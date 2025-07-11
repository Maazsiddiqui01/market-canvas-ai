import React, { useEffect, useState, useCallback } from 'react';

const InteractiveBackground = () => {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  const handleMouseMove = useCallback((e: MouseEvent) => {
    setMousePosition({ x: e.clientX, y: e.clientY });
  }, []);

  useEffect(() => {
    window.addEventListener('mousemove', handleMouseMove);
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, [handleMouseMove]);

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
      {/* Very subtle gradient mesh */}
      <div 
        className="absolute inset-0 opacity-5"
        style={{
          background: `
            radial-gradient(circle at ${20 + mousePosition.x * 0.02}% ${20 + mousePosition.y * 0.02}%, hsl(var(--primary) / 0.1) 0%, transparent 50%),
            radial-gradient(circle at ${80 - mousePosition.x * 0.02}% ${80 - mousePosition.y * 0.02}%, hsl(var(--accent) / 0.08) 0%, transparent 50%)
          `
        }}
      />

      {/* Minimal grid pattern */}
      <div 
        className="absolute inset-0 opacity-2"
        style={{
          backgroundImage: `
            linear-gradient(rgba(255,255,255,0.03) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255,255,255,0.03) 1px, transparent 1px)
          `,
          backgroundSize: '100px 100px',
        }}
      />
    </div>
  );
};

export default InteractiveBackground;