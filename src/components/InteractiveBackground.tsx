import React, { useEffect, useState, useCallback } from 'react';
import { TrendingUp, BarChart3, Activity, Target, Sparkles, Zap } from 'lucide-react';

const InteractiveBackground = () => {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [isHovering, setIsHovering] = useState(false);
  const [clickRipples, setClickRipples] = useState<Array<{ id: number; x: number; y: number }>>([]);

  const handleMouseMove = useCallback((e: MouseEvent) => {
    setMousePosition({ x: e.clientX, y: e.clientY });
  }, []);

  const handleClick = useCallback((e: MouseEvent) => {
    const newRipple = {
      id: Date.now(),
      x: e.clientX,
      y: e.clientY
    };
    setClickRipples(prev => [...prev, newRipple]);
    
    // Remove ripple after animation
    setTimeout(() => {
      setClickRipples(prev => prev.filter(ripple => ripple.id !== newRipple.id));
    }, 1000);
  }, []);

  useEffect(() => {
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('click', handleClick);
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('click', handleClick);
    };
  }, [handleMouseMove, handleClick]);

  const FloatingIcon = ({ 
    Icon, 
    delay, 
    initialPosition, 
    className = "" 
  }: { 
    Icon: any; 
    delay: number; 
    initialPosition: { x: string; y: string }; 
    className?: string;
  }) => {
    const [position, setPosition] = useState(initialPosition);
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
      const timer = setTimeout(() => setIsVisible(true), delay);
      return () => clearTimeout(timer);
    }, [delay]);

    return (
      <div
        className={`absolute transition-all duration-1000 cursor-pointer group ${className} ${
          isVisible ? 'opacity-100 scale-100' : 'opacity-0 scale-0'
        }`}
        style={{
          left: position.x,
          top: position.y,
          transform: `translate(${mousePosition.x * 0.02}px, ${mousePosition.y * 0.02}px)`,
        }}
        onMouseEnter={() => setIsHovering(true)}
        onMouseLeave={() => setIsHovering(false)}
        onClick={() => {
          // Add a little bounce animation on click
          setPosition(prev => ({
            x: `calc(${prev.x} + ${Math.random() * 20 - 10}px)`,
            y: `calc(${prev.y} + ${Math.random() * 20 - 10}px)`
          }));
        }}
      >
        <div className="relative">
          <Icon 
            className="h-8 w-8 text-primary/20 group-hover:text-primary/60 transition-all duration-300 group-hover:scale-150 group-hover:rotate-12" 
          />
          <div className="absolute inset-0 bg-primary/10 rounded-full scale-0 group-hover:scale-150 transition-transform duration-300 -z-10"></div>
        </div>
      </div>
    );
  };

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
      {/* Animated gradient mesh */}
      <div 
        className="absolute inset-0 opacity-30"
        style={{
          background: `
            radial-gradient(circle at ${mousePosition.x * 0.1}% ${mousePosition.y * 0.1}%, hsl(var(--primary) / 0.1) 0%, transparent 70%),
            radial-gradient(circle at ${100 - mousePosition.x * 0.1}% ${100 - mousePosition.y * 0.1}%, hsl(var(--accent) / 0.1) 0%, transparent 70%),
            linear-gradient(45deg, transparent 30%, hsl(var(--primary) / 0.05) 50%, transparent 70%)
          `
        }}
      />

      {/* Interactive particles */}
      <div className="absolute inset-0">
        {Array.from({ length: 20 }).map((_, i) => (
          <div
            key={i}
            className="absolute w-1 h-1 bg-primary/30 rounded-full animate-pulse"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 3}s`,
              animationDuration: `${2 + Math.random() * 3}s`,
              transform: `translate(${mousePosition.x * 0.01}px, ${mousePosition.y * 0.01}px)`,
            }}
          />
        ))}
      </div>

      {/* Floating icons */}
      <div className="pointer-events-auto">
        <FloatingIcon 
          Icon={TrendingUp} 
          delay={500} 
          initialPosition={{ x: '10%', y: '20%' }}
          className="animate-pulse"
        />
        <FloatingIcon 
          Icon={BarChart3} 
          delay={1000} 
          initialPosition={{ x: '85%', y: '15%' }}
        />
        <FloatingIcon 
          Icon={Activity} 
          delay={1500} 
          initialPosition={{ x: '15%', y: '70%' }}
        />
        <FloatingIcon 
          Icon={Target} 
          delay={2000} 
          initialPosition={{ x: '80%', y: '65%' }}
        />
        <FloatingIcon 
          Icon={Sparkles} 
          delay={2500} 
          initialPosition={{ x: '50%', y: '30%' }}
          className="animate-spin"
        />
        <FloatingIcon 
          Icon={Zap} 
          delay={3000} 
          initialPosition={{ x: '25%', y: '45%' }}
        />
      </div>

      {/* Click ripples */}
      {clickRipples.map((ripple) => (
        <div
          key={ripple.id}
          className="absolute pointer-events-none"
          style={{
            left: ripple.x - 25,
            top: ripple.y - 25,
          }}
        >
          <div className="w-12 h-12 border-2 border-primary/40 rounded-full animate-ping" />
          <div className="absolute inset-0 w-12 h-12 bg-primary/20 rounded-full animate-pulse" />
        </div>
      ))}

      {/* Mouse follower */}
      <div
        className="absolute w-32 h-32 pointer-events-none transition-opacity duration-300"
        style={{
          left: mousePosition.x - 64,
          top: mousePosition.y - 64,
          opacity: isHovering ? 0.6 : 0.3,
        }}
      >
        <div className="w-full h-full rounded-full bg-gradient-to-r from-primary/10 to-accent/10 blur-xl animate-pulse" />
      </div>

      {/* Grid pattern */}
      <div 
        className="absolute inset-0 opacity-10"
        style={{
          backgroundImage: `
            linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)
          `,
          backgroundSize: '50px 50px',
          transform: `translate(${mousePosition.x * 0.005}px, ${mousePosition.y * 0.005}px)`,
        }}
      />
    </div>
  );
};

export default InteractiveBackground;