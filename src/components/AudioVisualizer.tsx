import React from 'react';
import { WaveformVisualizer } from './visualization/WaveformVisualizer';
import { CircularVisualizer } from './visualization/CircularVisualizer';
import { ParticleSystem } from './visualization/ParticleSystem';
import { useAudioContext } from '../contexts/AudioContext';

export const AudioVisualizer: React.FC = () => {
  const { bassLevel } = useAudioContext();

  return (
    <div className="relative w-full h-full">
      {/* Dynamic background */}
      <div 
        className="absolute inset-0 bg-gradient-to-br from-purple-900/30 via-black to-pink-900/30"
        style={{
          filter: `brightness(${1 + bassLevel * 0.5})`
        }}
      />
      
      {/* Visualizers */}
      <div className="absolute inset-0">
        <CircularVisualizer />
        <WaveformVisualizer />
        <ParticleSystem />
      </div>

      {/* Ambient effects */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-32 h-32 bg-pink-500/20 rounded-full filter blur-3xl animate-pulse-glow" />
        <div className="absolute bottom-1/4 right-1/4 w-32 h-32 bg-purple-500/20 rounded-full filter blur-3xl animate-pulse-glow" style={{ animationDelay: '-1s' }} />
      </div>

      {/* Floating orbs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {Array.from({ length: 3 }).map((_, i) => (
          <div
            key={i}
            className="absolute w-64 h-64 rounded-full animate-orbit"
            style={{
              background: 'radial-gradient(circle, rgba(236, 72, 153, 0.1), transparent 70%)',
              animationDelay: `${i * -2.5}s`,
              filter: 'blur(8px)',
              transform: `scale(${1 + bassLevel * 0.2})`
            }}
          />
        ))}
      </div>
    </div>
  );
};