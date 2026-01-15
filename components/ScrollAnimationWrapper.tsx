'use client';

import { useState, useEffect, createContext, useContext, ReactNode } from 'react';

interface ScrollContextType {
  scrollProgress: number; // 0 to 1 based on first 100vh of scroll
  animationComplete: boolean;
  setAnimationComplete: (value: boolean) => void;
}

const ScrollContext = createContext<ScrollContextType>({
  scrollProgress: 0,
  animationComplete: false,
  setAnimationComplete: () => {},
});

export const useScrollAnimation = () => useContext(ScrollContext);

interface ScrollAnimationWrapperProps {
  children: ReactNode;
}

export default function ScrollAnimationWrapper({ children }: ScrollAnimationWrapperProps) {
  const [animationComplete, setAnimationComplete] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);

  useEffect(() => {
    if (!animationComplete) return;

    const handleScroll = () => {
      const scrollY = window.scrollY;
      const windowHeight = window.innerHeight;
      const progress = Math.min(scrollY / windowHeight, 1);
      setScrollProgress(progress);
    };

    // Attach scroll listener
    window.addEventListener('scroll', handleScroll, { passive: true });

    // Initial call
    handleScroll();

    return () => window.removeEventListener('scroll', handleScroll);
  }, [animationComplete]);

  return (
    <ScrollContext.Provider value={{ scrollProgress, animationComplete, setAnimationComplete }}>
      <div className="relative">
        {children}

        {/* Scroll spacer - creates scrollable area */}
        {animationComplete && (
          <div
            style={{ height: '300vh' }}
            aria-hidden="true"
          />
        )}
      </div>
    </ScrollContext.Provider>
  );
}
