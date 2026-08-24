import { useEffect, useState } from 'react';
import * as THREE from 'three';

let cachedMap: THREE.CanvasTexture | null = null;
let cachedEmissive: THREE.CanvasTexture | null = null;

function createCanTexture(): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = 2048;
  canvas.height = 1024;
  const ctx = canvas.getContext('2d')!;

  // Base metallic gradient (vertical)
  const baseGrad = ctx.createLinearGradient(0, 0, 0, 1024);
  baseGrad.addColorStop(0, '#080c14');
  baseGrad.addColorStop(0.5, '#161c28');
  baseGrad.addColorStop(1, '#080c14');
  ctx.fillStyle = baseGrad;
  ctx.fillRect(0, 0, 2048, 1024);

  // Subtle brushed metal vertical streaks
  for (let i = 0; i < 100; i++) {
    const x = Math.random() * 2048;
    const w = Math.random() * 2.5 + 0.4;
    ctx.fillStyle = `rgba(159,180,204,${Math.random() * 0.045})`;
    ctx.fillRect(x, 0, w, 1024);
  }

  // Top metadata text (AYX-01 repeated)
  ctx.font = '400 22px "JetBrains Mono", monospace';
  ctx.fillStyle = 'rgba(159,180,204,0.42)';
  ctx.textAlign = 'center';
  for (let i = 0; i < 8; i++) {
    ctx.fillText('AYX-01 // ENERGY SYSTEM', i * 256 + 128, 95);
  }

  // Bottom metadata text (tagline repeated)
  ctx.font = '400 20px "JetBrains Mono", monospace';
  ctx.fillStyle = 'rgba(159,180,204,0.38)';
  for (let i = 0; i < 8; i++) {
    ctx.fillText('FOCUS // DRIVE // ENERGY', i * 256 + 128, 945);
  }

  // Accent bands (cyan, top and bottom of label area)
  drawBand(ctx, 180, '#00e6ff', 0.95);
  drawBand(ctx, 200, '#00e6ff', 0.25);
  drawBand(ctx, 824, '#00e6ff', 0.25);
  drawBand(ctx, 844, '#00e6ff', 0.95);

  // 4 panels around the can
  for (let i = 0; i < 4; i++) {
    drawPanel(ctx, i * 512 + 256, 512, i);
  }

  const texture = new THREE.CanvasTexture(canvas);
  texture.anisotropy = 8;
  texture.colorSpace = THREE.SRGBColorSpace;
  texture.needsUpdate = true;
  return texture;
}

function drawBand(ctx: CanvasRenderingContext2D, y: number, color: string, alpha: number) {
  ctx.globalAlpha = alpha;
  ctx.fillStyle = color;
  ctx.fillRect(0, y, 2048, 1.5);
  ctx.globalAlpha = 1;
}

function drawPanel(
  ctx: CanvasRenderingContext2D,
  cx: number,
  cy: number,
  idx: number
) {
  ctx.textAlign = 'center';

  // Geometric marker above logo
  ctx.strokeStyle = '#00e6ff';
  ctx.lineWidth = 1.5;
  ctx.beginPath();
  ctx.moveTo(cx - 110, cy - 210);
  ctx.lineTo(cx - 35, cy - 210);
  ctx.moveTo(cx + 35, cy - 210);
  ctx.lineTo(cx + 110, cy - 210);
  ctx.stroke();
  ctx.fillStyle = '#7c5cff';
  ctx.beginPath();
  ctx.arc(cx, cy - 210, 3, 0, Math.PI * 2);
  ctx.fill();

  // AYX logo with glow
  ctx.save();
  ctx.shadowColor = '#00e6ff';
  ctx.shadowBlur = 40;
  ctx.fillStyle = '#00e6ff';
  ctx.font = '900 200px Orbitron, sans-serif';
  ctx.fillText('AYX', cx, cy - 30);
  ctx.restore();

  // ENERGY DRINK subtitle
  ctx.font = '500 34px "Space Grotesk", sans-serif';
  ctx.fillStyle = '#cfd8e3';
  ctx.fillText('ENERGY DRINK', cx, cy + 28);

  // Tagline
  ctx.font = '400 20px "JetBrains Mono", monospace';
  ctx.fillStyle = '#7c5cff';
  ctx.fillText('FOCUS // DRIVE // ENERGY', cx, cy + 72);

  // Small accent bars below
  ctx.fillStyle = 'rgba(0, 230, 255, 0.55)';
  ctx.fillRect(cx - 80, cy + 128, 160, 2);
  ctx.fillStyle = 'rgba(124, 92, 255, 0.35)';
  ctx.fillRect(cx - 50, cy + 138, 100, 1);

  // Panel index marker
  ctx.font = '400 14px "JetBrains Mono", monospace';
  ctx.fillStyle = 'rgba(159,180,204,0.5)';
  ctx.fillText(`P-${String(idx + 1).padStart(2, '0')}`, cx + 110, cy + 200);
  ctx.fillText(`P-${String(idx + 1).padStart(2, '0')}`, cx - 110, cy + 200);
}

function createEmissiveTexture(): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = 2048;
  canvas.height = 1024;
  const ctx = canvas.getContext('2d')!;

  // Pure black background (no emission elsewhere)
  ctx.fillStyle = '#000000';
  ctx.fillRect(0, 0, 2048, 1024);

  // Accent bands (cyan, emissive)
  ctx.fillStyle = '#00e6ff';
  ctx.globalAlpha = 0.85;
  ctx.fillRect(0, 180, 2048, 1.5);
  ctx.fillRect(0, 844, 2048, 1.5);
  ctx.globalAlpha = 0.3;
  ctx.fillRect(0, 200, 2048, 1.5);
  ctx.fillRect(0, 824, 2048, 1.5);
  ctx.globalAlpha = 1;

  // Cyan logo with glow on each panel
  for (let i = 0; i < 4; i++) {
    const cx = i * 512 + 256;
    const cy = 512;

    ctx.save();
    ctx.shadowColor = '#00e6ff';
    ctx.shadowBlur = 30;
    ctx.fillStyle = '#00e6ff';
    ctx.font = '900 200px Orbitron, sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('AYX', cx, cy - 30);
    ctx.restore();

    // Geometric markers (cyan)
    ctx.strokeStyle = '#00e6ff';
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.moveTo(cx - 110, cy - 210);
    ctx.lineTo(cx - 35, cy - 210);
    ctx.moveTo(cx + 35, cy - 210);
    ctx.lineTo(cx + 110, cy - 210);
    ctx.stroke();

    // Small bars below
    ctx.fillStyle = 'rgba(0, 230, 255, 0.6)';
    ctx.fillRect(cx - 80, cy + 128, 160, 2);
  }

  const texture = new THREE.CanvasTexture(canvas);
  texture.anisotropy = 8;
  texture.colorSpace = THREE.SRGBColorSpace;
  texture.needsUpdate = true;
  return texture;
}

export function useCanTexture() {
  const [textures, setTextures] = useState<{
    map: THREE.CanvasTexture | null;
    emissive: THREE.CanvasTexture | null;
  }>({ map: cachedMap, emissive: cachedEmissive });

  useEffect(() => {
    if (cachedMap && cachedEmissive) return;

    let mounted = true;
    const build = () => {
      if (!mounted) return;
      cachedMap = createCanTexture();
      cachedEmissive = createEmissiveTexture();
      setTextures({ map: cachedMap, emissive: cachedEmissive });
    };

    if (typeof document !== 'undefined' && document.fonts && document.fonts.ready) {
      document.fonts.ready.then(build).catch(build);
    } else {
      const t = setTimeout(build, 600);
      return () => {
        mounted = false;
        clearTimeout(t);
      };
    }

    return () => {
      mounted = false;
    };
  }, []);

  return textures;
}
