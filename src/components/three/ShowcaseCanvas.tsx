import { Canvas } from '@react-three/fiber';
import { Suspense, useEffect, useRef, useState } from 'react';
import Scene from './Scene';
import CanFallback from './CanFallback';
import { MotionValue } from 'framer-motion';
import { useQuality } from '../../hooks/useQuality';
import ErrorBoundary from '../ErrorBoundary';

interface Props {
  scrollRotation: MotionValue<number>;
}

export default function ShowcaseCanvas({ scrollRotation }: Props) {
  const [inView, setInView] = useState(false);
  const [webglOk, setWebglOk] = useState(true);
  const ref = useRef<HTMLDivElement>(null);
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

  useEffect(() => {
    if (!ref.current) return;
    const obs = new IntersectionObserver(
      ([e]) => setInView(e.isIntersecting),
      { threshold: 0.05, rootMargin: '100px' }
    );
    obs.observe(ref.current);
    return () => obs.disconnect();
  }, []);

  return (
    <div ref={ref} className="absolute inset-0">
      {!webglOk ? (
        <CanFallback />
      ) : inView ? (
        <ErrorBoundary fallback={<CanFallback />}>
          <Canvas
            camera={{ position: [0, 0, 6.5], fov: 32 }}
            dpr={quality === 'low' ? [1, 1.25] : [1, 1.75]}
            gl={{
              antialias: quality !== 'low',
              alpha: true,
              powerPreference: 'high-performance',
              stencil: false,
              depth: true,
            }}
            className="!absolute inset-0"
          >
            <Suspense fallback={null}>
              <Scene quality={quality} scrollRotation={scrollRotation} autoRotate={false} />
            </Suspense>
          </Canvas>
        </ErrorBoundary>
      ) : null}
    </div>
  );
}
