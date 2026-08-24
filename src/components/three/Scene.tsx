import { Environment, AdaptiveDpr, Preload, ContactShadows } from '@react-three/drei';
import EnergyCan from './EnergyCan';
import { MotionValue } from 'framer-motion';

interface SceneProps {
  quality?: 'low' | 'medium' | 'high';
  scrollRotation?: MotionValue<number> | null;
}

export default function Scene({ quality = 'high', scrollRotation = null }: SceneProps) {
  return (
    <>
      <AdaptiveDpr pixelated={false} />

      {/* Soft, bright studio lighting */}
      <ambientLight intensity={0.9} />
      <directionalLight position={[5, 8, 5]} intensity={1.5} color="#ffffff" />
      <spotLight position={[-5, 5, 5]} intensity={0.8} angle={0.5} penumbra={1} color="#ffffff" />
      
      {/* Clean environment for aluminum reflections */}
      <Environment resolution={quality === 'low' ? 64 : 128} preset="studio" />

      <EnergyCan 
        scrollRotation={scrollRotation} 
        isInteractive={!scrollRotation} 
      />

      {/* Soft contact shadow */}
      <ContactShadows 
        position={[0, -1.5, 0]} 
        opacity={0.35} 
        scale={6} 
        blur={2.8} 
        far={3} 
        resolution={quality === 'low' ? 128 : 256} 
        color="#000000" 
      />
      
      <Preload all />
    </>
  );
}
