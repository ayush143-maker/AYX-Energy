import { useRef, useMemo } from 'react';
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

  // Lathe Geometry for smooth can profile
  const points = useMemo(() => {
    const pts = [];
    pts.push(new THREE.Vector2(0.0, -1.4)); // Center bottom
    pts.push(new THREE.Vector2(0.58, -1.4)); // Bottom edge
    pts.push(new THREE.Vector2(0.62, -1.35)); // Bottom curve
    pts.push(new THREE.Vector2(0.62, 1.15)); // Straight body
    pts.push(new THREE.Vector2(0.62, 1.2)); // Shoulder start
    pts.push(new THREE.Vector2(0.6, 1.3)); // Shoulder curve
    pts.push(new THREE.Vector2(0.52, 1.35)); // Neck start
    return pts;
  }, []);

  // Event handlers for drag (using 'any' to bypass R3F strict TS event types)
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

  return (
    <group 
      ref={groupRef} 
      dispose={null}
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={onPointerUp}
      onPointerLeave={onPointerUp}
    >
      
      {/* Main Body (Lathe Geometry) */}
      <mesh castShadow receiveShadow>
        <latheGeometry args={[points, 96]} />
        <meshStandardMaterial 
          map={map || undefined}
          color={map ? '#ffffff' : '#F9FAFB'}
          metalness={0.4} 
          roughness={0.5} 
          side={THREE.DoubleSide}
        />
      </mesh>

      {/* Sleek Thin Steel Top Rim (Red Bull style) */}
      <mesh position={[0, 1.36, 0]} castShadow>
        <cylinderGeometry args={[0.53, 0.53, 0.04, 96, 1, false]} />
        <meshStandardMaterial color="#9CA3AF" metalness={1.0} roughness={0.15} />
      </mesh>

      {/* Lid Top (Recessed Steel) */}
      <mesh position={[0, 1.385, 0]} castShadow>
        <cylinderGeometry args={[0.48, 0.48, 0.015, 96, 1, false]} />
        <meshStandardMaterial color="#E5E7EB" metalness={0.9} roughness={0.2} />
      </mesh>

      {/* Pull Tab Base */}
      <mesh position={[0.15, 1.395, 0]} rotation={[0, 0, 0]} castShadow>
        <torusGeometry args={[0.1, 0.015, 8, 24]} />
        <meshStandardMaterial color="#9CA3AF" metalness={1.0} roughness={0.2} />
      </mesh>

      {/* Pull Tab Ring */}
      <mesh position={[0.15, 1.40, 0]} rotation={[Math.PI / 2 - 0.2, 0, 0]} castShadow>
        <torusGeometry args={[0.08, 0.012, 8, 24]} />
        <meshStandardMaterial color="#9CA3AF" metalness={1.0} roughness={0.2} />
      </mesh>

      {/* Rivet */}
      <mesh position={[0.15, 1.395, 0]}>
        <sphereGeometry args={[0.02, 12, 12]} />
        <meshStandardMaterial color="#6B7280" metalness={0.9} roughness={0.2} />
      </mesh>

      {/* Inner Bottom (Dark inside) */}
      <mesh position={[0, -1.39, 0]}>
        <cylinderGeometry args={[0.57, 0.57, 0.02, 96, 1, false]} />
        <meshStandardMaterial color="#111111" metalness={0.5} roughness={0.8} side={THREE.DoubleSide} />
      </mesh>

    </group>
  );
}
