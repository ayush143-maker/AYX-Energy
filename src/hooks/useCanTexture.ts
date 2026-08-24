import { useEffect, useState } from 'react';
import * as THREE from 'three';

let cachedMap: THREE.CanvasTexture | null = null;
let cachedEmissive: THREE.CanvasTexture | null = null;

function createCanTexture(): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = 1024;
  canvas.height = 512;
  const ctx = canvas.getContext('2d')!;

  const baseGrad = ctx.createLinearGradient(0, 0, 0, 512);
  baseGrad.addColorStop(0, '#04060a');
  baseGrad.addColorStop(0.5, '#0c1119');
  baseGrad.addColorStop(1, '#04060a');
  ctx.fillStyle = baseGrad;
  ctx.fillRect(0, 0, 1024, 512);

  // 4 faces wrapping around
  const panelWidth = 256;
  for (let i = 0; i < 4; i++) {
    const cx = i * panelWidth + panelWidth / 2;
    const cy = 256;

    ctx.fillStyle = '#00e6ff';
    ctx.globalAlpha = 0.8;
    ctx.fillRect(cx - 100, 80, 200, 1);
    ctx.fillRect(cx - 100, 432, 200, 1);
    ctx.globalAlpha = 0.3;
    ctx.fillRect(cx - 100, 86, 200, 1);
    ctx.fillRect(cx - 100, 426, 200, 1);
    ctx.globalAlpha = 1;

    ctx.save();
    ctx.shadowColor = '#00e6ff';
    ctx.shadowBlur = 20;
    ctx.fillStyle = '#00e6ff';
    ctx.font = '900 110px Orbitron, sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('AYX', cx, cy - 20);
    ctx.restore();

    ctx.font = '500 18px "Space Grotesk", sans-serif';
    ctx.fillStyle = '#cfd8e3';
    ctx.fillText('ENERGY DRINK', cx, cy + 16);

    ctx.font = '400 12px "JetBrains Mono", monospace';
    ctx.fillStyle = '#7c5cff';
    ctx.fillText('FOCUS // DRIVE // ENERGY', cx, cy + 40);
  }

  const texture = new THREE.CanvasTexture(canvas);
  texture.anisotropy = 4;
  texture.colorSpace = THREE.SRGBColorSpace;
  texture.needsUpdate = true;
  return texture;
}

function createEmissiveTexture(): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = 1024;
  canvas.height = 512;
  const ctx = canvas.getContext('2d')!;

  ctx.fillStyle = '#000000';
  ctx.fillRect(0, 0, 1024, 512);

  const panelWidth = 256;
  for (let i = 0; i < 4; i++) {
    const cx = i * panelWidth + panelWidth / 2;
    const cy = 256;

    ctx.fillStyle = '#00e6ff';
    ctx.globalAlpha = 0.8;
    ctx.fillRect(cx - 100, 80, 200, 1);
    ctx.fillRect(cx - 100, 432, 200, 1);
    ctx.globalAlpha = 1;

    ctx.save();
    ctx.shadowColor = '#00e6ff';
    ctx.shadowBlur = 15;
    ctx.fillStyle = '#00e6ff';
    ctx.font = '900 110px Orbitron, sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('AYX', cx, cy - 20);
    ctx.restore();
  }

  const texture = new THREE.CanvasTexture(canvas);
  texture.anisotropy = 4;
  texture.colorSpace = THREE.SRGBColorSpace;
  texture.needsUpdate = true;
  return texture;
}

export function useCanTexture() {
  const [textures, setTextures] = useState<{ map: THREE.CanvasTexture | null; emissive: THREE.CanvasTexture | null }>({ map: cachedMap, emissive: cachedEmissive });

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
      return () => { mounted = false; clearTimeout(t); };
    }
    return () => { mounted = false; };
  }, []);

  return textures;
}
