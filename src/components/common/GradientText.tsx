import React from 'react';

interface GradientTextProps {
  children: React.ReactNode;
  className?: string;
}

export const GradientText: React.FC<GradientTextProps> = ({ children, className = '' }) => {
  return (
    <span className={`bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-500 text-transparent bg-clip-text ${className}`}>
      {children}
    </span>
  );
};