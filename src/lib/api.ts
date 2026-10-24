export interface ApiUser {
  uid: string;
  email: string;
  displayName: string;
  role: 'admin' | 'user';
  createdAt: string;
}

export class ApiError extends Error {
  readonly status: number;

  constructor(status: number, message: string) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
  }
}

const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === 'object' && value !== null;

const parseUser = (value: unknown): ApiUser => {
  if (
    !isRecord(value) ||
    typeof value.uid !== 'string' ||
    typeof value.email !== 'string' ||
    typeof value.displayName !== 'string' ||
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

const parseUserResponse = (value: unknown): ApiUser => {
  if (!isRecord(value)) throw new Error('The API returned an invalid response.');
  return parseUser(value.user);
};

const apiRequest = async (path: string, init?: RequestInit): Promise<unknown> => {
  const headers = new Headers(init?.headers);
  if (init?.body && !headers.has('Content-Type')) {
    headers.set('Content-Type', 'application/json');
  }
  const response = await fetch(`/api${path}`, {
    ...init,
    credentials: 'same-origin',
    headers,
  });

  let payload: unknown;
  try {
    payload = await response.json();
  } catch {
    throw new ApiError(response.status, 'The server returned an invalid response.');
  }

  if (!response.ok) {
    const message = isRecord(payload) && typeof payload.error === 'string'
      ? payload.error
      : 'The request could not be completed.';
    throw new ApiError(response.status, message);
  }
  return payload;
};

export const getCurrentUser = async (): Promise<ApiUser | null> => {
  try {
    return parseUserResponse(await apiRequest('/auth/me'));
  } catch (error) {
    if (error instanceof ApiError && error.status === 401) return null;
    throw error;
  }
};

export const login = async (email: string, password: string): Promise<ApiUser> =>
  parseUserResponse(await apiRequest('/auth/login', {
    method: 'POST',
    body: JSON.stringify({ email, password }),
  }));

export const register = async (
  email: string,
  password: string,
  displayName: string,
): Promise<ApiUser> =>
  parseUserResponse(await apiRequest('/auth/register', {
    method: 'POST',
    body: JSON.stringify({ email, password, displayName }),
  }));

export const logout = async (): Promise<void> => {
  await apiRequest('/auth/logout', { method: 'POST' });
};

export const updateProfile = async (displayName: string): Promise<ApiUser> =>
  parseUserResponse(await apiRequest('/auth/profile', {
    method: 'POST',
    body: JSON.stringify({ displayName }),
  }));

export const getAdminUsers = async (): Promise<ApiUser[]> => {
  const payload = await apiRequest('/admin/users');
  if (!isRecord(payload) || !Array.isArray(payload.users)) {
    throw new Error('The API returned an invalid user list.');
  }
  return payload.users.map(parseUser);
};
