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
        camera={{ position: [0, 0, 4], fov: 35 }}
        dpr={quality === 'low' ? [1, 1.25] : [1, 1.75]}
        gl={{ antialias: quality !== 'low', alpha: true }}
        className="!absolute inset-0"
      >
        <Suspense fallback={null}>
          <ambientLight intensity={0.9} />
          <directionalLight position={[3, 5, 5]} intensity={1.2} />
          <Environment preset="studio" />
          
          <group rotation={[0, Math.PI / 8, 0]} scale={0.8}>
            <EnergyCan variant={variant} accent={accent} isInteractive={false} />
          </group>

          <ContactShadows position={[0, -1.2, 0]} opacity={0.3} scale={4} blur={2.5} far={2} />
        </Suspense>
      </Canvas>
    </ErrorBoundary>
  );
}
