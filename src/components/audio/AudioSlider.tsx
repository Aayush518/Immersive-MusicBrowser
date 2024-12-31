import React from 'react';
import { LucideIcon } from 'lucide-react';

interface AudioSliderProps {
  label: string;
  value: number;
  onChange: (value: number) => void;
  icon: LucideIcon;
  color?: string;
}

export const AudioSlider: React.FC<AudioSliderProps> = ({
  label,
  value,
  onChange,
  icon: Icon,
  color = 'from-pink-500 to-purple-500'
}) => {
  return (
    <div className="group">
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2 text-sm text-gray-400">
          <Icon className="w-4 h-4" />
          <span>{label}</span>
        </div>
        <span className="text-xs font-medium text-white/60">
          {Math.round(value * 100)}%
        </span>
      </div>
      
      <div className="relative h-2">
        <div className="absolute inset-0 bg-white/5 rounded-full" />
        <div
          className={`absolute h-full bg-gradient-to-r ${color} rounded-full transition-all`}
          style={{ width: `${value * 100}%` }}
        />
        <input
          type="range"
          min="0"
          max="1"
          step="0.01"
          value={value}
          onChange={(e) => onChange(parseFloat(e.target.value))}
          className="absolute inset-0 w-full opacity-0 cursor-pointer"
        />
        
        <div 
          className="absolute top-1/2 -translate-y-1/2 w-3 h-3 bg-white rounded-full shadow-lg opacity-0 group-hover:opacity-100 transition-opacity"
          style={{ left: `${value * 100}%`, transform: `translate(-50%, -50%)` }}
        />
      </div>
    </div>
  );
};