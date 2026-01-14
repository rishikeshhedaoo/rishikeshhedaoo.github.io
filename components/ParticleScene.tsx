'use client';

import { useEffect, useRef } from 'react';
import * as THREE from 'three';

export default function ParticleScene() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    const container = containerRef.current;
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(
      60,
      window.innerWidth / window.innerHeight,
      1,
      4000
    );
    camera.position.z = 800;

    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setPixelRatio(window.devicePixelRatio || 1);
    renderer.setSize(window.innerWidth, window.innerHeight);
    container.appendChild(renderer.domElement);

    const group = new THREE.Group();
    scene.add(group);

    const COUNT = 6000;
    const positions = new Float32Array(COUNT * 3);
    for (let i = 0; i < COUNT; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 3000;
      positions[i * 3 + 1] = (Math.random() - 0.5) * 3000;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 3000;
    }

    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));

    // add per-point phase and scale for twinkle
    const phases = new Float32Array(COUNT);
    const scales = new Float32Array(COUNT);
    for (let i = 0; i < COUNT; i++) {
      phases[i] = Math.random() * Math.PI * 2.0;
      scales[i] = Math.random() * 1.4 + 0.6;
    }
    geometry.setAttribute('aPhase', new THREE.BufferAttribute(phases, 1));
    geometry.setAttribute('aScale', new THREE.BufferAttribute(scales, 1));

    const material = new THREE.ShaderMaterial({
      uniforms: {
        uTime: { value: 0.0 },
        uColor: { value: new THREE.Color(0xffffff) },
      },
      vertexShader: `
        attribute float aScale;
        attribute float aPhase;
        uniform float uTime;
        varying float vAlpha;
        void main(){
            vec4 mvPos = modelViewMatrix * vec4(position, 1.0);
            float tw = 0.5 + 0.5 * sin(uTime * 3.0 + aPhase);
            vAlpha = 0.25 + 0.45 * tw;
            float size = aScale * 2.0 * (300.0 / -mvPos.z) * (0.6 + 0.6 * tw);
            gl_PointSize = size;
            gl_Position = projectionMatrix * mvPos;
        }
      `,
      fragmentShader: `
        uniform vec3 uColor;
        varying float vAlpha;
        void main(){
            vec2 c = gl_PointCoord - vec2(0.5);
            float r = length(c);
            if(r > 0.5) discard;
            float fade = smoothstep(0.5, 0.32, r);
            gl_FragColor = vec4(uColor * fade, vAlpha * fade * 0.85);
        }
      `,
      transparent: true,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
    });

    const points = new THREE.Points(geometry, material);
    group.add(points);
    const clock = new THREE.Clock();

    let targetX = 0,
      targetY = 0;

    function onPointerMove(e: PointerEvent) {
      const x = (e.clientX / window.innerWidth) * 2 - 1;
      const y = (e.clientY / window.innerHeight) * 2 - 1;
      targetX = x * 0.6;
      targetY = y * 0.6;
    }

    window.addEventListener('pointermove', onPointerMove, { passive: true });

    function onResize() {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    }
    window.addEventListener('resize', onResize);

    let animationId: number;
    function animate() {
      animationId = requestAnimationFrame(animate);
      const t = clock.getElapsedTime();
      if (material.uniforms) material.uniforms.uTime.value = t;
      group.rotation.y += (targetX - group.rotation.y) * 0.05;
      group.rotation.x += (targetY - group.rotation.x) * 0.05;
      // clamp x rotation
      group.rotation.x = Math.max(Math.min(group.rotation.x, 0.9), -0.9);
      // slow auto-rotate
      group.rotation.y += 0.0008;
      renderer.render(scene, camera);
    }
    animate();

    // Cleanup
    return () => {
      cancelAnimationFrame(animationId);
      window.removeEventListener('pointermove', onPointerMove);
      window.removeEventListener('resize', onResize);
      renderer.dispose();
      geometry.dispose();
      material.dispose();
      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
    };
  }, []);

  return <div ref={containerRef} id="container" />;
}
