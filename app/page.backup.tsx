'use client';

import { useState, useEffect, useCallback, useMemo } from 'react';
import dynamic from 'next/dynamic';
import Navigation from '@/components/Navigation';
import StructuredData from '@/components/StructuredData';
import CenterText from '@/components/CenterText';

const ParticleScene = dynamic(() => import('@/components/ParticleScene'), {
  ssr: false,
  loading: () => <div className="w-full h-full bg-black" />,
});

// Section configuration - angles positioned so labels appear on the VISIBLE edge
// Since disc shows its RIGHT side on screen (the part sliding in from left),
// we position labels at angles that put them on the visible portion
const sections = [
  { id: 'home', label: 'Home', angle: 0 },      // 0° = right edge (3 o'clock) - visible
  { id: 'about', label: 'About', angle: 90 },   // 90° = bottom (6 o'clock)
  { id: 'contact', label: 'Contact', angle: 180 }, // 180° = left (9 o'clock) - NOT visible
  { id: 'projects', label: 'Projects', angle: 270 }, // 270° = top (12 o'clock)
];

export default function Home() {
  const [animationComplete, setAnimationComplete] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [rotationProgress, setRotationProgress] = useState(0);
  const [activeSection, setActiveSection] = useState(0);

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

      // Phase 2: After 100vh - disc rotates through sections
      // Each section gets 100vh of scroll, loops infinitely
      if (scrollY > windowHeight) {
        const rotateScroll = scrollY - windowHeight;
        // Continuous rotation - 90deg per 100vh
        const rotation = (rotateScroll / windowHeight) * 90;
        setRotationProgress(rotation);

        // Determine active section based on rotation (loops with modulo)
        // Each 90deg = 1 section, loops back to 0 after 3
        const sectionIndex = Math.floor(rotation / 90) % 4;
        setActiveSection(sectionIndex);
      } else {
        setRotationProgress(0);
        setActiveSection(0);
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();

    return () => window.removeEventListener('scroll', handleScroll);
  }, [animationComplete]);

  // Calculate section transition progress (0-1 for each section)
  const sectionTransition = useMemo(() => {
    const sectionProgress = (rotationProgress % 90) / 90;
    return sectionProgress;
  }, [rotationProgress]);

  // Fade out BEHAVE text as disc slides in and sections approach
  // Fades from 100% at scrollProgress 0 to 0% at scrollProgress 1
  const behaveOpacity = 1 - scrollProgress;

  return (
    <>
      <StructuredData />
      <ParticleScene />
      <Navigation />

      {/* BEHAVE Text - fades out as sections take over */}
      <div style={{ opacity: behaveOpacity, transition: 'opacity 0.3s ease-out' }}>
        <CenterText
          scrollProgress={scrollProgress}
          onAnimationComplete={handleAnimationComplete}
        />
      </div>

      {/* Section Content - appears on right side as disc shows sections */}
      {animationComplete && scrollProgress >= 1 && (
        <div
          className="fixed right-0 top-1/2 z-20 pointer-events-none"
          style={{
            width: '50%',
            transform: 'translateY(-50%)',
            padding: '2rem 4rem',
          }}
        >
          {sections.map((section, index) => {
            // Only show the active section - simple and clean approach
            const isActive = activeSection === index;

            // Simple visibility: 1 when active, 0 otherwise
            // Use sectionTransition for smooth crossfade effect
            let opacity = 0;
            let translateY = 30;

            if (isActive) {
              // Active section is visible
              opacity = 1;
              translateY = 0;
            }

            return (
              <div
                key={section.id}
                className="absolute inset-0 flex flex-col justify-center"
                style={{
                  opacity,
                  transform: `translateY(${translateY}px)`,
                  transition: 'opacity 0.3s ease-out, transform 0.3s ease-out',
                  padding: '2rem 4rem',
                  visibility: opacity > 0 ? 'visible' : 'hidden',
                }}
              >
                <h2
                  style={{
                    fontFamily: "'Audiowide', 'Orbitron', sans-serif",
                    fontSize: 'clamp(2rem, 5vw, 4rem)',
                    fontWeight: 400,
                    letterSpacing: '0.1em',
                    marginBottom: '1.5rem',
                    background: 'linear-gradient(90deg, #ff6b6b, #4ecdc4, #45b7d1)',
                    WebkitBackgroundClip: 'text',
                    backgroundClip: 'text',
                    color: 'transparent',
                  }}
                >
                  {section.label}
                </h2>
                <p
                  style={{
                    fontSize: 'clamp(1rem, 2vw, 1.25rem)',
                    color: 'rgba(156, 163, 175, 0.9)',
                    lineHeight: 1.7,
                    maxWidth: '500px',
                  }}
                >
                  {section.id === 'home' && 'Welcome to my creative space. I build digital experiences that blend art with technology.'}
                  {section.id === 'about' && 'A passionate developer and designer focused on creating immersive web experiences with cutting-edge technologies.'}
                  {section.id === 'contact' && 'Let\'s connect and build something amazing together. Reach out for collaborations or just to say hello.'}
                  {section.id === 'projects' && 'Explore my portfolio of innovative projects spanning web development, creative coding, and interactive design.'}
                </p>
              </div>
            );
          })}
        </div>
      )}

      {/* Disc - slides in from left with section labels */}
      {animationComplete && (
        <div
          className="fixed z-10 pointer-events-none"
          style={{
            left: 0,
            top: '50%',
            transform: `translateX(${-100 + scrollProgress * 45}%) translateY(-50%)`,
          }}
        >
          {/* Rotating disc (rings, spokes, and labels) */}
          <div
            className="relative"
            style={{
              width: '100vh',
              height: '100vh',
              // Disc rotates to show active section at right edge (0 degrees)
              // Each section is 90 degrees apart, so rotate by -activeSection * 90
              // Plus smooth transition within section
              transform: `rotate(${-rotationProgress}deg)`,
              transition: 'transform 0.1s ease-out',
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

            {/* INACTIVE labels - on the disc, rotate with it */}
            {sections.map((section, index) => {
              const isActiveLabel = activeSection === index;

              // Skip the active label - it's rendered separately
              if (isActiveLabel) return null;

              // Other labels: positioned at their fixed angles on the disc
              // They rotate with the disc naturally since they're inside the rotating container
              return (
                <div
                  key={section.id}
                  className="absolute"
                  style={{
                    left: '50%',
                    top: '50%',
                    // Position at this label's angle, move to edge, counter-rotate text
                    transform: `rotate(${section.angle}deg) translateX(42vh) rotate(${-section.angle + rotationProgress}deg)`,
                    transformOrigin: '0 0',
                    opacity: 0.5,
                  }}
                >
                  <span
                    style={{
                      display: 'block',
                      fontFamily: "'Audiowide', 'Orbitron', sans-serif",
                      fontSize: 'clamp(0.9rem, 2vw, 1.3rem)',
                      fontWeight: 400,
                      letterSpacing: '0.2em',
                      textTransform: 'uppercase',
                      color: 'rgba(107, 114, 128, 0.5)',
                      whiteSpace: 'nowrap',
                      transform: 'translate(-50%, -50%)',
                    }}
                  >
                    {section.label}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* ACTIVE label - FIXED at a specific screen position, NOT on the disc */}
      {animationComplete && scrollProgress >= 1 && (
        <div
          className="fixed z-20 pointer-events-none"
          style={{
            // Position this at the visible edge of the disc
            // The disc visible edge is approximately at 37-40vh from left when fully slid in
            // This is where the disc's right side meets the visible viewport
            left: `calc(${-55 + scrollProgress * 45}vh + 92vh)`, // disc left edge + distance to right edge
            top: '50%',
            transform: 'translate(-50%, -50%)',
          }}
        >
          <span
            style={{
              display: 'block',
              fontFamily: "'Audiowide', 'Orbitron', sans-serif",
              fontSize: 'clamp(1.1rem, 2.5vw, 1.6rem)',
              fontWeight: 400,
              letterSpacing: '0.25em',
              textTransform: 'uppercase',
              color: '#4ecdc4',
              textShadow: '0 0 20px rgba(78, 205, 196, 0.6), 0 0 40px rgba(78, 205, 196, 0.3)',
              whiteSpace: 'nowrap',
            }}
          >
            {sections[activeSection].label}
          </span>
        </div>
      )}

      {/* Scroll spacer - very large for infinite scrolling through sections */}
      {animationComplete && (
        <div style={{ height: '2000vh' }} />
      )}
    </>
  );
}

