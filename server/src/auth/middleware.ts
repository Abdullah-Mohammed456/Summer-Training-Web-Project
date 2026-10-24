import type { RequestHandler } from 'express';
import type { QueryResultRow } from 'pg';
import { database } from '../database.ts';
import { HttpError } from '../errors.ts';
import { getSessionTokenHash, readSessionToken } from './session.ts';

interface AuthIdentityRow extends QueryResultRow {
  id: string;
  email: string;
  display_name: string;
  role: 'USER' | 'ADMIN';
  created_at: Date;
}

export const requireAuthentication: RequestHandler = async (request, _response, next) => {
  try {
    const token = readSessionToken(request.headers.cookie);
    if (!token) throw new HttpError(401, 'Authentication is required.');

    const result = await database.query<AuthIdentityRow>(
      `SELECT profiles.id::text AS id, profiles.email, profiles.display_name, profiles.role, profiles.created_at
       FROM auth_sessions AS sessions
       JOIN user_profiles AS profiles ON profiles.id = sessions.user_id
       WHERE sessions.token_hash = $1 AND sessions.expires_at > NOW()`,
      [getSessionTokenHash(token)],
    );
    const profile = result.rows[0];
    if (!profile) throw new HttpError(401, 'Authentication is required.');

    request.identity = {
      id: profile.id,
      email: profile.email,
      displayName: profile.display_name,
      role: profile.role,
      createdAt: profile.created_at,
    };
    next();
  } catch (error) {
    next(error);
  }
};

export const requireAdministrator: RequestHandler = (request, _response, next) => {
  if (!request.identity) {
    next(new HttpError(401, 'Authentication is required.'));
    return;
  }
  if (request.identity.role !== 'ADMIN') {
    next(new HttpError(403, 'Administrator access is required.'));
    return;
  }
  next();
};
