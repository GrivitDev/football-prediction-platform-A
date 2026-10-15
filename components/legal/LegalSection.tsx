'use client';

import { useEffect, type ReactNode } from 'react';
import { cn } from '@/lib/utils';
import { useLegalAccordion, useLegalSectionPrefix } from './LegalAccordionContext';

interface LegalSectionProps {
  id?: string;
  title: string;
  children: ReactNode;
}

export default function LegalSection({ id, title, children }: LegalSectionProps) {
  const { openId, setOpenId } = useLegalAccordion();
  const prefix = useLegalSectionPrefix();
  const sectionId = `${prefix}-${id || title.toLowerCase().replace(/[^a-z0-9]+/g, '-')}`;
  const opened = openId === sectionId;

  useEffect(() => {
    const openRequestedSection = () => {
      if (window.location.hash === `#${sectionId}`) setOpenId(sectionId);
    };
    openRequestedSection();
    window.addEventListener('hashchange', openRequestedSection);
    return () => window.removeEventListener('hashchange', openRequestedSection);
  }, [sectionId, setOpenId]);

  return (
    <section id={sectionId} className="scroll-mt-20 border-b border-border last:border-b-0">
      <h3>
        <button
          type="button"
          aria-expanded={opened}
          aria-controls={`${sectionId}-content`}
          onClick={() => setOpenId(opened ? null : sectionId)}
          className="flex w-full items-center justify-between gap-3 py-3 text-left text-[13px] font-medium leading-5 text-foreground transition-colors hover:text-foreground/70 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring sm:text-sm"
        >
          <span>{title}</span>
          <span
            aria-hidden="true"
            className={cn(
              'flex h-4 w-4 shrink-0 items-center justify-center text-sm font-normal text-muted-foreground transition-transform',
              opened && 'rotate-180',
            )}
          >
            ⌄
          </span>
        </button>
      </h3>
      {opened && (
        <div
          id={`${sectionId}-content`}
          className="legal-prose max-w-none pb-4 text-[13px] leading-5 text-muted-foreground sm:text-sm [&_p]:mb-2 [&_p]:leading-5 [&_ul]:my-2 [&_ul]:space-y-1 [&_ul]:pl-5 [&_ol]:my-2 [&_ol]:space-y-1 [&_ol]:pl-5 [&_li]:leading-5 [&_strong]:font-semibold [&_strong]:text-foreground [&_a]:underline [&_a]:underline-offset-2"
        >
          {children}
        </div>
      )}
    </section>
  );
}
