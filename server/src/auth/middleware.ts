import type { RequestHandler } from 'express';
import type { QueryResultRow } from 'pg';
import { database } from '../database.ts';
import { HttpError } from '../errors.ts';
import { verifyFirebaseIdToken } from './firebase-token.ts';

interface RoleRow extends QueryResultRow {
  role: string;
}

export const requireAuthentication: RequestHandler = async (request, _response, next) => {
  try {
    const authorization = request.header('authorization');
    const match = authorization?.match(/^Bearer\s+(.+)$/i);
    if (!match) {
      throw new HttpError(401, 'Authentication is required.');
    }

    request.identity = await verifyFirebaseIdToken(match[1]);
    next();
  } catch (error) {
    next(error);
  }
};

export const requireAdministrator: RequestHandler = async (request, _response, next) => {
  try {
    const identity = request.identity;
    if (!identity) {
      throw new HttpError(401, 'Authentication is required.');
    }

    const result = await database.query<RoleRow>(
      'SELECT role FROM user_profiles WHERE firebase_uid = $1',
      [identity.uid],
    );
    if (result.rows[0]?.role !== 'ADMIN') {
      throw new HttpError(403, 'Administrator access is required.');
    }

    next();
  } catch (error) {
    next(error);
  }
};
