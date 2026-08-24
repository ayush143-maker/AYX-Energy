import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { MotionValue } from 'framer-motion';
import { useReducedMotion } from '../../hooks/useReducedMotion';
import { useCanTexture } from '../../hooks/useCanTexture';

interface EnergyCanProps {
  variant?: string;
  accent?: string;
  isInteractive?: boolean;
  scrollRotation?: MotionValue<number> | null;
}

export default function EnergyCan({ 
  variant = 'ORIGINAL', 
  accent = '#0047FF', 
  isInteractive = true,
  scrollRotation = null
}: EnergyCanProps) {
  const groupRef = useRef<THREE.Group>(null);
  const reduceMotion = useReducedMotion();
  const map = useCanTexture(variant, accent);

  // Drag state
  const isDragging = useRef(false);
  const prevPointer = useRef({ x: 0, y: 0 });
  const velocity = useRef(0);

  // Event handlers for drag
  const onPointerDown = (e: any) => {
    if (!isInteractive || scrollRotation) return;
    isDragging.current = true;
    prevPointer.current = { x: e.clientX, y: e.clientY };
    e.target.setPointerCapture(e.pointerId);
  };

  const onPointerMove = (e: any) => {
    if (!isDragging.current || !groupRef.current) return;
    const deltaX = e.clientX - prevPointer.current.x;
    velocity.current = deltaX * 0.01;
    groupRef.current.rotation.y += velocity.current;
    prevPointer.current = { x: e.clientX, y: e.clientY };
  };

  const onPointerUp = (e: any) => {
    isDragging.current = false;
    e.target.releasePointerCapture(e.pointerId);
  };

  useFrame((_, delta) => {
    if (!groupRef.current) return;

    if (scrollRotation) {
      // Scroll-driven mode (Showcase section)
      const targetY = scrollRotation.get();
      groupRef.current.rotation.y = THREE.MathUtils.lerp(groupRef.current.rotation.y, targetY, 0.1);
    } else if (!isDragging.current) {
      // Idle drift + inertia (Hero section)
      if (Math.abs(velocity.current) > 0.0001) {
        groupRef.current.rotation.y += velocity.current;
        velocity.current *= 0.92; // friction
      } else if (!reduceMotion) {
        // Very slow premium idle drift
        groupRef.current.rotation.y += delta * 0.15;
      }
    }
  });

  // Dimensions based on 330ml slim can
  const radius = 0.6;
  const height = 2.8;

  return (
    <group 
      ref={groupRef} 
      dispose={null}
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={onPointerUp}
      onPointerLeave={onPointerUp}
    >
      
      {/* Main Body (Perfect Cylinder - Fixes Text Stretching) */}
      <mesh castShadow receiveShadow>
        <cylinderGeometry args={[radius, radius, height, 64, 1, false]} />
        <meshStandardMaterial 
          map={map || undefined}
          color={map ? '#ffffff' : '#F9FAFB'}
          metalness={0.1} 
          roughness={0.8} 
          side={THREE.DoubleSide}
          envMapIntensity={0.5}
        />
      </mesh>

      {/* Top Neck Taper */}
      <mesh position={[0, height / 2 + 0.05, 0]} castShadow>
        <cylinderGeometry args={[radius - 0.05, radius, 0.1, 64, 1, false]} />
        <meshStandardMaterial color="#F9FAFB" metalness={0.1} roughness={0.8} />
      </mesh>

      {/* Thin Steel Top Rim */}
      <mesh position={[0, height / 2 + 0.11, 0]} castShadow>
        <cylinderGeometry args={[radius - 0.04, radius - 0.04, 0.02, 64, 1, false]} />
        <meshStandardMaterial color="#D1D5DB" metalness={1.0} roughness={0.2} />
      </mesh>

      {/* Lid Top (Recessed Steel) */}
      <mesh position={[0, height / 2 + 0.105, 0]} castShadow>
        <cylinderGeometry args={[radius - 0.06, radius - 0.06, 0.015, 64, 1, false]} />
        <meshStandardMaterial color="#E5E7EB" metalness={0.9} roughness={0.3} />
      </mesh>

      {/* Pull Tab Base */}
      <mesh position={[0.15, height / 2 + 0.12, 0]} rotation={[0, 0, 0]} castShadow>
        <torusGeometry args={[0.1, 0.015, 8, 24]} />
        <meshStandardMaterial color="#9CA3AF" metalness={1.0} roughness={0.2} />
      </mesh>

      {/* Pull Tab Ring */}
      <mesh position={[0.15, height / 2 + 0.13, 0]} rotation={[Math.PI / 2 - 0.3, 0, 0]} castShadow>
        <torusGeometry args={[0.08, 0.012, 8, 24]} />
        <meshStandardMaterial color="#E5E7EB" metalness={1.0} roughness={0.1} />
      </mesh>

      {/* Rivet */}
      <mesh position={[0.15, height / 2 + 0.12, 0]}>
        <sphereGeometry args={[0.02, 12, 12]} />
        <meshStandardMaterial color="#6B7280" metalness={0.9} roughness={0.2} />
      </mesh>

      {/* Bottom Neck Taper */}
      <mesh position={[0, -height / 2 - 0.05, 0]} castShadow receiveShadow>
        <cylinderGeometry args={[radius, radius - 0.05, 0.1, 64, 1, false]} />
        <meshStandardMaterial color="#F9FAFB" metalness={0.1} roughness={0.8} />
      </mesh>

      {/* Realistic Concave Bottom (NO GLOBE) */}
      {/* Outer Bottom Rim */}
      <mesh position={[0, -height / 2 - 0.11, 0]} receiveShadow>
        <cylinderGeometry args={[radius - 0.04, radius - 0.04, 0.02, 64, 1, false]} />
        <meshStandardMaterial color="#D1D5DB" metalness={1.0} roughness={0.2} />
      </mesh>
      
      {/* Inward Curved Base */}
      <mesh position={[0, -height / 2 - 0.08, 0]} scale={[1, 0.15, 1]}>
        <sphereGeometry args={[radius - 0.08, 64, 32, 0, Math.PI * 2, 0, Math.PI / 2]} />
        <meshStandardMaterial color="#9CA3AF" metalness={1.0} roughness={0.3} side={THREE.BackSide} />
      </mesh>

    </group>
  );
}
