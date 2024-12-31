import React from 'react';
import { Play, Pause, Music } from 'lucide-react';
import { Song } from '../../types/music';
import { formatTime } from '../../utils/audioUtils';
import { SongMetadata } from '../player/SongMetadata';
import { GlassCard } from '../common/GlassCard';
import { GradientText } from '../common/GradientText';

interface Props {
  songs: Song[];
  currentSong: Song | null;
  onSongSelect: (song: Song) => void;
  isPlaying: boolean;
}

export const Playlist: React.FC<Props> = ({ songs, currentSong, onSongSelect, isPlaying }) => {
  return (
    <GlassCard>
      <div className="p-6 border-b border-white/10 bg-gradient-to-r from-pink-500/10 to-purple-500/10">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Music className="w-6 h-6 text-pink-500" />
            <h2 className="text-xl font-medium">
              <GradientText>Your Collection</GradientText>
            </h2>
          </div>
          <span className="px-4 py-2 rounded-full text-sm font-medium bg-white/5 text-gray-300 border border-white/10">
            {songs.length} tracks
          </span>
        </div>
      </div>
      
      <div className="divide-y divide-white/5">
        {songs.map((song) => (
          <div
            key={song.id}
            onClick={() => onSongSelect(song)}
            className={`flex items-center gap-4 p-4 hover:bg-white/5 cursor-pointer transition-all duration-200 group ${
              currentSong?.id === song.id ? 'bg-white/5' : ''
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
            
            <span className="text-sm text-gray-400 ml-4 opacity-0 group-hover:opacity-100 transition-opacity">
              {formatTime(song.duration)}
            </span>
          </div>
        ))}
      </div>
    </GlassCard>
  );
};