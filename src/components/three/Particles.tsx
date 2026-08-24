import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { useReducedMotion } from '../../hooks/useReducedMotion';

interface ParticlesProps {
  count?: number;
  radius?: number;
}

export default function Particles({ count = 80, radius = 6 }: ParticlesProps) {
  const ref = useRef<THREE.Points>(null);
  const reduceMotion = useReducedMotion();

  const { positions, sizes } = useMemo(() => {
    const pos = new Float32Array(count * 3);
    const siz = new Float32Array(count);
    for (let i = 0; i < count; i++) {
      const r = radius * (0.4 + Math.random() * 0.6);
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);
      pos[i * 3] = r * Math.sin(phi) * Math.cos(theta);
      pos[i * 3 + 1] = (Math.random() - 0.5) * radius * 1.6;
      pos[i * 3 + 2] = r * Math.sin(phi) * Math.sin(theta);
      siz[i] = Math.random() * 0.04 + 0.015;
    }
    return { positions: pos, sizes: siz };
  }, [count, radius]);

  useFrame((_, delta) => {
    if (!ref.current || reduceMotion) return;
    ref.current.rotation.y += delta * 0.04;
    ref.current.rotation.x = Math.sin(performance.now() * 0.0001) * 0.05;
  });

  if (count === 0) return null;

  return (
    <points ref={ref}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
        <bufferAttribute attach="attributes-size" args={[sizes, 1]} />
      </bufferGeometry>
      <pointsMaterial
        size={0.03}
        color="#00e6ff"
        transparent
        opacity={0.7}
        sizeAttenuation
        depthWrite={false}
        blending={THREE.AdditiveBlending}
      />
    </points>
  );
}
