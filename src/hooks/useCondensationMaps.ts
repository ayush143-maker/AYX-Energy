import { useEffect, useMemo } from 'react';
import * as THREE from 'three';

const SIZE = 1024;
const MAX_DROPLETS = 900;
const PER_TICK = 14;
const TICK_MS = 180;

/**
 * Generates a bump map (height) + roughness map that "builds up" over time,
 * exactly like a cold can sweating in a warm room. Incremental drawing keeps
 * each tick nearly free (only new droplets are painted).
 */
export function useCondensationMaps(active: boolean) {
  const maps = useMemo(() => {
    const bumpCanvas = document.createElement('canvas');
    const roughCanvas = document.createElement('canvas');
    bumpCanvas.width = bumpCanvas.height = SIZE;
    roughCanvas.width = roughCanvas.height = SIZE;

    const bctx = bumpCanvas.getContext('2d')!;
    const rctx = roughCanvas.getContext('2d')!;

    // neutral height (0.5 gray) / base printed-aluminum roughness (~0.35)
    bctx.fillStyle = '#808080';
    bctx.fillRect(0, 0, SIZE, SIZE);
    rctx.fillStyle = '#595959';
    rctx.fillRect(0, 0, SIZE, SIZE);

    const bumpTex = new THREE.CanvasTexture(bumpCanvas);
    const roughTex = new THREE.CanvasTexture(roughCanvas);

    return { bumpCanvas, roughCanvas, bctx, rctx, bumpTex, roughTex, count: 0 };
  }, []);

  useEffect(() => {
    if (!active) return;

    const paintOne = () => {
      const { bctx, rctx } = maps;
      const x = Math.random() * SIZE;
      const y = Math.random() * SIZE;
      const big = Math.random() < 0.12;
      const r = big ? 5 + Math.random() * 7 : 1.2 + Math.random() * 3.2;

      /* bump: raised dome + meniscus rim dip */
      let g = bctx.createRadialGradient(x - r * 0.2, y - r * 0.25, r * 0.1, x, y, r);
      g.addColorStop(0, 'rgba(255,255,255,0.85)');
      g.addColorStop(0.7, 'rgba(210,210,210,0.45)');
      g.addColorStop(1, 'rgba(128,128,128,0)');
      bctx.fillStyle = g;
      bctx.beginPath(); bctx.arc(x, y, r, 0, Math.PI * 2); bctx.fill();
      bctx.strokeStyle = 'rgba(60,60,60,0.25)';
      bctx.lineWidth = Math.max(0.6, r * 0.12);
      bctx.beginPath(); bctx.arc(x, y, r * 0.95, 0, Math.PI * 2); bctx.stroke();

      /* roughness: water is glossy -> dark spot */
      g = rctx.createRadialGradient(x, y, 0, x, y, r);
      g.addColorStop(0, 'rgba(18,18,18,0.9)');
      g.addColorStop(0.8, 'rgba(30,30,30,0.5)');
      g.addColorStop(1, 'rgba(89,89,89,0)');
      rctx.fillStyle = g;
      rctx.beginPath(); rctx.arc(x, y, r, 0, Math.PI * 2); rctx.fill();
    };

    const id = window.setInterval(() => {
      if (maps.count >= MAX_DROPLETS) {
        window.clearInterval(id);
        return;
      }
      for (let i = 0; i < PER_TICK; i++) paintOne();
      maps.count += PER_TICK;
      maps.bumpTex.needsUpdate = true;
      maps.roughTex.needsUpdate = true;
    }, TICK_MS);

    return () => window.clearInterval(id);
  }, [active, maps]);

  return { bumpMap: maps.bumpTex, roughMap: maps.roughTex };
}
