import React from 'react';
import { LucideIcon } from 'lucide-react';

interface ControlSectionProps {
  title: string;
  icon: LucideIcon;
  children: React.ReactNode;
}

export const ControlSection: React.FC<ControlSectionProps> = ({
  title,
  icon: Icon,
  children
}) => {
  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2 text-white/80">
        <Icon className="w-4 h-4" />
        <h3 className="text-sm font-medium">{title}</h3>
      </div>
      <div className="space-y-4">
        {children}
      </div>
    </div>
  );
};