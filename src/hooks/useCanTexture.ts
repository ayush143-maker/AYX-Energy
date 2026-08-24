import { useEffect, useState } from 'react';
import * as THREE from 'three';

const cachedMaps: Record<string, THREE.CanvasTexture> = {};

function drawLabel(variant: string, accent: string): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = 2048;
  canvas.height = 1024;
  const ctx = canvas.getContext('2d')!;

  // Base matte white printed surface
  ctx.fillStyle = '#FFFFFF';
  ctx.fillRect(0, 0, 2048, 1024);

  // Signature horizontal wrap lines (Top and Bottom)
  ctx.fillStyle = '#111111';
  ctx.fillRect(0, 120, 2048, 4);
  ctx.fillRect(0, 900, 2048, 4);
  
  // Accent line
  ctx.fillStyle = accent;
  ctx.fillRect(0, 124, 2048, 1);
  ctx.fillRect(0, 899, 2048, 1);

  /* 
    UV MAPPING LAYOUT (2048px wide):
    0-512px: Left Side
    512-1024px: Front
    1024-1536px: Right Side
    1536-2048px: Back
  */

  // --- FRONT (512 - 1024) ---
  const frontCx = 768;
  ctx.textAlign = 'center';

  // AYX Logo
  ctx.fillStyle = '#111111';
  ctx.font = '900 220px Inter, sans-serif';
  ctx.fillText('AYX', frontCx, 380);

  // Subtitle
  ctx.font = '600 36px Inter, sans-serif';
  ctx.fillText('ENERGY DRINK', frontCx, 440);

  // Accent Line
  ctx.fillStyle = accent;
  ctx.fillRect(frontCx - 60, 470, 120, 4);

  // Variant
  ctx.fillStyle = accent;
  ctx.font = '700 34px Inter, sans-serif';
  ctx.fillText(variant, frontCx, 520);

  // Features
  ctx.fillStyle = '#111111';
  ctx.font = '600 22px Inter, sans-serif';
  const features = ['180 MG CAFFEINE', 'TAURINE', 'B VITAMINS'];
  features.forEach((f, i) => {
    ctx.fillText(f, frontCx, 600 + i * 35);
  });

  // Tagline
  ctx.font = '500 18px Inter, sans-serif';
  ctx.fillStyle = '#6B7280';
  ctx.fillText('FOCUS / DRIVE / MOMENTUM', frontCx, 750);

  // Bottom Info
  ctx.font = '600 24px Inter, sans-serif';
  ctx.fillStyle = '#111111';
  ctx.fillText('330 ML', frontCx, 830);
  ctx.font = '400 14px Inter, sans-serif';
  ctx.fillStyle = '#6B7280';
  ctx.fillText('CAFFEINATED ENERGY DRINK', frontCx, 860);
  ctx.fillText('AYX-01', frontCx, 880);

  // --- RIGHT SIDE (1024 - 1536) ---
  const rightCx = 1280;
  ctx.fillStyle = '#111111';
  ctx.font = '600 24px Inter, sans-serif';
  ctx.fillText('AYX ENERGY DRINK', rightCx, 300);
  
  ctx.font = '500 20px Inter, sans-serif';
  ctx.fillStyle = '#6B7280';
  ctx.fillText('FOCUS', rightCx, 400);
  ctx.fillText('SHARP MIND', rightCx, 430);
  ctx.fillText('DRIVE', rightCx, 480);
  ctx.fillText('STAY ACTIVE', rightCx, 510);
  ctx.fillText('MOMENTUM', rightCx, 560);
  ctx.fillText('KEEP MOVING', rightCx, 590);

  // Barcode
  ctx.fillStyle = '#000000';
  let barX = rightCx - 80;
  for(let i = 0; i < 50; i++) {
    const w = Math.random() * 3 + 1;
    ctx.fillRect(barX, 700, w, 80);
    barX += w + 2;
  }
  ctx.fillStyle = '#111111';
  ctx.font = '400 14px Inter, sans-serif';
  ctx.fillText('8 901234 567890', rightCx, 810);

  // --- BACK (1536 - 2048) ---
  const backCx = 1792;
  ctx.fillStyle = '#111111';
  ctx.font = '700 32px Inter, sans-serif';
  ctx.textAlign = 'center';
  ctx.fillText('Nutrition Facts', backCx, 250);

  // Nutrition Table Lines
  ctx.strokeStyle = '#111111';
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(backCx - 180, 270);
  ctx.lineTo(backCx + 180, 270);
  ctx.moveTo(backCx - 180, 310);
  ctx.lineTo(backCx + 180, 310);
  ctx.stroke();

  ctx.textAlign = 'left';
  ctx.font = '400 18px Inter, sans-serif';
  const nutrition = [
    'Serving Size 1 can (330ml)',
    'Calories 120',
    'Total Fat 0g',
    'Sodium 60mg',
    'Total Carbohydrate 30g',
    'Sugars 30g',
    'Protein 0g',
    'Vitamin B6 2mg',
    'Vitamin B12 3mcg'
  ];
  nutrition.forEach((line, i) => {
    ctx.fillText(line, backCx - 180, 300 + i * 28);
  });

  // Ingredients
  ctx.font = '600 24px Inter, sans-serif';
  ctx.fillText('INGREDIENTS:', backCx - 180, 620);
  ctx.font = '400 16px Inter, sans-serif';
  const ingredients = [
    'Carbonated Water, Sugar, Citric Acid,',
    'Natural Flavors, Sodium Citrate,',
    'Caffeine, Taurine, Inositol,',
    'Niacinamide, Pyridoxine HCl,',
    'Cyanocobalamin.'
  ];
  ingredients.forEach((line, i) => ctx.fillText(line, backCx - 180, 650 + i * 22));

  // Recycling Symbol
  ctx.strokeStyle = '#111111';
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(backCx + 120, 750);
  ctx.lineTo(backCx + 140, 730);
  ctx.lineTo(backCx + 160, 750);
  ctx.stroke();
  ctx.font = '400 12px Inter, sans-serif';
  ctx.textAlign = 'center';
  ctx.fillText('ALU', backCx + 140, 770);

  // --- LEFT SIDE (0 - 512) ---
  ctx.textAlign = 'center';
  const leftCx = 256;
  ctx.fillStyle = '#111111';
  ctx.font = '600 24px Inter, sans-serif';
  ctx.fillText('AYX / ORIGINAL', leftCx, 400);
  ctx.fillStyle = accent;
  ctx.fillRect(leftCx - 40, 430, 80, 2);
  ctx.fillStyle = '#6B7280';
  ctx.font = '400 16px Inter, sans-serif';
  ctx.fillText('BATCH: AYX-2026-01', leftCx, 480);
  ctx.fillText('MFG: 08/2026', leftCx, 510);
  ctx.fillText('EXP: 08/2028', leftCx, 540);

  const texture = new THREE.CanvasTexture(canvas);
  texture.anisotropy = 16;
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
      const tex = drawLabel(variant, accent);
      cachedMaps[variant] = tex;
      setMap(tex);
    };

    build();

    return () => { mounted = false; };
  }, [variant, accent]);

  return map;
}
