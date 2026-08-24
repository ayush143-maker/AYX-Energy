import { Environment, AdaptiveDpr, Preload, ContactShadows } from '@react-three/drei';
import EnergyCan from './EnergyCan';
import { MotionValue } from 'framer-motion';

interface SceneProps {
  quality?: 'low' | 'medium' | 'high';
  scrollRotation?: MotionValue<number>;
}

export default function Scene({ quality = 'high', scrollRotation }: SceneProps) {
  return (
    <>
      <AdaptiveDpr pixelated={false} />

      {/* Soft, neutral studio lighting */}
      <ambientLight intensity={0.8} />
      <directionalLight position={[5, 8, 5]} intensity={1.2} color="#ffffff" />
      <spotLight position={[-5, 5, 5]} intensity={0.6} angle={0.5} penumbra={1} color="#ffffff" />
      
      {/* Clean studio environment for aluminum reflections */}
      <Environment resolution={quality === 'low' ? 64 : 128} preset="studio" />

      <EnergyCan followCursor={!quality?.includes('low') && !scrollRotation} rotationY={scrollRotation} quality={quality} />

      {/* Soft contact shadow */}
      <ContactShadows 
        position={[0, -1.6, 0]} 
        opacity={0.4} 
        scale={8} 
        blur={2.5} 
        far={4} 
        resolution={quality === 'low' ? 128 : 256} 
        color="#000000" 
      />
      
      <Preload all />
    </>
  );
}
