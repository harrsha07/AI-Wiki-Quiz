import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';

const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {
  const [theme, setTheme] = useState('bright');

  // Load theme from localStorage on initial render
  useEffect(() => {
    try {
      // Check if we're in a browser environment
      if (typeof window !== 'undefined' && window.localStorage) {
        const savedTheme = localStorage.getItem('theme');
        if (savedTheme && (savedTheme === 'bright' || savedTheme === 'darkmagic')) {
          setTheme(savedTheme);
        } else {
          // Check system preference
          const prefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
          setTheme(prefersDark ? 'darkmagic' : 'bright');
        }
      }
    } catch (error) {
      console.error('Error loading theme from localStorage:', error);
      // Fallback to default theme
      setTheme('bright');
    }
  }, []);

  // Apply theme to document element
  useEffect(() => {
    try {
      // Check if we're in a browser environment
      if (typeof window !== 'undefined' && window.localStorage) {
        document.documentElement.setAttribute('data-theme', theme);
        localStorage.setItem('theme', theme);
        // Update background class - fixed the class names to match DaisyUI themes
        document.documentElement.className = theme === 'bright' ? 'theme-bright' : 'theme-darkmagic';
      }
    } catch (error) {
      console.error('Error applying theme:', error);
    }
  }, [theme]);

  const toggleTheme = useCallback(() => {
    setTheme(prevTheme => prevTheme === 'bright' ? 'darkmagic' : 'bright');
  }, []);

  // Memoize context value to prevent unnecessary re-renders
  const contextValue = React.useMemo(() => ({
    theme,
    toggleTheme
  }), [theme, toggleTheme]);

  return (
    <ThemeContext.Provider value={contextValue}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};