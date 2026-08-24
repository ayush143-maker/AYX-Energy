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

      {/* Premium Studio Lighting */}
      <ambientLight intensity={0.8} />
      <directionalLight position={[5, 8, 5]} intensity={2.0} color="#ffffff" castShadow shadow-mapSize-width={1024} shadow-mapSize-height={1024} />
      <spotLight position={[-5, 5, 5]} intensity={1.5} angle={0.4} penumbra={1} color="#ffffff" />
      <pointLight position={[0, -2, 3]} intensity={0.5} color="#ffffff" />
      
      {/* Clean environment for realistic metal reflections */}
      <Environment resolution={quality === 'low' ? 64 : 256} preset="studio" />

      <EnergyCan 
        scrollRotation={scrollRotation} 
        isInteractive={!scrollRotation} 
      />

      {/* Soft contact shadow */}
      <ContactShadows 
        position={[0, -1.45, 0]} 
        opacity={0.4} 
        scale={6} 
        blur={2.5} 
        far={3} 
        resolution={quality === 'low' ? 128 : 512} 
        color="#000000" 
      />
      
      <Preload all />
    </>
  );
}
