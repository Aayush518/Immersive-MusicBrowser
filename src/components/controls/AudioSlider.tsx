import React from 'react';
import { LucideIcon } from 'lucide-react';

interface AudioSliderProps {
  label: string;
  icon: LucideIcon;
  value: number;
  onChange: (value: number) => void;
}

export const AudioSlider: React.FC<AudioSliderProps> = ({
  label,
  icon: Icon,
  value,
  onChange,
}) => {
  return (
    <div className="space-y-2">
      <label className="text-gray-300 flex items-center gap-2 text-sm">
        <Icon className="w-4 h-4" />
        {label}
      </label>
      <div className="relative w-full h-8 group flex items-center">
        <div className="absolute h-1.5 w-full rounded-full bg-gray-700" />
        <div 
          className="absolute h-1.5 rounded-full bg-gradient-to-r from-pink-500 to-purple-500"
          style={{ width: `${value * 100}%` }}
        />
        <input
          type="range"
          min="0"
          max="1"
          step="0.01"
          value={value}
          onChange={(e) => onChange(parseFloat(e.target.value))}
          className="absolute w-full opacity-0 cursor-pointer"
        />
        <div 
          className="absolute w-3 h-3 rounded-full bg-white shadow-lg transform scale-0 group-hover:scale-100 transition-transform"
          style={{ left: `${value * 100}%`, transform: 'translateX(-50%)' }}
        />
      </div>
    </div>
  );
};