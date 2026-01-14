import dynamic from 'next/dynamic';
import Navigation from '@/components/Navigation';
import CenterText from '@/components/CenterText';
import StructuredData from '@/components/StructuredData';

// Dynamically import Three.js component with no SSR
const ParticleScene = dynamic(() => import('@/components/ParticleScene'), {
  ssr: false,
  loading: () => <div className="w-full h-full bg-black" />,
});

export default function Home() {
  return (
    <>
      <StructuredData />
      <ParticleScene />
      <Navigation />
      <CenterText />
    </>
  );
}
