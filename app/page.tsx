'use client';

import { useState, useEffect, useCallback } from 'react';
import dynamic from 'next/dynamic';
import Navigation from '@/components/Navigation';
import StructuredData from '@/components/StructuredData';
import CenterText from '@/components/CenterText';

const ParticleScene = dynamic(() => import('@/components/ParticleScene'), {
  ssr: false,
  loading: () => <div className="w-full h-full bg-black" />,
});

export default function Home() {
  const [animationComplete, setAnimationComplete] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [rotationProgress, setRotationProgress] = useState(0);

  const handleAnimationComplete = useCallback(() => {
    setAnimationComplete(true);
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

  return (
    <>
      <StructuredData />
      <ParticleScene />
      <Navigation />

      {/* BEHAVE Text with interactive hover effect */}
      <CenterText
        scrollProgress={scrollProgress}
        onAnimationComplete={handleAnimationComplete}
      />


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
