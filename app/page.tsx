'use client';

import { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
import Navigation from '@/components/Navigation';
import StructuredData from '@/components/StructuredData';

const ParticleScene = dynamic(() => import('@/components/ParticleScene'), {
  ssr: false,
  loading: () => <div className="w-full h-full bg-black" />,
});

export default function Home() {
  const [showText, setShowText] = useState(false);
  const [showColorReveal, setShowColorReveal] = useState(false);
  const [animationComplete, setAnimationComplete] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [rotationProgress, setRotationProgress] = useState(0);

  // Initial animation sequence
  useEffect(() => {
    // Start typewriter after small delay
    const showTimer = setTimeout(() => setShowText(true), 100);

    // Show color reveal after typewriter (2.5s)
    const colorTimer = setTimeout(() => setShowColorReveal(true), 2600);

    // Hide color reveal and enable scroll (4.2s total)
    const completeTimer = setTimeout(() => {
      setShowColorReveal(false);
      setAnimationComplete(true);
    }, 4200);

    return () => {
      clearTimeout(showTimer);
      clearTimeout(colorTimer);
      clearTimeout(completeTimer);
    };
  }, []);

  // Scroll handler
  useEffect(() => {
    if (!animationComplete) return;

    const handleScroll = () => {
      const scrollY = window.scrollY;
      const windowHeight = window.innerHeight;

      // Phase 1: 0-100vh - disc slides in, text shifts
      const slideProgress = Math.min(scrollY / windowHeight, 1);
      setScrollProgress(slideProgress);

      // Phase 2: 100vh-300vh - disc rotates
      if (scrollY > windowHeight) {
        const rotateScroll = scrollY - windowHeight;
        // Full rotation over 200vh (2 viewport heights)
        const rotation = (rotateScroll / (windowHeight * 2)) * 360;
        setRotationProgress(rotation);
      } else {
        setRotationProgress(0);
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();

    return () => window.removeEventListener('scroll', handleScroll);
  }, [animationComplete]);

  // BEHAVE: starts centered, moves right to be closer to disc
  const behaveX = scrollProgress * 12;

  // Text scale reduces smoothly: 1 -> 0.7
  const textScale = 1 - scrollProgress * 0.3;

  return (
    <>
      <StructuredData />
      <ParticleScene />
      <Navigation />

      {/* BEHAVE Text - centered in right area when scrolled */}
      <div
        className="fixed inset-0 flex items-center justify-center z-20 pointer-events-none"
        style={{
          transform: `translateX(${behaveX}%)`,
        }}
      >
        <div className="relative">
          {/* Base text with typewriter animation */}
          <h1
            className="uppercase select-none"
            style={{
              fontFamily: "'Audiowide', 'Orbitron', sans-serif",
              fontSize: 'clamp(2.5rem, 12vw, 10rem)',
              letterSpacing: '0.15em',
              WebkitTextStroke: '2px rgba(107, 114, 128, 0.8)',
              color: 'transparent',
              transform: `scale(${textScale})`,
              willChange: 'transform',
              opacity: showText ? 1 : 0,
              animation: showText && !animationComplete ? 'typeWriter 2.5s ease-out forwards' : 'none',
            }}
          >
            BEHAVE
          </h1>

          {/* Color reveal overlay */}
          {showColorReveal && (
            <h1
              className="absolute inset-0 uppercase select-none"
              style={{
                fontFamily: "'Audiowide', 'Orbitron', sans-serif",
                fontSize: 'clamp(2.5rem, 12vw, 10rem)',
                letterSpacing: '0.15em',
                background: 'linear-gradient(90deg, #ff6b6b, #4ecdc4, #45b7d1, #f7b731)',
                backgroundClip: 'text',
                WebkitBackgroundClip: 'text',
                color: 'transparent',
                transform: `scale(${textScale})`,
                animation: 'fadeInOut 1.6s ease-in-out forwards',
              }}
            >
              BEHAVE
            </h1>
          )}
        </div>
      </div>

      <style jsx>{`
        @keyframes typeWriter {
          0% {
            clip-path: inset(0 100% 0 0);
            letter-spacing: 0.3em;
          }
          100% {
            clip-path: inset(0 0 0 0);
            letter-spacing: 0.15em;
          }
        }
        @keyframes fadeInOut {
          0% { opacity: 0; }
          30% { opacity: 1; }
          70% { opacity: 1; }
          100% { opacity: 0; }
        }
      `}</style>

      {/* Disc - slides in from left, only 40-50% visible */}
      {animationComplete && (
        <div
          className="fixed z-10 pointer-events-none"
          style={{
            left: 0,
            top: '50%',
            // Starts fully hidden (-100%), slides to show ~45% of disc
            // At progress 1: translateX(-55%) means 45% of disc is visible
            transform: `translateX(${-100 + scrollProgress * 45}%) translateY(-50%)`,
          }}
        >
          <div
            className="relative"
            style={{
              width: '100vh',
              height: '100vh',
              transform: `rotate(${rotationProgress}deg)`,
            }}
          >
            {/* Outer ring */}
            <div
              className="absolute inset-0 rounded-full"
              style={{
                background: 'transparent',
                border: '2px solid rgba(107, 114, 128, 0.6)',
              }}
            />
            {/* Middle ring */}
            <div
              className="absolute rounded-full"
              style={{
                inset: '15%',
                border: '2px solid rgba(107, 114, 128, 0.5)',
              }}
            />
            {/* Inner ring */}
            <div
              className="absolute rounded-full"
              style={{
                inset: '30%',
                border: '2px solid rgba(107, 114, 128, 0.4)',
              }}
            />
            {/* Center ring */}
            <div
              className="absolute rounded-full"
              style={{
                inset: '40%',
                background: 'transparent',
                border: '2px solid rgba(107, 114, 128, 0.5)',
              }}
            />
            {/* Spokes for rotation visibility */}
            {[0, 30, 60, 90, 120, 150, 180, 210, 240, 270, 300, 330].map((angle, i) => (
              <div
                key={i}
                className="absolute left-1/2 top-1/2"
                style={{
                  width: '1px',
                  height: '35%',
                  background: 'rgba(107, 114, 128, 0.3)',
                  transform: `rotate(${angle}deg)`,
                  transformOrigin: '50% 0',
                }}
              />
            ))}
          </div>
        </div>
      )}

      {/* Scroll spacer */}
      {animationComplete && (
        <div style={{ height: '400vh' }} />
      )}
    </>
  );
}
