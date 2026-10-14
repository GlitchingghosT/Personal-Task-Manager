import React, { useMemo, useState } from 'react';
import { AUTH_EMAIL_KEY, AUTH_TOKEN_KEY } from '../services/authStorage';
import { AuthContext, type AuthContextValue } from './AuthContext';

export const AuthProvider: React.FC<React.PropsWithChildren> = ({ children }) => {
  const [token, setToken] = useState<string | null>(() => localStorage.getItem(AUTH_TOKEN_KEY));
  const [email, setEmail] = useState<string | null>(() => localStorage.getItem(AUTH_EMAIL_KEY));

  const value = useMemo<AuthContextValue>(() => ({
    token,
    email,
    signIn: (nextToken, nextEmail) => {
      localStorage.setItem(AUTH_TOKEN_KEY, nextToken);
      localStorage.setItem(AUTH_EMAIL_KEY, nextEmail);
      setToken(nextToken);
      setEmail(nextEmail);
    },
    signOut: () => {
      localStorage.removeItem(AUTH_TOKEN_KEY);
      localStorage.removeItem(AUTH_EMAIL_KEY);
      setToken(null);
      setEmail(null);
    },
  }), [token, email]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
