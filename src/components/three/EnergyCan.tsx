import { useMemo, useRef } from 'react';
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
  quality?: 'low' | 'medium' | 'high';
  autoRotate?: boolean;
  rotationSpeed?: number;
}

// Real 330ml slim-can proportions
const R = 0.55;
const H = 2.55;

const DROPLETS: Record<string, number> = { low: 0, medium: 90, high: 150 };
const INTRO_DURATION = 3.2;
const START_Y = -Math.PI * 2 * 1.4;

/* ------------- Realistic condensation (refractive water) ------------- */
function Condensation({
  radius,
  height,
  count,
  premium,
}: {
  radius: number;
  height: number;
  count: number;
  premium: boolean;
}) {
  const ref = useRef<THREE.InstancedMesh>(null);
  const dummy = useMemo(() => new THREE.Object3D(), []);

  const drops = useMemo(
    () =>
      Array.from({ length: count }, () => {
        const big = Math.random() < 0.15;
        return {
          theta: Math.random() * Math.PI * 2,
          y: (Math.random() - 0.5) * (height - 0.25),
          r: big ? 0.014 + Math.random() * 0.009 : 0.0045 + Math.random() * 0.007,
          slide: big && Math.random() < 0.7,
          speed: 0.035 + Math.random() * 0.07,
          wobble: Math.random() * Math.PI * 2,
          squash: 0.85 + Math.random() * 0.4,
        };
      }),
    [count, height]
  );

  useFrame((state, delta) => {
    if (!ref.current) return;
    const t = state.clock.elapsedTime;
    for (let i = 0; i < drops.length; i++) {
      const d = drops[i];
      if (d.slide) {
        d.y -= delta * d.speed;
        d.theta += Math.sin(t * 1.5 + d.wobble) * delta * 0.04;
        if (d.y < -height / 2 + 0.12) {
          d.y = height / 2 - 0.25;
          d.theta = Math.random() * Math.PI * 2;
        }
      }
      const rr = radius + d.r * 0.3; // embed into surface (no floating)
      dummy.position.set(Math.sin(d.theta) * rr, d.y, Math.cos(d.theta) * rr);
      dummy.rotation.set(0, d.theta, 0);
      dummy.scale.set(d.r, d.r * (d.slide ? 1.45 : d.squash), d.r * 0.45); // flattened bead
      dummy.updateMatrix();
      ref.current.setMatrixAt(i, dummy.matrix);
    }
    ref.current.instanceMatrix.needsUpdate = true;
  });

  return (
    <instancedMesh ref={ref} args={[undefined, undefined, count] as any} frustumCulled={false}>
      <sphereGeometry args={[1, 12, 12]} />
      {premium ? (
        /* Real water: refracts the label behind it */
        <meshPhysicalMaterial
          transmission={1}
          thickness={0.05}
          roughness={0.03}
          ior={1.33}
          clearcoat={1}
          clearcoatRoughness={0.02}
          envMapIntensity={1.6}
        />
      ) : (
        /* Cheap fallback for weak GPUs */
        <meshPhysicalMaterial
          transparent
          opacity={0.18}
          roughness={0.05}
          clearcoat={1}
          envMapIntensity={1.4}
          depthWrite={false}
        />
      )}
    </instancedMesh>
  );
}

/* ------------------------------ Can ------------------------------ */
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
      // Hero: tilted spin-in, settles perfectly straight
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

    // Flavor cards: slow premium turntable spin
    if (autoRotate && !reduceMotion) {
      g.rotation.y += delta * rotationSpeed;
    }
  });

  const dropCount = DROPLETS[quality];

  return (
    <group
      ref={groupRef}
      dispose={null}
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={onPointerUp}
      onPointerLeave={onPointerUp}
    >
      {/* Main Body – glossy printed aluminum */}
      <mesh castShadow receiveShadow>
        <cylinderGeometry args={[R, R, H, 96, 1, false]} />
        <meshPhysicalMaterial
          map={map || undefined}
          color={map ? '#ffffff' : '#F9FAFB'}
          metalness={0.55}
          roughness={0.34}
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
      {/* Thin Steel Top Rim */}
      <mesh position={[0, H / 2 + 0.11, 0]} castShadow>
        <cylinderGeometry args={[R - 0.05, R - 0.05, 0.02, 96, 1, false]} />
        <meshStandardMaterial color="#E8EAEE" metalness={1.0} roughness={0.15} envMapIntensity={1.5} />
      </mesh>
      {/* Lid Top (Recessed Steel) */}
      <mesh position={[0, H / 2 + 0.105, 0]} castShadow>
        <cylinderGeometry args={[R - 0.07, R - 0.07, 0.015, 96, 1, false]} />
        <meshStandardMaterial color="#DFE2E7" metalness={0.95} roughness={0.25} envMapIntensity={1.3} />
      </mesh>
      {/* Pull Tab Base */}
      <mesh position={[0.14, H / 2 + 0.12, 0]} castShadow>
        <torusGeometry args={[0.1, 0.015, 8, 24]} />
        <meshStandardMaterial color="#9CA3AF" metalness={1.0} roughness={0.2} />
      </mesh>
      {/* Pull Tab Ring */}
      <mesh position={[0.14, H / 2 + 0.13, 0]} rotation={[Math.PI / 2 - 0.3, 0, 0]} castShadow>
        <torusGeometry args={[0.08, 0.012, 8, 24]} />
        <meshStandardMaterial color="#E5E7EB" metalness={1.0} roughness={0.1} />
      </mesh>
      {/* Rivet */}
      <mesh position={[0.14, H / 2 + 0.12, 0]}>
        <sphereGeometry args={[0.02, 12, 12]} />
        <meshStandardMaterial color="#6B7280" metalness={0.9} roughness={0.2} />
      </mesh>

      {/* Bottom Neck Taper – bare aluminum */}
      <mesh position={[0, -H / 2 - 0.05, 0]} castShadow receiveShadow>
        <cylinderGeometry args={[R, R - 0.06, 0.1, 96, 1, false]} />
        <meshStandardMaterial color="#CFD3D8" metalness={1.0} roughness={0.28} envMapIntensity={1.3} />
      </mesh>
      {/* Outer Bottom Rim */}
      <mesh position={[0, -H / 2 - 0.11, 0]} receiveShadow>
        <cylinderGeometry args={[R - 0.05, R - 0.05, 0.02, 96, 1, false]} />
        <meshStandardMaterial color="#D1D5DB" metalness={1.0} roughness={0.2} />
      </mesh>
      {/* Concave Bottom */}
      <mesh position={[0, -H / 2 - 0.08, 0]} scale={[1, 0.15, 1]}>
        <sphereGeometry args={[R - 0.09, 64, 32, 0, Math.PI * 2, 0, Math.PI / 2]} />
        <meshStandardMaterial color="#9CA3AF" metalness={1.0} roughness={0.3} side={THREE.BackSide} />
      </mesh>

      {/* Condensation – real refractive water beads */}
      {dropCount > 0 && (
        <Condensation radius={R} height={H} count={dropCount} premium={quality !== 'low'} />
      )}
    </group>
  );
}
