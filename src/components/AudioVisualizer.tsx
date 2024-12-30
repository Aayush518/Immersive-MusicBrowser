import React, { useRef, useEffect } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import { AudioVisualizerScene } from './AudioVisualizerScene';
import { useAudioContext } from '../contexts/AudioContext';

export const AudioVisualizer: React.FC = () => {
  const { audioData, bassLevel } = useAudioContext();
  const canvasRef = useRef<HTMLCanvasElement>(null);

  return (
    <div className="w-full h-[400px] rounded-xl overflow-hidden bg-gradient-to-br from-purple-900 via-blue-900 to-black">
      <Canvas>
        <OrbitControls enableZoom={false} />
        <AudioVisualizerScene audioData={audioData} bassLevel={bassLevel} />
      </Canvas>
    </div>
  );
};