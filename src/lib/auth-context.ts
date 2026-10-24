import { createContext, useContext } from 'react';
import type { ApiUser } from './api';

export interface AuthContextValue {
  user: ApiUser | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<ApiUser>;
  register: (email: string, password: string, displayName: string) => Promise<ApiUser>;
  logout: () => Promise<void>;
  updateProfile: (displayName: string) => Promise<ApiUser>;
}

export const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export const useAuth = (): AuthContextValue => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within an AuthProvider.');
  return context;
};
