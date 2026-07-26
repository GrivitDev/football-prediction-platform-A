'use client';

interface DashboardSectionProps {
  children: React.ReactNode;
  className?: string;
}

export function DashboardSection({
  children,
  className = '',
}: DashboardSectionProps) {

  return (

    <section
      className={`
        relative
        w-full
        space-y-5
        sm:space-y-6
        lg:space-y-8
        ${className}
      `}
    >

      {children}

    </section>

  );

}