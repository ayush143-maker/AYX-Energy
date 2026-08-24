import { useRef } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';
import { MotionValue } from 'framer-motion';
import { useReducedMotion } from '../../hooks/useReducedMotion';
import { useCanTexture } from '../../hooks/useCanTexture';

interface EnergyCanProps {
  followCursor?: boolean;
  rotationY?: MotionValue<number>;
  quality?: 'low' | 'medium' | 'high';
}

export default function EnergyCan({ followCursor = true, rotationY, quality = 'high' }: EnergyCanProps) {
  const groupRef = useRef<THREE.Group>(null);
  const { mouse } = useThree();
  const reduceMotion = useReducedMotion();
  const { map } = useCanTexture();

  const segments = quality === 'low' ? 48 : quality === 'medium' ? 72 : 96;

  useFrame((_, delta) => {
    if (!groupRef.current) return;

    if (rotationY) {
      groupRef.current.rotation.y = rotationY.get();
    } else if (!reduceMotion) {
      // Slow, elegant idle rotation
      groupRef.current.rotation.y += delta * 0.15; 
    }

    if (followCursor && !reduceMotion) {
      groupRef.current.rotation.x = THREE.MathUtils.lerp(groupRef.current.rotation.x, mouse.y * 0.1, 0.05);
    }
  });

  // Dimensions based on 330ml slim can
  const radius = 0.6;
  const height = 2.8;

  return (
    <group ref={groupRef} dispose={null}>
      
      {/* Main Body */}
      <mesh castShadow receiveShadow>
        <cylinderGeometry args={[radius, radius, height, segments, 1, true]} />
        <meshStandardMaterial 
          map={map || undefined}
          color={map ? '#ffffff' : '#F7F7F5'}
          metalness={0.1} 
          roughness={0.6} 
          side={THREE.DoubleSide}
        />
      </mesh>

      {/* Shoulder Taper */}
      <mesh position={[0, height / 2 - 0.05, 0]} castShadow>
        <cylinderGeometry args={[radius - 0.02, radius, 0.1, segments, 1, false]} />
        <meshStandardMaterial color="#F7F7F5" metalness={0.1} roughness={0.6} />
      </mesh>

      {/* Neck */}
      <mesh position={[0, height / 2 + 0.02, 0]} castShadow>
        <cylinderGeometry args={[radius - 0.12, radius - 0.02, 0.06, segments, 1, false]} />
        <meshStandardMaterial color="#F7F7F5" metalness={0.1} roughness={0.6} />
      </mesh>

      {/* Top Rim (Raised edge) */}
      <mesh position={[0, height / 2 + 0.06, 0]} castShadow>
        <cylinderGeometry args={[radius - 0.1, radius - 0.1, 0.02, segments, 1, false]} />
        <meshStandardMaterial color="#D1D5DB" metalness={0.8} roughness={0.3} />
      </mesh>

      {/* Recessed Lid */}
      <mesh position={[0, height / 2 + 0.05, 0]} castShadow>
        <cylinderGeometry args={[radius - 0.13, radius - 0.1, 0.015, segments, 1, false]} />
        <meshStandardMaterial color="#E5E7EB" metalness={0.9} roughness={0.2} />
      </mesh>

      {/* Pull Tab Base Ring */}
      <mesh position={[0.15, height / 2 + 0.07, 0]} rotation={[0, 0, 0]} castShadow>
        <torusGeometry args={[0.1, 0.012, 8, 24]} />
        <meshStandardMaterial color="#9CA3AF" metalness={0.9} roughness={0.2} />
      </mesh>

      {/* Pull Tab Ring (The finger loop) */}
      <mesh position={[0.15, height / 2 + 0.08, 0]} rotation={[Math.PI / 2 - 0.2, 0, 0]} castShadow>
        <torusGeometry args={[0.08, 0.01, 8, 24]} />
        <meshStandardMaterial color="#9CA3AF" metalness={0.9} roughness={0.2} />
      </mesh>

      {/* Rivet */}
      <mesh position={[0.15, height / 2 + 0.075, 0]}>
        <sphereGeometry args={[0.015, 12, 12]} />
        <meshStandardMaterial color="#6B7280" metalness={0.9} roughness={0.2} />
      </mesh>

      {/* Bottom Base */}
      <mesh position={[0, -height / 2 + 0.02, 0]} castShadow receiveShadow>
        <cylinderGeometry args={[radius - 0.05, radius, 0.05, segments, 1, false]} />
        <meshStandardMaterial color="#D1D5DB" metalness={0.6} roughness={0.4} />
      </mesh>

      {/* Bottom Inset */}
      <mesh position={[0, -height / 2 + 0.01, 0]}>
        <cylinderGeometry args={[radius - 0.15, radius - 0.05, 0.02, segments, 1, false]} />
        <meshStandardMaterial color="#9CA3AF" metalness={0.8} roughness={0.3} />
      </mesh>

      {/* Inner Bottom (Dark inside if looked at from below) */}
      <mesh position={[0, -height / 2 + 0.03, 0]}>
        <cylinderGeometry args={[radius - 0.16, radius - 0.16, 0.02, segments, 1, false]} />
        <meshStandardMaterial color="#111111" metalness={0.5} roughness={0.8} />
      </mesh>

    </group>
  );
}
