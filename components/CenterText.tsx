'use client';

import { useState, useEffect, useRef } from 'react';

export default function CenterText() {
  const [mousePos, setMousePos] = useState({ x: -1000, y: -1000 });
  const [isHovered, setIsHovered] = useState(false);
  const [animationComplete, setAnimationComplete] = useState(false);
  const [showInitialColor, setShowInitialColor] = useState(false);
  const textRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // After writing animation, show color fill once
    const colorTimer = setTimeout(() => {
      setShowInitialColor(true);
    }, 2500); // Start showing color after writing

    // Then enable interactive mode
    const interactiveTimer = setTimeout(() => {
      setShowInitialColor(false);
      setAnimationComplete(true);
    }, 4200); // 2.5s writing + 1.7s color display (reduced from 2.5s)

    return () => {
      clearTimeout(colorTimer);
      clearTimeout(interactiveTimer);
    };
  }, []);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (textRef.current && animationComplete) {
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
  }, [animationComplete]);

  return (
    <div 
      className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[90vw] max-w-[900px] text-center z-20 pointer-events-auto cursor-pointer uppercase select-none"
      ref={textRef}
      style={{
        fontFamily: "'Audiowide', 'Orbitron', sans-serif",
        fontWeight: 400,
        fontSize: 'clamp(50px, 15vw, 200px)',
        letterSpacing: '0.15em',
        lineHeight: '1',
      }}
    >
      <div className="relative overflow-hidden">
        <span className="relative inline-block">
          {/* Base text with border only - no color inside */}
          <span 
            className="relative inline-block"
            style={{
              WebkitTextStroke: '2px rgba(107, 114, 128, 0.8)',
              color: 'transparent',
              animation: animationComplete || showInitialColor ? 'none' : 'typeWriter 2.5s cubic-bezier(0.4, 0, 0.2, 1) forwards',
              opacity: animationComplete || showInitialColor ? 1 : 0,
            }}
          >
            BEHAVE
          </span>
          
          {/* Initial color reveal - shows once after writing animation */}
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
          
          {/* Interactive hover color layer - only active after initial color shown */}
          {animationComplete && (
            <span 
              className="absolute inset-0 bg-clip-text text-transparent"
              style={{
                backgroundImage: 'linear-gradient(90deg, #ff6b6b 0%, #4ecdc4 33%, #45b7d1 66%, #f7b731 100%)',
                backgroundSize: '200% 100%',
                maskImage: isHovered ? `radial-gradient(circle 220px at ${mousePos.x}px ${mousePos.y}px, black, transparent 55%)` : 'radial-gradient(circle 0px at -1000px -1000px, black, transparent)',
                WebkitMaskImage: isHovered ? `radial-gradient(circle 220px at ${mousePos.x}px ${mousePos.y}px, black, transparent 55%)` : 'radial-gradient(circle 0px at -1000px -1000px, black, transparent)',
                transition: 'none',
              }}
            >
              BEHAVE
            </span>
          )}
        </span>
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
        
        @keyframes fadeIn {
          0% {
            opacity: 0;
            transform: scale(0.98);
          }
          100% {
            opacity: 1;
            transform: scale(1);
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
