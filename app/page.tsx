'use client';

import Navbar from '@/components/navbar/navbar';
import HeroSection from '@/components/home-sections/hero-section';
import FeaturesSection from '@/components/home-sections/features-section';
import TodayPredictionsPreview from '@/components/home-sections/today-predictions-preview';
import ArticlesPreview from '@/components/home-sections/articles-preview';
import WhyChoose from '@/components/home-sections/why-choose';
import Footer from '@/components/footer';

import { useTheme } from 'next-themes';

export default function HomePage() {
  const { resolvedTheme } = useTheme();

  const isDark = resolvedTheme === 'dark';

  return (
    <main
      className={`
        min-h-screen overflow-x-hidden transition-colors duration-300
        ${isDark ? 'bg-slate-950 text-white' : 'bg-white text-slate-900'}
      `}
    >
      <Navbar />

      <HeroSection />
      <FeaturesSection />
      <TodayPredictionsPreview />
      <ArticlesPreview />
      <WhyChoose />
      <Footer />
    </main>
  );
}