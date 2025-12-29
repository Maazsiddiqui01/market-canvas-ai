import React from 'react';
import { cn } from '@/lib/utils';
import { useScrollReveal } from '@/hooks/useScrollReveal';

interface ScrollRevealProps {
  children: React.ReactNode;
  className?: string;
  delay?: number;
  direction?: 'up' | 'down' | 'left' | 'right' | 'scale';
}

const ScrollReveal: React.FC<ScrollRevealProps> = ({
  children,
  className,
  delay = 0,
  direction = 'up',
}) => {
  const { ref, isVisible } = useScrollReveal({ threshold: 0.1 });

  const getInitialTransform = () => {
    switch (direction) {
      case 'up': return 'translateY(40px)';
      case 'down': return 'translateY(-40px)';
      case 'left': return 'translateX(40px)';
      case 'right': return 'translateX(-40px)';
      case 'scale': return 'scale(0.9)';
      default: return 'translateY(40px)';
    }
  };

  return (
    <div
      ref={ref}
      className={cn('transition-all duration-700 ease-out', className)}
      style={{
        opacity: isVisible ? 1 : 0,
        transform: isVisible ? 'none' : getInitialTransform(),
        transitionDelay: `${delay}ms`,
      }}
    >
      {children}
    </div>
  );
};

export default ScrollReveal;
