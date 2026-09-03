import { Environment, AdaptiveDpr, Preload } from '@react-three/drei';
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
      <ambientLight intensity={0.9} />
      <directionalLight position={[5, 8, 5]} intensity={1.5} color="#ffffff" />
      <spotLight position={[-5, 5, 5]} intensity={1.0} angle={0.5} penumbra={1} color="#ffffff" />
      {/* Rim light – makes aluminum edges + droplets sparkle */}
      <directionalLight position={[-6, 3, -6]} intensity={1.1} color="#ffffff" />
      <Environment resolution={quality === 'low' ? 64 : 256} preset="studio" />
      <EnergyCan
        scrollRotation={scrollRotation}
        isInteractive={!scrollRotation}
        quality={quality}
      />
      {/* Soft radial shadow plane (no "globe" artifact) */}
      <mesh position={[0, -1.45, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[6, 6]} />
        <meshBasicMaterial transparent opacity={0.15} depthWrite={false}>
          <canvasTexture attach="map" image={createShadowCanvas()} />
        </meshBasicMaterial>
      </mesh>
      <Preload all />
    </>
  );
}

function createShadowCanvas(): HTMLCanvasElement {
  const canvas = document.createElement('canvas');
  canvas.width = 256;
  canvas.height = 256;
  const ctx = canvas.getContext('2d')!;
  const gradient = ctx.createRadialGradient(128, 128, 0, 128, 128, 128);
  gradient.addColorStop(0, 'rgba(0,0,0,0.6)');
  gradient.addColorStop(0.5, 'rgba(0,0,0,0.2)');
  gradient.addColorStop(1, 'rgba(0,0,0,0)');
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, 256, 256);
  return canvas;
}
