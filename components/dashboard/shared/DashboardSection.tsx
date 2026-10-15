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
        w-full
        ${className}
      `}
    >
      {children}
    </section>
  );
}