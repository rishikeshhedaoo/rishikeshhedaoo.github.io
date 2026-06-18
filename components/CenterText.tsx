'use client';

import { useState, useEffect, useRef, useId, useCallback } from 'react';
import { measureSteelText, SteelTextDims } from './steelTextMetrics';

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
  const [textDims, setTextDims] = useState<SteelTextDims>({
    width: 0,
    height: 0,
    fontSize: 48,
    textY: 40,
    offsetX: 0,
    offsetY: 0,
    fontFamily: "'Audiowide', 'Orbitron', sans-serif",
    fontWeight: 400,
    letterSpacing: '0.15em',
    textTransform: 'none',
  });
  const wordRef = useRef<HTMLDivElement>(null);
  const baseTextRef = useRef<HTMLSpanElement>(null);
  const onAnimationCompleteRef = useRef(onAnimationComplete);
  const uid = useId().replace(/:/g, '');

  const textShiftX = scrollProgress * 15;
  const fontScale = 1 - scrollProgress * 0.4;
  const baseFontSize = 12;
  const minFontSize = 3;
  const maxFontSize = 12;
  const scaledFontSize = baseFontSize * fontScale;

  useEffect(() => {
    onAnimationCompleteRef.current = onAnimationComplete;
  }, [onAnimationComplete]);

  const measureText = useCallback(() => {
    const span = baseTextRef.current;
    const wrapper = wordRef.current;
    if (!span || !wrapper) return;
    setTextDims(measureSteelText(span, wrapper, 'BEHAVE'));
  }, []);

  useEffect(() => {
    const colorTimer = setTimeout(() => setShowInitialColor(true), 2500);
    const interactiveTimer = setTimeout(() => {
      setShowInitialColor(false);
      setInternalAnimationComplete(true);
      onAnimationCompleteRef.current?.();
    }, 4200);

    const updateCircleSize = () => {
      const width = window.innerWidth;
      if (width < 640) setCircleSize(120);
      else if (width < 1024) setCircleSize(180);
      else if (width < 1440) setCircleSize(220);
      else setCircleSize(280);
    };

    updateCircleSize();
    window.addEventListener('resize', updateCircleSize);

    return () => {
      clearTimeout(colorTimer);
      clearTimeout(interactiveTimer);
      window.removeEventListener('resize', updateCircleSize);
    };
  }, []);

  useEffect(() => {
    measureText();
    window.addEventListener('resize', measureText);
    const ro = new ResizeObserver(measureText);
    if (wordRef.current) ro.observe(wordRef.current);
    document.fonts.ready.then(measureText);
    return () => {
      window.removeEventListener('resize', measureText);
      ro.disconnect();
    };
  }, [measureText, scaledFontSize]);

  useEffect(() => {
    if (!internalAnimationComplete) return;

    const handleMouseMove = (e: MouseEvent) => {
      if (!wordRef.current) return;

      const rect = wordRef.current.getBoundingClientRect();
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

  const fontStyle = {
    fontFamily: "'Audiowide', 'Orbitron', sans-serif",
    fontWeight: 400,
    fontSize: `clamp(${minFontSize * fontScale}rem, ${scaledFontSize}vw, ${maxFontSize * fontScale}rem)`,
    letterSpacing: '0.15em',
    lineHeight: '1' as const,
  };

  const steelAngle = 115 + (mousePos.x / Math.max(textDims.width, 1) - 0.5) * 30;
  const spotX = mousePos.x - textDims.offsetX;
  const spotY = mousePos.y - textDims.offsetY;
  const steelId = `steel-${uid}`;
  const spotId = `spot-${uid}`;
  const maskId = `mask-${uid}`;

  return (
    <div
      className="fixed inset-0 flex items-center justify-center z-20 pointer-events-none"
      style={{
        padding: 'clamp(1rem, 5vw, 3rem)',
        transform: `translateX(${textShiftX}%)`,
      }}
    >
      <div
        className="pointer-events-auto cursor-pointer select-none uppercase"
        style={fontStyle}
      >
        <div ref={wordRef} className="relative inline-block w-fit">
          {/* Base outline text */}
          <span
            ref={baseTextRef}
            data-behave-text
            className="relative inline-block"
            style={{
              WebkitTextStroke: '2px rgba(107, 114, 128, 0.8)',
              color: 'transparent',
              animation:
                internalAnimationComplete || showInitialColor
                  ? 'none'
                  : 'typeWriter 2.5s cubic-bezier(0.4, 0, 0.2, 1) forwards',
              opacity: internalAnimationComplete || showInitialColor ? 1 : 0,
            }}
          >
            BEHAVE
          </span>

          {/* Initial metallic shine — clipped to letter fill only */}
          {showInitialColor && (
            <span
              className="absolute left-0 top-0 pointer-events-none whitespace-nowrap"
              style={{
                backgroundImage: `linear-gradient(
                  135deg,
                  #2a2a2e 0%,
                  #868690 30%,
                  #ececee 48%,
                  #ffffff 52%,
                  #94949c 74%,
                  #343438 100%
                )`,
                backgroundSize: '200% 100%',
                WebkitBackgroundClip: 'text',
                backgroundClip: 'text',
                color: 'transparent',
                animation: 'fadeInOut 1.7s cubic-bezier(0.4, 0, 0.2, 1) forwards',
              }}
            >
              BEHAVE
            </span>
          )}

          {/* Steel fill on hover — SVG mask follows letter shapes only */}
          {internalAnimationComplete && isHovered && textDims.width > 0 && (
            <svg
              className="absolute pointer-events-none overflow-visible"
              style={{ left: textDims.offsetX, top: textDims.offsetY }}
              width={textDims.width}
              height={textDims.height}
              aria-hidden
            >
              <defs>
                <linearGradient
                  id={steelId}
                  gradientUnits="userSpaceOnUse"
                  x1="0"
                  y1="0"
                  x2={textDims.width}
                  y2={textDims.height}
                  gradientTransform={`rotate(${steelAngle} ${textDims.width / 2} ${textDims.height / 2})`}
                >
                  <stop offset="0%" stopColor="#2a2a2e" />
                  <stop offset="14%" stopColor="#52525a" />
                  <stop offset="26%" stopColor="#868690" />
                  <stop offset="38%" stopColor="#c4c4ca" />
                  <stop offset="48%" stopColor="#ececee" />
                  <stop offset="52%" stopColor="#ffffff" />
                  <stop offset="62%" stopColor="#d0d0d6" />
                  <stop offset="74%" stopColor="#94949c" />
                  <stop offset="86%" stopColor="#5a5a62" />
                  <stop offset="100%" stopColor="#343438" />
                </linearGradient>

                <radialGradient
                  id={spotId}
                  cx={spotX}
                  cy={spotY}
                  r={circleSize}
                  gradientUnits="userSpaceOnUse"
                >
                  <stop offset="0%" stopColor="white" />
                  <stop offset="65%" stopColor="white" stopOpacity="0.4" />
                  <stop offset="100%" stopColor="white" stopOpacity="0" />
                </radialGradient>

                <mask id={maskId} maskUnits="userSpaceOnUse">
                  <text
                    x="0"
                    y={textDims.textY}
                    dominantBaseline="alphabetic"
                    fill={`url(#${spotId})`}
                    style={{
                      fontFamily: textDims.fontFamily,
                      fontSize: textDims.fontSize,
                      fontWeight: textDims.fontWeight,
                      letterSpacing: textDims.letterSpacing,
                      textTransform: textDims.textTransform,
                    }}
                  >
                    BEHAVE
                  </text>
                </mask>
              </defs>

              <text
                x="0"
                y={textDims.textY}
                dominantBaseline="alphabetic"
                fill={`url(#${steelId})`}
                mask={`url(#${maskId})`}
                style={{
                  fontFamily: textDims.fontFamily,
                  fontSize: textDims.fontSize,
                  fontWeight: textDims.fontWeight,
                  letterSpacing: textDims.letterSpacing,
                  textTransform: textDims.textTransform,
                }}
              >
                BEHAVE
              </text>
            </svg>
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
