import { Router, type RequestHandler } from 'express';
import type { QueryResultRow } from 'pg';
import { z } from 'zod';
import { database } from '../database.ts';
import { HttpError } from '../errors.ts';
import { requireAdministrator, requireAuthentication } from '../auth/middleware.ts';

interface UserProfileRow extends QueryResultRow {
  firebase_uid: string;
  email: string | null;
  display_name: string | null;
  role: 'USER' | 'ADMIN';
  created_at: Date;
}

const profileInputSchema = z.object({
  displayName: z.string().trim().max(120).optional(),
}).strict();

const saveProfile = async (
  firebaseUid: string,
  email: string | null,
  displayName: string | null,
): Promise<UserProfileRow> => {
  const result = await database.query<UserProfileRow>(
    `INSERT INTO user_profiles (firebase_uid, email, display_name)
     VALUES ($1, $2, $3)
     ON CONFLICT (firebase_uid) DO UPDATE
       SET email = EXCLUDED.email,
           display_name = COALESCE(NULLIF(EXCLUDED.display_name, ''), user_profiles.display_name),
           updated_at = NOW()
     RETURNING firebase_uid, email, display_name, role, created_at`,
    [firebaseUid, email, displayName],
  );

  const profile = result.rows[0];
  if (!profile) {
    throw new HttpError(500, 'Unable to load the account profile.');
  }
  return profile;
};

const toPublicUser = (profile: UserProfileRow) => ({
  uid: profile.firebase_uid,
  email: profile.email,
  displayName: profile.display_name,
  role: profile.role === 'ADMIN' ? 'admin' : 'user',
  createdAt: profile.created_at.toISOString(),
});

const asyncRoute = (handler: RequestHandler): RequestHandler =>
  (request, response, next) => {
    Promise.resolve(handler(request, response, next)).catch(next);
  };

export const apiRouter = Router();

apiRouter.get(
  '/auth/me',
  requireAuthentication,
  asyncRoute(async (request, response) => {
    const identity = request.identity;
    if (!identity) throw new HttpError(401, 'Authentication is required.');

    const profile = await saveProfile(identity.uid, identity.email, identity.displayName);
    response.json({ user: toPublicUser(profile) });
  }),
);

apiRouter.post(
  '/auth/profile',
  requireAuthentication,
  asyncRoute(async (request, response) => {
    const identity = request.identity;
    if (!identity) throw new HttpError(401, 'Authentication is required.');

    const input = profileInputSchema.parse(request.body);
    const displayName = input.displayName?.trim() || identity.displayName;
    const profile = await saveProfile(identity.uid, identity.email, displayName);
    response.status(200).json({ user: toPublicUser(profile) });
  }),
);

apiRouter.get(
  '/admin/users',
  requireAuthentication,
  requireAdministrator,
  asyncRoute(async (_request, response) => {
    const result = await database.query<UserProfileRow>(
      `SELECT firebase_uid, email, display_name, role, created_at
       FROM user_profiles
       ORDER BY created_at DESC`,
    );
    response.json({ users: result.rows.map(toPublicUser) });
  }),
);
