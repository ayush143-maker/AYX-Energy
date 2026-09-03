import { useEffect, useState } from 'react';
import * as THREE from 'three';

const cachedMaps: Record<string, THREE.CanvasTexture> = {};

function drawBolt(ctx: CanvasRenderingContext2D, cx: number, cy: number, s: number, color: string) {
  ctx.fillStyle = color;
  ctx.beginPath();
  ctx.moveTo(cx + 0.15 * s, cy - 0.5 * s);
  ctx.lineTo(cx - 0.25 * s, cy + 0.08 * s);
  ctx.lineTo(cx - 0.02 * s, cy + 0.08 * s);
  ctx.lineTo(cx - 0.15 * s, cy + 0.5 * s);
  ctx.lineTo(cx + 0.25 * s, cy - 0.08 * s);
  ctx.lineTo(cx + 0.02 * s, cy - 0.08 * s);
  ctx.closePath();
  ctx.fill();
}

function drawLabel(variant: string, accent: string): THREE.CanvasTexture {
  const W = 2048;
  const H = 1024;
  const canvas = document.createElement('canvas');
  canvas.width = W;
  canvas.height = H;
  const ctx = canvas.getContext('2d')!;

  /* ---- Metallic silver base with vertical brush finish ---- */
  const base = ctx.createLinearGradient(0, 0, 0, H);
  base.addColorStop(0, '#fbfcfe');
  base.addColorStop(0.25, '#edf0f4');
  base.addColorStop(0.5, '#ffffff');
  base.addColorStop(0.75, '#e6e9ee');
  base.addColorStop(1, '#f4f6f8');
  ctx.fillStyle = base;
  ctx.fillRect(0, 0, W, H);

  ctx.globalAlpha = 0.05;
  for (let x = 0; x < W; x += 4) {
    ctx.fillStyle = x % 8 === 0 ? '#ffffff' : '#9aa0a8';
    ctx.fillRect(x, 0, 1, H);
  }
  ctx.globalAlpha = 1;

  /* ---- Top / bottom print rules ---- */
  ctx.fillStyle = '#0a0a0a';
  ctx.fillRect(0, 96, W, 6);
  ctx.fillRect(0, H - 148, W, 6);
  ctx.fillStyle = accent;
  ctx.fillRect(0, 104, W, 3);
  ctx.fillRect(0, H - 141, W, 3);

  /* ---- Bottom accent band ---- */
  ctx.fillStyle = accent;
  ctx.fillRect(0, H - 132, W, 44);
  ctx.fillStyle = '#ffffff';
  ctx.font = '700 22px Inter, Arial, sans-serif';
  ctx.textAlign = 'center';
  for (let x = 256; x < W; x += 512) {
    ctx.fillText('FOCUS / DRIVE / MOMENTUM', x, H - 103);
  }

  /* =============== FRONT (512 - 1024) =============== */
  const frontCx = 768;
  ctx.textAlign = 'center';

  drawBolt(ctx, frontCx, 205, 90, accent);

  ctx.fillStyle = '#0a0a0a';
  ctx.font = '900 240px Inter, Arial, sans-serif';
  ctx.fillText('AYX', frontCx, 430);

  // Accent swoosh under logo
  ctx.fillStyle = accent;
  ctx.beginPath();
  ctx.moveTo(frontCx - 175, 462);
  ctx.lineTo(frontCx + 175, 462);
  ctx.lineTo(frontCx + 150, 482);
  ctx.lineTo(frontCx - 175, 482);
  ctx.closePath();
  ctx.fill();

  // ENERGY DRINK block
  ctx.fillStyle = '#0a0a0a';
  ctx.fillRect(frontCx - 155, 505, 310, 54);
  ctx.fillStyle = '#ffffff';
  ctx.font = '800 30px Inter, Arial, sans-serif';
  ctx.fillText('ENERGY DRINK', frontCx, 542);

  // Variant
  ctx.fillStyle = accent;
  ctx.font = '900 46px Inter, Arial, sans-serif';
  ctx.fillText(variant, frontCx, 625);

  // Features
  ctx.fillStyle = '#111111';
  ctx.font = '700 24px Inter, Arial, sans-serif';
  ['180 MG CAFFEINE', 'TAURINE', 'B VITAMINS'].forEach((f, i) => {
    ctx.fillText(f, frontCx, 680 + i * 36);
  });

  // Bottom info
  ctx.font = '800 30px Inter, Arial, sans-serif';
  ctx.fillStyle = '#0a0a0a';
  ctx.fillText('330 ML e', frontCx, 815);
  ctx.font = '500 16px Inter, Arial, sans-serif';
  ctx.fillStyle = '#565b64';
  ctx.fillText('CAFFEINATED ENERGY DRINK', frontCx, 845);
  ctx.fillText('AYX-01', frontCx, 867);

  /* =============== RIGHT SIDE (1024 - 1536) =============== */
  const rightCx = 1280;
  ctx.fillStyle = '#0a0a0a';
  ctx.font = '800 26px Inter, Arial, sans-serif';
  ctx.fillText('AYX ENERGY DRINK', rightCx, 300);
  drawBolt(ctx, rightCx, 350, 44, accent);

  ctx.font = '600 20px Inter, Arial, sans-serif';
  ctx.fillStyle = '#565b64';
  ctx.fillText('FOCUS — SHARP MIND', rightCx, 430);
  ctx.fillText('DRIVE — STAY ACTIVE', rightCx, 465);
  ctx.fillText('MOMENTUM — KEEP MOVING', rightCx, 500);

  // Barcode on white box
  ctx.fillStyle = '#ffffff';
  ctx.fillRect(rightCx - 110, 640, 220, 140);
  ctx.fillStyle = '#000000';
  let barX = rightCx - 90;
  for (let i = 0; i < 45; i++) {
    const w = Math.random() * 4 + 1;
    ctx.fillRect(barX, 655, w, 90);
    barX += w + 3;
  }
  ctx.fillStyle = '#111111';
  ctx.font = '400 16px Inter, Arial, sans-serif';
  ctx.fillText('8 901234 567890', rightCx, 768);

  /* =============== BACK (1536 - 2048) =============== */
  const backCx = 1792;
  ctx.fillStyle = '#0a0a0a';
  ctx.font = '800 40px Inter, Arial, sans-serif';
  ctx.fillText('Nutrition Facts', backCx, 240);

  ctx.strokeStyle = '#0a0a0a';
  ctx.lineWidth = 4;
  ctx.beginPath();
  ctx.moveTo(backCx - 180, 260);
  ctx.lineTo(backCx + 180, 260);
  ctx.stroke();

  const rows: [string, string][] = [
    ['Serving Size', '1 can (330ml)'],
    ['Calories', '120'],
    ['Total Fat', '0g'],
    ['Sodium', '60mg'],
    ['Total Carbohydrate', '30g'],
    ['Sugars', '30g'],
    ['Protein', '0g'],
    ['Vitamin B6', '2mg'],
    ['Vitamin B12', '3mcg'],
  ];
  ctx.font = '500 18px Inter, Arial, sans-serif';
  rows.forEach((r, i) => {
    const y = 292 + i * 30;
    ctx.fillStyle = '#111111';
    ctx.textAlign = 'left';
    ctx.fillText(r[0], backCx - 180, y);
    ctx.textAlign = 'right';
    ctx.font = '700 18px Inter, Arial, sans-serif';
    ctx.fillText(r[1], backCx + 180, y);
    ctx.font = '500 18px Inter, Arial, sans-serif';
    ctx.strokeStyle = '#c6cad1';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(backCx - 180, y + 8);
    ctx.lineTo(backCx + 180, y + 8);
    ctx.stroke();
  });

  ctx.textAlign = 'left';
  ctx.fillStyle = '#0a0a0a';
  ctx.font = '800 24px Inter, Arial, sans-serif';
  ctx.fillText('INGREDIENTS:', backCx - 180, 620);
  ctx.font = '400 16px Inter, Arial, sans-serif';
  ctx.fillStyle = '#33383f';
  [
    'Carbonated Water, Sugar, Citric Acid,',
    'Natural Flavors, Sodium Citrate,',
    'Caffeine, Taurine, Inositol,',
    'Niacinamide, Pyridoxine HCl,',
    'Cyanocobalamin.',
  ].forEach((line, i) => ctx.fillText(line, backCx - 180, 650 + i * 22));

  // Recycle mark
  ctx.strokeStyle = '#0a0a0a';
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(backCx + 120, 780);
  ctx.lineTo(backCx + 140, 760);
  ctx.lineTo(backCx + 160, 780);
  ctx.stroke();
  ctx.font = '400 12px Inter, Arial, sans-serif';
  ctx.textAlign = 'center';
  ctx.fillStyle = '#0a0a0a';
  ctx.fillText('ALU', backCx + 140, 800);

  /* =============== LEFT SIDE (0 - 512) =============== */
  const leftCx = 256;
  ctx.save();
  ctx.translate(leftCx, 470);
  ctx.rotate(-Math.PI / 2);
  ctx.textAlign = 'center';
  ctx.fillStyle = '#0a0a0a';
  ctx.font = '900 110px Inter, Arial, sans-serif';
  ctx.fillText('AYX', -90, 40);
  ctx.fillStyle = accent;
  ctx.font = '900 70px Inter, Arial, sans-serif';
  ctx.fillText(variant, 170, 40);
  ctx.restore();

  ctx.textAlign = 'center';
  ctx.fillStyle = '#565b64';
  ctx.font = '400 16px Inter, Arial, sans-serif';
  ctx.fillText('BATCH: AYX-2026-01', leftCx, 700);
  ctx.fillText('MFG: 08/2026   EXP: 08/2028', leftCx, 728);

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
    return () => {
      mounted = false;
    };
  }, [variant, accent]);
  return map;
}
