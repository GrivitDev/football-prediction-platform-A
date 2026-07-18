import { ReactNode } from 'react';

interface LegalSectionProps {
  id?: string;
  title: string;
  children: ReactNode;
}

export default function LegalSection({
  id,
  title,
  children,
}: LegalSectionProps) {

  const sectionId =
    id ||
    title
      .toLowerCase()
      .replace(/\s+/g, '-');

  return (
    <section
      id={sectionId}
      className="
        scroll-mt-24
        mb-6
      "
    >

      <h2
        className="
          text-lg
          font-semibold
          tracking-tight
          text-white
          lg:text-xl
        "
      >
        {title}
      </h2>


      <div
        className="
          prose
          prose-invert
          mt-2
          max-w-none
          prose-p:leading-7
          prose-li:leading-7
        "
      >
        {children}
      </div>

    </section>
  );
}