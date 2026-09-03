import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { MotionValue } from 'framer-motion';
import { useReducedMotion } from '../../hooks/useReducedMotion';
import { useCanTexture } from '../../hooks/useCanTexture';
import { useCondensationMaps } from '../../hooks/useCondensationMaps';
import FrostShell from './FrostShell';
import Condensation from './Condensation';

interface EnergyCanProps {
  variant?: string;
  accent?: string;
  isInteractive?: boolean;
  scrollRotation?: MotionValue<number> | null;
  quality?: 'low' | 'medium' | 'high';
  autoRotate?: boolean;
  rotationSpeed?: number;
}

const R = 0.55;
const H = 2.55;
const LIVE_BEADS: Record<string, number> = { low: 0, medium: 10, high: 18 };
const INTRO_DURATION = 3.2;
const START_Y = -Math.PI * 2 * 1.4;

export default function EnergyCan({
  variant = 'ORIGINAL',
  accent = '#0047FF',
  isInteractive = true,
  scrollRotation = null,
  quality = 'high',
  autoRotate = false,
  rotationSpeed = 0.5,
}: EnergyCanProps) {
  const groupRef = useRef<THREE.Group>(null);
  const reduceMotion = useReducedMotion();
  const map = useCanTexture(variant, accent);
  const { bumpMap, roughMap } = useCondensationMaps(quality !== 'low');

  const isDragging = useRef(false);
  const prevPointer = useRef({ x: 0, y: 0 });
  const velocity = useRef(0);
  const introT = useRef(0);
  const initialized = useRef(false);

  const onPointerDown = (e: any) => {
    if (!isInteractive || scrollRotation) return;
    isDragging.current = true;
    introT.current = INTRO_DURATION;
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
    const g = groupRef.current;
    if (!g) return;

    if (scrollRotation) {
      const targetY = scrollRotation.get();
      g.rotation.y = THREE.MathUtils.lerp(g.rotation.y, targetY, 0.1);
      return;
    }

    if (isInteractive) {
      if (!initialized.current) {
        initialized.current = true;
        if (!reduceMotion) g.rotation.set(0.12, START_Y, 0.3);
        else g.rotation.set(0, 0, 0);
      }
      if (isDragging.current) return;

      if (!reduceMotion && introT.current < INTRO_DURATION) {
        introT.current += delta;
        const k = Math.min(introT.current / INTRO_DURATION, 1);
        const ease = 1 - Math.pow(1 - k, 3);
        g.rotation.y = START_Y * (1 - ease);
        g.rotation.z = 0.3 * (1 - ease);
        g.rotation.x = 0.12 * (1 - ease);
      } else if (Math.abs(velocity.current) > 0.0001) {
        g.rotation.y += velocity.current;
        velocity.current *= 0.92;
        g.rotation.z = THREE.MathUtils.damp(g.rotation.z, 0, 2, delta);
      } else if (!reduceMotion) {
        g.rotation.y += delta * 0.12;
        g.rotation.z = THREE.MathUtils.damp(g.rotation.z, 0, 2, delta);
      }
      return;
    }

    if (autoRotate && !reduceMotion) {
      g.rotation.y += delta * rotationSpeed;
    }
  });

  const beadCount = LIVE_BEADS[quality];

  return (
    <group
      ref={groupRef}
      dispose={null}
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={onPointerUp}
      onPointerLeave={onPointerUp}
    >
      {/* Main Body – printed aluminum + live sweat (bump/roughness buildup) */}
      <mesh castShadow receiveShadow>
        <cylinderGeometry args={[R, R, H, 96, 1, false]} />
        <meshPhysicalMaterial
          map={map || undefined}
          color={map ? '#ffffff' : '#F9FAFB'}
          metalness={0.55}
          roughness={1}
          roughnessMap={roughMap}
          bumpMap={bumpMap}
          bumpScale={0.02}
          clearcoat={0.9}
          clearcoatRoughness={0.18}
          envMapIntensity={1.0}
        />
      </mesh>

      {/* Top Neck Taper – bare aluminum */}
      <mesh position={[0, H / 2 + 0.05, 0]} castShadow>
        <cylinderGeometry args={[R - 0.06, R, 0.1, 96, 1, false]} />
        <meshStandardMaterial color="#CFD3D8" metalness={1.0} roughness={0.28} envMapIntensity={1.3} />
      </mesh>
      <mesh position={[0, H / 2 + 0.11, 0]} castShadow>
        <cylinderGeometry args={[R - 0.05, R - 0.05, 0.02, 96, 1, false]} />
        <meshStandardMaterial color="#E8EAEE" metalness={1.0} roughness={0.15} envMapIntensity={1.5} />
      </mesh>
      <mesh position={[0, H / 2 + 0.105, 0]} castShadow>
        <cylinderGeometry args={[R - 0.07, R - 0.07, 0.015, 96, 1, false]} />
        <meshStandardMaterial color="#DFE2E7" metalness={0.95} roughness={0.25} envMapIntensity={1.3} />
      </mesh>
      <mesh position={[0.14, H / 2 + 0.12, 0]} castShadow>
        <torusGeometry args={[0.1, 0.015, 8, 24]} />
        <meshStandardMaterial color="#9CA3AF" metalness={1.0} roughness={0.2} />
      </mesh>
      <mesh position={[0.14, H / 2 + 0.13, 0]} rotation={[Math.PI / 2 - 0.3, 0, 0]} castShadow>
        <torusGeometry args={[0.08, 0.012, 8, 24]} />
        <meshStandardMaterial color="#E5E7EB" metalness={1.0} roughness={0.1} />
      </mesh>
      <mesh position={[0.14, H / 2 + 0.12, 0]}>
        <sphereGeometry args={[0.02, 12, 12]} />
        <meshStandardMaterial color="#6B7280" metalness={0.9} roughness={0.2} />
      </mesh>

      {/* Bottom Neck Taper – bare aluminum */}
      <mesh position={[0, -H / 2 - 0.05, 0]} castShadow receiveShadow>
        <cylinderGeometry args={[R, R - 0.06, 0.1, 96, 1, false]} />
        <meshStandardMaterial color="#CFD3D8" metalness={1.0} roughness={0.28} envMapIntensity={1.3} />
      </mesh>
      <mesh position={[0, -H / 2 - 0.11, 0]} receiveShadow>
        <cylinderGeometry args={[R - 0.05, R - 0.05, 0.02, 96, 1, false]} />
        <meshStandardMaterial color="#D1D5DB" metalness={1.0} roughness={0.2} />
      </mesh>
      <mesh position={[0, -H / 2 - 0.08, 0]} scale={[1, 0.15, 1]}>
        <sphereGeometry args={[R - 0.09, 64, 32, 0, Math.PI * 2, 0, Math.PI / 2]} />
        <meshStandardMaterial color="#9CA3AF" metalness={1.0} roughness={0.3} side={THREE.BackSide} />
      </mesh>

      {/* LAYER: procedural frost mist shell */}
      {quality !== 'low' && (
        <FrostShell radius={R} height={H} intensity={quality === 'high' ? 1 : 0.7} />
      )}

      {/* LAYER: live sliding beads + wet trails */}
      {beadCount > 0 && <Condensation radius={R} height={H} count={beadCount} />}
    </group>
  );
}
