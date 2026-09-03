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
}

// Real 330ml slim-can proportions
const R = 0.55;
const H = 2.55;

const DROPLETS: Record<string, number> = { low: 60, medium: 140, high: 240 };
const INTRO_DURATION = 3.2;
const START_Y = -Math.PI * 2 * 1.4; // ~1.4 full spins, settles to front

/* ---------------- Condensation (water droplets) ---------------- */
function Condensation({ radius, height, count }: { radius: number; height: number; count: number }) {
  const ref = useRef<THREE.InstancedMesh>(null);
  const dummy = useMemo(() => new THREE.Object3D(), []);

  const drops = useMemo(
    () =>
      Array.from({ length: count }, () => ({
        theta: Math.random() * Math.PI * 2,
        y: (Math.random() - 0.5) * (height - 0.3),
        r: 0.01 + Math.random() * 0.022,
        slide: Math.random() < 0.35,
        speed: 0.05 + Math.random() * 0.12,
        wobble: Math.random() * Math.PI * 2,
      })),
    [count, height]
  );

  useFrame((state, delta) => {
    if (!ref.current) return;
    const t = state.clock.elapsedTime;
    for (let i = 0; i < drops.length; i++) {
      const d = drops[i];
      if (d.slide) {
        d.y -= delta * d.speed;
        d.theta += Math.sin(t * 2 + d.wobble) * delta * 0.06;
        if (d.y < -height / 2 + 0.12) {
          d.y = height / 2 - 0.25;
          d.theta = Math.random() * Math.PI * 2;
        }
      }
      const rr = radius + d.r * 0.45;
      dummy.position.set(Math.sin(d.theta) * rr, d.y, Math.cos(d.theta) * rr);
      dummy.rotation.set(0, d.theta, 0);
      dummy.scale.set(d.r, d.r * (d.slide ? 1.6 : 1.15), d.r * 0.55); // flattened, sliding = stretched
      dummy.updateMatrix();
      ref.current.setMatrixAt(i, dummy.matrix);
    }
    ref.current.instanceMatrix.needsUpdate = true;
  });

  return (
    <instancedMesh ref={ref} args={[undefined, undefined, count] as any} frustumCulled={false}>
      <sphereGeometry args={[1, 10, 10]} />
      <meshPhysicalMaterial
        color="#ffffff"
        transparent
        opacity={0.38}
        roughness={0.06}
        metalness={0}
        clearcoat={1}
        clearcoatRoughness={0.08}
        envMapIntensity={2.2}
        depthWrite={false}
      />
    </instancedMesh>
  );
}

/* ---------------- Can ---------------- */
export default function EnergyCan({
  variant = 'ORIGINAL',
  accent = '#0047FF',
  isInteractive = true,
  scrollRotation = null,
  quality = 'high',
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
    introT.current = INTRO_DURATION; // hand control to user
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
      // Scroll-driven mode (Showcase section)
      const targetY = scrollRotation.get();
      g.rotation.y = THREE.MathUtils.lerp(g.rotation.y, targetY, 0.1);
      return;
    }

    if (isInteractive) {
      // Hero mode: tilted + spun-in, settles perfectly straight
      if (!initialized.current) {
        initialized.current = true;
        if (!reduceMotion) g.rotation.set(0.12, START_Y, 0.3);
        else g.rotation.set(0, 0, 0);
      }
      if (isDragging.current) return;

      if (!reduceMotion && introT.current < INTRO_DURATION) {
        introT.current += delta;
        const k = Math.min(introT.current / INTRO_DURATION, 1);
        const ease = 1 - Math.pow(1 - k, 3); // cubic ease-out
        g.rotation.y = START_Y * (1 - ease);
        g.rotation.z = 0.3 * (1 - ease);
        g.rotation.x = 0.12 * (1 - ease);
      } else if (Math.abs(velocity.current) > 0.0001) {
        g.rotation.y += velocity.current;
        velocity.current *= 0.92;
        g.rotation.z = THREE.MathUtils.damp(g.rotation.z, 0, 2, delta);
      } else if (!reduceMotion) {
        g.rotation.y += delta * 0.12; // slow premium idle drift
        g.rotation.z = THREE.MathUtils.damp(g.rotation.z, 0, 2, delta);
      }
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
      {/* Main Body – glossy coated printed aluminum */}
      <mesh castShadow receiveShadow>
        <cylinderGeometry args={[R, R, H, 96, 1, false]} />
        <meshPhysicalMaterial
          map={map || undefined}
          color={map ? '#ffffff' : '#F9FAFB'}
          metalness={0.35}
          roughness={0.38}
          clearcoat={0.7}
          clearcoatRoughness={0.25}
          envMapIntensity={0.9}
        />
      </mesh>

      {/* Top Neck Taper – bare aluminum */}
      <mesh position={[0, H / 2 + 0.05, 0]} castShadow>
        <cylinderGeometry args={[R - 0.06, R, 0.1, 96, 1, false]} />
        <meshStandardMaterial color="#D6D9DE" metalness={1.0} roughness={0.32} envMapIntensity={1.2} />
      </mesh>
      {/* Thin Steel Top Rim */}
      <mesh position={[0, H / 2 + 0.11, 0]} castShadow>
        <cylinderGeometry args={[R - 0.05, R - 0.05, 0.02, 96, 1, false]} />
        <meshStandardMaterial color="#E8EAEE" metalness={1.0} roughness={0.18} envMapIntensity={1.4} />
      </mesh>
      {/* Lid Top (Recessed Steel) */}
      <mesh position={[0, H / 2 + 0.105, 0]} castShadow>
        <cylinderGeometry args={[R - 0.07, R - 0.07, 0.015, 96, 1, false]} />
        <meshStandardMaterial color="#DFE2E7" metalness={0.95} roughness={0.28} envMapIntensity={1.2} />
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
        <meshStandardMaterial color="#D6D9DE" metalness={1.0} roughness={0.32} envMapIntensity={1.2} />
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

      {/* Condensation droplets */}
      {dropCount > 0 && <Condensation radius={R} height={H} count={dropCount} />}
    </group>
  );
}
