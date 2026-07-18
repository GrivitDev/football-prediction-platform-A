import Link from 'next/link';

interface LegalBreadcrumbProps {
  current: string;
}

export default function LegalBreadcrumb({
  current,
}: LegalBreadcrumbProps) {
  return (
    <nav
      className="
        mb-8
        flex
        items-center
        gap-2
        text-sm
        text-muted-foreground
      "
    >
      <Link
        href="/"
        className="
          transition
          hover:text-primary
        "
      >
        Home
      </Link>

      <span>
        /
      </span>

      <span>
        Legal
      </span>

      <span>
        /
      </span>

      <span
        className="
          font-medium
          text-foreground
        "
      >
        {current}
      </span>
    </nav>
  );
}