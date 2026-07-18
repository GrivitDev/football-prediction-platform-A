import Link from 'next/link';
import { ArrowLeft, ArrowRight } from 'lucide-react';

interface Props {
  previous?: {
    title: string;
    href: string;
  };

  next?: {
    title: string;
    href: string;
  };
}

export default function LegalFooterNavigation({
  previous,
  next,
}: Props) {
  return (
    <div className="mt-20 flex justify-between gap-6">
      {previous ? (
        <Link
          href={previous.href}
          className="glass-card flex items-center gap-3 rounded-2xl px-6 py-4 transition hover:scale-[1.02]"
        >
          <ArrowLeft className="h-5 w-5" />

          <div>
            <p className="text-xs uppercase text-muted-foreground">
              Previous
            </p>

            <p className="font-semibold">
              {previous.title}
            </p>
          </div>
        </Link>
      ) : (
        <div />
      )}

      {next && (
        <Link
          href={next.href}
          className="glass-card flex items-center gap-3 rounded-2xl px-6 py-4 transition hover:scale-[1.02]"
        >
          <div className="text-right">
            <p className="text-xs uppercase text-muted-foreground">
              Next
            </p>

            <p className="font-semibold">
              {next.title}
            </p>
          </div>

          <ArrowRight className="h-5 w-5" />
        </Link>
      )}
    </div>
  );
}