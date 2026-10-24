import { useEffect, useMemo, useState, type ReactNode } from 'react';
import {
  getCurrentUser,
  login as loginRequest,
  logout as logoutRequest,
  register as registerRequest,
  updateProfile as updateProfileRequest,
} from './api';
import { AuthContext, type AuthContextValue } from './auth-context';

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<AuthContextValue['user']>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;
    void getCurrentUser()
      .then((currentUser) => {
        if (isMounted) setUser(currentUser);
      })
      .catch(() => {
        if (isMounted) setUser(null);
      })
      .finally(() => {
        if (isMounted) setLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, []);

  const value = useMemo<AuthContextValue>(() => ({
    user,
    loading,
    login: async (email, password) => {
      const signedInUser = await loginRequest(email, password);
      setUser(signedInUser);
      return signedInUser;
    },
    register: async (email, password, displayName) => {
      const registeredUser = await registerRequest(email, password, displayName);
      setUser(registeredUser);
      return registeredUser;
    },
    logout: async () => {
      await logoutRequest();
      setUser(null);
    },
    updateProfile: async (displayName) => {
      const updatedUser = await updateProfileRequest(displayName);
      setUser(updatedUser);
      return updatedUser;
    },
  }), [loading, user]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
