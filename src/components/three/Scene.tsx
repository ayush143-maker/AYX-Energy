import { Environment, Lightformer, AdaptiveDpr, Preload, ContactShadows } from '@react-three/drei';
import EnergyCan from './EnergyCan';
import Particles from './Particles';
import { MotionValue } from 'framer-motion';

interface SceneProps {
  quality?: 'low' | 'medium' | 'high';
  scrollRotation?: MotionValue<number>;
  autoRotate?: boolean;
}

export default function Scene({
  quality = 'high',
  scrollRotation,
  autoRotate = true,
}: SceneProps) {
  const isLow = quality === 'low';
  const isMed = quality === 'medium';

  return (
    <>
      <AdaptiveDpr pixelated={false} />

      {/* Lights */}
      <ambientLight intensity={0.32} />
      <directionalLight position={[5, 8, 5]} intensity={1.6} color="#ffffff" />
      <spotLight
        position={[0, 6, 4]}
        intensity={isLow ? 12 : 22}
        angle={0.45}
        penumbra={1}
        color="#ffffff"
        distance={20}
      />
      <pointLight
        position={[-4, 1, -3]}
        intensity={isLow ? 6 : isMed ? 10 : 16}
        color="#00e6ff"
        distance={18}
      />
      <pointLight
        position={[4, -1, 3]}
        intensity={isLow ? 5 : isMed ? 8 : 12}
        color="#7c5cff"
        distance={18}
      />

      {/* Environment for reflections */}
      <Environment resolution={isLow ? 64 : isMed ? 128 : 256}>
        <Lightformer
          position={[0, 5, 4]}
          scale={[10, 4, 1]}
          intensity={2.2}
          color="#ffffff"
        />
        <Lightformer
          position={[-5, 1, 2]}
          scale={[3, 6, 1]}
          intensity={3}
          color="#00e6ff"
        />
        <Lightformer
          position={[5, 1, 2]}
          scale={[3, 6, 1]}
          intensity={2.6}
          color="#7c5cff"
        />
        <Lightformer
          position={[0, -3, 0]}
          scale={[10, 4, 1]}
          intensity={0.6}
          color="#9fb4cc"
        />
      </Environment>

      {/* The can */}
      <EnergyCan
        followCursor={!isLow && !scrollRotation}
        autoRotateSpeed={0.32}
        rotationY={scrollRotation}
        autoRotate={autoRotate}
        quality={quality}
      />

      {/* Particles */}
      <Particles count={isLow ? 0 : isMed ? 50 : 120} radius={5.5} />

      {/* Contact shadow */}
      <ContactShadows
        position={[0, -1.65, 0]}
        opacity={0.55}
        scale={7}
        blur={2.6}
        far={3.5}
        resolution={isLow ? 128 : 256}
        color="#000000"
      />

      <Preload all />
    </>
  );
}
