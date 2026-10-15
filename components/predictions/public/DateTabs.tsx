'use client';

import { addCalendarDays, formatDateLabel, getDateKeyInLagos } from './date-utils';

export interface DateTabsProps {
  value: string;
  onChange: (date: string) => void;
  /** Number of earlier dates to show before today. Defaults to 1. */
  pastDays?: number;
  /** Number of future dates to show after today. Defaults to 6. */
  futureDays?: number;
  className?: string;
}

export function DateTabs({
  value,
  onChange,
  pastDays = 1,
  futureDays = 6,
  className = '',
}: DateTabsProps) {
  const today = getDateKeyInLagos();
  const dates = Array.from({ length: pastDays + futureDays + 1 }, (_, index) =>
    addCalendarDays(today, index - pastDays),
  );

  return (
    <div className="w-full overflow-x-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden" role="tablist" aria-label="Select date">
      <div className={`mx-auto flex min-w-full w-max justify-center gap-1 pb-0.5 ${className}`}>
        {dates.map((date) => {
          const active = value === date;
          return (
            <button
              key={date}
              type="button"
              role="tab"
              aria-selected={active}
              onClick={() => onChange(date)}
              className={`shrink-0 rounded-md border px-2 py-1 text-[9px] font-semibold leading-4 transition-colors sm:px-2.5 sm:text-[10px] ${
                active
                  ? 'border-primary bg-primary text-primary-foreground'
                  : 'border-border bg-background text-muted-foreground hover:bg-muted hover:text-foreground'
              }`}
            >
              <span className="block">{formatDateLabel(date, today)}</span>
              {date !== today && <span className="block text-[8px] font-normal opacity-75">{date.slice(5).replace('-', '/')}</span>}
            </button>
          );
        })}
      </div>
    </div>
  );
}

export default DateTabs;
