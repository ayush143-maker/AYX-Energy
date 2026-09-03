import { useEffect, useState } from 'react';
import * as THREE from 'three';

const cachedMaps: Record<string, THREE.CanvasTexture> = {};
const TAU = Math.PI * 2;

/* ---------------- typography: manual letter-tracking ---------------- */
function tracked(ctx: CanvasRenderingContext2D, text: string, cx: number, y: number, spacing: number) {
  const chars = [...text];
  const widths = chars.map((ch) => ctx.measureText(ch).width);
  const total = widths.reduce((a, b) => a + b, 0) + spacing * (chars.length - 1);
  let x = cx - total / 2;
  const prev = ctx.textAlign;
  ctx.textAlign = 'left';
  chars.forEach((ch, i) => {
    ctx.fillText(ch, x, y);
    x += widths[i] + spacing;
  });
  ctx.textAlign = prev;
}

function gauss() {
  let u = 0, v = 0;
  while (!u) u = Math.random();
  while (!v) v = Math.random();
  return Math.sqrt(-2 * Math.log(u)) * Math.cos(TAU * v);
}

/* ---------------- photographic droplet v2 ----------------
   contact shadow -> refractive rim -> clear body -> dark
   lens core -> bottom caustic -> primary + secondary spec  */
function dropletV2(
  ctx: CanvasRenderingContext2D,
  x: number, y: number, r: number,
  stretch = 1, rot = 0
) {
  ctx.save();
  ctx.translate(x, y);
  ctx.rotate(rot);
  ctx.scale(1, stretch);

  // contact shadow pooled beneath the bead
  let g = ctx.createRadialGradient(0, r * 0.55, 0, 0, r * 0.55, r * 1.2);
  g.addColorStop(0, 'rgba(28,36,48,0.20)');
  g.addColorStop(1, 'rgba(28,36,48,0)');
  ctx.fillStyle = g;
  ctx.beginPath(); ctx.arc(0, r * 0.55, r * 1.2, 0, TAU); ctx.fill();

  // body + refractive rim
  g = ctx.createRadialGradient(-r * 0.25, -r * 0.3, r * 0.1, 0, 0, r);
  g.addColorStop(0, 'rgba(255,255,255,0.34)');
  g.addColorStop(0.45, 'rgba(255,255,255,0.07)');
  g.addColorStop(0.75, 'rgba(88,98,112,0.10)');
  g.addColorStop(0.92, 'rgba(40,48,62,0.26)');
  g.addColorStop(1, 'rgba(40,48,62,0.34)');
  ctx.fillStyle = g;
  ctx.beginPath(); ctx.arc(0, 0, r, 0, TAU); ctx.fill();

  // dark lens core (light bending away at top)
  g = ctx.createRadialGradient(0, -r * 0.15, 0, 0, -r * 0.15, r * 0.55);
  g.addColorStop(0, 'rgba(70,80,95,0.10)');
  g.addColorStop(1, 'rgba(70,80,95,0)');
  ctx.fillStyle = g;
  ctx.beginPath(); ctx.arc(0, -r * 0.15, r * 0.55, 0, TAU); ctx.fill();

  // caustic – light focused at bottom
  g = ctx.createRadialGradient(r * 0.06, r * 0.48, 0, r * 0.06, r * 0.48, r * 0.5);
  g.addColorStop(0, 'rgba(255,255,255,0.55)');
  g.addColorStop(1, 'rgba(255,255,255,0)');
  ctx.fillStyle = g;
  ctx.beginPath(); ctx.arc(r * 0.06, r * 0.48, r * 0.5, 0, TAU); ctx.fill();

  // primary sharp specular
  g = ctx.createRadialGradient(-r * 0.38, -r * 0.42, 0, -r * 0.38, -r * 0.42, r * 0.24);
  g.addColorStop(0, 'rgba(255,255,255,0.95)');
  g.addColorStop(1, 'rgba(255,255,255,0)');
  ctx.fillStyle = g;
  ctx.beginPath(); ctx.arc(-r * 0.38, -r * 0.42, r * 0.24, 0, TAU); ctx.fill();

  // secondary broad sheen
  g = ctx.createRadialGradient(-r * 0.1, -r * 0.2, 0, -r * 0.1, -r * 0.2, r * 0.6);
  g.addColorStop(0, 'rgba(255,255,255,0.18)');
  g.addColorStop(1, 'rgba(255,255,255,0)');
  ctx.fillStyle = g;
  ctx.beginPath(); ctx.arc(-r * 0.1, -r * 0.2, r * 0.6, 0, TAU); ctx.fill();

  ctx.restore();
}

function microBead(ctx: CanvasRenderingContext2D, x: number, y: number, r: number) {
  ctx.fillStyle = 'rgba(40,48,60,0.16)';
  ctx.beginPath(); ctx.arc(x, y, r, 0, TAU); ctx.fill();
  ctx.fillStyle = 'rgba(255,255,255,0.4)';
  ctx.beginPath(); ctx.arc(x - r * 0.3, y - r * 0.3, r * 0.55, 0, TAU); ctx.fill();
}

function runnel(ctx: CanvasRenderingContext2D, x: number, yTop: number, len: number, w: number) {
  const g = ctx.createLinearGradient(x, yTop, x, yTop + len);
  g.addColorStop(0, 'rgba(235,240,247,0)');
  g.addColorStop(0.12, 'rgba(235,240,247,0.16)');
  g.addColorStop(0.85, 'rgba(235,240,247,0.16)');
  g.addColorStop(1, 'rgba(235,240,247,0)');
  ctx.fillStyle = g;
  ctx.fillRect(x - w / 2, yTop, w, len);
  ctx.fillStyle = 'rgba(40,48,60,0.07)';
  ctx.fillRect(x - w / 2, yTop, 1, len);
  ctx.fillRect(x + w / 2 - 1, yTop, 1, len);
}

/* -------- clustered condensation field (real physics: beads cluster) -------- */
function paintCondensation(ctx: CanvasRenderingContext2D, W: number, H: number) {
  const top = 130, bottom = H - 130;

  // uniform micro film
  for (let i = 0; i < 1600; i++) {
    microBead(ctx, Math.random() * W, top + Math.random() * (bottom - top), 0.7 + Math.random() * 1.6);
  }

  // gaussian clusters of medium beads
  for (let c = 0; c < 26; c++) {
    const cx = Math.random() * W;
    const cy = top + 40 + Math.random() * (bottom - top - 80);
    const sigma = 30 + Math.random() * 80;
    const n = 18 + Math.floor(Math.random() * 40);
    for (let i = 0; i < n; i++) {
      const x = (cx + gauss() * sigma + W) % W;
      const y = Math.min(bottom - 10, Math.max(top + 10, cy + gauss() * sigma * 0.8));
      dropletV2(ctx, x, y, 2 + Math.random() * 4, 1 + Math.random() * 0.2, (Math.random() - 0.5) * 0.4);
    }
  }

  // scattered medium
  for (let i = 0; i < 140; i++) {
    dropletV2(
      ctx, Math.random() * W, top + 10 + Math.random() * (bottom - top - 20),
      2.5 + Math.random() * 3.5, 1 + Math.random() * 0.2, (Math.random() - 0.5) * 0.5
    );
  }

  // large hero beads, gravity stretched
  for (let i = 0; i < 34; i++) {
    dropletV2(
      ctx, Math.random() * W, top + 30 + Math.random() * (bottom - top - 60),
      6 + Math.random() * 8, 1.15 + Math.random() * 0.25, (Math.random() - 0.5) * 0.2
    );
  }

  // runnels with a bead parked at the end
  for (let i = 0; i < 12; i++) {
    const x = Math.random() * W;
    const yTop = top + 30 + Math.random() * (H * 0.4);
    const len = 120 + Math.random() * 280;
    const w = 3 + Math.random() * 4;
    runnel(ctx, x, yTop, len, w);
    dropletV2(ctx, x, yTop + len, w * 1.7, 1.3, 0);
  }
}

/* ---------------- label ---------------- */
function drawLabel(variant: string, accent: string): THREE.CanvasTexture {
  const W = 2048, H = 1024;
  const canvas = document.createElement('canvas');
  canvas.width = W; canvas.height = H;
  const ctx = canvas.getContext('2d')!;

  const INK = '#050505';
  const GRAY = '#6a7078';

  /* brushed aluminum base */
  const base = ctx.createLinearGradient(0, 0, 0, H);
  base.addColorStop(0, '#f8fafc');
  base.addColorStop(0.2, '#e2e6eb');
  base.addColorStop(0.5, '#fdfeff');
  base.addColorStop(0.8, '#d8dce2');
  base.addColorStop(1, '#f2f4f7');
  ctx.fillStyle = base;
  ctx.fillRect(0, 0, W, H);
  ctx.globalAlpha = 0.04;
  for (let x = 0; x < W; x += 4) {
    ctx.fillStyle = x % 8 === 0 ? '#ffffff' : '#8d949e';
    ctx.fillRect(x, 0, 1, H);
  }
  ctx.globalAlpha = 1;

  /* hairline pinlines */
  ctx.fillStyle = INK;
  ctx.fillRect(0, 100, W, 2);
  ctx.fillRect(0, H - 102, W, 2);
  ctx.fillStyle = accent;
  ctx.fillRect(0, 105, W, 1);
  ctx.fillRect(0, H - 97, W, 1);

  /* =============== FRONT =============== */
  const frontCx = 768;
  ctx.fillStyle = GRAY;
  ctx.font = '600 19px Inter, Helvetica, Arial, sans-serif';
  tracked(ctx, 'PRECISION ENERGY', frontCx, 205, 9);

  ctx.fillStyle = INK;
  ctx.font = '900 255px Inter, Helvetica, Arial, sans-serif';
  ctx.textAlign = 'center';
  ctx.fillText('AYX', frontCx, 465);

  ctx.fillStyle = accent;
  ctx.fillRect(frontCx - 120, 505, 240, 3);

  ctx.font = '700 30px Inter, Helvetica, Arial, sans-serif';
  tracked(ctx, variant, frontCx, 565, 14);

  ctx.fillStyle = GRAY;
  ctx.font = '500 17px Inter, Helvetica, Arial, sans-serif';
  tracked(ctx, '180 MG CAFFEINE · TAURINE · B-VITAMINS', frontCx, 690, 2.5);

  ctx.fillStyle = INK;
  ctx.font = '700 26px Inter, Helvetica, Arial, sans-serif';
  ctx.fillText('330 ml ℮', frontCx, 815);
  ctx.fillStyle = GRAY;
  ctx.font = '500 13px Inter, Helvetica, Arial, sans-serif';
  tracked(ctx, 'AYX-01 · CAFFEINATED ENERGY DRINK', frontCx, 848, 2);

  /* =============== RIGHT =============== */
  const rightCx = 1280;
  ctx.save();
  ctx.translate(rightCx, 470);
  ctx.rotate(-Math.PI / 2);
  ctx.fillStyle = INK;
  ctx.font = '900 44px Inter, Helvetica, Arial, sans-serif';
  tracked(ctx, `AYX / ${variant}`, 0, 15, 10);
  ctx.restore();

  ctx.fillStyle = '#ffffff';
  ctx.fillRect(rightCx - 105, 660, 210, 130);
  ctx.fillStyle = INK;
  let barX = rightCx - 88;
  for (let i = 0; i < 42; i++) {
    const w = Math.random() * 4 + 1;
    ctx.fillRect(barX, 674, w, 88);
    barX += w + 3;
  }
  ctx.font = '400 14px Inter, Helvetica, Arial, sans-serif';
  ctx.textAlign = 'center';
  ctx.fillText('8 901234 567890', rightCx, 780);

  /* =============== BACK =============== */
  const backCx = 1792;
  ctx.fillStyle = INK;
  ctx.font = '800 30px Inter, Helvetica, Arial, sans-serif';
  tracked(ctx, 'NUTRITION FACTS', backCx, 235, 4);

  ctx.strokeStyle = INK;
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.moveTo(backCx - 180, 255);
  ctx.lineTo(backCx + 180, 255);
  ctx.stroke();

  const rows: [string, string][] = [
    ['Serving Size', '1 can (330 ml)'],
    ['Calories', '120'],
    ['Total Fat', '0 g'],
    ['Sodium', '60 mg'],
    ['Total Carbohydrate', '30 g'],
    ['Sugars', '30 g'],
    ['Protein', '0 g'],
    ['Vitamin B6', '2 mg'],
    ['Vitamin B12', '3 mcg'],
  ];
  rows.forEach((r, i) => {
    const y = 288 + i * 30;
    ctx.fillStyle = INK;
    ctx.font = '500 17px Inter, Helvetica, Arial, sans-serif';
    ctx.textAlign = 'left';
    ctx.fillText(r[0], backCx - 180, y);
    ctx.font = '700 17px Inter, Helvetica, Arial, sans-serif';
    ctx.textAlign = 'right';
    ctx.fillText(r[1], backCx + 180, y);
    ctx.strokeStyle = 'rgba(5,5,5,0.18)';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(backCx - 180, y + 9);
    ctx.lineTo(backCx + 180, y + 9);
    ctx.stroke();
  });

  ctx.textAlign = 'left';
  ctx.fillStyle = INK;
  ctx.font = '800 20px Inter, Helvetica, Arial, sans-serif';
  tracked(ctx, 'INGREDIENTS', backCx - 118, 610, 3);
  ctx.font = '400 15px Inter, Helvetica, Arial, sans-serif';
  ctx.fillStyle = '#3a3f46';
  [
    'Carbonated Water, Sugar, Citric Acid,',
    'Natural Flavors, Sodium Citrate, Caffeine,',
    'Taurine, Inositol, Niacinamide,',
    'Pyridoxine HCl, Cyanocobalamin.',
  ].forEach((line, i) => ctx.fillText(line, backCx - 180, 640 + i * 22));

  ctx.fillStyle = GRAY;
  ctx.font = '600 15px Inter, Helvetica, Arial, sans-serif';
  tracked(ctx, 'SERVE ICE COLD', backCx, 790, 6);

  /* =============== LEFT =============== */
  const leftCx = 256;
  ctx.save();
  ctx.translate(leftCx, 480);
  ctx.rotate(-Math.PI / 2);
  ctx.fillStyle = GRAY;
  ctx.font = '600 22px Inter, Helvetica, Arial, sans-serif';
  tracked(ctx, 'ENERGY WITHOUT LIMITS', 0, 8, 10);
  ctx.restore();

  ctx.textAlign = 'center';
  ctx.fillStyle = GRAY;
  ctx.font = '400 14px Inter, Helvetica, Arial, sans-serif';
  ctx.fillText('BATCH AYX-2026-01', leftCx, 700);
  ctx.fillText('MFG 08/2026 · EXP 08/2028', leftCx, 726);

  /* condensation ON TOP of the print */
  paintCondensation(ctx, W, H);

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
    const tex = drawLabel(variant, accent);
    cachedMaps[variant] = tex;
    setMap(tex);
    return () => { mounted = false; };
  }, [variant, accent]);
  return map;
}
