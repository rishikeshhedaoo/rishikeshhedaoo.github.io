'use client';

import { useState, useCallback, useRef } from 'react';
import dynamic from 'next/dynamic';
import Navigation from '@/components/Navigation';
import StructuredData from '@/components/StructuredData';
import CenterText from '@/components/CenterText';

const ParticleScene = dynamic(() => import('@/components/ParticleScene'), {
  ssr: false,
  loading: () => <div className="w-full h-full bg-black" />,
});

// Section configuration
const sections = [
  { id: 'home', label: 'Home' },
  { id: 'about', label: 'About' },
  { id: 'services', label: 'Services' },
  { id: 'contact', label: 'Contact' },
];

export default function Home() {
  const [animationComplete, setAnimationComplete] = useState(false);
  const [activeSection, setActiveSection] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);

  // For SCALABLE SYSTEMS hover effect
  const [scaleMousePos, setScaleMousePos] = useState({ x: 0, y: 0 });
  const [isScaleHovered, setIsScaleHovered] = useState(false);
  const scaleTextRef = useRef<HTMLDivElement>(null);

  // For Services workflow interaction
  const [selectedService, setSelectedService] = useState<number | null>(null);

  const handleAnimationComplete = useCallback(() => {
    setAnimationComplete(true);
  }, []);

  const handleSectionChange = (index: number) => {
    if (index === activeSection || isTransitioning) return;
    setIsTransitioning(true);
    setTimeout(() => {
      setActiveSection(index);
      setIsTransitioning(false);
    }, 300);
  };

  return (
    <>
      <StructuredData />
      <ParticleScene />
      <Navigation />

      {/* BEHAVE Text with hover animation - stays visible until section is selected */}
      {(!animationComplete || activeSection === 0) && (
        <div
          style={{
            opacity: animationComplete && activeSection !== 0 ? 0 : 1,
            transition: 'opacity 0.5s ease-out',
          }}
        >
          <CenterText
            scrollProgress={0}
            onAnimationComplete={handleAnimationComplete}
          />
        </div>
      )}

      {/* Subtitle below BEHAVE - separate fixed element */}
      {animationComplete && activeSection === 0 && (
        <div
          className="fixed z-15 pointer-events-none"
          style={{
            left: '50%',
            top: '62%',
            transform: 'translateX(-50%)',
            textAlign: 'center',
          }}
        >
          <p
            style={{
              fontFamily: "'Audiowide', sans-serif",
              fontSize: 'clamp(0.65rem, 1vw, 0.85rem)',
              WebkitTextStroke: '1px rgba(107, 114, 128, 0.6)',
              color: 'transparent',
              letterSpacing: '0.4em',
            }}
          >
            BUILD · AUTOMATE · SCALE
          </p>
        </div>
      )}

      {/* Section Content Area */}
      {animationComplete && (
        <main
          className="fixed inset-0 z-10 flex items-center justify-center"
          style={{ pointerEvents: 'none' }}
        >
          <div
            className={`transition-all duration-500 ${isTransitioning ? 'opacity-0 scale-95' : 'opacity-100 scale-100'}`}
            style={{
              maxWidth: '900px',
              width: '100%',
              padding: '2rem',
              pointerEvents: 'auto',
            }}
          >


            {/* About Section - Engaging & Creative */}
            {activeSection === 1 && (
              <div style={{ maxWidth: '900px', margin: '0 auto', textAlign: 'center', position: 'relative' }}>

                {/* Floating decorative lines */}
                <div
                  style={{
                    position: 'absolute',
                    top: '-50px',
                    left: '10%',
                    width: '1px',
                    height: '80px',
                    background: 'linear-gradient(to bottom, transparent, rgba(107, 114, 128, 0.3), transparent)',
                  }}
                />
                <div
                  style={{
                    position: 'absolute',
                    top: '-30px',
                    right: '15%',
                    width: '1px',
                    height: '60px',
                    background: 'linear-gradient(to bottom, transparent, rgba(107, 114, 128, 0.2), transparent)',
                  }}
                />

                {/* Main headline with BEHAVE-style outline */}
                <div style={{ marginBottom: '2rem' }}>
                  <div
                    style={{
                      fontFamily: "'Audiowide', sans-serif",
                      fontSize: 'clamp(1.8rem, 4vw, 2.8rem)',
                      fontWeight: 400,
                      letterSpacing: '0.1em',
                      WebkitTextStroke: '1.2px rgba(107, 114, 128, 0.7)',
                      color: 'transparent',
                      lineHeight: 1.2,
                      marginBottom: '0.3rem',
                    }}
                  >
                    WE BUILD
                  </div>
                  {/* SCALABLE SYSTEMS with BEHAVE-like hover */}
                  <div
                    ref={scaleTextRef}
                    style={{
                      position: 'relative',
                      display: 'inline-block',
                      cursor: 'pointer',
                    }}
                    onMouseMove={(e) => {
                      if (scaleTextRef.current) {
                        const rect = scaleTextRef.current.getBoundingClientRect();
                        setScaleMousePos({
                          x: e.clientX - rect.left,
                          y: e.clientY - rect.top,
                        });
                      }
                    }}
                    onMouseEnter={() => setIsScaleHovered(true)}
                    onMouseLeave={() => setIsScaleHovered(false)}
                  >
                    {/* Base outlined text */}
                    <span
                      style={{
                        fontFamily: "'Audiowide', sans-serif",
                        fontSize: 'clamp(1.8rem, 4vw, 2.8rem)',
                        fontWeight: 400,
                        letterSpacing: '0.1em',
                        WebkitTextStroke: '1.2px rgba(107, 114, 128, 0.7)',
                        color: 'transparent',
                        lineHeight: 1.2,
                      }}
                    >
                      SCALABLE SYSTEMS
                    </span>

                    {/* Gradient overlay revealed on hover */}
                    {isScaleHovered && (
                      <span
                        style={{
                          position: 'absolute',
                          inset: 0,
                          fontFamily: "'Audiowide', sans-serif",
                          fontSize: 'clamp(1.8rem, 4vw, 2.8rem)',
                          fontWeight: 400,
                          letterSpacing: '0.1em',
                          lineHeight: 1.2,
                          background: 'linear-gradient(90deg, #ff6b6b, #4ecdc4, #45b7d1, #f7b731)',
                          backgroundSize: '200% 100%',
                          WebkitBackgroundClip: 'text',
                          color: 'transparent',
                          WebkitMaskImage: `radial-gradient(circle 80px at ${scaleMousePos.x}px ${scaleMousePos.y}px, black 0%, transparent 100%)`,
                          maskImage: `radial-gradient(circle 80px at ${scaleMousePos.x}px ${scaleMousePos.y}px, black 0%, transparent 100%)`,
                        }}
                      >
                        SCALABLE SYSTEMS
                      </span>
                    )}
                  </div>
                </div>

                {/* Engaging description with creative layout */}
                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    gap: '1.5rem',
                    marginBottom: '2rem',
                    flexWrap: 'wrap',
                  }}
                >
                  <span style={{ color: 'rgba(107, 114, 128, 0.4)', fontSize: '1rem' }}>—</span>
                  <p
                    style={{
                      fontFamily: "'Inter', sans-serif",
                      fontSize: 'clamp(0.8rem, 1.1vw, 0.95rem)',
                      color: 'rgba(255, 255, 255, 0.5)',
                      lineHeight: 1.7,
                      maxWidth: '350px',
                    }}
                  >
                    From concept to deployment, we craft digital
                    experiences that evolve with your vision
                  </p>
                  <span style={{ color: 'rgba(107, 114, 128, 0.4)', fontSize: '1rem' }}>—</span>
                </div>

                {/* Interactive stats with spotlight effect */}
                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'center',
                    gap: '3rem',
                    padding: '1.5rem 0',
                  }}
                >
                  {[
                    { num: '50+', label: 'PROJECTS' },
                    { num: '5+', label: 'YEARS' },
                    { num: '30+', label: 'CLIENTS' },
                  ].map((stat, i) => (
                    <div
                      key={i}
                      style={{
                        cursor: 'pointer',
                        transition: 'transform 0.3s ease',
                        position: 'relative',
                      }}
                      onMouseMove={(e) => {
                        const rect = e.currentTarget.getBoundingClientRect();
                        const x = e.clientX - rect.left;
                        const y = e.clientY - rect.top;
                        const overlay = e.currentTarget.querySelector('.stat-overlay') as HTMLElement;
                        if (overlay) {
                          overlay.style.opacity = '1';
                          (overlay.style as any).maskImage = `radial-gradient(circle 60px at ${x}px ${y}px, black 0%, transparent 70%)`;
                          (overlay.style as any).webkitMaskImage = `radial-gradient(circle 60px at ${x}px ${y}px, black 0%, transparent 70%)`;
                        }
                      }}
                      onMouseLeave={(e) => {
                        const overlay = e.currentTarget.querySelector('.stat-overlay') as HTMLElement;
                        if (overlay) overlay.style.opacity = '0';
                        e.currentTarget.style.transform = 'scale(1)';
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.transform = 'scale(1.1)';
                      }}
                    >
                      <div
                        style={{
                          fontFamily: "'Audiowide', sans-serif",
                          fontSize: '1.8rem',
                          WebkitTextStroke: '1px rgba(107, 114, 128, 0.6)',
                          color: 'transparent',
                          transition: 'all 0.3s ease',
                          position: 'relative',
                        }}
                      >
                        {stat.num}
                        {/* Overlay with gradient - revealed by maskImage */}
                        <span
                          className="stat-overlay"
                          style={{
                            position: 'absolute',
                            inset: 0,
                            background: 'linear-gradient(90deg, #ff6b6b 0%, #4ecdc4 33%, #45b7d1 66%, #f7b731 100%)',
                            backgroundSize: '200% 100%',
                            WebkitBackgroundClip: 'text',
                            backgroundClip: 'text',
                            color: 'transparent',
                            opacity: 0,
                            transition: 'opacity 0.2s ease',
                            pointerEvents: 'none',
                          }}
                        >
                          {stat.num}
                        </span>
                      </div>
                      <div
                        style={{
                          fontFamily: "'Audiowide', sans-serif",
                          fontSize: '0.6rem',
                          color: 'rgba(107, 114, 128, 0.5)',
                          letterSpacing: '0.25em',
                          marginTop: '0.5rem',
                        }}
                      >
                        {stat.label}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Services Section - Minimal & Interactive */}
            {activeSection === 2 && (
              <div style={{ maxWidth: '750px', margin: '0 auto', position: 'relative' }}>

                {(() => {
                  // SVG Icons for steps
                  const icons = {
                    search: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><circle cx="11" cy="11" r="8" /><path d="m21 21-4.35-4.35" /></svg>,
                    pencil: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M12 20h9" /><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z" /></svg>,
                    code: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><polyline points="16 18 22 12 16 6" /><polyline points="8 6 2 12 8 18" /></svg>,
                    rocket: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M4.5 16.5c-1.5 1.26-2 5-2 5s3.74-.5 5-2c.71-.84.7-2.13-.09-2.91a2.18 2.18 0 0 0-2.91-.09z" /><path d="m12 15-3-3a22 22 0 0 1 2-3.95A12.88 12.88 0 0 1 22 2c0 2.72-.78 7.5-6 11a22.35 22.35 0 0 1-4 2z" /></svg>,
                    chart: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M3 3v18h18" /><path d="m19 9-5 5-4-4-3 3" /></svg>,
                    layers: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><polygon points="12 2 2 7 12 12 22 7 12 2" /><polyline points="2 17 12 22 22 17" /><polyline points="2 12 12 17 22 12" /></svg>,
                    box: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" /></svg>,
                    check: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><polyline points="20 6 9 17 4 12" /></svg>,
                    globe: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><circle cx="12" cy="12" r="10" /><line x1="2" y1="12" x2="22" y2="12" /><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" /></svg>,
                    bulb: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M9 18h6" /><path d="M10 22h4" /><path d="M15.09 14c.18-.98.65-1.74 1.41-2.5A4.65 4.65 0 0 0 18 8 6 6 0 0 0 6 8c0 1 .23 2.23 1.5 3.5A4.61 4.61 0 0 1 8.91 14" /></svg>,
                    phone: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><rect x="5" y="2" width="14" height="20" rx="2" ry="2" /><line x1="12" y1="18" x2="12.01" y2="18" /></svg>,
                    star: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" /></svg>,
                  };

                  const services = [
                    {
                      num: '01',
                      title: 'AI AUTOMATION',
                      steps: [
                        { name: 'Analyze', icon: icons.search },
                        { name: 'Design', icon: icons.pencil },
                        { name: 'Build', icon: icons.code },
                        { name: 'Deploy', icon: icons.rocket },
                        { name: 'Scale', icon: icons.chart },
                      ]
                    },
                    {
                      num: '02',
                      title: 'SOFTWARE',
                      steps: [
                        { name: 'Plan', icon: icons.layers },
                        { name: 'Prototype', icon: icons.box },
                        { name: 'Develop', icon: icons.code },
                        { name: 'Test', icon: icons.check },
                        { name: 'Launch', icon: icons.globe },
                      ]
                    },
                    {
                      num: '03',
                      title: 'MOBILE APPS',
                      steps: [
                        { name: 'Concept', icon: icons.bulb },
                        { name: 'Design', icon: icons.pencil },
                        { name: 'Build', icon: icons.phone },
                        { name: 'Test', icon: icons.check },
                        { name: 'Release', icon: icons.star },
                      ]
                    },
                  ];

                  // Detail view when service selected
                  if (selectedService !== null) {
                    const service = services[selectedService];
                    return (
                      <div style={{ animation: 'fadeIn 0.3s ease' }}>
                        {/* Back */}
                        <div
                          onClick={() => setSelectedService(null)}
                          style={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '0.5rem',
                            cursor: 'pointer',
                            marginBottom: '2.5rem',
                            fontFamily: "'Audiowide', sans-serif",
                            fontSize: '0.7rem',
                            letterSpacing: '0.15em',
                            color: 'rgba(107, 114, 128, 0.6)',
                            transition: 'color 0.3s ease',
                          }}
                          onMouseEnter={(e) => e.currentTarget.style.color = 'rgba(255, 255, 255, 0.8)'}
                          onMouseLeave={(e) => e.currentTarget.style.color = 'rgba(107, 114, 128, 0.6)'}
                        >
                          ← BACK
                        </div>

                        {/* Decorative floating dots */}
                        <div style={{ position: 'absolute', top: '20%', left: '5%', width: '4px', height: '4px', borderRadius: '50%', background: 'rgba(107, 114, 128, 0.3)', animation: 'pulse 3s ease-in-out infinite' }} />
                        <div style={{ position: 'absolute', top: '60%', right: '8%', width: '3px', height: '3px', borderRadius: '50%', background: 'rgba(107, 114, 128, 0.2)', animation: 'pulse 4s ease-in-out infinite 1s' }} />
                        <div style={{ position: 'absolute', bottom: '25%', left: '12%', width: '2px', height: '2px', borderRadius: '50%', background: 'rgba(107, 114, 128, 0.25)', animation: 'pulse 3.5s ease-in-out infinite 0.5s' }} />

                        {/* Service title with spotlight effect */}
                        <div
                          style={{ textAlign: 'center', marginBottom: '3rem', position: 'relative' }}
                          onMouseMove={(e) => {
                            const rect = e.currentTarget.getBoundingClientRect();
                            const x = e.clientX - rect.left;
                            const y = e.clientY - rect.top;
                            const overlay = e.currentTarget.querySelector('.title-overlay') as HTMLElement;
                            if (overlay) {
                              overlay.style.opacity = '1';
                              (overlay.style as any).maskImage = `radial-gradient(circle 120px at ${x}px ${y}px, black 0%, transparent 70%)`;
                              (overlay.style as any).webkitMaskImage = `radial-gradient(circle 120px at ${x}px ${y}px, black 0%, transparent 70%)`;
                            }
                          }}
                          onMouseLeave={(e) => {
                            const overlay = e.currentTarget.querySelector('.title-overlay') as HTMLElement;
                            if (overlay) overlay.style.opacity = '0';
                          }}
                        >
                          {/* Base outlined text */}
                          <div
                            style={{
                              fontFamily: "'Audiowide', sans-serif",
                              fontSize: 'clamp(1.8rem, 5vw, 2.5rem)',
                              letterSpacing: '0.15em',
                              WebkitTextStroke: '1.2px rgba(107, 114, 128, 0.7)',
                              color: 'transparent',
                              marginBottom: '0.5rem',
                              position: 'relative',
                              cursor: 'default',
                            }}
                          >
                            {service.title}
                            {/* Overlay with gradient - revealed by maskImage */}
                            <span
                              className="title-overlay"
                              style={{
                                position: 'absolute',
                                inset: 0,
                                background: 'linear-gradient(90deg, #ff6b6b 0%, #4ecdc4 33%, #45b7d1 66%, #f7b731 100%)',
                                backgroundSize: '200% 100%',
                                WebkitBackgroundClip: 'text',
                                backgroundClip: 'text',
                                color: 'transparent',
                                opacity: 0,
                                transition: 'opacity 0.2s ease',
                                pointerEvents: 'none',
                              }}
                            >
                              {service.title}
                            </span>
                          </div>
                          <div
                            style={{
                              fontFamily: "'Audiowide', sans-serif",
                              fontSize: '0.65rem',
                              letterSpacing: '0.3em',
                              color: 'rgba(107, 114, 128, 0.5)',
                            }}
                          >
                            OUR PROCESS
                          </div>
                        </div>

                        {/* Interactive workflow - horizontal timeline */}
                        <div style={{ position: 'relative', padding: '2rem 0' }}>
                          {/* Animated pulse ring behind workflow */}
                          <div
                            style={{
                              position: 'absolute',
                              top: '50%',
                              left: '50%',
                              width: '80%',
                              height: '60px',
                              transform: 'translate(-50%, -50%)',
                              border: '1px solid rgba(107, 114, 128, 0.1)',
                              borderRadius: '30px',
                              animation: 'breathe 4s ease-in-out infinite',
                            }}
                          />

                          {/* Connection line */}
                          <div
                            style={{
                              position: 'absolute',
                              top: '50%',
                              left: '5%',
                              right: '5%',
                              height: '1px',
                              background: 'linear-gradient(90deg, transparent, rgba(107, 114, 128, 0.3), transparent)',
                              transform: 'translateY(-50%)',
                            }}
                          />

                          {/* Steps */}
                          <div style={{ display: 'flex', justifyContent: 'space-between', position: 'relative' }}>
                            {service.steps.map((step, idx) => (
                              <div
                                key={idx}
                                style={{
                                  display: 'flex',
                                  flexDirection: 'column',
                                  alignItems: 'center',
                                  opacity: 0,
                                  animation: `slideUp 0.5s ease forwards ${idx * 0.12}s`,
                                  cursor: 'pointer',
                                  transition: 'transform 0.3s ease',
                                }}
                                onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-5px)'}
                                onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}
                              >
                                {/* Step circle with icon */}
                                <div
                                  style={{
                                    width: '48px',
                                    height: '48px',
                                    borderRadius: '50%',
                                    border: '1px solid rgba(107, 114, 128, 0.4)',
                                    background: 'rgba(0, 0, 0, 0.5)',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    marginBottom: '1rem',
                                    transition: 'all 0.3s ease',
                                    color: 'rgba(255, 255, 255, 0.5)',
                                  }}
                                  onMouseEnter={(e) => {
                                    e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.7)';
                                    e.currentTarget.style.boxShadow = '0 0 25px rgba(255, 255, 255, 0.15)';
                                    e.currentTarget.style.color = 'rgba(255, 255, 255, 0.9)';
                                  }}
                                  onMouseLeave={(e) => {
                                    e.currentTarget.style.borderColor = 'rgba(107, 114, 128, 0.4)';
                                    e.currentTarget.style.boxShadow = 'none';
                                    e.currentTarget.style.color = 'rgba(255, 255, 255, 0.5)';
                                  }}
                                >
                                  {step.icon}
                                </div>

                                {/* Step name */}
                                <div
                                  style={{
                                    fontFamily: "'Audiowide', sans-serif",
                                    fontSize: '0.6rem',
                                    letterSpacing: '0.1em',
                                    color: 'rgba(255, 255, 255, 0.5)',
                                    textTransform: 'uppercase',
                                  }}
                                >
                                  {step.name}
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>

                        {/* CTA */}
                        <div style={{ textAlign: 'center', marginTop: '3rem' }}>
                          <a
                            href="mailto:hello@behave.studio"
                            style={{
                              fontFamily: "'Audiowide', sans-serif",
                              fontSize: '0.7rem',
                              letterSpacing: '0.15em',
                              color: 'rgba(107, 114, 128, 0.6)',
                              textDecoration: 'none',
                              transition: 'color 0.3s ease',
                            }}
                            onMouseEnter={(e) => e.currentTarget.style.color = 'rgba(255, 255, 255, 0.8)'}
                            onMouseLeave={(e) => e.currentTarget.style.color = 'rgba(107, 114, 128, 0.6)'}
                          >
                            START PROJECT →
                          </a>
                        </div>
                      </div>
                    );
                  }

                  // Service list view
                  return (
                    <>
                      {/* Header with spotlight effect */}
                      <div
                        style={{ textAlign: 'center', marginBottom: '2.5rem', position: 'relative' }}
                        onMouseMove={(e) => {
                          const rect = e.currentTarget.getBoundingClientRect();
                          const x = e.clientX - rect.left;
                          const y = e.clientY - rect.top;
                          const overlay = e.currentTarget.querySelector('.header-overlay') as HTMLElement;
                          if (overlay) {
                            overlay.style.opacity = '1';
                            (overlay.style as any).maskImage = `radial-gradient(circle 100px at ${x}px ${y}px, black 0%, transparent 70%)`;
                            (overlay.style as any).webkitMaskImage = `radial-gradient(circle 100px at ${x}px ${y}px, black 0%, transparent 70%)`;
                          }
                        }}
                        onMouseLeave={(e) => {
                          const overlay = e.currentTarget.querySelector('.header-overlay') as HTMLElement;
                          if (overlay) overlay.style.opacity = '0';
                        }}
                      >
                        <div
                          style={{
                            fontFamily: "'Audiowide', sans-serif",
                            fontSize: 'clamp(1.3rem, 3.5vw, 2rem)',
                            letterSpacing: '0.12em',
                            WebkitTextStroke: '1px rgba(107, 114, 128, 0.7)',
                            color: 'transparent',
                            position: 'relative',
                            cursor: 'default',
                          }}
                        >
                          WHAT WE BUILD
                          {/* Overlay with gradient - revealed by maskImage */}
                          <span
                            className="header-overlay"
                            style={{
                              position: 'absolute',
                              inset: 0,
                              background: 'linear-gradient(90deg, #ff6b6b 0%, #4ecdc4 33%, #45b7d1 66%, #f7b731 100%)',
                              backgroundSize: '200% 100%',
                              WebkitBackgroundClip: 'text',
                              backgroundClip: 'text',
                              color: 'transparent',
                              opacity: 0,
                              transition: 'opacity 0.2s ease',
                              pointerEvents: 'none',
                            }}
                          >
                            WHAT WE BUILD
                          </span>
                        </div>
                      </div>

                      {/* Service items */}
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '0' }}>
                        {services.map((service, i) => (
                          <div
                            key={i}
                            onClick={() => setSelectedService(i)}
                            style={{
                              display: 'flex',
                              alignItems: 'center',
                              padding: '1.5rem 0',
                              borderBottom: i < services.length - 1 ? '1px solid rgba(107, 114, 128, 0.15)' : 'none',
                              cursor: 'pointer',
                              transition: 'all 0.3s ease',
                            }}
                            onMouseEnter={(e) => {
                              e.currentTarget.style.paddingLeft = '1rem';
                              const num = e.currentTarget.querySelector('.svc-num') as HTMLElement;
                              const title = e.currentTarget.querySelector('.svc-title') as HTMLElement;
                              if (num) num.style.color = 'rgba(255, 255, 255, 0.8)';
                              if (title) title.style.color = 'rgba(255, 255, 255, 0.9)';
                            }}
                            onMouseLeave={(e) => {
                              e.currentTarget.style.paddingLeft = '0';
                              const num = e.currentTarget.querySelector('.svc-num') as HTMLElement;
                              const title = e.currentTarget.querySelector('.svc-title') as HTMLElement;
                              if (num) {
                                num.style.color = 'transparent';
                                (num.style as any).webkitTextStroke = '1px rgba(107, 114, 128, 0.5)';
                              }
                              if (title) title.style.color = 'rgba(255, 255, 255, 0.6)';
                            }}
                          >
                            {/* Number - outlined */}
                            <div
                              className="svc-num"
                              style={{
                                fontFamily: "'Audiowide', sans-serif",
                                fontSize: '1.5rem',
                                WebkitTextStroke: '1px rgba(107, 114, 128, 0.5)',
                                color: 'transparent',
                                minWidth: '60px',
                                transition: 'all 0.3s ease',
                              }}
                            >
                              {service.num}
                            </div>

                            {/* Title */}
                            <div
                              className="svc-title"
                              style={{
                                fontFamily: "'Audiowide', sans-serif",
                                fontSize: 'clamp(0.8rem, 2vw, 1rem)',
                                letterSpacing: '0.12em',
                                color: 'rgba(255, 255, 255, 0.6)',
                                flex: 1,
                                transition: 'color 0.3s ease',
                              }}
                            >
                              {service.title}
                            </div>

                            {/* View steps hint */}
                            <div
                              style={{
                                fontFamily: "'Audiowide', sans-serif",
                                fontSize: '0.6rem',
                                letterSpacing: '0.1em',
                                color: 'rgba(107, 114, 128, 0.4)',
                              }}
                            >
                              {service.steps.length} STEPS →
                            </div>
                          </div>
                        ))}
                      </div>
                    </>
                  );
                })()}

                {/* Animations */}
                <style>{`
                  @keyframes fadeIn {
                    from { opacity: 0; }
                    to { opacity: 1; }
                  }
                  @keyframes slideUp {
                    from {
                      opacity: 0;
                      transform: translateY(20px);
                    }
                    to {
                      opacity: 1;
                      transform: translateY(0);
                    }
                  }
                  @keyframes pulse {
                    0%, 100% { opacity: 0.3; transform: scale(1); }
                    50% { opacity: 0.8; transform: scale(1.5); }
                  }
                  @keyframes breathe {
                    0%, 100% { opacity: 0.1; transform: translate(-50%, -50%) scale(1); }
                    50% { opacity: 0.2; transform: translate(-50%, -50%) scale(1.02); }
                  }
                `}</style>
              </div>
            )}

            {/* Contact Section - Engaging */}
            {activeSection === 3 && (
              <div style={{ textAlign: 'center', position: 'relative' }}>

                {/* Large outlined header */}
                <div style={{ marginBottom: '3rem' }}>
                  <div
                    style={{
                      fontFamily: "'Audiowide', sans-serif",
                      fontSize: 'clamp(2.5rem, 6vw, 4rem)',
                      fontWeight: 400,
                      letterSpacing: '0.1em',
                      WebkitTextStroke: '1.5px rgba(107, 114, 128, 0.7)',
                      color: 'transparent',
                      lineHeight: 1.2,
                    }}
                  >
                    SAY HELLO
                  </div>
                </div>

                {/* Email with engaging hover */}
                <a
                  href="mailto:hello@behave.studio"
                  style={{
                    fontFamily: "'Audiowide', sans-serif",
                    fontSize: 'clamp(1rem, 2vw, 1.4rem)',
                    WebkitTextStroke: '1px rgba(107, 114, 128, 0.5)',
                    color: 'transparent',
                    textDecoration: 'none',
                    letterSpacing: '0.15em',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '1rem',
                    transition: 'all 0.4s ease',
                    cursor: 'pointer',
                  }}
                  onMouseEnter={(e) => {
                    (e.currentTarget.style as any).webkitTextStroke = '0px';
                    e.currentTarget.style.background = 'linear-gradient(90deg, #ff6b6b, #4ecdc4, #45b7d1)';
                    (e.currentTarget.style as any).webkitBackgroundClip = 'text';
                    e.currentTarget.style.color = 'transparent';
                  }}
                  onMouseLeave={(e) => {
                    (e.currentTarget.style as any).webkitTextStroke = '1px rgba(107, 114, 128, 0.5)';
                    e.currentTarget.style.background = 'none';
                    e.currentTarget.style.color = 'transparent';
                  }}
                >
                  hello@behave.studio
                  <span style={{ fontSize: '1.2em', color: 'rgba(107, 114, 128, 0.4)' }}>→</span>
                </a>

                {/* Decorative line below */}
                <div
                  style={{
                    marginTop: '3rem',
                    display: 'flex',
                    justifyContent: 'center',
                  }}
                >
                  <div
                    style={{
                      width: '100px',
                      height: '1px',
                      background: 'linear-gradient(90deg, transparent, rgba(107, 114, 128, 0.3), transparent)',
                    }}
                  />
                </div>
              </div>
            )}
          </div>
        </main >
      )
      }

      {/* Horizontal Navigation - Bottom Left */}
      {
        animationComplete && (
          <nav
            className="fixed z-30"
            style={{
              bottom: '2.5rem',
              left: '3rem',
              display: 'flex',
              flexDirection: 'row',
              alignItems: 'center',
              gap: '2rem',
            }}
          >
            {sections.map((section, index) => (
              <button
                key={section.id}
                onClick={() => handleSectionChange(index)}
                style={{
                  fontFamily: "'Audiowide', sans-serif",
                  fontSize: '0.75rem',
                  letterSpacing: '0.2em',
                  textTransform: 'uppercase',
                  color: activeSection === index ? 'rgba(107, 114, 128, 0.9)' : 'rgba(107, 114, 128, 0.4)',
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  transition: 'all 0.3s ease',
                  position: 'relative',
                  padding: '0.5rem 0',
                }}
                onMouseEnter={(e) => {
                  if (activeSection !== index) {
                    e.currentTarget.style.color = 'rgba(107, 114, 128, 0.7)';
                  }
                }}
                onMouseLeave={(e) => {
                  if (activeSection !== index) {
                    e.currentTarget.style.color = 'rgba(107, 114, 128, 0.4)';
                  }
                }}
              >
                {section.label}
                {/* Active indicator line */}
                <span
                  style={{
                    position: 'absolute',
                    bottom: 0,
                    left: 0,
                    width: activeSection === index ? '100%' : '0%',
                    height: '1px',
                    background: 'rgba(107, 114, 128, 0.6)',
                    transition: 'width 0.3s ease',
                  }}
                />
              </button>
            ))}

            {/* Decorative line after navigation */}
            <div
              style={{
                width: '60px',
                height: '1px',
                background: 'linear-gradient(90deg, rgba(107, 114, 128, 0.4), transparent)',
                marginLeft: '1rem',
              }}
            />
          </nav>
        )
      }

      {/* Decorative corner accent - bottom left */}
      <div
        className="fixed z-10"
        style={{
          bottom: '1.5rem',
          left: '1.5rem',
          width: '20px',
          height: '20px',
          borderLeft: '1px solid rgba(78, 205, 196, 0.3)',
          borderBottom: '1px solid rgba(78, 205, 196, 0.3)',
        }}
      />

      {/* Decorative corner accent - top right */}
      <div
        className="fixed z-10"
        style={{
          top: '1.5rem',
          right: '1.5rem',
          width: '20px',
          height: '20px',
          borderRight: '1px solid rgba(78, 205, 196, 0.3)',
          borderTop: '1px solid rgba(78, 205, 196, 0.3)',
        }}
      />
    </>
  );
}
