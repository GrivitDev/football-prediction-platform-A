import { ReactNode } from 'react';

interface LegalContainerProps {
  children: ReactNode;
}

export default function LegalContainer({
  children,
}: LegalContainerProps) {
  return (
    <div className="mx-auto w-full max-w-5xl px-6 py-20 lg:px-8">
      {children}
    </div>
  );
}