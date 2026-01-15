'use client';

import { useScrollAnimation } from './ScrollAnimationWrapper';

export default function ScrollDisc() {
  const { scrollProgress, animationComplete } = useScrollAnimation();

  // Don't render until animation is complete
  if (!animationComplete) return null;

  // Disc position: -100% (hidden) to -60% (40% visible)
  const discX = -100 + scrollProgress * 40;

  return (
    <div
      className="fixed left-0 z-10 pointer-events-none"
      style={{
        top: '50%',
        transform: `translateX(${discX}%) translateY(-50%)`,
      }}
    >
      <div
        style={{
          width: 'min(60vw, 600px)',
          height: 'min(60vw, 600px)',
        }}
      >
        {/* Main disc body */}
        <div
          className="absolute inset-0 rounded-full"
          style={{
            background: 'radial-gradient(circle at 30% 30%, #3a3a45, #1a1a22)',
            border: '4px solid #666',
            boxShadow: '0 0 40px rgba(100,100,120,0.3), inset 0 0 60px rgba(0,0,0,0.5)',
          }}
        />

        {/* Middle ring */}
        <div
          className="absolute rounded-full"
          style={{
            inset: '20%',
            border: '2px solid #555',
          }}
        />

        {/* Center label */}
        <div
          className="absolute rounded-full"
          style={{
            inset: '38%',
            background: 'radial-gradient(circle at 40% 40%, #4a4a55, #2a2a32)',
            border: '2px solid #666',
          }}
        />

        {/* Grooves */}
        {Array.from({ length: 12 }).map((_, i) => (
          <div
            key={i}
            className="absolute left-1/2 top-1/2"
            style={{
              width: '1px',
              height: '30%',
              background: 'linear-gradient(to bottom, transparent, rgba(100,100,110,0.4), transparent)',
              transform: `rotate(${i * 30}deg)`,
              transformOrigin: '50% 0',
            }}
          />
        ))}

        {/* Shine */}
        <div
          className="absolute inset-0 rounded-full"
          style={{
            background: 'linear-gradient(135deg, rgba(255,255,255,0.15) 0%, transparent 40%)',
          }}
        />
      </div>
    </div>
  );
}
