import React from 'react';
import { LucideIcon } from 'lucide-react';

interface GradientButtonProps {
  icon?: LucideIcon;
  children: React.ReactNode;
  onClick?: () => void;
  className?: string;
  type?: 'button' | 'submit';
}

export const GradientButton: React.FC<GradientButtonProps> = ({
  icon: Icon,
  children,
  onClick,
  className = '',
  type = 'button'
}) => {
  return (
    <button
      type={type}
      onClick={onClick}
      className={`group inline-flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-pink-500 to-purple-500 text-white rounded-2xl transition-all font-medium shadow-lg shadow-pink-500/20 hover:shadow-xl hover:shadow-pink-500/30 hover:scale-105 active:scale-[0.98] ${className}`}
    >
      {Icon && <Icon className="w-5 h-5 group-hover:scale-110 transition-transform" />}
      <span className="font-medium">{children}</span>
    </button>
  );
};