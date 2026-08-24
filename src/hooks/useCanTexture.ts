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

  // Repeat branding 4 times around the can (360 degrees)
  const panelWidth = 512;
  for (let i = 0; i < 4; i++) {
    const cx = i * panelWidth + panelWidth / 2;
    const cy = 460;

    ctx.textAlign = 'center';

    // AYX Logo
    ctx.fillStyle = '#111111';
    ctx.font = '900 180px sans-serif';
    ctx.fillText('AYX', cx, cy);

    // Subtitle
    ctx.fillStyle = '#111111';
    ctx.font = '600 32px sans-serif';
    ctx.fillText('ENERGY DRINK', cx, cy + 50);

    // Accent Line
    ctx.fillStyle = accent;
    ctx.fillRect(cx - 50, cy + 75, 100, 4);

    // Variant
    ctx.fillStyle = accent;
    ctx.font = '700 30px sans-serif';
    ctx.fillText(variant, cx, cy + 120);

    // Volume
    ctx.fillStyle = '#6B7280';
    ctx.font = '500 22px sans-serif';
    ctx.fillText('330 ML', cx, cy + 160);
  }

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

    // Immediate build to prevent blank textures
    build();

    return () => { mounted = false; };
  }, [variant, accent]);

  return map;
}
