import { useRef, useState, useMemo } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';
import { useReducedMotion } from '../../hooks/useReducedMotion';
import { useCanTexture } from '../../hooks/useCanTexture';

interface EnergyCanProps {
  variant?: string;
  accent?: string;
  onQuadrantChange?: (q: number) => void;
  isInteractive?: boolean;
}

export default function EnergyCan({ 
  variant = 'ORIGINAL', 
  accent = '#0047FF', 
  onQuadrantChange,
  isInteractive = true 
}: EnergyCanProps) {
  const groupRef = useRef<THREE.Group>(null);
  const reduceMotion = useReducedMotion();
  const { mouse } = useThree();
  const map = useCanTexture(variant, accent);

  // Animation State Machine
  const [phase, setPhase] = useState(0); // 0: Front, 1: Tilt, 2: Turn
  const phaseTimer = useRef(0);
  const touchVelocity = useRef(0);
  const currentQuadrant = useRef(0);

  // Lathe Geometry for smooth can profile
  const points = useMemo(() => {
    const pts = [];
    // Bottom to Top
    pts.push(new THREE.Vector2(0.0, -1.4)); // Center bottom
    pts.push(new THREE.Vector2(0.58, -1.4)); // Bottom edge
    pts.push(new THREE.Vector2(0.62, -1.35)); // Bottom curve
    pts.push(new THREE.Vector2(0.62, 1.15)); // Straight body
    pts.push(new THREE.Vector2(0.62, 1.2)); // Shoulder start
    pts.push(new THREE.Vector2(0.6, 1.3)); // Shoulder curve
    pts.push(new THREE.Vector2(0.52, 1.4)); // Neck
    pts.push(new THREE.Vector2(0.54, 1.45)); // Rim outer
    pts.push(new THREE.Vector2(0.52, 1.48)); // Rim top
    pts.push(new THREE.Vector2(0.48, 1.48)); // Lid inner
    return pts;
  }, []);

  useFrame((state, delta) => {
    if (!groupRef.current) return;

    // Touch inertia decay
    if (Math.abs(touchVelocity.current) > 0.0001) {
      groupRef.current.rotation.y += touchVelocity.current;
      touchVelocity.current *= 0.92; // friction
    } else if (isInteractive && !reduceMotion) {
      // State machine logic
      phaseTimer.current += delta;
      
      if (phase === 0 && phaseTimer.current > 2.5) { // Hold front
        setPhase(1); phaseTimer.current = 0;
      } else if (phase === 1 && phaseTimer.current > 1.5) { // Tilt
        setPhase(2); phaseTimer.current = 0;
      } else if (phase === 2 && phaseTimer.current > 6.0) { // Turn
        setPhase(0); phaseTimer.current = 0;
      }

      // Smooth transitions based on phase
      let targetY = groupRef.current.rotation.y;
      let targetX = groupRef.current.rotation.x;
      let targetZ = groupRef.current.rotation.z;

      if (phase === 0) {
        // Return to front (Y=0)
        targetY = 0; targetX = 0; targetZ = 0;
      } else if (phase === 1) {
        // Slight tilt
        targetX = 0.08; targetZ = 0.12;
      } else if (phase === 2) {
        // Slow continuous turn
        targetY += delta * 0.15;
        targetX = 0.05; targetZ = 0.05;
      }

      groupRef.current.rotation.y = THREE.MathUtils.lerp(groupRef.current.rotation.y, targetY, 0.05);
      groupRef.current.rotation.x = THREE.MathUtils.lerp(groupRef.current.rotation.x, targetX, 0.05);
      groupRef.current.rotation.z = THREE.MathUtils.lerp(groupRef.current.rotation.z, targetZ, 0.05);
    }

    // Pointer influence (Desktop)
    if (isInteractive && !reduceMotion && Math.abs(touchVelocity.current) < 0.0001) {
      const targetY = mouse.x * 0.5 + groupRef.current.rotation.y;
      const targetX = -mouse.y * 0.15 + groupRef.current.rotation.x;
      groupRef.current.rotation.x = THREE.MathUtils.lerp(groupRef.current.rotation.x, targetX, 0.02);
    }

    // Quadrant calculation for dynamic text
    if (onQuadrantChange) {
      const y = groupRef.current.rotation.y;
      const normalizedY = ((y % (Math.PI * 2)) + Math.PI * 2) % (Math.PI * 2);
      const quad = Math.floor(((normalizedY + Math.PI / 4) / (Math.PI / 2)) % 4);
      
      if (quad !== currentQuadrant.current) {
        currentQuadrant.current = quad;
        onQuadrantChange(quad);
      }
    }
  });

  return (
    <group ref={groupRef} dispose={null}>
      
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

      {/* Lid Top (Recessed) */}
      <mesh position={[0, 1.475, 0]} castShadow>
        <cylinderGeometry args={[0.48, 0.48, 0.01, 96, 1, false]} />
        <meshStandardMaterial color="#E5E7EB" metalness={0.9} roughness={0.2} />
      </mesh>

      {/* Pull Tab Base */}
      <mesh position={[0.15, 1.49, 0]} rotation={[0, 0, 0]} castShadow>
        <torusGeometry args={[0.1, 0.015, 8, 24]} />
        <meshStandardMaterial color="#9CA3AF" metalness={0.9} roughness={0.2} />
      </mesh>

      {/* Pull Tab Ring */}
      <mesh position={[0.15, 1.5, 0]} rotation={[Math.PI / 2 - 0.2, 0, 0]} castShadow>
        <torusGeometry args={[0.08, 0.012, 8, 24]} />
        <meshStandardMaterial color="#9CA3AF" metalness={0.9} roughness={0.2} />
      </mesh>

      {/* Rivet */}
      <mesh position={[0.15, 1.495, 0]}>
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
