import React, { useRef, useEffect } from 'react';
import { useAudioContext } from '../../contexts/AudioContext';
import { createParticle, updateParticles } from './utils/particleSystem';
import type { Particle } from './types';

export const ParticleSystem: React.FC = () => {
  const { audioData, bassLevel } = useAudioContext();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const particlesRef = useRef<Particle[]>([]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const resize = () => {
      canvas.width = canvas.offsetWidth * window.devicePixelRatio;
      canvas.height = canvas.offsetHeight * window.devicePixelRatio;
      ctx.scale(window.devicePixelRatio, window.devicePixelRatio);
    };

    resize();
    window.addEventListener('resize', resize);

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      createParticle(canvas, audioData, bassLevel, particlesRef);
      updateParticles(ctx, particlesRef);
      
      requestAnimationFrame(animate);
    };

    animate();

    return () => window.removeEventListener('resize', resize);
  }, [audioData, bassLevel]);

  return (
    <canvas 
      ref={canvasRef}
      className="absolute inset-0 w-full h-full pointer-events-none"
    />
  );
};