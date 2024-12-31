import React from 'react';
import { WaveformVisualizer } from './WaveformVisualizer';
import { CircularVisualizer } from './CircularVisualizer';
import { ParticleSystem } from './ParticleSystem';
import { useAudioContext } from '../../contexts/AudioContext';

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
    </div>
  );
};