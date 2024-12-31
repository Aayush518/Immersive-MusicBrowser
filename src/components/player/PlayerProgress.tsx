import React from 'react';
import { formatTime } from '../../utils/audioUtils';

interface PlayerProgressProps {
  currentTime: number;
  duration: number;
  onSeek: (time: number) => void;
  isCollapsed?: boolean;
}

export const PlayerProgress: React.FC<PlayerProgressProps> = ({
  currentTime,
  duration,
  onSeek,
  isCollapsed
}) => {
  const progress = duration ? (currentTime / duration) * 100 : 0;

  if (isCollapsed) {
    return (
      <div className="absolute bottom-0 left-0 right-0 h-1 bg-gray-700">
        <div
          className="h-full bg-gradient-to-r from-pink-500 to-purple-500"
          style={{ width: `${progress}%` }}
        />
      </div>
    );
  }

  return (
    <div className="w-full flex items-center gap-2">
      <span className="text-xs text-gray-400 w-10">
        {formatTime(currentTime)}
      </span>
      
      <div className="relative flex-1 h-1 bg-gray-700 rounded-full">
        <div
          className="absolute h-full bg-gradient-to-r from-purple-500 to-pink-500 rounded-full"
          style={{ width: `${progress}%` }}
        />
        <input
          type="range"
          min={0}
          max={duration || 100}
          value={currentTime}
          onChange={(e) => onSeek(parseFloat(e.target.value))}
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
        />
      </div>
      
      <span className="text-xs text-gray-400 w-10">
        {formatTime(duration)}
      </span>
    </div>
  );
};