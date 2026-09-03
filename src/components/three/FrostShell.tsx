import { useEffect, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

const VERT = /* glsl */ `
varying vec2 vUv;
varying vec3 vNormalW;
varying vec3 vViewDirW;
void main() {
  vUv = uv;
  vec4 wp = modelMatrix * vec4(position, 1.0);
  vNormalW = normalize(mat3(modelMatrix) * normal);
  vViewDirW = normalize(cameraPosition - wp.xyz);
  gl_Position = projectionMatrix * viewMatrix * wp;
}
`;

const FRAG = /* glsl */ `
precision highp float;
varying vec2 vUv;
varying vec3 vNormalW;
varying vec3 vViewDirW;
uniform float uTime;
uniform float uIntensity;

float hash(vec2 p) {
  p = fract(p * vec2(123.4, 789.2));
  p += dot(p, p + 34.5);
  return fract(p.x * p.y);
}
float noise(vec2 p) {
  vec2 i = floor(p), f = fract(p);
  vec2 u = f * f * (3.0 - 2.0 * f);
  return mix(
    mix(hash(i), hash(i + vec2(1.0, 0.0)), u.x),
    mix(hash(i + vec2(0.0, 1.0)), hash(i + vec2(1.0, 1.0)), u.x),
    u.y
  );
}
float fbm(vec2 p) {
  float v = 0.0; float a = 0.5;
  for (int i = 0; i < 4; i++) { v += a * noise(p); p *= 2.03; a *= 0.5; }
  return v;
}
/* voronoi micro-droplet field */
float droplets(vec2 uv, float scale, float seed) {
  vec2 g = uv * scale;
  vec2 id = floor(g);
  vec2 f = fract(g);
  float d = 8.0;
  for (int y = -1; y <= 1; y++)
  for (int x = -1; x <= 1; x++) {
    vec2 o = vec2(float(x), float(y));
    vec2 rnd = vec2(hash(id + o + seed), hash(id + o + seed + 13.7));
    vec2 c = o + 0.15 + 0.7 * rnd - f;
    float rad = 0.16 + 0.30 * hash(id + o + seed + 7.3);
    d = min(d, length(c) - rad);
  }
  return smoothstep(0.05, -0.18, d);
}

void main() {
  vec2 uv = vUv;
  float vfade = smoothstep(0.02, 0.12, uv.y) * smoothstep(0.98, 0.88, uv.y);

  float micro  = droplets(uv * vec2(2.0, 1.0), 220.0, 1.0);
  float micro2 = droplets(uv * vec2(2.0, 1.0) + 3.7, 340.0, 9.0);

  // slow drifting cold patches
  float patch = fbm(uv * vec2(6.0, 3.0) + vec2(0.0, uTime * 0.015));
  float mist = smoothstep(0.35, 0.75, patch);

  float fres = pow(1.0 - clamp(dot(normalize(vNormalW), normalize(vViewDirW)), 0.0, 1.0), 2.0);

  float a = (micro * 0.5 + micro2 * 0.35) * (0.3 + 0.7 * mist);
  a += mist * 0.10;
  a *= vfade;
  a *= (0.35 + 0.9 * fres);   // silhouette frosts first, like real cans
  a *= uIntensity;

  // glints where beads catch the key light
  float glint = pow(max(micro * micro2, 0.0), 3.0) * (0.4 + fres) * 1.6;

  vec3 col = vec3(0.95, 0.97, 1.0);
  float alpha = clamp(a + glint * 0.25, 0.0, 0.45);
  gl_FragColor = vec4(col + vec3(glint * 0.35), alpha);
}
`;

interface Props {
  radius: number;
  height: number;
  intensity?: number;
}

export default function FrostShell({ radius, height, intensity = 1 }: Props) {
  const mat = useMemo(
    () =>
      new THREE.ShaderMaterial({
        vertexShader: VERT,
        fragmentShader: FRAG,
        uniforms: { uTime: { value: 0 }, uIntensity: { value: intensity } },
        transparent: true,
        depthWrite: false,
      }),
    [intensity]
  );

  useFrame((state) => {
    mat.uniforms.uTime.value = state.clock.elapsedTime;
  });

  useEffect(() => () => mat.dispose(), [mat]);

  return (
    <mesh material={mat} renderOrder={3} raycast={() => null}>
      <cylinderGeometry args={[radius + 0.004, radius + 0.004, height * 0.98, 96, 1, true]} />
    </mesh>
  );
}
