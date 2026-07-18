import Image from 'next/image';

interface LegalHeroProps {
  title: string;
  description: string;
  lastUpdated: string;
  readingTime: string;
}

export default function LegalHero({
  title,
  description,
  lastUpdated,
  readingTime,
}: LegalHeroProps) {
  return (
    <section className="mb-10 text-center">

      <div className="mb-1 flex justify-center">
        <Image
          src="/logo.png"
          alt="Football Prediction Platform"
          width={150}
          height={90}
          className="object-contain"
          priority
        />
      </div>


      <span className="glass-chip text-1xl">
        LEGAL CENTER
      </span>


      <h1
        className="
          mt-4
          text-2xl
          font-black
          tracking-tight
          lg:text-3xl
        "
      >
        {title}
      </h1>


      <p
        className="
          mx-auto
          mt-3
          max-w-2xl
          text-base
          leading-7
          text-muted-foreground
          lg:text-lg
        "
      >
        {description}
      </p>


      <div
        className="
          mt-6
          flex
          justify-center
        "
      >

        <div
          className="
            glass-card
            flex
            items-center
            gap-4
            px-5
            py-3
          "
        >

          <div>
            <p className="text-xs uppercase tracking-widest opacity-60">
              Last Updated
            </p>

            <p className="mt-1 font-semibold">
              {lastUpdated}
            </p>
          </div>


          <span className="h-8 w-px bg-border" />


          <div>
            <p className="text-xs uppercase tracking-widest opacity-60">
              Reading Time
            </p>

            <p className="mt-1 font-semibold">
              {readingTime}
            </p>
          </div>

        </div>

      </div>

    </section>
  );
}