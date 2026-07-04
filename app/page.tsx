import Navbar from '@/components/navbar';

import HeroSection from '@/components/hero-section';

import Footer from '@/components/footer';

export default function HomePage() {
  return (
    <main className="bg-slate-950">
      <Navbar />

      <HeroSection />

      <Footer />
    </main>
  );
}