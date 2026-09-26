import { useEffect, useMemo, useRef } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { AdditiveBlending, type Points, type ShaderMaterial } from 'three';

const vertexShader = /* glsl */ `
  attribute float aPhase;
  attribute float aSize;
  uniform float uTime;
  uniform float uPixelRatio;
  varying float vAlpha;
  void main() {
    vec4 mv = modelViewMatrix * vec4(position, 1.0);
    gl_Position = projectionMatrix * mv;
    gl_PointSize = aSize * uPixelRatio * (220.0 / -mv.z);
    // Each star twinkles at its own phase and speed.
    vAlpha = 0.45 + 0.55 * (0.5 + 0.5 * sin(uTime * (0.6 + fract(aPhase) * 1.8) + aPhase));
  }
`;

const fragmentShader = /* glsl */ `
  varying float vAlpha;
  void main() {
    float d = length(gl_PointCoord - 0.5);
    if (d > 0.5) discard;
    float glow = smoothstep(0.5, 0.0, d);
    gl_FragColor = vec4(vec3(1.0), glow * glow * vAlpha);
  }
`;

/** Shared, mutable input read inside the render loop — updating it never re-renders React. */
const input = { px: 0, py: 0, scrollVelocity: 0 };

function StarLayer({
  count,
  radius,
  depth,
  size,
  speed,
}: {
  count: number;
  radius: number;
  depth: number;
  size: number;
  speed: number;
}) {
  const ref = useRef<Points>(null);
  const material = useRef<ShaderMaterial>(null);
  const dpr = useThree((s) => s.viewport.dpr);

  const { positions, phases, sizes } = useMemo(() => {
    const positions = new Float32Array(count * 3);
    const phases = new Float32Array(count);
    const sizes = new Float32Array(count);
    for (let i = 0; i < count; i++) {
      const r = radius + Math.random() * depth;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(Math.random() * 2 - 1);
      positions.set(
        [r * Math.sin(phi) * Math.cos(theta), r * Math.sin(phi) * Math.sin(theta), r * Math.cos(phi)],
        i * 3,
      );
      phases[i] = Math.random() * 100;
      sizes[i] = size * (0.4 + Math.random() * Math.random() * 1.6); // mostly small, a few bright
    }
    return { positions, phases, sizes };
  }, [count, radius, depth, size]);

  const uniforms = useMemo(() => ({ uTime: { value: 0 }, uPixelRatio: { value: dpr } }), [dpr]);

  useFrame((_, delta) => {
    if (!ref.current || !material.current) return;
    material.current.uniforms.uTime.value += delta;
    // Base drift + a boost while the page is scrolling ("warp").
    const boost = 1 + Math.min(Math.abs(input.scrollVelocity) * 0.02, 12);
    ref.current.rotation.y += delta * 0.02 * speed * boost;
    ref.current.rotation.x += delta * 0.008 * speed * boost;
  });

  return (
    <points ref={ref}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" count={count} array={positions} itemSize={3} />
        <bufferAttribute attach="attributes-aPhase" count={count} array={phases} itemSize={1} />
        <bufferAttribute attach="attributes-aSize" count={count} array={sizes} itemSize={1} />
      </bufferGeometry>
      <shaderMaterial
        ref={material}
        vertexShader={vertexShader}
        fragmentShader={fragmentShader}
        uniforms={uniforms}
        transparent
        depthWrite={false}
        blending={AdditiveBlending}
      />
    </points>
  );
}

/** Camera eases toward the cursor (parallax) and pushes forward while scrolling fast. */
function CameraRig() {
  useFrame(({ camera }) => {
    input.scrollVelocity *= 0.9; // decay between scroll events
    camera.position.x += (input.px * 14 - camera.position.x) * 0.03;
    camera.position.y += (-input.py * 14 - camera.position.y) * 0.03;
    const targetZ = 100 - Math.min(Math.abs(input.scrollVelocity) * 0.25, 30);
    camera.position.z += (targetZ - camera.position.z) * 0.05;
    camera.lookAt(0, 0, 0);
  });
  return null;
}

/** Site-wide interactive star field. Lazy-loaded so three.js never blocks first paint. */
export default function StarField() {
  const lowPower = typeof navigator !== 'undefined' && (navigator.hardwareConcurrency ?? 8) <= 4;
  const small = typeof window !== 'undefined' && window.innerWidth < 768;
  const scale = lowPower || small ? 0.5 : 1;

  useEffect(() => {
    let lastY = window.scrollY;
    const onMove = (e: MouseEvent) => {
      input.px = (e.clientX / window.innerWidth) * 2 - 1;
      input.py = (e.clientY / window.innerHeight) * 2 - 1;
    };
    const onScroll = () => {
      input.scrollVelocity += window.scrollY - lastY;
      lastY = window.scrollY;
    };
    window.addEventListener('mousemove', onMove, { passive: true });
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => {
      window.removeEventListener('mousemove', onMove);
      window.removeEventListener('scroll', onScroll);
    };
  }, []);

  return (
    <Canvas
      className="!absolute inset-0"
      camera={{ position: [0, 0, 100], fov: 75 }}
      dpr={[1, 1.5]}
      gl={{ antialias: false, powerPreference: 'low-power', alpha: true }}
    >
      <CameraRig />
      {/* Far layer: many faint stars, slow. Near layer: fewer, bigger, faster → depth. */}
      <StarLayer count={Math.round(1800 * scale)} radius={110} depth={60} size={2.2} speed={0.6} />
      <StarLayer count={Math.round(350 * scale)} radius={60} depth={40} size={2.6} speed={1.4} />
    </Canvas>
  );
}
