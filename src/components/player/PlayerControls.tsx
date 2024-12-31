import React from 'react';
import { Play, Pause, SkipBack, SkipForward } from 'lucide-react';

interface PlayerControlsProps {
  isPlaying: boolean;
  onTogglePlay: () => void;
  onNext: () => void;
  onPrevious: () => void;
}

export const PlayerControls: React.FC<PlayerControlsProps> = ({
  isPlaying,
  onTogglePlay,
  onNext,
  onPrevious
}) => {
  return (
    <div className="flex items-center justify-center gap-4">
      <button
        onClick={onPrevious}
        className="p-2 text-gray-400 hover:text-white transition-colors"
      >
        <SkipBack className="w-5 h-5" />
      </button>
      
      <button
        onClick={onTogglePlay}
        className="p-3 bg-gradient-to-r from-pink-500 to-purple-500 rounded-full text-white hover:opacity-90 transition-opacity shadow-lg shadow-pink-500/20"
      >
        {isPlaying ? (
          <Pause className="w-5 h-5" />
        ) : (
          <Play className="w-5 h-5" />
        )}
      </button>
      
      <button
        onClick={onNext}
        className="p-2 text-gray-400 hover:text-white transition-colors"
      >
        <SkipForward className="w-5 h-5" />
      </button>
    </div>
  );
};