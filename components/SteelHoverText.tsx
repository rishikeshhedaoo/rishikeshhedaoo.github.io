'use client';

import {
  useState,
  useEffect,
  useRef,
  useId,
  useCallback,
  CSSProperties,
  ElementType,
} from 'react';
import { measureSteelText, SteelTextDims } from './steelTextMetrics';

interface SteelHoverTextProps {
  children: string;
  className?: string;
  style?: CSSProperties;
  strokeWidth?: string;
  strokeColor?: string;
  circleSize?: number;
  hoverPadding?: number;
  as?: 'span' | 'div' | 'a';
  href?: string;
  onClick?: () => void;
  enabled?: boolean;
  scaleOnHover?: boolean;
}

function getResponsiveCircleSize(width: number, override?: number) {
  if (override !== undefined) return override;
  if (width < 640) return 100;
  if (width < 1024) return 140;
  return 180;
}

export default function SteelHoverText({
  children,
  className = '',
  style = {},
  strokeWidth = '1.2px',
  strokeColor = 'rgba(107, 114, 128, 0.7)',
  circleSize: circleSizeProp,
  hoverPadding = 40,
  as: Tag = 'span',
  href,
  onClick,
  enabled = true,
  scaleOnHover = false,
}: SteelHoverTextProps) {
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [isHovered, setIsHovered] = useState(false);
  const [circleSize, setCircleSize] = useState(140);
  const [textDims, setTextDims] = useState<SteelTextDims>({
    width: 0,
    height: 0,
    fontSize: 16,
    textY: 14,
    offsetX: 0,
    offsetY: 0,
    fontFamily: "'Audiowide', 'Orbitron', sans-serif",
    fontWeight: 400,
    letterSpacing: '0.1em',
  });
  const wordRef = useRef<HTMLDivElement>(null);
  const baseTextRef = useRef<HTMLElement>(null);
  const uid = useId().replace(/:/g, '');

  const measureText = useCallback(() => {
    const el = baseTextRef.current;
    const wrapper = wordRef.current;
    if (!el || !wrapper) return;
    setTextDims(measureSteelText(el, wrapper, children));
  }, [children]);

  useEffect(() => {
    const updateCircleSize = () => {
      setCircleSize(getResponsiveCircleSize(window.innerWidth, circleSizeProp));
    };
    updateCircleSize();
    window.addEventListener('resize', updateCircleSize);
    return () => window.removeEventListener('resize', updateCircleSize);
  }, [circleSizeProp]);

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
  }, [measureText, children, style]);

  useEffect(() => {
    if (!enabled) return;

    const handleMouseMove = (e: MouseEvent) => {
      if (!wordRef.current) return;

      const rect = wordRef.current.getBoundingClientRect();
      const isInside =
        e.clientX >= rect.left - hoverPadding &&
        e.clientX <= rect.right + hoverPadding &&
        e.clientY >= rect.top - hoverPadding &&
        e.clientY <= rect.bottom + hoverPadding;

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
  }, [enabled, hoverPadding]);

  const steelAngle = 115 + (mousePos.x / Math.max(textDims.width, 1) - 0.5) * 30;
  const spotX = mousePos.x - textDims.offsetX;
  const spotY = mousePos.y - textDims.offsetY;
  const steelId = `steel-${uid}`;
  const spotId = `spot-${uid}`;
  const maskId = `mask-${uid}`;

  const WrapperTag = Tag as ElementType;
  const wrapperProps: Record<string, unknown> = {
    ref: baseTextRef,
    className: `relative inline-block ${className}`.trim(),
    style: {
      WebkitTextStroke: `${strokeWidth} ${strokeColor}`,
      color: 'transparent',
      cursor: onClick || href ? 'pointer' : 'default',
      transition: scaleOnHover ? 'transform 0.3s ease' : undefined,
      transform: scaleOnHover && isHovered ? 'scale(1.08)' : undefined,
      ...style,
    },
  };

  if (href) wrapperProps.href = href;
  if (onClick) wrapperProps.onClick = onClick;

  return (
    <div ref={wordRef} className="relative inline-block w-fit">
      <WrapperTag {...wrapperProps}>{children}</WrapperTag>

      {enabled && isHovered && textDims.width > 0 && (
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
                }}
              >
                {children}
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
            }}
          >
            {children}
          </text>
        </svg>
      )}
    </div>
  );
}
