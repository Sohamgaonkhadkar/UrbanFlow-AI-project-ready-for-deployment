import React from 'react';

const AnimatedCard = ({ children, glowColor = 'cyan', className = '' }) => {
  return (
    <div className={`relative rounded-xl border border-gray-800 bg-gray-900/50 backdrop-blur-md overflow-hidden ${className}`}>
      
      {/* The neon glow effect behind the card */}
      <div 
        className={`absolute -inset-0.5 opacity-20 blur-md rounded-xl pointer-events-none`}
        style={{ backgroundColor: glowColor === 'purple' ? '#a855f7' : glowColor === 'amber' ? '#f59e0b' : '#06b6d4' }}
      ></div>
      
      {/* The actual content (children) goes here! */}
      <div className="relative h-full w-full">
        {children}
      </div>
      
    </div>
  );
};

export default AnimatedCard;