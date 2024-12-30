import React, { useState, useCallback } from 'react';
import { Volume2, VolumeX, Volume1 } from 'lucide-react';
import { VolumeSlider } from './VolumeSlider';

interface Props {
  volume: number;
  onChange: (volume: number) => void;
  isMuted: boolean;
  onMuteToggle: () => void;
}

export const AdvancedVolumeControl: React.FC<Props> = ({
  volume,
  onChange,
  isMuted,
  onMuteToggle,
}) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const getVolumeIcon = () => {
    if (isMuted || volume === 0) return VolumeX;
    if (volume < 0.5) return Volume1;
    return Volume2;
  };

  const VolumeIcon = getVolumeIcon();

  return (
    <div 
      className="relative group"
      onMouseEnter={() => setIsExpanded(true)}
      onMouseLeave={() => setIsExpanded(false)}
    >
      <button
        onClick={onMuteToggle}
        className="p-2 text-gray-400 hover:text-white transition-colors"
      >
        <VolumeIcon className="w-5 h-5" />
      </button>
      
      <div className={`absolute bottom-full left-1/2 -translate-x-1/2 mb-2 bg-black/90 rounded-lg p-4 transition-all duration-200 ${
        isExpanded ? 'opacity-100 visible translate-y-0' : 'opacity-0 invisible translate-y-2'
      }`}>
        <div className="h-32 flex flex-col items-center gap-2">
          <div className="h-24 w-6 relative">
            <VolumeSlider
              value={isMuted ? 0 : volume}
              onChange={onChange}
              className="transform -rotate-90 origin-left translate-x-3 translate-y-12 w-24"
            />
          </div>
          <span className="text-xs text-white font-medium">
            {Math.round((isMuted ? 0 : volume) * 100)}%
          </span>
        </div>
      </div>
    </div>
  );
};