'use client';

import { useState, useEffect, useRef } from 'react';
import { useScrollAnimation } from './ScrollAnimationWrapper';

export default function CenterText() {
  const { scrollProgress, setAnimationComplete } = useScrollAnimation();
  const [mousePos, setMousePos] = useState({ x: -1000, y: -1000 });
  const [isHovered, setIsHovered] = useState(false);
  const [internalAnimationComplete, setInternalAnimationComplete] = useState(false);
  const [showInitialColor, setShowInitialColor] = useState(false);
  const [circleSize, setCircleSize] = useState(220);
  const containerRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    // After writing animation, show color fill once
    const colorTimer = setTimeout(() => {
      setShowInitialColor(true);
    }, 2500);

    // Then enable interactive mode and notify parent
    const interactiveTimer = setTimeout(() => {
      setShowInitialColor(false);
      setInternalAnimationComplete(true);
      setAnimationComplete(true);
    }, 4200);

    // Update circle size based on screen size
    const updateCircleSize = () => {
      const width = window.innerWidth;
      if (width < 640) {
        setCircleSize(120);
      } else if (width < 1024) {
        setCircleSize(180);
      } else if (width < 1440) {
        setCircleSize(220);
      } else {
        setCircleSize(280);
      }
    };

    updateCircleSize();
    window.addEventListener('resize', updateCircleSize);

    return () => {
      clearTimeout(colorTimer);
      clearTimeout(interactiveTimer);
      window.removeEventListener('resize', updateCircleSize);
    };
  }, [setAnimationComplete]);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (textRef.current && internalAnimationComplete) {
        const rect = textRef.current.getBoundingClientRect();
        const isInside =
          e.clientX >= rect.left &&
          e.clientX <= rect.right &&
          e.clientY >= rect.top &&
          e.clientY <= rect.bottom;

        if (isInside) {
          setMousePos({
            x: e.clientX - rect.left,
            y: e.clientY - rect.top,
          });
          setIsHovered(true);
        } else {
          setIsHovered(false);
          setMousePos({ x: -1000, y: -1000 });
        }
      }
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, [internalAnimationComplete]);

  // Text shifts right: 0% to 30% based on scroll
  const textShiftX = scrollProgress * 30;

  return (
    <div
      className="fixed inset-0 flex items-center justify-center z-20 pointer-events-none"
      style={{
        padding: 'clamp(1rem, 5vw, 3rem)',
        transform: `translateX(${textShiftX}%)`,
      }}
    >
      <div
        ref={containerRef}
        className="pointer-events-auto cursor-pointer select-none w-full max-w-[90vw] uppercase"
        style={{
          fontFamily: "'Audiowide', 'Orbitron', sans-serif",
          fontWeight: 400,
          fontSize: 'clamp(3rem, 12vw, 12rem)',
          letterSpacing: '0.15em',
          lineHeight: '1',
          textAlign: 'center',
        }}
      >
        <div className="relative overflow-hidden">
          <span className="relative inline-block" ref={textRef}>
            {/* Base text with border only */}
            <span
              className="relative inline-block"
              style={{
                WebkitTextStroke: '2px rgba(107, 114, 128, 0.8)',
                color: 'transparent',
                animation: internalAnimationComplete || showInitialColor ? 'none' : 'typeWriter 2.5s cubic-bezier(0.4, 0, 0.2, 1) forwards',
                opacity: internalAnimationComplete || showInitialColor ? 1 : 0,
              }}
            >
              BEHAVE
            </span>

            {/* Initial color reveal */}
            {showInitialColor && (
              <span
                className="absolute inset-0 bg-clip-text text-transparent"
                style={{
                  backgroundImage: 'linear-gradient(90deg, #ff6b6b 0%, #4ecdc4 33%, #45b7d1 66%, #f7b731 100%)',
                  backgroundSize: '200% 100%',
                  animation: 'fadeInOut 1.7s cubic-bezier(0.4, 0, 0.2, 1) forwards',
                }}
              >
                BEHAVE
              </span>
            )}

            {/* Interactive hover color layer */}
            {internalAnimationComplete && (
              <span
                className="absolute inset-0 bg-clip-text text-transparent"
                style={{
                  backgroundImage: 'linear-gradient(90deg, #ff6b6b 0%, #4ecdc4 33%, #45b7d1 66%, #f7b731 100%)',
                  backgroundSize: '200% 100%',
                  maskImage: isHovered
                    ? `radial-gradient(circle ${circleSize}px at ${mousePos.x}px ${mousePos.y}px, black, transparent 55%)`
                    : 'radial-gradient(circle 0px at -1000px -1000px, black, transparent)',
                  WebkitMaskImage: isHovered
                    ? `radial-gradient(circle ${circleSize}px at ${mousePos.x}px ${mousePos.y}px, black, transparent 55%)`
                    : 'radial-gradient(circle 0px at -1000px -1000px, black, transparent)',
                }}
              >
                BEHAVE
              </span>
            )}
          </span>
        </div>
      </div>

      <style jsx>{`
        @keyframes typeWriter {
          0% {
            opacity: 1;
            clip-path: inset(0 100% 0 0);
            letter-spacing: 0.3em;
          }
          100% {
            opacity: 1;
            clip-path: inset(0 0 0 0);
            letter-spacing: 0.15em;
          }
        }

        @keyframes fadeInOut {
          0% {
            opacity: 0;
            transform: scale(0.98);
          }
          25% {
            opacity: 1;
            transform: scale(1);
          }
          75% {
            opacity: 1;
            transform: scale(1);
          }
          100% {
            opacity: 0;
            transform: scale(0.98);
          }
        }
      `}</style>
    </div>
  );
}
