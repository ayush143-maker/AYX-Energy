import { useRef } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';
import { MotionValue } from 'framer-motion';
import { useReducedMotion } from '../../hooks/useReducedMotion';
import { useCanTexture } from '../../hooks/useCanTexture';

interface EnergyCanProps {
  followCursor?: boolean;
  autoRotateSpeed?: number;
  rotationY?: MotionValue<number>;
  autoRotate?: boolean;
  position?: [number, number, number];
  scale?: number;
  quality?: 'low' | 'medium' | 'high';
}

export default function EnergyCan({ followCursor = true, autoRotateSpeed = 0.3, rotationY, autoRotate = true, position = [0, 0, 0], scale = 1, quality = 'high' }: EnergyCanProps) {
  const groupRef = useRef<THREE.Group>(null);
  const { mouse } = useThree();
  const reduceMotion = useReducedMotion();
  const { map, emissive } = useCanTexture();
  const segments = quality === 'low' ? 48 : quality === 'medium' ? 72 : 96;

  useFrame((_, delta) => {
    if (!groupRef.current) return;
    if (rotationY) {
      groupRef.current.rotation.y = rotationY.get();
    } else if (autoRotate && !reduceMotion) {
      groupRef.current.rotation.y += delta * autoRotateSpeed;
    }
    if (followCursor && !reduceMotion) {
      groupRef.current.rotation.x = THREE.MathUtils.lerp(groupRef.current.rotation.x, mouse.y * 0.12, 0.045);
      groupRef.current.rotation.z = THREE.MathUtils.lerp(groupRef.current.rotation.z, mouse.x * 0.06, 0.045);
    }
  });

  return (
    <group ref={groupRef} position={position} scale={scale} dispose={null}>
      <mesh castShadow receiveShadow>
        <cylinderGeometry args={[1, 1, 2.6, segments, 1, true]} />
        <meshStandardMaterial
          map={map || undefined}
          emissiveMap={emissive || undefined}
          emissive={emissive ? '#ffffff' : '#000000'}
          emissiveIntensity={0.8}
          metalness={0.9}
          roughness={0.35}
          envMapIntensity={0.4} // <--- Prevents white blown-out look
          side={THREE.DoubleSide}
          color={map ? '#ffffff' : '#04060a'} // <--- Dark base
        />
      </mesh>

      <mesh position={[0, 1.32, 0]}>
        <cylinderGeometry args={[1.015, 1.015, 0.08, segments]} />
        <meshStandardMaterial color="#9fb4cc" metalness={1} roughness={0.2} envMapIntensity={1.0} />
      </mesh>

      <mesh position={[0, 1.365, 0]}>
        <cylinderGeometry args={[0.96, 0.96, 0.02, segments]} />
        <meshStandardMaterial color="#cfd8e3" metalness={1} roughness={0.14} envMapIntensity={1.0} />
      </mesh>

      <mesh position={[0, 1.34, 0]}>
        <cylinderGeometry args={[0.92, 0.92, 0.04, segments, 1, true]} />
        <meshStandardMaterial color="#0a0e16" metalness={0.6} roughness={0.4} side={THREE.DoubleSide} />
      </mesh>

      <mesh position={[0.32, 1.375, 0]}>
        <cylinderGeometry args={[0.18, 0.18, 0.018, 24]} />
        <meshStandardMaterial color="#cfd8e3" metalness={1} roughness={0.18} envMapIntensity={1.0} />
      </mesh>

      <mesh position={[0.32, 1.39, 0]} rotation={[Math.PI / 2 - 0.25, 0, 0]}>
        <torusGeometry args={[0.13, 0.022, 12, 32]} />
        <meshStandardMaterial color="#cfd8e3" metalness={1} roughness={0.2} envMapIntensity={1.0} />
      </mesh>

      <mesh position={[0.32, 1.385, 0]}>
        <sphereGeometry args={[0.025, 12, 12]} />
        <meshStandardMaterial color="#9fb4cc" metalness={1} roughness={0.15} />
      </mesh>

      <mesh position={[0, -1.3, 0]}>
        <cylinderGeometry args={[1.015, 0.985, 0.08, segments]} />
        <meshStandardMaterial color="#1a1f2a" metalness={0.85} roughness={0.4} envMapIntensity={0.6} />
      </mesh>

      <mesh position={[0, -1.335, 0]}>
        <cylinderGeometry args={[0.94, 0.94, 0.02, segments]} />
        <meshStandardMaterial color="#0a0e16" metalness={0.6} roughness={0.5} />
      </mesh>
    </group>
  );
}
