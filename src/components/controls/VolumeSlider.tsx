import React, { useCallback } from 'react';
import { Volume, Volume1, Volume2, VolumeX } from 'lucide-react';

interface Props {
  value: number;
  onChange: (value: number) => void;
  isMuted: boolean;
  onMuteToggle: () => void;
  className?: string;
}

export const VolumeSlider: React.FC<Props> = ({ 
  value = 0,
  onChange, 
  isMuted,
  onMuteToggle,
  className = '' 
}) => {
  const getVolumeIcon = useCallback(() => {
    if (isMuted || value === 0) return VolumeX;
    if (value < 0.3) return Volume;
    if (value < 0.7) return Volume1;
    return Volume2;
  }, [value, isMuted]);

  const handleVolumeChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    e.stopPropagation();
    onChange(parseFloat(e.target.value));
  }, [onChange]);

  const handleMuteClick = useCallback((e: React.MouseEvent) => {
    e.stopPropagation();
    onMuteToggle();
  }, [onMuteToggle]);

  const VolumeIcon = getVolumeIcon();

  return (
    <div className={`flex items-center gap-2 ${className}`} onClick={e => e.stopPropagation()}>
      <button
        onClick={handleMuteClick}
        className="p-1.5 text-gray-400 hover:text-white transition-colors rounded-lg hover:bg-white/10"
      >
        <VolumeIcon className="w-5 h-5" />
      </button>
      
      <div className="relative w-24 h-8 group flex items-center">
        <div className="absolute h-1.5 w-full rounded-full bg-gray-700" />
        
        <div 
          className="absolute h-1.5 rounded-full bg-gradient-to-r from-pink-500 to-purple-500"
          style={{ width: `${(isMuted ? 0 : value) * 100}%` }}
        />
        
        <input
          type="range"
          min="0"
          max="1"
          step="0.01"
          value={isMuted ? 0 : value}
          onChange={handleVolumeChange}
          className="absolute w-full opacity-0 cursor-pointer"
        />
        
        <div 
          className="absolute w-3 h-3 rounded-full bg-white shadow-lg transform scale-0 group-hover:scale-100 transition-transform"
          style={{ left: `${(isMuted ? 0 : value) * 100}%`, transform: 'translateX(-50%)' }}
        />
      </div>
    </div>
  );
};