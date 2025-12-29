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
    <>
      {/* Light mode logo */}
      <img
        src={logoLight}
        alt="Market Canvas AI"
        className={`${sizeClasses[size]} w-auto object-contain block dark:hidden ${className}`}
      />
      {/* Dark mode logo - no background */}
      <img
        src={logoDark}
        alt="Market Canvas AI"
        className={`${sizeClasses[size]} w-auto object-contain hidden dark:block ${className}`}
      />
    </>
  );
};

export default Logo;

