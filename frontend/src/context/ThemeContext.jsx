import { createContext, useEffect, useMemo, useState } from 'react';

// FIXED: Default the context definition to 'light'
export const ThemeContext = createContext({ theme: 'light', toggleTheme: () => {} });

export function ThemeProvider({ children }) {
  // FIXED: Force default state to 'light' immediately. 
  // (I removed the 'prefersDark' check so the site ALWAYS starts in Academic Light mode)
  const [theme, setTheme] = useState('light');

  useEffect(() => {
    // FIXED: Changed key to 'iaac_theme_v2' to ignore your old dark mode setting
    const storedTheme = window.localStorage.getItem('iaac_theme_v2');
    if (storedTheme) {
      setTheme(storedTheme);
    }
  }, []);

  useEffect(() => {
    // FIXED: Save to the new key
    window.localStorage.setItem('iaac_theme_v2', theme);
    
    // This adds/removes the 'dark' class on the <html> tag
    document.documentElement.classList.toggle('dark', theme === 'dark');
  }, [theme]);

  const toggleTheme = () => setTheme((prev) => (prev === 'dark' ? 'light' : 'dark'));

  const value = useMemo(() => ({ theme, toggleTheme }), [theme]);

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}