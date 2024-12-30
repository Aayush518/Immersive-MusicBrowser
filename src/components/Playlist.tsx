import React from 'react';
import { Music, Play } from 'lucide-react';
import { Song } from '../types/music';
import { formatTime } from '../utils/audioUtils';

interface Props {
  songs: Song[];
  currentSong: Song | null;
  onSongSelect: (song: Song) => void;
}

export const Playlist: React.FC<Props> = ({ songs, currentSong, onSongSelect }) => {
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
            <div className="w-12 h-12 flex items-center justify-center rounded-lg bg-gradient-to-br from-pink-500/10 to-purple-500/10">
              {song.coverArt ? (
                <img
                  src={song.coverArt}
                  alt={song.title}
                  className="w-full h-full object-cover rounded-lg"
                />
              ) : (
                <Music className="w-6 h-6 text-pink-500" />
              )}
            </div>
            
            <div className="flex-1 min-w-0">
              <h3 className="text-white font-medium truncate">
                {song.title}
              </h3>
              <p className="text-sm text-gray-400">{song.artist}</p>
            </div>
            
            <div className="flex items-center gap-4">
              <span className="text-sm text-gray-400">
                {formatTime(song.duration)}
              </span>
              {currentSong?.id === song.id && (
                <Play className="w-5 h-5 text-pink-500" />
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};