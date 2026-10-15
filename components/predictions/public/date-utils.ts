export const SPORTS_TIME_ZONE = 'Africa/Lagos';

export function getDateKeyInLagos(date = new Date()): string {
  const parts = new Intl.DateTimeFormat('en-CA', {
    timeZone: SPORTS_TIME_ZONE,
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  }).formatToParts(date);

  const part = (type: string) => parts.find((item) => item.type === type)?.value ?? '';
  return `${part('year')}-${part('month')}-${part('day')}`;
}

export function addCalendarDays(dateKey: string, amount: number): string {
  const date = new Date(`${dateKey}T12:00:00.000Z`);
  date.setUTCDate(date.getUTCDate() + amount);
  return `${date.getUTCFullYear()}-${String(date.getUTCMonth() + 1).padStart(2, '0')}-${String(date.getUTCDate()).padStart(2, '0')}`;
}

/** Converts a Nigeria-local calendar day into the UTC bounds expected by /sports. */
export function getLagosDayRange(dateKey: string): { from: string; to: string } {
  const start = new Date(`${dateKey}T00:00:00.000+01:00`);
  const nextDate = addCalendarDays(dateKey, 1);
  const end = new Date(`${nextDate}T00:00:00.000+01:00`);
  return { from: start.toISOString(), to: end.toISOString() };
}

export function formatDateLabel(dateKey: string, todayKey = getDateKeyInLagos()): string {
  if (dateKey === todayKey) return 'Today';
  if (dateKey === addCalendarDays(todayKey, -1)) return 'Yesterday';
  if (dateKey === addCalendarDays(todayKey, 1)) return 'Tomorrow';

  const parsed = new Date(`${dateKey}T12:00:00.000Z`);
  return new Intl.DateTimeFormat('en-GB', {
    weekday: 'short',
    day: 'numeric',
    month: 'short',
    timeZone: SPORTS_TIME_ZONE,
  }).format(parsed);
}

export function formatDateTime(value?: string | null): string {
  if (!value) return '—';
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return '—';
  return new Intl.DateTimeFormat('en-GB', {
    timeZone: SPORTS_TIME_ZONE,
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  }).format(date);
}

export function formatShortDate(value?: string | null): string {
  if (!value) return '—';
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return '—';
  return new Intl.DateTimeFormat('en-GB', {
    timeZone: SPORTS_TIME_ZONE,
    day: '2-digit',
    month: 'short',
  }).format(date);
}

export function dateKeyInLagos(value?: string | null): string | null {
  if (!value) return null;
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return null;
  return getDateKeyInLagos(date);
}
