import React from 'react';
import { useTheme } from 'next-themes';
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
  const { resolvedTheme } = useTheme();
  
  // Red logo for dark mode, teal logo for light mode
  const logoSrc = resolvedTheme === 'dark' ? logoDark : logoLight;

  return (
    <img 
      src={logoSrc} 
      alt="Market Canvas AI" 
      className={`${sizeClasses[size]} w-auto object-contain ${className}`}
      style={{ 
        background: 'transparent',
        maxWidth: 'none',
      }}
    />
  );
};

export default Logo;
