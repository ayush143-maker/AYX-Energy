import { Environment, Lightformer, AdaptiveDpr, Preload, ContactShadows } from '@react-three/drei';
import EnergyCan from './EnergyCan';
import Particles from './Particles';
import { MotionValue } from 'framer-motion';

interface SceneProps {
  quality?: 'low' | 'medium' | 'high';
  scrollRotation?: MotionValue<number>;
  autoRotate?: boolean;
}

export default function Scene({ quality = 'high', scrollRotation, autoRotate = true }: SceneProps) {
  const isLow = quality === 'low';
  const isMed = quality === 'medium';

  return (
    <>
      <AdaptiveDpr pixelated={false} />

      {/* Dark, cinematic lighting */}
      <ambientLight intensity={0.1} />
      <directionalLight position={[5, 8, 5]} intensity={0.8} color="#ffffff" />
      <spotLight position={[0, 6, 4]} intensity={15} angle={0.45} penumbra={1} color="#ffffff" distance={20} />
      <pointLight position={[-4, 1, -3]} intensity={12} color="#00e6ff" distance={18} />
      <pointLight position={[4, -1, 3]} intensity={8} color="#7c5cff" distance={18} />

      {/* Dark environment for metal reflections */}
      <Environment resolution={isLow ? 64 : 128}>
        <Lightformer position={[0, 5, 4]} scale={[10, 4, 1]} intensity={1.0} color="#ffffff" />
        <Lightformer position={[-5, 1, 2]} scale={[3, 6, 1]} intensity={2.0} color="#00e6ff" />
        <Lightformer position={[5, 1, 2]} scale={[3, 6, 1]} intensity={1.5} color="#7c5cff" />
        <Lightformer position={[0, -3, 0]} scale={[10, 4, 1]} intensity={0.2} color="#9fb4cc" />
      </Environment>

      <EnergyCan followCursor={!isLow && !scrollRotation} autoRotateSpeed={0.32} rotationY={scrollRotation} autoRotate={autoRotate} quality={quality} />

      <Particles count={isLow ? 0 : isMed ? 40 : 80} radius={5.5} />

      <ContactShadows position={[0, -1.65, 0]} opacity={0.45} scale={7} blur={2.6} far={3.5} resolution={isLow ? 128 : 256} color="#000000" />
      <Preload all />
    </>
  );
}
