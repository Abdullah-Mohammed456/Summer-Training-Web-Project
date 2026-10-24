import type { User } from 'firebase/auth';

export interface ApiUser {
  uid: string;
  email: string | null;
  displayName: string | null;
  role: 'admin' | 'user';
  createdAt: string;
}

const apiBaseUrl = (import.meta.env.VITE_API_BASE_URL ?? '').trim().replace(/\/+$/, '');

const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === 'object' && value !== null;

const parseUser = (value: unknown): ApiUser => {
  if (
    !isRecord(value) ||
    typeof value.uid !== 'string' ||
    (value.email !== null && typeof value.email !== 'string') ||
    (value.displayName !== null && typeof value.displayName !== 'string') ||
    (value.role !== 'admin' && value.role !== 'user') ||
    typeof value.createdAt !== 'string'
  ) {
    throw new Error('The API returned an invalid user profile.');
  }
  return {
    uid: value.uid,
    email: value.email,
    displayName: value.displayName,
    role: value.role,
    createdAt: value.createdAt,
  };
};

const request = async (path: string, user: User, init?: RequestInit): Promise<unknown> => {
  if (!apiBaseUrl) {
    throw new Error('VITE_API_BASE_URL is not configured.');
  }

  const token = await user.getIdToken();
  const headers = new Headers(init?.headers);
  if (init?.body && !headers.has('Content-Type')) {
    headers.set('Content-Type', 'application/json');
  }
  headers.set('Authorization', `Bearer ${token}`);
  const response = await fetch(`${apiBaseUrl}/api${path}`, {
    ...init,
    headers,
  });

  if (!response.ok) {
    throw new Error('The API request could not be completed.');
  }
  return (await response.json()) as unknown;
};

export const getApiUser = async (user: User): Promise<ApiUser> => {
  const payload = await request('/auth/me', user);
  if (!isRecord(payload)) throw new Error('The API returned an invalid profile.');
  return parseUser(payload.user);
};

export const saveApiProfile = async (user: User, displayName: string): Promise<ApiUser> => {
  const payload = await request('/auth/profile', user, {
    method: 'POST',
    body: JSON.stringify({ displayName }),
  });
  if (!isRecord(payload)) throw new Error('The API returned an invalid profile.');
  return parseUser(payload.user);
};

export const getAdminUsers = async (user: User): Promise<ApiUser[]> => {
  const payload = await request('/admin/users', user);
  if (!isRecord(payload) || !Array.isArray(payload.users)) {
    throw new Error('The API returned an invalid user list.');
  }
  return payload.users.map(parseUser);
};
