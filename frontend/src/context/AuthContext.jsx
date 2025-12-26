import { createContext, useEffect, useMemo, useState } from 'react';

export const AuthContext = createContext({ user: null, setUser: () => {} });

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const storedUser = window.localStorage.getItem('iaac_user');
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch (err) {
        console.error('Failed to parse stored user', err);
        window.localStorage.removeItem('iaac_user');
      }
    }
  }, []);

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
