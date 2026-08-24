import { Canvas } from '@react-three/fiber';
import { Suspense, useEffect, useState } from 'react';
import Scene from './Scene';
import CanFallback from './CanFallback';
import { useQuality } from '../../hooks/useQuality';
import ErrorBoundary from '../ErrorBoundary';

export default function HeroCanvas() {
  const [webglOk, setWebglOk] = useState(true);
  const quality = useQuality();

  useEffect(() => {
    try {
      const c = document.createElement('canvas');
      const gl = c.getContext('webgl2') || c.getContext('webgl');
      if (!gl) setWebglOk(false);
    } catch {
      setWebglOk(false);
    }
  }, []);

  if (!webglOk) return <CanFallback />;

  return (
    <ErrorBoundary fallback={<CanFallback />}>
      <Canvas
        camera={{ position: [0, 0, 5.5], fov: 35 }}
        dpr={quality === 'low' ? [1, 1.5] : [1, 2]}
        gl={{
          antialias: true,
          alpha: true,
          powerPreference: 'high-performance',
          stencil: false,
          depth: true,
        }}
        shadows
        className="!absolute inset-0"
        // Prevents page scroll when dragging the can on mobile
        style={{ touchAction: 'none' }}
      >
        <Suspense fallback={null}>
          <Scene quality={quality} />
        </Suspense>
      </Canvas>
    </ErrorBoundary>
  );
}
