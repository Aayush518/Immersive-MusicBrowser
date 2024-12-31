import React, { useRef, useEffect } from 'react';
import { useAudioContext } from '../../contexts/AudioContext';
import '../../styles/visualizer.css';

export const BassVisualizer: React.FC = () => {
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

    const draw = () => {
      if (!ctx || !canvas) return;

      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      // Get bass frequencies (typically 20-150Hz)
      const bassFrequencies = audioData.slice(0, 8);
      const averageBass = bassFrequencies.reduce((a, b) => a + b, 0) / bassFrequencies.length;
      const normalizedBass = averageBass / 255;
      
      // Draw bass ripples
      const rippleSize = canvas.width * 0.3 * (1 + normalizedBass * bassLevel);
      const gradient = ctx.createRadialGradient(
        canvas.width / 2,
        canvas.height / 2,
        0,
        canvas.width / 2,
        canvas.height / 2,
        rippleSize
      );

      gradient.addColorStop(0, `rgba(236, 72, 153, ${normalizedBass * 0.5})`); // pink-500
      gradient.addColorStop(1, 'rgba(236, 72, 153, 0)');
      
      ctx.beginPath();
      ctx.arc(canvas.width / 2, canvas.height / 2, rippleSize, 0, Math.PI * 2);
      ctx.fillStyle = gradient;
      ctx.fill();

      // Draw frequency bars in a circle
      const bars = 32;
      const centerX = canvas.width / 2;
      const centerY = canvas.height / 2;
      const radius = canvas.width * 0.2;

      for (let i = 0; i < bars; i++) {
        const angle = (i / bars) * Math.PI * 2;
        const frequency = audioData[i] / 255;
        const barHeight = radius * frequency * bassLevel;
        
        const x1 = centerX + Math.cos(angle) * radius;
        const y1 = centerY + Math.sin(angle) * radius;
        const x2 = centerX + Math.cos(angle) * (radius + barHeight);
        const y2 = centerY + Math.sin(angle) * (radius + barHeight);

        ctx.beginPath();
        ctx.moveTo(x1, y1);
        ctx.lineTo(x2, y2);
        ctx.strokeStyle = `rgba(236, 72, 153, ${0.5 + frequency * 0.5})`;
        ctx.lineWidth = 4;
        ctx.stroke();
      }

      requestAnimationFrame(draw);
    };

    draw();

    return () => {
      window.removeEventListener('resize', resize);
    };
  }, [audioData, bassLevel]);

  return (
    <canvas 
      ref={canvasRef}
      className="absolute inset-0 w-full h-full"
    />
  );
};