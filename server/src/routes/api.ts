import { Router, type RequestHandler } from 'express';
import { rateLimit } from 'express-rate-limit';
import type { QueryResultRow } from 'pg';
import { z } from 'zod';
import { requireAdministrator, requireAuthentication } from '../auth/middleware.ts';
import { hashPassword, verifyPassword } from '../auth/password.ts';
import {
  clearSessionCookie,
  createSession,
  readSessionToken,
  revokeSession,
  setSessionCookie,
  type AuthIdentity,
} from '../auth/session.ts';
import { database } from '../database.ts';
import { HttpError } from '../errors.ts';

interface UserProfileRow extends QueryResultRow {
  id: string;
  email: string;
  display_name: string;
  password_hash?: string;
  role: 'USER' | 'ADMIN';
  created_at: Date;
}

const emailSchema = z.string().trim().toLowerCase().email().max(320);
const loginInputSchema = z.object({
  email: emailSchema,
  password: z.string().min(1).max(128),
}).strict();
const registerInputSchema = z.object({
  email: emailSchema,
  password: z.string().min(12).max(128),
  displayName: z.string().trim().min(1).max(120),
}).strict();
const profileInputSchema = z.object({
  displayName: z.string().trim().min(1).max(120),
}).strict();

const authenticationRateLimit = rateLimit({
  windowMs: 15 * 60 * 1_000,
  limit: 10,
  standardHeaders: 'draft-8',
  legacyHeaders: false,
  message: { error: 'Too many authentication attempts. Please try again later.' },
});
const dummyPasswordHash = `scrypt$32768$${'00'.repeat(16)}$${'00'.repeat(64)}`;

const asyncRoute = (handler: RequestHandler): RequestHandler =>
  (request, response, next) => {
    Promise.resolve(handler(request, response, next)).catch(next);
  };

const toPublicUser = (user: AuthIdentity) => ({
  uid: user.id,
  email: user.email,
  displayName: user.displayName,
  role: user.role === 'ADMIN' ? 'admin' : 'user',
  createdAt: user.createdAt.toISOString(),
});

const toIdentity = (profile: UserProfileRow): AuthIdentity => ({
  id: profile.id,
  email: profile.email,
  displayName: profile.display_name,
  role: profile.role,
  createdAt: profile.created_at,
});

const isUniqueEmailViolation = (error: unknown): boolean =>
  typeof error === 'object' && error !== null && 'code' in error && error.code === '23505';

export const apiRouter = Router();

apiRouter.post(
  '/auth/register',
  authenticationRateLimit,
  asyncRoute(async (request, response) => {
    const input = registerInputSchema.parse(request.body);
    const passwordHash = await hashPassword(input.password);

    let profile: UserProfileRow | undefined;
    try {
      const result = await database.query<UserProfileRow>(
        `INSERT INTO user_profiles (email, display_name, password_hash)
         VALUES ($1, $2, $3)
         RETURNING id::text AS id, email, display_name, role, created_at`,
        [input.email, input.displayName, passwordHash],
      );
      profile = result.rows[0];
    } catch (error) {
      if (isUniqueEmailViolation(error)) {
        throw new HttpError(409, 'An account already uses this email.');
      }
      throw error;
    }

    if (!profile) throw new HttpError(500, 'Unable to create the account.');

    const identity = toIdentity(profile);
    const token = await createSession(identity.id);
    setSessionCookie(response, token);
    response.status(201).json({ user: toPublicUser(identity) });
  }),
);

apiRouter.post(
  '/auth/login',
  authenticationRateLimit,
  asyncRoute(async (request, response) => {
    const input = loginInputSchema.parse(request.body);
    const result = await database.query<UserProfileRow>(
      `SELECT id::text AS id, email, display_name, password_hash, role, created_at
       FROM user_profiles
       WHERE LOWER(email) = $1`,
      [input.email],
    );
    const profile = result.rows[0];
    const passwordMatches = await verifyPassword(
      input.password,
      profile?.password_hash ?? dummyPasswordHash,
    );
    if (!profile || !passwordMatches) {
      throw new HttpError(401, 'Email or password is incorrect.');
    }

    await revokeSession(readSessionToken(request.headers.cookie));
    const identity = toIdentity(profile);
    const token = await createSession(identity.id);
    setSessionCookie(response, token);
    response.status(200).json({ user: toPublicUser(identity) });
  }),
);

apiRouter.post(
  '/auth/logout',
  asyncRoute(async (request, response) => {
    await revokeSession(readSessionToken(request.headers.cookie));
    clearSessionCookie(response);
    response.status(200).json({ ok: true });
  }),
);

apiRouter.get(
  '/auth/me',
  requireAuthentication,
  asyncRoute(async (request, response) => {
    if (!request.identity) throw new HttpError(401, 'Authentication is required.');
    response.json({ user: toPublicUser(request.identity) });
  }),
);

apiRouter.post(
  '/auth/profile',
  requireAuthentication,
  asyncRoute(async (request, response) => {
    if (!request.identity) throw new HttpError(401, 'Authentication is required.');
    const input = profileInputSchema.parse(request.body);
    const result = await database.query<UserProfileRow>(
      `UPDATE user_profiles
       SET display_name = $2, updated_at = NOW()
       WHERE id = $1
       RETURNING id::text AS id, email, display_name, role, created_at`,
      [request.identity.id, input.displayName],
    );
    const profile = result.rows[0];
    if (!profile) throw new HttpError(404, 'The account was not found.');
    response.json({ user: toPublicUser(toIdentity(profile)) });
  }),
);

apiRouter.get(
  '/admin/users',
  requireAuthentication,
  requireAdministrator,
  asyncRoute(async (_request, response) => {
    const result = await database.query<UserProfileRow>(
      `SELECT id::text AS id, email, display_name, role, created_at
       FROM user_profiles
       ORDER BY created_at DESC`,
    );
    response.json({ users: result.rows.map((profile) => toPublicUser(toIdentity(profile))) });
  }),
);
