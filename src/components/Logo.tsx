import React from 'react';
import logoImage from '@/assets/logo.png';

interface LogoProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  showText?: boolean;
  className?: string;
}

const sizeClasses = {
  sm: 'h-8',
  md: 'h-10',
  lg: 'h-12',
  xl: 'h-16',
};

const Logo = ({ size = 'md', showText = true, className = '' }: LogoProps) => {
  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <img 
        src={logoImage} 
        alt="Market Canvas AI" 
        className={`${sizeClasses[size]} w-auto object-contain dark:brightness-110 dark:contrast-110`}
        style={{ 
          filter: 'drop-shadow(0 0 0 transparent)',
        }}
      />
    </div>
  );
};

export default Logo;
