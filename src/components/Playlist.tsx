import React from 'react';
import { Play, Pause } from 'lucide-react';
import { Song } from '../types/music';
import { formatTime } from '../utils/audioUtils';
import { SongMetadata } from './player/SongMetadata';

interface Props {
  songs: Song[];
  currentSong: Song | null;
  onSongSelect: (song: Song) => void;
  isPlaying: boolean;
}

export const Playlist: React.FC<Props> = ({ songs, currentSong, onSongSelect, isPlaying }) => {
  return (
    <div className="bg-[#111111] border border-[#333333] rounded-xl overflow-hidden">
      <div className="p-6">
        <h2 className="text-xl font-semibold text-white mb-4">Your Collection</h2>
      </div>
      
      <div className="divide-y divide-[#333333]">
        {songs.map((song) => (
          <div
            key={song.id}
            onClick={() => onSongSelect(song)}
            className={`flex items-center gap-4 p-4 hover:bg-[#1a1a1a] cursor-pointer transition-colors ${
              currentSong?.id === song.id ? 'bg-[#1a1a1a]' : ''
            }`}
          >
            <div className="relative flex-1">
              <SongMetadata song={song} showAlbum={true} size="sm" />
              {currentSong?.id === song.id && (
                <div className="absolute right-0 top-1/2 -translate-y-1/2 p-2">
                  {isPlaying ? (
                    <Pause className="w-5 h-5 text-pink-500" />
                  ) : (
                    <Play className="w-5 h-5 text-pink-500" />
                  )}
                </div>
              )}
            </div>
            
            <span className="text-sm text-gray-400 ml-4">
              {formatTime(song.duration)}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};