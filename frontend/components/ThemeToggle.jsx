'use client';

import { useTheme } from '@/components/ThemeProvider';
import { Sun, Moon } from 'lucide-react';

export default function ThemeToggle({ className = "" }) {
  const { theme, toggleTheme } = useTheme();

  return (
    <button
      onClick={toggleTheme}
      type="button"
      className={`p-2.5 rounded-full transition-all duration-300 border flex items-center justify-center ${
        theme === 'dark'
          ? 'bg-slate-900/90 border-slate-800 text-amber-400 hover:bg-slate-800 hover:scale-110 shadow-sm'
          : 'bg-slate-100 border-slate-300 text-indigo-600 hover:bg-slate-200 hover:scale-110 shadow-sm'
      } ${className}`}
      title={`Switch to ${theme === 'dark' ? 'Light' : 'Dark'} Mode`}
      aria-label="Toggle Theme"
    >
      {theme === 'dark' ? (
        <Sun className="w-4 h-4 text-amber-400 animate-spin-once" />
      ) : (
        <Moon className="w-4 h-4 text-indigo-600 animate-spin-once" />
      )}
    </button>
  );
}
