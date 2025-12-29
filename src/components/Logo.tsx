import React from 'react';
import logoImage from '@/assets/logo.png';

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
    <img 
      src={logoImage} 
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
