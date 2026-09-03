import { useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

function createTrailTexture(): THREE.CanvasTexture {
  const c = document.createElement('canvas');
  c.width = 32; c.height = 128;
  const ctx = c.getContext('2d')!;
  const g = ctx.createLinearGradient(0, 0, 0, 128);
  g.addColorStop(0, 'rgba(223,232,242,0)');
  g.addColorStop(0.5, 'rgba(223,232,242,0.5)');
  g.addColorStop(1, 'rgba(223,232,242,0.9)');
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, 32, 128);
  const t = new THREE.CanvasTexture(c);
  return t;
}

interface Props {
  radius: number;
  height: number;
  count: number;
}

/** Live refractive water beads that slide down leaving wet trails. */
export default function Condensation({ radius, height, count }: Props) {
  const beadsRef = useRef<THREE.InstancedMesh>(null);
  const trailRef = useRef<THREE.InstancedMesh>(null);
  const dummy = useMemo(() => new THREE.Object3D(), []);
  const trailTex = useMemo(() => createTrailTexture(), []);

  const beads = useMemo(
    () =>
      Array.from({ length: count }, (_, i) => ({
        theta: Math.random() * Math.PI * 2,
        y: (Math.random() - 0.5) * (height - 0.4),
        r: 0.008 + Math.random() * 0.011 + (i % 6 === 0 ? 0.007 : 0),
        speed: 0.015 + Math.random() * 0.05,
        wobble: Math.random() * Math.PI * 2,
        slide: i % 2 === 0,
      })),
    [count, height]
  );

  useFrame((state, delta) => {
    if (!beadsRef.current) return;
    const t = state.clock.elapsedTime;

    for (let i = 0; i < beads.length; i++) {
      const d = beads[i];
      if (d.slide) {
        d.y -= delta * d.speed;
        d.theta += Math.sin(t * 1.3 + d.wobble) * delta * 0.05;
        if (d.y < -height / 2 + 0.15) {
          d.y = height / 2 - 0.3;
          d.theta = Math.random() * Math.PI * 2;
        }
      }
      const rr = radius + d.r * 0.3;
      dummy.position.set(Math.sin(d.theta) * rr, d.y, Math.cos(d.theta) * rr);
      dummy.rotation.set(0, d.theta, 0);
      dummy.scale.set(d.r, d.r * (d.slide ? 1.5 : 1.15), d.r * 0.5);
      dummy.updateMatrix();
      beadsRef.current.setMatrixAt(i, dummy.matrix);

      if (trailRef.current) {
        if (d.slide) {
          const tl = 0.22 + d.speed * 3.5;
          dummy.position.set(
            Math.sin(d.theta) * (rr - 0.0015),
            d.y + tl / 2 + d.r,
            Math.cos(d.theta) * (rr - 0.0015)
          );
          dummy.rotation.set(0, d.theta, 0);
          dummy.scale.set(d.r * 0.8, tl, 1);
        } else {
          dummy.position.set(0, -10, 0);
          dummy.scale.set(0.0001, 0.0001, 0.0001);
        }
        dummy.updateMatrix();
        trailRef.current.setMatrixAt(i, dummy.matrix);
      }
    }
    beadsRef.current.instanceMatrix.needsUpdate = true;
    if (trailRef.current) trailRef.current.instanceMatrix.needsUpdate = true;
  });

  return (
    <group>
      {/* refractive water beads */}
      <instancedMesh ref={beadsRef} args={[undefined, undefined, count] as any} frustumCulled={false} raycast={() => null}>
        <sphereGeometry args={[1, 16, 16]} />
        <meshPhysicalMaterial
          transmission={1}
          thickness={0.06}
          roughness={0.02}
          ior={1.33}
          clearcoat={1}
          clearcoatRoughness={0.03}
          specularIntensity={1.2}
          envMapIntensity={2}
        />
      </instancedMesh>
      {/* wet trails behind sliding beads */}
      <instancedMesh ref={trailRef} args={[undefined, undefined, count] as any} frustumCulled={false} raycast={() => null}>
        <planeGeometry args={[1, 1]} />
        <meshBasicMaterial
          map={trailTex}
          transparent
          opacity={0.16}
          color="#dfe8f2"
          depthWrite={false}
          side={THREE.DoubleSide}
        />
      </instancedMesh>
    </group>
  );
}
