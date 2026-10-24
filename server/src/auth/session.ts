import { createHash, randomBytes } from 'node:crypto';
import type { Response } from 'express';
import { config } from '../config.ts';
import { database } from '../database.ts';

export interface AuthIdentity {
  id: string;
  email: string;
  displayName: string;
  role: 'USER' | 'ADMIN';
  createdAt: Date;
}

export const sessionCookieName = 'netclaks_session';
export const sessionDurationSeconds = 7 * 24 * 60 * 60;

const hashSessionToken = (token: string): string =>
  createHash('sha256').update(token).digest('hex');

export const createSession = async (userId: string): Promise<string> => {
  const token = randomBytes(32).toString('base64url');
  const expiresAt = new Date(Date.now() + sessionDurationSeconds * 1_000);
  await database.query('DELETE FROM auth_sessions WHERE expires_at <= NOW()');
  await database.query(
    'INSERT INTO auth_sessions (user_id, token_hash, expires_at) VALUES ($1, $2, $3)',
    [userId, hashSessionToken(token), expiresAt],
  );
  return token;
};

export const revokeSession = async (token: string | null): Promise<void> => {
  if (!token) return;
  await database.query('DELETE FROM auth_sessions WHERE token_hash = $1', [hashSessionToken(token)]);
};

export const setSessionCookie = (response: Response, token: string): void => {
  const secure = config.nodeEnv === 'production' ? '; Secure' : '';
  response.setHeader(
    'Set-Cookie',
    `${sessionCookieName}=${token}; Path=/api; HttpOnly; SameSite=Lax; Max-Age=${sessionDurationSeconds}${secure}`,
  );
};

export const clearSessionCookie = (response: Response): void => {
  const secure = config.nodeEnv === 'production' ? '; Secure' : '';
  response.setHeader(
    'Set-Cookie',
    `${sessionCookieName}=; Path=/api; HttpOnly; SameSite=Lax; Max-Age=0; Expires=Thu, 01 Jan 1970 00:00:00 GMT${secure}`,
  );
};

export const readSessionToken = (cookieHeader: string | undefined): string | null => {
  if (!cookieHeader) return null;
  for (const part of cookieHeader.split(';')) {
    const separator = part.indexOf('=');
    if (separator < 0 || part.slice(0, separator).trim() !== sessionCookieName) continue;
    const token = part.slice(separator + 1).trim();
    return /^[A-Za-z0-9_-]{40,50}$/.test(token) ? token : null;
  }
  return null;
};

export const getSessionTokenHash = (token: string): string => hashSessionToken(token);
