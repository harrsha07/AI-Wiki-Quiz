import React from 'react';
import { useTheme } from '../contexts/ThemeContext';
import { Sun, Moon } from 'lucide-react';

function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();

  return (
    <button
      onClick={toggleTheme}
      className="btn btn-circle btn-ghost bg-white/30 dark:bg-slate-800/40 text-base-content hover:bg-base-200/50 transition-all duration-500 ease-in-out transform hover:scale-110 backdrop-blur-md shadow-lg hover:shadow-xl"
      aria-label={`Switch to ${theme === 'bright' ? 'dark' : 'light'} mode`}
    >
      <div className="relative w-6 h-6">
        {/* Sun icon for light mode */}
        <Sun
          className={`absolute inset-0 h-6 w-6 transition-all duration-500 ease-in-out ${
            theme === 'bright' ? 'opacity-100 rotate-0 text-yellow-500' : 'opacity-0 rotate-90'
          }`}
        />

        {/* Moon icon for dark mode */}
        <Moon
          className={`absolute inset-0 h-6 w-6 transition-all duration-500 ease-in-out ${
            theme === 'darkmagic' ? 'opacity-100 rotate-0 text-indigo-300' : 'opacity-0 -rotate-90'
          }`}
        />
      </div>
    </button>
  );
}

export default ThemeToggle;