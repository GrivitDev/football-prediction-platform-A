'use client';

import { useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import type { ActiveCompetition, CompetitionPriority } from '@/types/sports';

export interface LeagueOption {
  /** Value passed back to the owning table; may be a competition ID or a prediction league code. */
  id: string;
  /** Full competition name, used for tooltips and screen readers. */
  label: string;
  /** Short display code, such as PL, ARG, PD or UCL. */
  code?: string;
  priority?: CompetitionPriority | string;
  /** Marks the aggregate All option. */
  isAll?: boolean;
}

export interface LeagueSelectorProps {
  leagues: LeagueOption[];
  /** In multiple mode an empty selection, or the All id, represents all leagues. */
  selectedIds: string[];
  onChange: (selectedIds: string[]) => void;
  multiple?: boolean;
  className?: string;
}

interface MenuPosition {
  top: number;
  left: number;
  width: number;
  maxHeight: number;
}

const PRIORITY_ORDER: Record<string, number> = {
  ELITE: 0,
  HIGH: 1,
  REGIONAL: 2,
  SELECTIVE: 3,
};

const PRIORITY_LABELS: Record<string, string> = {
  ELITE: 'Elite',
  HIGH: 'High',
  REGIONAL: 'Regional',
  SELECTIVE: 'Selective',
};

const ESPN_LEAGUE_CODES: Record<string, string> = {
  'eng.1': 'PL', 'eng.2': 'CH', 'esp.1': 'PD', 'ita.1': 'SA', 'ger.1': 'BL',
  'fra.1': 'L1', 'ned.1': 'ERE', 'por.1': 'PPL', 'sco.1': 'SPL', 'bel.1': 'BPL',
  'tur.1': 'TSL', 'nga.1': 'NPFL', 'rsa.1': 'PSL', 'bra.1': 'BSA', 'arg.1': 'ARG',
  'mex.1': 'LMX', 'usa.1': 'MLS', 'ksa.1': 'SPL-SA', 'uefa.champions': 'UCL',
  'uefa.europa': 'UEL', 'uefa.europa.conf': 'UECL', 'caf.champions': 'CAFCL',
  'caf.confed': 'CAFCC', 'conmebol.libertadores': 'LIB', 'conmebol.sudamericana': 'SUDAM',
  'fifa.world': 'WC', 'fifa.worldq': 'WCQ', 'caf.nations': 'AFCON',
  'caf.nations_qual': 'AFCONQ', 'uefa.euro': 'EURO', 'uefa.euroq': 'EUROQ',
  'uefa.nations': 'UNL', 'conmebol.america': 'CA', 'concacaf.gold': 'GOLD',
  'concacaf.nations.league': 'CNL', 'afc.asian.cup': 'AFC',
};

function normalizeCode(value: string | undefined): string {
  return (value ?? '').trim().toUpperCase().replace(/[^A-Z0-9]/g, '');
}

function priorityOrder(priority?: string): number {
  return PRIORITY_ORDER[(priority ?? '').toUpperCase()] ?? 4;
}

export function getCompetitionCode(competition: ActiveCompetition): string {
  if (competition.footballDataCode?.trim()) return competition.footballDataCode.trim().toUpperCase();
  const slug = competition.espnLeagueSlug || competition.competitionId;
  const mapped = ESPN_LEAGUE_CODES[slug.toLowerCase()];
  if (mapped) return mapped;
  const payload = competition.espnPayload;
  if (payload && typeof payload === 'object') {
    const abbreviation = (payload as Record<string, unknown>).abbreviation;
    if (typeof abbreviation === 'string' && abbreviation.trim()) return abbreviation.trim().toUpperCase();
  }
  return slug.split('.').map((part) => part.slice(0, 4)).join('').toUpperCase() || competition.competitionId.toUpperCase();
}

export function getCompetitionOptions(competitions: ActiveCompetition[]): LeagueOption[] {
  return sortLeagueOptions(competitions.map((competition) => ({
    id: competition.competitionId,
    label: competition.name,
    code: getCompetitionCode(competition),
    priority: competition.priority,
  })));
}

export function getCompetitionForCode(code: string | undefined, competitions: ActiveCompetition[]): ActiveCompetition | undefined {
  const wanted = normalizeCode(code);
  if (!wanted) return undefined;
  return competitions.find((competition) => [
    competition.competitionId,
    competition.espnLeagueSlug,
    competition.footballDataCode,
    getCompetitionCode(competition),
  ].some((candidate) => normalizeCode(candidate) === wanted));
}

export function getCodeLeagueOptions(codes: string[], competitions: ActiveCompetition[]): LeagueOption[] {
  const uniqueCodes = [...new Set(codes.map((code) => code.trim()).filter(Boolean))];
  return sortLeagueOptions(uniqueCodes.map((code) => {
    const competition = getCompetitionForCode(code, competitions);
    const knownCode = competition ? getCompetitionCode(competition) : ESPN_LEAGUE_CODES[code.toLowerCase()];
    return {
      id: code,
      label: competition?.name ?? code.toUpperCase(),
      code: knownCode ?? code.toUpperCase(),
      priority: competition?.priority ?? 'SELECTIVE',
    };
  }));
}

export function sortLeagueOptions(leagues: LeagueOption[]): LeagueOption[] {
  return leagues.slice().sort((a, b) => {
    if (a.isAll) return b.isAll ? 0 : -1;
    if (b.isAll) return 1;
    const priorityDifference = priorityOrder(a.priority) - priorityOrder(b.priority);
    if (priorityDifference !== 0) return priorityDifference;
    return (a.code ?? a.label).localeCompare(b.code ?? b.label);
  });
}

function visibleLeagueWindow(leagues: LeagueOption[], selectedId: string): LeagueOption[] {
  const allOption = leagues.find((league) => league.isAll);
  const individualLeagues = leagues.filter((league) => !league.isAll);

  if (!allOption) {
    const count = Math.min(7, individualLeagues.length);
    if (count === 0) return [];
    const selectedIndex = Math.max(0, individualLeagues.findIndex((league) => league.id === selectedId));
    const start = individualLeagues.length <= 7 ? selectedIndex - Math.floor(count / 2) : selectedIndex - 3;
    return Array.from({ length: count }, (_, offset) =>
      individualLeagues[(start + offset + individualLeagues.length * 2) % individualLeagues.length],
    );
  }

  const count = Math.min(6, individualLeagues.length);
  if (count === 0) return [allOption];
  if (individualLeagues.length <= 6) return [allOption, ...individualLeagues];
  const requestedIndex = individualLeagues.findIndex((league) => league.id === selectedId);
  const selectedIndex = requestedIndex >= 0 ? requestedIndex : 0;
  const start = selectedId === allOption.id ? 0 : selectedIndex - 2;
  return [
    allOption,
    ...Array.from({ length: count }, (_, offset) =>
      individualLeagues[(start + offset + individualLeagues.length * 2) % individualLeagues.length],
    ),
  ];
}

export function LeagueSelector({
  leagues,
  selectedIds,
  onChange,
  multiple = false,
  className = '',
}: LeagueSelectorProps) {
  const [moreOpen, setMoreOpen] = useState(false);
  const [menuPosition, setMenuPosition] = useState<MenuPosition | null>(null);
  const rootRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);

  const orderedLeagues = useMemo(() => sortLeagueOptions(leagues), [leagues]);
  const allOption = orderedLeagues.find((league) => league.isAll);
  const selectedLeagueIds = selectedIds.filter((id) => orderedLeagues.some((league) => !league.isAll && league.id === id));
  const allSelected = Boolean(allOption && (selectedIds.includes(allOption.id) || (multiple && selectedLeagueIds.length === 0)));
  const selectedId = allSelected
    ? allOption?.id ?? ''
    : selectedLeagueIds[0] ?? orderedLeagues.find((league) => selectedIds.includes(league.id))?.id ?? orderedLeagues[0]?.id ?? '';
  const visibleLeagues = useMemo(() => visibleLeagueWindow(orderedLeagues, selectedId), [orderedLeagues, selectedId]);

  useEffect(() => {
    if (!moreOpen) return;
    const handlePointerDown = (event: PointerEvent) => {
      const target = event.target;
      if (!(target instanceof Node)) return;
      if (rootRef.current?.contains(target) || menuRef.current?.contains(target)) return;
      setMoreOpen(false);
    };
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setMoreOpen(false);
    };
    document.addEventListener('pointerdown', handlePointerDown);
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('pointerdown', handlePointerDown);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [moreOpen]);

  // Render the overflow menu in document.body so table wrappers, rounded
  // sections and stacking contexts cannot clip it or cover it.
  useLayoutEffect(() => {
    if (!moreOpen || !triggerRef.current) return;
    const updatePosition = () => {
      const rect = triggerRef.current?.getBoundingClientRect();
      if (!rect) return;
      const gutter = 8;
      const width = Math.min(288, Math.max(240, window.innerWidth - gutter * 2));
      const left = Math.min(Math.max(gutter, rect.left + rect.width / 2 - width / 2), window.innerWidth - width - gutter);
      const below = window.innerHeight - rect.bottom - gutter;
      const above = rect.top - gutter;
      const openAbove = below < 220 && above > below;
      const maxHeight = Math.min(288, Math.max(120, (openAbove ? above : below) - 8));
      const top = openAbove ? Math.max(gutter, rect.top - maxHeight - 6) : rect.bottom + 6;
      setMenuPosition({ top, left, width, maxHeight });
    };
    updatePosition();
    window.addEventListener('resize', updatePosition);
    window.addEventListener('scroll', updatePosition, true);
    return () => {
      window.removeEventListener('resize', updatePosition);
      window.removeEventListener('scroll', updatePosition, true);
    };
  }, [moreOpen]);

  const groups = useMemo(() => {
    const individual = orderedLeagues.filter((league) => !league.isAll);
    const priorityKeys = ['ELITE', 'HIGH', 'REGIONAL', 'SELECTIVE'];
    return priorityKeys.map((priority) => ({
      priority,
      label: PRIORITY_LABELS[priority],
      leagues: individual.filter((league) => (league.priority ?? '').toUpperCase() === priority),
    })).filter((group) => group.leagues.length > 0).concat(
      individual.some((league) => priorityOrder(league.priority) === 4)
        ? [{ priority: 'OTHER', label: 'Other', leagues: individual.filter((league) => priorityOrder(league.priority) === 4) }]
        : [],
    );
  }, [orderedLeagues]);

  if (orderedLeagues.length === 0) return null;

  const handleLeagueChange = (league: LeagueOption) => {
    if (league.isAll) {
      onChange([league.id]);
      setMoreOpen(false);
      return;
    }
    if (!multiple) {
      onChange([league.id]);
      setMoreOpen(false);
      return;
    }
    const current = allSelected ? [] : selectedLeagueIds;
    const next = current.includes(league.id)
      ? current.filter((id) => id !== league.id)
      : [...current, league.id];
    onChange(next.length > 0 ? next : allOption ? [allOption.id] : []);
  };

  const menu = moreOpen && menuPosition && typeof document !== 'undefined'
    ? createPortal(
        <div
          ref={menuRef}
          role="listbox"
          aria-label="Choose leagues"
          aria-multiselectable={multiple}
          className="fixed z-[10050] overflow-y-auto rounded-lg border border-border bg-card p-2 text-left shadow-2xl"
          style={{ top: menuPosition.top, left: menuPosition.left, width: menuPosition.width, maxHeight: menuPosition.maxHeight }}
        >
          <p className="px-2 pb-1.5 text-[10px] text-muted-foreground">Choose a league</p>
          {allOption && (
            <button
              type="button"
              role="option"
              aria-selected={allSelected}
              onClick={() => handleLeagueChange(allOption)}
              className={`mb-1.5 flex w-full items-center gap-2 rounded-md border-b border-border/60 px-2 py-2 text-left text-[11px] transition-colors ${allSelected ? 'bg-primary/10 font-semibold text-primary' : 'text-foreground hover:bg-muted'}`}
            >
              <span className="w-12 shrink-0 font-bold">ALL</span>
              <span className="min-w-0 flex-1">All leagues</span>
              {allSelected && <span aria-hidden="true" className="text-primary">✓</span>}
            </button>
          )}
          {groups.map((group) => (
            <div key={group.priority} className="mb-1.5 last:mb-0">
              <p className="sticky top-0 bg-card px-2 py-1 text-[9px] font-bold uppercase tracking-wider text-muted-foreground">{group.label}</p>
              {group.leagues.map((league) => {
                const active = multiple ? selectedLeagueIds.includes(league.id) : selectedId === league.id;
                return (
                  <button
                    key={league.id}
                    type="button"
                    role="option"
                    aria-selected={active}
                    onClick={() => handleLeagueChange(league)}
                    className={`flex w-full items-center gap-2 rounded-md px-2 py-1.5 text-left text-[11px] transition-colors ${active ? 'bg-primary/10 font-semibold text-primary' : 'text-foreground hover:bg-muted'}`}
                  >
                    <span className="w-12 shrink-0 font-bold">{league.code || league.label.slice(0, 4).toUpperCase()}</span>
                    <span className="min-w-0 flex-1 truncate">{league.label}</span>
                    {active && <span aria-hidden="true" className="text-primary">✓</span>}
                  </button>
                );
              })}
            </div>
          ))}
        </div>,
        document.body,
      )
    : null;

  const showMore = orderedLeagues.length > 7;

  return (
    <div ref={rootRef} className={`relative flex w-full justify-center ${className}`}>
      <div className="flex max-w-full flex-wrap items-center justify-center gap-1" aria-label={multiple ? 'Select leagues' : 'Select one league'}>
        {visibleLeagues.map((league) => {
          const active = league.isAll ? allSelected : multiple ? selectedLeagueIds.includes(league.id) : selectedId === league.id;
          return (
            <button
              key={league.id}
              type="button"
              aria-pressed={active}
              aria-label={`Select ${league.label}`}
              title={league.priority ? `${league.label} · ${league.priority}` : league.label}
              onClick={() => handleLeagueChange(league)}
              className={`min-w-[26px] shrink-0 rounded-md border px-1 py-1 text-[8px] font-bold leading-4 transition-colors sm:min-w-[34px] sm:px-2 sm:text-[10px] ${active ? 'border-primary bg-primary text-primary-foreground shadow-sm' : 'border-border bg-background text-muted-foreground hover:border-primary/50 hover:bg-muted hover:text-foreground'}`}
            >
              {league.isAll ? 'ALL' : league.code || league.label.slice(0, 4).toUpperCase()}
            </button>
          );
        })}
        {showMore && (
          <button
            ref={triggerRef}
            type="button"
            aria-expanded={moreOpen}
            aria-haspopup="listbox"
            onClick={() => setMoreOpen((open) => !open)}
            className={`shrink-0 rounded-md border border-border bg-background px-1.5 py-1 text-[8px] font-bold leading-4 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground sm:px-2 sm:text-[10px] ${moreOpen ? 'border-primary/60 bg-muted text-foreground' : ''}`}
          >
            More <span aria-hidden="true">▾</span>
          </button>
        )}
      </div>
      {menu}
    </div>
  );
}

export default LeagueSelector;
