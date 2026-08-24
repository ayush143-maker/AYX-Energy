import { useEffect, useState } from 'react';
import * as THREE from 'three';

const cachedMaps: Record<string, { map: THREE.CanvasTexture; droplets: THREE.CanvasTexture; normal: THREE.CanvasTexture }> = {};

function drawLabel(variant: string, accent: string): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = 2048;
  canvas.height = 1024;
  const ctx = canvas.getContext('2d')!;

  // Base satin aluminum color
  ctx.fillStyle = '#F9FAFB';
  ctx.fillRect(0, 0, 2048, 1024);

  // Subtle metallic vertical streaks
  for (let i = 0; i < 150; i++) {
    const x = Math.random() * 2048;
    const w = Math.random() * 3 + 0.5;
    ctx.fillStyle = `rgba(200,210,220,${Math.random() * 0.06})`;
    ctx.fillRect(x, 0, w, 1024);
  }

  // --- LAYOUT MAPPING ---
  // 0-512px: Left Side | 512-1024px: Front | 1024-1536px: Right Side | 1536-2048px: Back

  // Front (512 - 1024)
  const frontCx = 768;
  ctx.textAlign = 'center';

  // AYX Logo
  ctx.fillStyle = '#111111';
  ctx.font = '900 260px Inter, sans-serif';
  ctx.fillText('AYX', frontCx, 400);

  // Subtitle
  ctx.font = '600 42px Inter, sans-serif';
  ctx.fillText('ENERGY DRINK', frontCx, 460);

  // Accent Line
  ctx.fillStyle = accent;
  ctx.fillRect(frontCx - 60, 490, 120, 4);

  // Variant
  ctx.fillStyle = accent;
  ctx.font = '700 38px Inter, sans-serif';
  ctx.fillText(variant, frontCx, 540);

  // Features (Simulated icons + text)
  ctx.fillStyle = '#111111';
  ctx.font = '600 24px Inter, sans-serif';
  const features = ['180 MG CAFFEINE', 'TAURINE', 'B VITAMINS'];
  features.forEach((f, i) => {
    const y = 620 + i * 40;
    // Simple geometric icon
    ctx.strokeStyle = '#111111';
    ctx.lineWidth = 2;
    ctx.strokeRect(frontCx - 120, y - 20, 16, 16);
    ctx.fillText(f, frontCx - 90, y - 5);
  });

  // Tagline
  ctx.font = '500 20px Inter, sans-serif';
  ctx.fillStyle = '#6B7280';
  ctx.fillText('FOCUS / DRIVE / MOMENTUM', frontCx, 770);

  // Bottom Info
  ctx.font = '600 28px Inter, sans-serif';
  ctx.fillStyle = '#111111';
  ctx.fillText('330 ML', frontCx, 850);
  ctx.font = '400 16px Inter, sans-serif';
  ctx.fillStyle = '#6B7280';
  ctx.fillText('CAFFEINATED ENERGY DRINK', frontCx, 880);
  ctx.fillText('AYX-01', frontCx, 910);

  // Right Side (1024 - 1536)
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

  // Barcode (Right Side bottom)
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

  // Back (1536 - 2048)
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
    'Servings Per Container 1',
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

  // Recycling Symbol (Back)
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

  // Left Side (0 - 512)
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

// Generates the water droplet normal and roughness maps
function drawDroplets(): { droplets: THREE.CanvasTexture; normal: THREE.CanvasTexture } {
  const size = 1024;
  const canvas = document.createElement('canvas');
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext('2d')!;

  // Roughness map: White = rough (0), Black = smooth (1). 
  // Base is gray (semi-rough), droplets are black (glossy/wet)
  ctx.fillStyle = '#666666'; 
  ctx.fillRect(0, 0, size, size);

  // Draw droplets
  for (let i = 0; i < 600; i++) {
    const x = Math.random() * size;
    const y = Math.random() * size;
    const r = Math.random() * 8 + 1;
    
    // Gradient for smooth droplet edge
    const grad = ctx.createRadialGradient(x, y, 0, x, y, r);
    grad.addColorStop(0, '#000000');
    grad.addColorStop(0.7, '#000000');
    grad.addColorStop(1, '#666666');
    ctx.fillStyle = grad;
    ctx.beginPath();
    ctx.arc(x, y, r, 0, Math.PI * 2);
    ctx.fill();
  }

  const dropletTex = new THREE.CanvasTexture(canvas);
  dropletTex.wrapS = THREE.RepeatWrapping;
  dropletTex.wrapT = THREE.RepeatWrapping;
  dropletTex.repeat.set(2, 2);

  // For simplicity in R3F, we reuse the droplet texture as a bump/normal map
  // by using it in the normalMap slot, which gives physical bumps.
  return { droplets: dropletTex, normal: dropletTex };
}

export function useCanTexture(variant: string, accent: string) {
  const [textures, setTextures] = useState(cachedMaps[variant] || null);

  useEffect(() => {
    if (cachedMaps[variant]) {
      setTextures(cachedMaps[variant]);
      return;
    }

    let mounted = true;
    const build = () => {
      if (!mounted) return;
      const map = drawLabel(variant, accent);
      const droplets = drawDroplets();
      cachedMaps[variant] = { map, droplets: droplets.droplets, normal: droplets.normal };
      setTextures(cachedMaps[variant]);
    };

    // Immediate build
    build();

    // Rebuild when fonts are ready
    if (typeof document !== 'undefined' && document.fonts && document.fonts.ready) {
      document.fonts.ready.then(build).catch(build);
    }
    
    return () => { mounted = false; };
  }, [variant, accent]);

  return textures;
}
