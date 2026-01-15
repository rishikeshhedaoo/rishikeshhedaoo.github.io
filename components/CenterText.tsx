'use client';

import { useState, useEffect, useRef } from 'react';

interface CenterTextProps {
  scrollProgress?: number;
  onAnimationComplete?: () => void;
}

export default function CenterText({ scrollProgress = 0, onAnimationComplete }: CenterTextProps) {
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [isHovered, setIsHovered] = useState(false);
  const [internalAnimationComplete, setInternalAnimationComplete] = useState(false);
  const [showInitialColor, setShowInitialColor] = useState(false);
  const [circleSize, setCircleSize] = useState(220);
  const textContainerRef = useRef<HTMLDivElement>(null);
  const onAnimationCompleteRef = useRef(onAnimationComplete);

  // Keep the ref updated with the latest callback
  useEffect(() => {
    onAnimationCompleteRef.current = onAnimationComplete;
  }, [onAnimationComplete]);

  useEffect(() => {
    // After writing animation, show color fill once
    const colorTimer = setTimeout(() => {
      setShowInitialColor(true);
    }, 2500);

    // Then enable interactive mode and notify parent
    const interactiveTimer = setTimeout(() => {
      setShowInitialColor(false);
      setInternalAnimationComplete(true);
      onAnimationCompleteRef.current?.();
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
  }, []); // Empty dependency - runs only on mount

  // Window-level mouse tracking for more reliable hover detection
  useEffect(() => {
    if (!internalAnimationComplete) return;

    const handleMouseMove = (e: MouseEvent) => {
      if (!textContainerRef.current) return;

      const rect = textContainerRef.current.getBoundingClientRect();
      const padding = 50;
      const isInside =
        e.clientX >= rect.left - padding &&
        e.clientX <= rect.right + padding &&
        e.clientY >= rect.top - padding &&
        e.clientY <= rect.bottom + padding;

      if (isInside) {
        setMousePos({
          x: e.clientX - rect.left,
          y: e.clientY - rect.top,
        });
        setIsHovered(true);
      } else {
        setIsHovered(false);
      }
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, [internalAnimationComplete]);

  // Text shifts right: 0% to 15% based on scroll (centers in right side content area)
  const textShiftX = scrollProgress * 15;

  // Font size scales down: 100% to 60% based on scroll
  const fontScale = 1 - (scrollProgress * 0.4);
  const baseFontSize = 12; // vw
  const minFontSize = 3; // rem
  const maxFontSize = 12; // rem
  const scaledFontSize = baseFontSize * fontScale;

  return (
    <div
      className="fixed inset-0 flex items-center justify-center z-20 pointer-events-none"
      style={{
        padding: 'clamp(1rem, 5vw, 3rem)',
        transform: `translateX(${textShiftX}%)`,
      }}
    >
      <div
        ref={textContainerRef}
        className="pointer-events-auto cursor-pointer select-none uppercase"
        style={{
          fontFamily: "'Audiowide', 'Orbitron', sans-serif",
          fontWeight: 400,
          fontSize: `clamp(${minFontSize * fontScale}rem, ${scaledFontSize}vw, ${maxFontSize * fontScale}rem)`,
          letterSpacing: '0.15em',
          lineHeight: '1',
          textAlign: 'center',
          transition: 'font-size 0.1s ease-out',
        }}
      >
        <div className="relative inline-block">
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

          {/* Interactive hover color layer - reveals gradient in area around cursor */}
          {internalAnimationComplete && (
            <span
              className="absolute inset-0"
              style={{
                background: 'linear-gradient(90deg, #ff6b6b 0%, #4ecdc4 33%, #45b7d1 66%, #f7b731 100%)',
                backgroundSize: '200% 100%',
                WebkitBackgroundClip: 'text',
                backgroundClip: 'text',
                color: 'transparent',
                opacity: isHovered ? 1 : 0,
                maskImage: `radial-gradient(circle ${circleSize}px at ${mousePos.x}px ${mousePos.y}px, black 0%, transparent 70%)`,
                WebkitMaskImage: `radial-gradient(circle ${circleSize}px at ${mousePos.x}px ${mousePos.y}px, black 0%, transparent 70%)`,
                transition: 'opacity 0.2s ease-out',
                pointerEvents: 'none',
              }}
            >
              BEHAVE
            </span>
          )}
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
