'use client';

import { createContext, useContext, useEffect, useState } from 'react';

const ThemeContext = createContext({
  theme: 'dark',
  toggleTheme: () => {},
});

export function ThemeProvider({ children }) {
  const [theme] = useState('dark');

  useEffect(() => {
    // Permanently enforce dark mode
    localStorage.setItem('rachit_theme', 'dark');
    const root = document.documentElement;
    root.classList.remove('light');
    root.classList.add('dark');
  }, []);

  const toggleTheme = () => {
    // Always keep dark theme
    const root = document.documentElement;
    root.classList.remove('light');
    root.classList.add('dark');
  };

  return (
    <ThemeContext.Provider value={{ theme: 'dark', toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  return useContext(ThemeContext);
}
