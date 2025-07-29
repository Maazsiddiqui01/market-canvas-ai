import React, { useState, useEffect } from 'react';
import { Moon, Sun } from 'lucide-react';
import { Button } from '@/components/ui/button';

const ThemeToggle = () => {
  const [theme, setTheme] = useState<'dark' | 'light'>('dark');
  const [showAttentionAnimation, setShowAttentionAnimation] = useState(true);

  useEffect(() => {
    // Check for saved theme preference or default to 'dark'
    const savedTheme = localStorage.getItem('theme') as 'dark' | 'light';
    const preferredTheme = savedTheme || 'dark';
    setTheme(preferredTheme);
    applyTheme(preferredTheme);

    // Show attention animation for 5 seconds, then stop
    const timer = setTimeout(() => {
      setShowAttentionAnimation(false);
    }, 5000);

    return () => clearTimeout(timer);
  }, []);

  const applyTheme = (newTheme: 'dark' | 'light') => {
    const root = document.documentElement;
    
    if (newTheme === 'dark') {
      root.classList.add('dark');
      root.classList.remove('light');
    } else {
      root.classList.add('light');
      root.classList.remove('dark');
    }
  };

  const toggleTheme = () => {
    const newTheme = theme === 'dark' ? 'light' : 'dark';
    setTheme(newTheme);
    applyTheme(newTheme);
    localStorage.setItem('theme', newTheme);
    setShowAttentionAnimation(false); // Stop animation after first interaction
  };

  return (
    <div className="relative">
      <Button
        variant="ghost"
        size="sm"
        onClick={toggleTheme}
        className={`text-muted-foreground hover:text-foreground hover:bg-primary/10 transition-all duration-300 relative ${
          showAttentionAnimation 
            ? 'animate-pulse shadow-lg shadow-primary/40 ring-2 ring-primary/30 ring-offset-2 ring-offset-background' 
            : ''
        }`}
        aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
      >
        {theme === 'dark' ? (
          <Sun className={`h-4 w-4 ${showAttentionAnimation ? 'animate-bounce' : ''}`} />
        ) : (
          <Moon className={`h-4 w-4 ${showAttentionAnimation ? 'animate-bounce' : ''}`} />
        )}
      </Button>
      
      {/* Attention indicator */}
      {showAttentionAnimation && (
        <div className="absolute -top-1 -right-1 h-3 w-3 bg-primary rounded-full animate-ping"></div>
      )}
    </div>
  );
};

export default ThemeToggle;