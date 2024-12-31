import React from 'react';
import { Music } from 'lucide-react';
import { Song } from '../../types/music';

interface SongInfoProps {
  song: Song;
}

export const SongInfo: React.FC<SongInfoProps> = ({ song }) => {
  return (
    <div className="flex items-center gap-4">
      {song.albumArt ? (
        <img 
          src={song.albumArt} 
          alt={`${song.title} cover`}
          className="w-12 h-12 rounded-lg object-cover shadow-lg"
        />
      ) : (
        <div className="w-12 h-12 bg-gradient-to-br from-purple-500/10 to-pink-500/10 rounded-lg flex items-center justify-center">
          <Music className="w-6 h-6 text-white" />
        </div>
      )}
      <div className="min-w-0">
        <h3 className="text-white font-medium truncate">{song.title}</h3>
        <div className="flex items-center gap-2 text-sm">
          <span className="text-gray-400 truncate">{song.artist}</span>
          {song.album && (
            <>
              <span className="text-gray-600">•</span>
              <span className="text-gray-400 truncate">{song.album}</span>
            </>
          )}
        </div>
      </div>
    </div>
  );
};