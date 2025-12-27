import { createContext, useEffect, useMemo, useState } from 'react';

export const AuthContext = createContext({ user: null, setUser: () => {} });

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    try {
      const stored = window.localStorage.getItem('iaac_user');
      return stored ? JSON.parse(stored) : null;
    } catch (err) {
      console.error('Failed to parse stored user', err);
      window.localStorage.removeItem('iaac_user');
      return null;
    }
  });

  useEffect(() => {
    if (user) {
      window.localStorage.setItem('iaac_user', JSON.stringify(user));
    } else {
      window.localStorage.removeItem('iaac_user');
    }
  }, [user]);

  const value = useMemo(() => ({ user, setUser }), [user]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
