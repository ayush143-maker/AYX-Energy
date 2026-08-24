import { useEffect, useState } from 'react';
import * as THREE from 'three';

let cachedMap: THREE.CanvasTexture | null = null;

function createCanTexture(): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = 2048;
  canvas.height = 1024;
  const ctx = canvas.getContext('2d')!;

  // Base color matches the can material
  ctx.fillStyle = '#F7F7F5';
  ctx.fillRect(0, 0, 2048, 1024);

  // Draw the logo layout in the center of the texture (which maps to the front face)
  const centerX = 1024;
  const centerY = 500;

  ctx.textAlign = 'center';

  // AYX Logo
  ctx.fillStyle = '#111111';
  ctx.font = '900 220px Inter, sans-serif';
  ctx.fillText('AYX', centerX, centerY);

  // Subtitle
  ctx.fillStyle = '#111111';
  ctx.font = '600 40px Inter, sans-serif';
  ctx.fillText('ENERGY DRINK', centerX, centerY + 60);

  // Accent Line
  ctx.fillStyle = '#0047FF';
  ctx.fillRect(centerX - 60, centerY + 90, 120, 3);

  // Variant
  ctx.fillStyle = '#0047FF';
  ctx.font = '700 36px Inter, sans-serif';
  ctx.fillText('ORIGINAL', centerX, centerY + 140);

  // Volume (Small, bottom of center)
  ctx.fillStyle = '#6B7280';
  ctx.font = '500 24px Inter, sans-serif';
  ctx.fillText('330 ML', centerX, centerY + 190);

  const texture = new THREE.CanvasTexture(canvas);
  texture.anisotropy = 8;
  texture.colorSpace = THREE.SRGBColorSpace;
  texture.needsUpdate = true;
  return texture;
}

export function useCanTexture() {
  const [textures, setTextures] = useState<{ map: THREE.CanvasTexture | null }>({ map: cachedMap });

  useEffect(() => {
    if (cachedMap) return;
    
    let mounted = true;
    const build = () => {
      if (!mounted) return;
      cachedMap = createCanTexture();
      setTextures({ map: cachedMap });
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
