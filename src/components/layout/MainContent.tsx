import React from 'react';
import { Song } from '../../types/music';
import { MusicUploader } from '../MusicUploader';
import { AudioVisualizer } from '../visualization/AudioVisualizer';
import { Playlist } from '../playlist/Playlist';
import { AudioControlPanel } from '../audio/AudioControlPanel';
import { Music } from 'lucide-react';
import { GradientText } from '../common/GradientText';
import { GlassCard } from '../common/GlassCard';
import { GradientButton } from '../common/GradientButton';

interface MainContentProps {
  songs: Song[];
  currentSong: Song | null;
  isPlaying: boolean;
  onUpload: (files: File[]) => void;
  onSongSelect: (song: Song) => void;
}

export const MainContent: React.FC<MainContentProps> = ({
  songs,
  currentSong,
  isPlaying,
  onUpload,
  onSongSelect,
}) => {
  if (songs.length === 0) {
    return (
      <div className="relative min-h-[600px] flex items-center justify-center">
        <div className="absolute inset-0">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-pink-500/10 rounded-full filter blur-[100px] animate-pulse-slow"></div>
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-500/10 rounded-full filter blur-[100px] animate-pulse-slow delay-1000"></div>
        </div>
        
        <div className="relative w-full max-w-2xl mx-auto px-4">
          <div className="text-center mb-12">
            <h1 className="text-5xl font-bold mb-6">
              <GradientText>Welcome to Neural Music</GradientText>
            </h1>
            <p className="text-gray-400 text-xl">
              Transform your music into a visual and auditory experience
            </p>
          </div>
          <MusicUploader onUpload={onUpload} />
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <GlassCard className="relative h-[300px] sm:h-[400px] md:h-[500px] lg:h-[600px]">
        <div className="absolute inset-0 bg-gradient-to-br from-pink-500/10 via-purple-500/5 to-blue-500/10"></div>
        <AudioVisualizer />
        
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-pink-500/10 rounded-full filter blur-[100px] animate-pulse-slow"></div>
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-500/10 rounded-full filter blur-[100px] animate-pulse-slow delay-1000"></div>
        </div>
      </GlassCard>
      
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        <div className="lg:col-span-3 space-y-8">
          <Playlist
            songs={songs}
            currentSong={currentSong}
            onSongSelect={onSongSelect}
            isPlaying={isPlaying}
          />
          
          <div className="flex justify-center">
            <label htmlFor="music-upload">
              <GradientButton icon={Music}>Add More Music</GradientButton>
            </label>
            <input
              type="file"
              id="music-upload"
              accept="audio/*"
              multiple
              onChange={(e) => {
                const files = e.target.files ? Array.from(e.target.files) : [];
                onUpload(files);
              }}
              className="hidden"
            />
          </div>
        </div>
        
        <div>
          <AudioControlPanel />
        </div>
      </div>
    </div>
  );
};