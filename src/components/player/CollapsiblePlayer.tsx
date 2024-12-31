import React, { useState } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';
import { Song } from '../../types/music';
import { Player } from './Player';

interface CollapsiblePlayerProps {
  currentSong: Song;
  onNext: () => void;
  onPrevious: () => void;
  onPlayStateChange: (playing: boolean) => void;
  autoPlay?: boolean;
}

export const CollapsiblePlayer: React.FC<CollapsiblePlayerProps> = (props) => {
  const [isCollapsed, setIsCollapsed] = useState(false);

  return (
    <div className="fixed z-50 bottom-0 left-0 right-0">
      <div className={`transition-transform duration-300 ${
        isCollapsed ? 'transform translate-y-[calc(100%-4rem)]' : ''
      }`}>
        <button
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="absolute -top-8 right-4 p-2 bg-black/90 backdrop-blur-lg rounded-t-lg border-t border-x border-pink-500/10 hover:bg-black/80 transition-colors"
        >
          {isCollapsed ? (
            <ChevronUp className="w-4 h-4 text-gray-400 hover:text-white" />
          ) : (
            <ChevronDown className="w-4 h-4 text-gray-400 hover:text-white" />
          )}
        </button>
        
        <Player {...props} isCollapsed={isCollapsed} />
      </div>
    </div>
  );
};