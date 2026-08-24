'use client';

import HeroCTA from './HeroCTA';

import type {
  HeroSlide,
} from './hero.types';

interface HeroContentProps {
  slide: HeroSlide;

  isLoggedIn: boolean;
}

export default function HeroContent({
  slide,
  isLoggedIn,
}: HeroContentProps) {
  return (
    <div
      className="
        flex
        w-full
        flex-col
        gap-2
        text-slate-900
        dark:text-white
      "
    >
      {/* Badge */}

      <div
        className="
          w-fit
          rounded-full
          border
          border-slate-900/10
          bg-white/60
          px-4
          py-2
          text-sm
          font-semibold
          tracking-[0.25em]
          text-slate-700
          shadow-sm
          backdrop-blur-xl

          dark:border-white/20
          dark:bg-white/10
          dark:text-white/80
        "
      >
        {slide.badge}
      </div>

      {/* Title */}

      <h1
        className="
          max-w-2xl
          text-xl
          font-black
          leading-[1.05]
          tracking-tight
          text-slate-950

          sm:text-3xl

          lg:text-5xl

          dark:text-white
        "
      >
        {slide.title}
      </h1>

      {/* Subtitle */}

      <p
        className="
          max-w-xl
          text-sm
          leading-relaxed
          text-slate-700

          sm:text-base

          lg:text-lg

          dark:text-white/75
        "
      >
        {slide.subtitle}
      </p>

      {/* Button */}

      <div
        className="
          pt-2
        "
      >
        <HeroCTA
          button={slide.button}
          isLoggedIn={isLoggedIn}
        />
      </div>
    </div>
  );
}