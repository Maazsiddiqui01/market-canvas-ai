import React, { useEffect, useState, useCallback } from 'react';
import { TrendingUp, BarChart3, Activity, Target, Sparkles, Zap } from 'lucide-react';

const InteractiveBackground = () => {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
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
          left: initialPosition.x,
          top: initialPosition.y,
          transform: `translate(${mousePosition.x * 0.01}px, ${mousePosition.y * 0.01}px)`,
        }}
      >
        <div className="relative">
          <Icon 
            className="h-6 w-6 text-primary/30 group-hover:text-primary/70 transition-all duration-500 group-hover:scale-125 group-hover:rotate-12" 
          />
          <div className="absolute inset-0 bg-primary/5 rounded-full scale-0 group-hover:scale-200 transition-transform duration-500 -z-10"></div>
        </div>
      </div>
    );
  };

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
      {/* Smooth animated gradient mesh */}
      <div 
        className="absolute inset-0 opacity-20 transition-all duration-700"
        style={{
          background: `
            radial-gradient(circle at ${20 + mousePosition.x * 0.05}% ${20 + mousePosition.y * 0.05}%, hsl(var(--primary) / 0.15) 0%, transparent 60%),
            radial-gradient(circle at ${80 - mousePosition.x * 0.05}% ${80 - mousePosition.y * 0.05}%, hsl(var(--accent) / 0.1) 0%, transparent 60%)
          `
        }}
      />

      {/* Elegant floating particles */}
      <div className="absolute inset-0">
        {Array.from({ length: 15 }).map((_, i) => (
          <div
            key={i}
            className="absolute w-1 h-1 bg-primary/40 rounded-full animate-pulse"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 3}s`,
              animationDuration: `${3 + Math.random() * 2}s`,
              transform: `translate(${mousePosition.x * 0.005}px, ${mousePosition.y * 0.005}px)`,
            }}
          />
        ))}
      </div>

      {/* Cool floating geometric shapes instead of icons */}
      <div className="pointer-events-auto">
        {/* Triangular shapes */}
        <div
          className="absolute w-8 h-8 transition-all duration-1000 cursor-pointer group"
          style={{
            left: '15%',
            top: '25%',
            transform: `translate(${mousePosition.x * 0.02}px, ${mousePosition.y * 0.02}px) rotate(45deg)`,
          }}
        >
          <div className="w-full h-full bg-gradient-to-br from-primary/20 to-accent/20 group-hover:from-primary/40 group-hover:to-accent/40 transition-all duration-300 group-hover:scale-150 group-hover:rotate-180" 
               style={{ clipPath: 'polygon(50% 0%, 0% 100%, 100% 100%)' }} />
        </div>

        {/* Hexagonal shapes */}
        <div
          className="absolute w-10 h-10 transition-all duration-1000 cursor-pointer group"
          style={{
            left: '80%',
            top: '20%',
            transform: `translate(${mousePosition.x * 0.015}px, ${mousePosition.y * 0.015}px)`,
          }}
        >
          <div className="w-full h-full bg-gradient-to-br from-accent/20 to-primary/20 group-hover:from-accent/40 group-hover:to-primary/40 transition-all duration-300 group-hover:scale-125 group-hover:rotate-90" 
               style={{ clipPath: 'polygon(30% 0%, 70% 0%, 100% 30%, 100% 70%, 70% 100%, 30% 100%, 0% 70%, 0% 30%)' }} />
        </div>

        {/* Diamond shapes */}
        <div
          className="absolute w-6 h-6 transition-all duration-1000 cursor-pointer group"
          style={{
            left: '25%',
            top: '70%',
            transform: `translate(${mousePosition.x * 0.02}px, ${mousePosition.y * 0.02}px) rotate(45deg)`,
          }}
        >
          <div className="w-full h-full bg-gradient-to-br from-primary/30 to-accent/30 group-hover:from-primary/50 group-hover:to-accent/50 transition-all duration-300 group-hover:scale-150 group-hover:rotate-180" />
        </div>

        {/* Circular glowing orbs */}
        <div
          className="absolute w-12 h-12 transition-all duration-1000 cursor-pointer group"
          style={{
            left: '75%',
            top: '65%',
            transform: `translate(${mousePosition.x * 0.01}px, ${mousePosition.y * 0.01}px)`,
          }}
        >
          <div className="w-full h-full bg-gradient-to-br from-accent/20 to-primary/20 rounded-full group-hover:from-accent/40 group-hover:to-primary/40 transition-all duration-300 group-hover:scale-125 blur-sm" />
          <div className="absolute inset-2 bg-gradient-to-br from-primary/30 to-accent/30 rounded-full group-hover:scale-110 transition-transform duration-300" />
        </div>

        {/* Star shapes */}
        <div
          className="absolute w-8 h-8 transition-all duration-1000 cursor-pointer group"
          style={{
            left: '50%',
            top: '35%',
            transform: `translate(${mousePosition.x * 0.02}px, ${mousePosition.y * 0.02}px)`,
          }}
        >
          <div className="w-full h-full bg-gradient-to-br from-primary/25 to-accent/25 group-hover:from-primary/45 group-hover:to-accent/45 transition-all duration-300 group-hover:scale-150 group-hover:rotate-180" 
               style={{ clipPath: 'polygon(50% 0%, 61% 35%, 98% 35%, 68% 57%, 79% 91%, 50% 70%, 21% 91%, 32% 57%, 2% 35%, 39% 35%)' }} />
        </div>
      </div>

      {/* Click ripples */}
      {clickRipples.map((ripple) => (
        <div
          key={ripple.id}
          className="absolute pointer-events-none"
          style={{
            left: ripple.x - 30,
            top: ripple.y - 30,
          }}
        >
          <div className="w-16 h-16 border border-primary/30 rounded-full animate-ping" />
          <div className="absolute inset-0 w-16 h-16 bg-gradient-to-r from-primary/10 to-accent/10 rounded-full animate-pulse" />
        </div>
      ))}

      {/* Subtle mouse follower */}
      <div
        className="absolute w-20 h-20 pointer-events-none transition-all duration-500"
        style={{
          left: mousePosition.x - 40,
          top: mousePosition.y - 40,
        }}
      >
        <div className="w-full h-full rounded-full bg-gradient-to-r from-primary/5 to-accent/5 blur-xl" />
      </div>

      {/* Dynamic grid pattern */}
      <div 
        className="absolute inset-0 opacity-5"
        style={{
          backgroundImage: `
            linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)
          `,
          backgroundSize: '60px 60px',
          transform: `translate(${mousePosition.x * 0.003}px, ${mousePosition.y * 0.003}px)`,
        }}
      />
    </div>
  );
};

export default InteractiveBackground;