import type { Particle } from '../types';

export const createParticle = (
  canvas: HTMLCanvasElement,
  audioData: Uint8Array,
  bassLevel: number,
  particlesRef: React.MutableRefObject<Particle[]>
) => {
  const bassIntensity = audioData.slice(0, 4).reduce((a, b) => a + b, 0) / (4 * 255);
  if (Math.random() > bassIntensity * bassLevel) return;

  const particle: Particle = {
    x: canvas.width / 2,
    y: canvas.height / 2,
    size: Math.random() * 4 + 2,
    speedX: (Math.random() - 0.5) * 10,
    speedY: (Math.random() - 0.5) * 10,
    life: 0,
    maxLife: Math.random() * 100 + 50
  };
  
  particlesRef.current.push(particle);
};

export const updateParticles = (
  ctx: CanvasRenderingContext2D,
  particlesRef: React.MutableRefObject<Particle[]>
) => {
  particlesRef.current = particlesRef.current.filter(p => p.life < p.maxLife);
  
  particlesRef.current.forEach(p => {
    p.x += p.speedX;
    p.y += p.speedY;
    p.life++;
    
    const progress = p.life / p.maxLife;
    const opacity = 1 - progress;
    
    ctx.beginPath();
    ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
    ctx.fillStyle = `rgba(236, 72, 153, ${opacity})`;
    ctx.fill();
  });
};