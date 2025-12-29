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
  
  const isDark = resolvedTheme === 'dark';
  const logoSrc = isDark ? logoDark : logoLight;

  return (
    <div 
      className={`inline-flex items-center justify-center rounded-lg ${isDark ? 'bg-white/90 px-2 py-1' : ''}`}
    >
      <img 
        src={logoSrc} 
        alt="Market Canvas AI" 
        className={`${sizeClasses[size]} w-auto object-contain ${className}`}
        style={{ 
          background: 'transparent',
          maxWidth: 'none',
        }}
      />
    </div>
  );
};

export default Logo;
