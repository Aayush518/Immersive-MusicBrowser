import React from 'react';
import { Music, Sparkles } from 'lucide-react';
import { GradientText } from '../common/GradientText';
import { GlassCard } from '../common/GlassCard';

interface HeaderProps {
  songCount: number;
}

export const Header: React.FC<HeaderProps> = ({ songCount }) => {
  return (
    <header className="relative z-10 flex flex-col sm:flex-row items-center justify-between gap-6 mb-12">
      <div className="flex items-center gap-6">
        <div className="relative">
          <div className="absolute inset-0 bg-gradient-to-r from-pink-500 to-purple-500 rounded-2xl blur-lg opacity-50"></div>
          <div className="relative p-4 bg-black/50 rounded-2xl backdrop-blur-sm border border-white/10">
            <Music className="w-10 h-10 sm:w-12 sm:h-12 text-white" />
          </div>
        </div>
        <div>
          <h1 className="text-4xl sm:text-5xl font-bold">
            <GradientText>Neural Music</GradientText>
          </h1>
          <p className="text-gray-400 mt-2 text-lg">
            Experience your music in a new dimension
          </p>
        </div>
      </div>
      
      {songCount > 0 && (
        <GlassCard className="px-6 py-3 flex items-center gap-3">
          <Sparkles className="w-5 h-5 text-pink-500" />
          <span className="text-gray-300 font-medium">{songCount} tracks</span>
        </GlassCard>
      )}
    </header>
  );
};