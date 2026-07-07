'use client';

import HeroSection from '@/components/home-sections/hero-section';
import FeaturesSection from '@/components/home-sections/features-section';
import TodayPredictionsPreview from '@/components/home-sections/today-predictions-preview';
import ArticlesPreview from '@/components/home-sections/articles-preview';
import WhyChoose from '@/components/home-sections/why-choose';

export default function HomePage() {
  return (
    <main className="min-h-screen overflow-x-hidden transition-colors duration-300 bg-background text-foreground">

      <HeroSection />
      <FeaturesSection />
      <TodayPredictionsPreview />
      <ArticlesPreview />
      <WhyChoose />
    </main>
  );
}