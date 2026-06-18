'use client';

import { useEffect, useRef } from 'react';

const GRID_SPACING = 26;
const BASE_RADIUS = 0.625;
const MAX_RADIUS = 1.875;
const HOVER_RADIUS = 190;
const DOT_OPACITY = 0.4;

function smoothstep(edge0: number, edge1: number, x: number) {
  const t = Math.max(0, Math.min(1, (x - edge0) / (edge1 - edge0)));
  return t * t * (3 - 2 * t);
}

export default function ParticleScene() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const mouseRef = useRef({ x: -1000, y: -1000, active: false });
  const smoothMouseRef = useRef({ x: -1000, y: -1000 });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationId = 0;
    let width = 0;
    let height = 0;

    const resize = () => {
      const dpr = window.devicePixelRatio || 1;
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.width = width * dpr;
      canvas.height = height * dpr;
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    const draw = () => {
      ctx.clearRect(0, 0, width, height);

      smoothMouseRef.current.x += (mouseRef.current.x - smoothMouseRef.current.x) * 0.12;
      smoothMouseRef.current.y += (mouseRef.current.y - smoothMouseRef.current.y) * 0.12;

      if (!mouseRef.current.active) {
        animationId = requestAnimationFrame(draw);
        return;
      }

      const mx = smoothMouseRef.current.x;
      const my = smoothMouseRef.current.y;
      const cols = Math.ceil(width / GRID_SPACING) + 1;
      const rows = Math.ceil(height / GRID_SPACING) + 1;
      const offsetX = (width - (cols - 1) * GRID_SPACING) / 2;
      const offsetY = (height - (rows - 1) * GRID_SPACING) / 2;

      for (let row = 0; row < rows; row++) {
        for (let col = 0; col < cols; col++) {
          const x = offsetX + col * GRID_SPACING;
          const y = offsetY + row * GRID_SPACING;
          const dist = Math.hypot(x - mx, y - my);

          if (dist > HOVER_RADIUS) continue;

          const influence = 1 - dist / HOVER_RADIUS;
          const visibility = smoothstep(0, 1, influence);
          const radius = BASE_RADIUS + (MAX_RADIUS - BASE_RADIUS) * visibility;
          const alpha = DOT_OPACITY * visibility;

          ctx.beginPath();
          ctx.arc(x, y, radius, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(160, 165, 175, ${alpha})`;
          ctx.fill();
        }
      }

      animationId = requestAnimationFrame(draw);
    };

    const onPointerMove = (e: PointerEvent) => {
      mouseRef.current.x = e.clientX;
      mouseRef.current.y = e.clientY;
      mouseRef.current.active = true;
    };

    const onPointerLeave = () => {
      mouseRef.current.active = false;
    };

    resize();
    draw();

    window.addEventListener('resize', resize);
    window.addEventListener('pointermove', onPointerMove, { passive: true });
    document.documentElement.addEventListener('pointerleave', onPointerLeave);

    return () => {
      cancelAnimationFrame(animationId);
      window.removeEventListener('resize', resize);
      window.removeEventListener('pointermove', onPointerMove);
      document.documentElement.removeEventListener('pointerleave', onPointerLeave);
    };
  }, []);

  return (
    <div id="container" className="fixed inset-0 z-0 pointer-events-none" aria-hidden>
      <canvas ref={canvasRef} className="block h-full w-full" />
    </div>
  );
}
