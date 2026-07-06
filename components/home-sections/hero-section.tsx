'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import useEmblaCarousel from 'embla-carousel-react';

const getCtaLink = (isLoggedIn: boolean) =>
  isLoggedIn ? '/vip-payment' : '/register';

const slides = [
  {
    bg: 'from-green-500/20 to-blue-500/20',
    title: 'DAILY FOOTBALL PREDICTIONS',
    subtitle:
      'Carefully analyzed match predictions with confidence ratings and betting insights for today’s games.',
    highlight: 'Updated daily before matches',
    cta: { x: 'left-10', y: 'bottom-10' },
  },
  {
    bg: 'from-purple-500/20 to-pink-500/20',
    title: 'VIP EARLY ACCESS (3 DAYS BEFORE)',
    subtitle:
      'VIP members receive predictions up to 3 days before kickoff for maximum betting advantage.',
    highlight: 'Early access advantage',
    cta: { x: 'right-10', y: 'bottom-16' },
  },
  {
    bg: 'from-cyan-500/20 to-green-500/20',
    title: 'MATCH CONFIDENCE RATINGS',
    subtitle:
      'Every prediction includes win, draw, and away confidence levels to guide your betting decisions.',
    highlight: 'Probability-based insights',
    cta: { x: 'left-1/2 -translate-x-1/2', y: 'bottom-12' },
  },
  {
    bg: 'from-orange-500/20 to-red-500/20',
    title: 'TELEGRAM VIP DELIVERY',
    subtitle:
      'VIP predictions are delivered instantly to Telegram — no login needed after subscription.',
    highlight: 'Instant delivery system',
    cta: { x: 'right-16', y: 'top-16' },
  },
];

export default function HeroSection({
  isLoggedIn = false,
}: {
  isLoggedIn?: boolean;
}) {
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true });
  const [selectedIndex, setSelectedIndex] = useState(0);

  useEffect(() => {
    if (!emblaApi) return;

    emblaApi.on('select', () => {
      setSelectedIndex(emblaApi.selectedScrollSnap());
    });
  }, [emblaApi]);

  return (
    <section className="bg-white text-slate-900 dark:bg-slate-950 dark:text-white transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-6 py-16">

        <div className="overflow-hidden rounded-2xl" ref={emblaRef}>
          <div className="flex">

            {slides.map((slide, index) => (
              <div
                key={index}
                className="relative min-w-full h-[540px] flex items-center justify-center overflow-hidden rounded-2xl"
              >
                {/* Gradient */}
                <div
                  className={`absolute inset-0 bg-gradient-to-br ${slide.bg}`}
                />

                {/* Theme overlay */}
                <div className="absolute inset-0 bg-white/75 dark:bg-slate-950/70" />

                {/* Glow */}
                <div className="absolute w-[450px] h-[450px] rounded-full blur-[140px] bg-green-300/40 dark:bg-green-500/20 animate-pulse" />

                {/* Content */}
                <div className="relative z-10 max-w-3xl px-6 text-center">

                  <p className="text-xs tracking-widest text-green-600 dark:text-green-400 animate-pulse">
                    {slide.highlight}
                  </p>

                  <h2 className="mt-4 text-3xl md:text-5xl font-black leading-tight">
                    {slide.title}
                  </h2>

                  <p className="mt-5 text-base md:text-lg text-slate-600 dark:text-slate-300">
                    {slide.subtitle}
                  </p>

                </div>

                {/* CTA */}
                <div className={`absolute z-20 ${slide.cta.x} ${slide.cta.y}`}>
                  <Link
                    href={getCtaLink(isLoggedIn)}
                    className="rounded-xl bg-green-600 px-6 py-3 font-semibold text-white shadow-lg transition hover:bg-green-700"
                  >
                    Get VIP Access
                  </Link>
                </div>
              </div>
            ))}

          </div>
        </div>

        {/* Dots */}
        <div className="mt-5 flex justify-center gap-2">
          {slides.map((_, i) => (
            <div
              key={i}
              className={`h-2 w-2 rounded-full transition ${
                i === selectedIndex
                  ? 'bg-green-500'
                  : 'bg-slate-300 dark:bg-slate-700'
              }`}
            />
          ))}
        </div>

      </div>
    </section>
  );
}