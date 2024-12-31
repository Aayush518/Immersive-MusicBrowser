import React, { useRef, useEffect } from 'react';
import { useAudioContext } from '../../contexts/AudioContext';
import { drawCircularBars } from './utils/visualizerDrawing';

export const CircularVisualizer: React.FC = () => {
  const { audioData, bassLevel } = useAudioContext();
  const canvasRef = useRef<HTMLCanvasElement>(null);

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

    let rotation = 0;
    const draw = () => {
      if (!ctx || !canvas) return;
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      drawCircularBars(ctx, canvas, audioData, bassLevel, rotation);
      rotation += 0.005;
      
      requestAnimationFrame(draw);
    };

    draw();

    return () => window.removeEventListener('resize', resize);
  }, [audioData, bassLevel]);

  return (
    <canvas 
      ref={canvasRef}
      className="absolute inset-0 w-full h-full"
    />
  );
};