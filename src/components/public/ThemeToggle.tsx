'use client';

import { Sun, Moon } from 'lucide-react';

interface ThemeToggleProps {
  isDark: boolean;
  toggle: () => void;
}

export default function ThemeToggle({ isDark, toggle }: ThemeToggleProps) {
  return (
    <button
      onClick={toggle}
      className="p-2 rounded-full transition-all duration-300 hover:bg-bg-secondary dark:hover:bg-dark-bg-secondary"
      aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
    >
      {isDark ? (
        <Sun className="w-5 h-5 text-accent-secondary" />
      ) : (
        <Moon className="w-5 h-5 text-accent-primary" />
      )}
    </button>
  );
}