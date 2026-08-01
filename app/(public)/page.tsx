'use client';

import HeroSection from '@/components/home-sections/hero/HeroSection';
import FeaturesSection from '@/components/home-sections/features/FeaturesSection';
import ArticlesPreview from '@/components/home-sections/articles-preview';
import CommunityPreviewSection from '@/components/home-sections/community-preview/CommunityPreviewSection';
import PredictionPreview from '@/components/home-sections/PredictionsPreview';

export default function HomePage() {
  return (
    <main className="min-h-screen overflow-x-hidden transition-colors duration-300 bg-background text-foreground">

      <HeroSection />
      <FeaturesSection />
      <PredictionPreview />
      <ArticlesPreview />
      <CommunityPreviewSection/>
    </main>
  );
}