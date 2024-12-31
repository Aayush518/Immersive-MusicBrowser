export const drawCircularBars = (
  ctx: CanvasRenderingContext2D,
  canvas: HTMLCanvasElement,
  audioData: Uint8Array,
  bassLevel: number,
  rotation: number
) => {
  const centerX = canvas.width / 2;
  const centerY = canvas.height / 2;
  const radius = Math.min(centerX, centerY) * 0.5;

  ctx.save();
  ctx.translate(centerX, centerY);
  ctx.rotate(rotation);

  const barCount = 180;
  const angleStep = (Math.PI * 2) / barCount;

  for (let i = 0; i < barCount; i++) {
    const angle = i * angleStep;
    const dataIndex = Math.floor((i / barCount) * audioData.length);
    const value = audioData[dataIndex] / 255;
    
    const height = radius * 0.3 * (1 + value * bassLevel);
    const x1 = Math.cos(angle) * radius;
    const y1 = Math.sin(angle) * radius;
    const x2 = Math.cos(angle) * (radius + height);
    const y2 = Math.sin(angle) * (radius + height);

    const gradient = ctx.createLinearGradient(x1, y1, x2, y2);
    gradient.addColorStop(0, `rgba(236, 72, 153, ${0.3 + value * 0.7})`);
    gradient.addColorStop(1, `rgba(168, 85, 247, ${0.3 + value * 0.7})`);

    ctx.beginPath();
    ctx.moveTo(x1, y1);
    ctx.lineTo(x2, y2);
    ctx.strokeStyle = gradient;
    ctx.lineWidth = 2;
    ctx.lineCap = 'round';
    ctx.stroke();
  }

  ctx.restore();
};

export const drawWaveform = (
  ctx: CanvasRenderingContext2D,
  canvas: HTMLCanvasElement,
  audioData: Uint8Array,
  bassLevel: number
) => {
  const centerY = canvas.height / 2;
  const barWidth = (canvas.width / audioData.length) * 2;
  const barSpacing = 2;

  for (let i = 0; i < audioData.length; i++) {
    const x = i * (barWidth + barSpacing);
    const height = (audioData[i] / 255) * (canvas.height / 4) * bassLevel;

    const gradient = ctx.createLinearGradient(x, centerY - height, x, centerY + height);
    gradient.addColorStop(0, 'rgba(236, 72, 153, 0.8)');
    gradient.addColorStop(0.5, 'rgba(168, 85, 247, 0.4)');
    gradient.addColorStop(1, 'rgba(236, 72, 153, 0.8)');

    ctx.fillStyle = gradient;
    ctx.fillRect(x, centerY - height, barWidth, height);
    ctx.fillRect(x, centerY, barWidth, height);

    ctx.shadowColor = 'rgba(236, 72, 153, 0.5)';
    ctx.shadowBlur = 15;
    ctx.shadowOffsetX = 0;
    ctx.shadowOffsetY = 0;
  }
};