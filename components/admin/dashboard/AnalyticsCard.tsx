import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { CircleHelp } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import type { ReactNode } from 'react';

interface Props {
  title: string;
  children: ReactNode;
  description?: string;
  icon?: LucideIcon;
  highlight?: boolean;
}

export default function AnalyticsCard({
  title,
  children,
  description,
  icon: Icon,
  highlight = false,
}: Props) {
  const SafeIcon = Icon ?? CircleHelp;

  return (
    <Card
      className={`surface-card min-w-0 gap-0 overflow-hidden rounded-lg py-0 shadow-none ${
        highlight ? 'border-primary/30' : ''
      }`}
    >
      <CardHeader className="flex min-w-0 flex-row items-center justify-between gap-2 px-3 py-2">
        <CardTitle className="truncate text-[10px] font-medium leading-3 text-muted-foreground">
          {title}
        </CardTitle>
        <SafeIcon size={13} aria-hidden="true" className="shrink-0 text-primary" />
      </CardHeader>

      <CardContent className="min-w-0 space-y-1 px-3 pb-2.5 pt-0">
        {children}
        {description && (
          <p className="text-[9px] leading-3 text-muted-foreground">
            {description}
          </p>
        )}
      </CardContent>
    </Card>
  );
}
