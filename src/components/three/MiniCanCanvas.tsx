import { Canvas } from '@react-three/fiber';
import { Suspense, useEffect, useState } from 'react';
import EnergyCan from './EnergyCan';
import CanFallback from './CanFallback';
import { useQuality } from '../../hooks/useQuality';
import ErrorBoundary from '../ErrorBoundary';
import { Environment, ContactShadows } from '@react-three/drei';

interface Props {
  variant: string;
  accent: string;
}

export default function MiniCanCanvas({ variant, accent }: Props) {
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

  if (!webglOk) {
    return (
      <div className="w-full h-full flex items-center justify-center">
        <CanFallback />
      </div>
    );
  }

  return (
    <ErrorBoundary fallback={<CanFallback />}>
      <Canvas
        camera={{ position: [0, 0, 4.8], fov: 35 }}
        dpr={quality === 'low' ? [1, 1.25] : [1, 1.75]}
        gl={{ antialias: quality !== 'low', alpha: true }}
        className="!absolute inset-0"
      >
        <Suspense fallback={null}>
          <ambientLight intensity={0.9} />
          <directionalLight position={[3, 5, 5]} intensity={1.2} />
          <directionalLight position={[-4, 2, -4]} intensity={0.7} />
          <Environment preset="studio" />
          {/* Smaller, nicely framed can */}
          <group rotation={[0, Math.PI / 7, 0]} scale={0.62}>
            <EnergyCan variant={variant} accent={accent} isInteractive={false} quality={quality} />
          </group>
          <ContactShadows position={[0, -0.98, 0]} opacity={0.3} scale={3} blur={2.5} far={1.6} />
        </Suspense>
      </Canvas>
    </ErrorBoundary>
  );
}
