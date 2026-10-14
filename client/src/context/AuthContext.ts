import { createContext, useContext } from 'react';

export interface AuthContextValue {
  token: string | null;
  email: string | null;
  signIn: (token: string, email: string) => void;
  signOut: () => void;
}

export const AuthContext = createContext<AuthContextValue | null>(null);

export const useAuth = (): AuthContextValue => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
