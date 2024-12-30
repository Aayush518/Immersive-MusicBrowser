import React from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import { AudioVisualizerScene } from './AudioVisualizerScene';
import { useAudioContext } from '../contexts/AudioContext';

export const AudioVisualizer: React.FC = () => {
  const { audioData, bassLevel } = useAudioContext();

  return (
    <div className="w-full h-full">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-purple-900/30 via-blue-900/30 to-pink-900/30" />
      
      {/* 3D Visualization */}
      <Canvas camera={{ position: [0, 0, 10], fov: 75 }}>
        <OrbitControls 
          enableZoom={false}
          enablePan={false}
          maxPolarAngle={Math.PI / 1.5}
          minPolarAngle={Math.PI / 3}
        />
        <AudioVisualizerScene audioData={audioData} bassLevel={bassLevel} />
      </Canvas>

      {/* Floating particles */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {Array.from({ length: 20 }).map((_, i) => (
          <div
            key={i}
            className="absolute w-2 h-2 bg-white rounded-full opacity-20 animate-float"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 5}s`,
              animationDuration: `${5 + Math.random() * 10}s`
            }}
          />
        ))}
      </div>
    </div>
  );
};