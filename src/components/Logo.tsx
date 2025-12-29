import React from 'react';
import logoDark from '@/assets/logo-dark.png';
import logoLight from '@/assets/logo-light.png';

interface LogoProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
}

const sizeClasses = {
  sm: 'h-12',
  md: 'h-16',
  lg: 'h-20',
  xl: 'h-28',
};

const Logo = ({ size = 'md', className = '' }: LogoProps) => {
  return (
    <span className="inline-flex items-center">
      {/* Light mode */}
      <img
        src={logoLight}
        alt="Market Canvas AI logo"
        className={`${sizeClasses[size]} w-auto object-contain ${className} block dark:hidden`}
        style={{ background: 'transparent', maxWidth: 'none' }}
      />

      {/* Dark mode (with a subtle plate so the dark text is readable) */}
      <span className="hidden dark:inline-flex items-center justify-center rounded-lg bg-foreground/15 ring-1 ring-foreground/10 px-2 py-1">
        <img
          src={logoDark}
          alt="Market Canvas AI logo"
          className={`${sizeClasses[size]} w-auto object-contain ${className}`}
          style={{ background: 'transparent', maxWidth: 'none' }}
        />
      </span>
    </span>
  );
};

export default Logo;

