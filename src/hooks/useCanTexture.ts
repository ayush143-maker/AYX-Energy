import { useEffect, useState } from 'react';
import * as THREE from 'three';

const cachedMaps: Record<string, THREE.CanvasTexture> = {};

function createCanTexture(variant: string, accent: string): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = 2048;
  canvas.height = 1024;
  const ctx = canvas.getContext('2d')!;

  // Base satin aluminum color
  ctx.fillStyle = '#F9FAFB';
  ctx.fillRect(0, 0, 2048, 1024);

  // Subtle vertical metallic streaks
  for (let i = 0; i < 100; i++) {
    const x = Math.random() * 2048;
    const w = Math.random() * 3 + 0.5;
    ctx.fillStyle = `rgba(200,210,220,${Math.random() * 0.05})`;
    ctx.fillRect(x, 0, w, 1024);
  }

  // Signature horizontal wrap lines (Top and Bottom)
  ctx.fillStyle = accent;
  ctx.globalAlpha = 0.8;
  ctx.fillRect(0, 150, 2048, 4);
  ctx.fillRect(0, 872, 2048, 4);
  ctx.globalAlpha = 0.2;
  ctx.fillRect(0, 156, 2048, 1);
  ctx.fillRect(0, 866, 2048, 1);
  ctx.globalAlpha = 1;

  /* 
    UV MAPPING LAYOUT (2048px wide):
    0-512px: Left Side
    512-1024px: Front
    1024-1536px: Right Side
    1536-2048px: Back
  */

  // --- FRONT (512 - 1024) ---
  const frontCx = 768;
  const frontCy = 460;
  ctx.textAlign = 'center';

  ctx.fillStyle = '#111111';
  ctx.font = '900 220px sans-serif';
  ctx.fillText('AYX', frontCx, frontCy);

  ctx.fillStyle = '#111111';
  ctx.font = '600 36px sans-serif';
  ctx.fillText('ENERGY DRINK', frontCx, frontCy + 55);

  ctx.fillStyle = accent;
  ctx.fillRect(frontCx - 60, frontCy + 85, 120, 4);

  ctx.fillStyle = accent;
  ctx.font = '700 34px sans-serif';
  ctx.fillText(variant, frontCx, frontCy + 130);

  ctx.fillStyle = '#6B7280';
  ctx.font = '500 24px sans-serif';
  ctx.fillText('330 ML', frontCx, frontCy + 175);

  // --- RIGHT SIDE (1024 - 1536) ---
  const rightCx = 1280;
  ctx.fillStyle = '#111111';
  ctx.font = '600 24px sans-serif';
  ctx.fillText('ENERGY PROFILE', rightCx, 300);
  
  ctx.fillStyle = '#6B7280';
  ctx.font = '400 20px sans-serif';
  ctx.fillText('CAFFEINE', rightCx, 350);
  ctx.fillStyle = '#111111';
  ctx.font = '700 32px sans-serif';
  ctx.fillText('180 MG', rightCx, 390);

  ctx.fillStyle = '#6B7280';
  ctx.font = '400 20px sans-serif';
  ctx.fillText('TAURINE', rightCx, 450);
  ctx.fillStyle = '#111111';
  ctx.font = '700 32px sans-serif';
  ctx.fillText('400 MG', rightCx, 490);

  ctx.fillStyle = '#6B7280';
  ctx.font = '400 20px sans-serif';
  ctx.fillText('B VITAMINS', rightCx, 550);
  ctx.fillStyle = '#111111';
  ctx.font = '700 32px sans-serif';
  ctx.fillText('100% RDI', rightCx, 590);

  // --- BACK (1536 - 2048) ---
  const backCx = 1792;
  ctx.fillStyle = '#111111';
  ctx.font = '600 28px sans-serif';
  ctx.fillText('AYX ORIGINAL', backCx, 250);
  
  ctx.fillStyle = '#6B7280';
  ctx.font = '400 18px sans-serif';
  ctx.fillText('Engineered for focus.', backCx, 290);
  ctx.fillText('Built for momentum.', backCx, 315);

  // Ingredients List
  ctx.textAlign = 'left';
  ctx.fillStyle = '#111111';
  ctx.font = '600 18px sans-serif';
  ctx.fillText('INGREDIENTS:', backCx - 180, 380);
  ctx.fillStyle = '#6B7280';
  ctx.font = '400 16px sans-serif';
  const ingredients = [
    'Carbonated Water, Sugar, Citric Acid,',
    'Natural Flavors, Sodium Citrate,',
    'Caffeine, Taurine, Inositol,',
    'Niacinamide, Pyridoxine Hydrochloride,',
    'Cyanocobalamin.'
  ];
  ingredients.forEach((line, i) => ctx.fillText(line, backCx - 180, 410 + i * 22));

  // Barcode
  ctx.fillStyle = '#000000';
  let barX = backCx - 100;
  for(let i = 0; i < 40; i++) {
    const w = Math.random() * 3 + 1;
    ctx.fillRect(barX, 650, w, 80);
    barX += w + 2;
  }
  ctx.fillStyle = '#111111';
  ctx.font = '400 14px sans-serif';
  ctx.fillText('8 901234 567890', backCx - 50, 750);

  // Recycling Symbol
  ctx.strokeStyle = '#111111';
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(backCx + 80, 700);
  ctx.lineTo(backCx + 100, 680);
  ctx.lineTo(backCx + 120, 700);
  ctx.stroke();
  ctx.font = '400 12px sans-serif';
  ctx.fillText('ALU', backCx + 100, 720);

  // --- LEFT SIDE (0 - 512) ---
  ctx.textAlign = 'center';
  const leftCx = 256;
  ctx.fillStyle = '#111111';
  ctx.font = '600 24px sans-serif';
  ctx.fillText('FOCUS / DRIVE', leftCx, 350);
  ctx.fillText('MOMENTUM', leftCx, 390);

  ctx.fillStyle = accent;
  ctx.fillRect(leftCx - 40, 430, 80, 2);

  ctx.fillStyle = '#6B7280';
  ctx.font = '400 16px sans-serif';
  ctx.fillText('SERVING SIZE: 330 ML', leftCx, 480);
  ctx.fillText('BATCH: AYX-2026-01', leftCx, 510);
  ctx.fillText('MFG: 08/2026', leftCx, 540);

  const texture = new THREE.CanvasTexture(canvas);
  texture.anisotropy = 8;
  texture.colorSpace = THREE.SRGBColorSpace;
  texture.needsUpdate = true;
  return texture;
}

export function useCanTexture(variant: string, accent: string) {
  const [map, setMap] = useState<THREE.CanvasTexture | null>(cachedMaps[variant] || null);

  useEffect(() => {
    if (cachedMaps[variant]) {
      setMap(cachedMaps[variant]);
      return;
    }

    let mounted = true;
    const build = () => {
      if (!mounted) return;
      const tex = createCanTexture(variant, accent);
      cachedMaps[variant] = tex;
      setMap(tex);
    };

    build();

    return () => { mounted = false; };
  }, [variant, accent]);

  return map;
}
