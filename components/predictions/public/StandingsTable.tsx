'use client';

import { useId, useMemo, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Loader2, Trophy } from 'lucide-react';

import sportsApi from '@/services/sports.service';
import type { EspnStandingRecord, EspnTeamRecord } from '@/types/sports';
import LeagueSelector, { getCompetitionOptions } from './LeagueSelector';

export interface StandingsTableProps {
  title?: string;
  initialCompetitionId?: string;
  className?: string;
  /** Limits rendered rows without changing the backend response. */
  maxRows?: number;
}

function resolveTeamName(team: EspnTeamRecord | undefined, standing: EspnStandingRecord): string {
  const payload = standing.payload ?? {};
  const payloadTeam = payload.team;
  const payloadTeamName = payload.teamName;
  const payloadName = payload.name ?? payload.displayName;
  const nestedTeamName = payloadTeam && typeof payloadTeam === 'object'
    ? (payloadTeam as Record<string, unknown>).displayName ?? (payloadTeam as Record<string, unknown>).name
    : payloadTeam;
  const sourceName = [payloadTeamName, payloadName, nestedTeamName]
    .find((value): value is string => typeof value === 'string' && value.trim().length > 0);
  return team?.displayName || team?.name || team?.shortName || sourceName || `Team ${standing.teamId}`;
}

function resolveLogo(team: EspnTeamRecord | undefined, standing: EspnStandingRecord): string | undefined {
  if (team?.logo) return team.logo;
  if (Array.isArray(team?.logos)) return (team.logos[0] as { href?: string } | undefined)?.href;
  const payload = standing.payload ?? {};
  const badge = payload.teamBadge ?? payload.logo;
  if (typeof badge === 'string' && badge.trim()) return badge;
  if (Array.isArray(badge)) return (badge[0] as { href?: string } | undefined)?.href;
  return undefined;
}

export function StandingsTable({ title = 'League Standings', initialCompetitionId, className = '', maxRows }: StandingsTableProps) {
  const [selectedCompetitionId, setSelectedCompetitionId] = useState(initialCompetitionId ?? '');
  const [selectedGroupId, setSelectedGroupId] = useState('');
  const groupSelectId = useId();
  const competitionsQuery = useQuery({
    queryKey: ['public-football', 'competitions'],
    queryFn: () => sportsApi.getCompetitions({ activeOnly: true }),
    staleTime: 5 * 60_000,
  });
  const competitions = competitionsQuery.data ?? [];
  const options = useMemo(() => getCompetitionOptions(competitions), [competitions]);
  const resolvedCompetitionId = options.some((item) => item.id === selectedCompetitionId)
    ? selectedCompetitionId
    : options[0]?.id ?? '';

  const tableQuery = useQuery({
    queryKey: ['public-football', 'standings', resolvedCompetitionId],
    enabled: Boolean(resolvedCompetitionId),
    queryFn: async () => {
      const [standings, teams] = await Promise.all([
        sportsApi.getLeagueTable(resolvedCompetitionId),
        // Team names/logos enrich the table, but a teams endpoint failure must
        // never hide an otherwise valid standings response.
        sportsApi.getCompetitionTeams(resolvedCompetitionId).catch(() => [] as EspnTeamRecord[]),
      ]);
      return { standings, teams };
    },
    staleTime: 3 * 60_000,
    refetchInterval: 5 * 60_000,
  });

  const teamById = useMemo(() => {
    const map = new Map<string, EspnTeamRecord>();
    for (const team of tableQuery.data?.teams ?? []) map.set(String(team.teamId), team);
    return map;
  }, [tableQuery.data?.teams]);
  const standings = (tableQuery.data?.standings ?? []).slice().sort((a, b) => {
    const groupOrder = (a.groupName ?? '').localeCompare(b.groupName ?? '');
    return groupOrder || a.rank - b.rank;
  });
  const groupOptions = useMemo(() => {
    const optionsById = new Map<string, string>();
    for (const standing of standings) {
      const id = standing.groupId || 'overall';
      const label = standing.groupName || (id === 'overall' ? 'League table' : id.replace(/-/g, ' '));
      if (!optionsById.has(id)) optionsById.set(id, label);
    }
    return [...optionsById.entries()].map(([id, label]) => ({ id, label }));
  }, [standings]);
  const hasGroupTables = standings.some((standing) => standing.stage === 'GROUP') || groupOptions.length > 1;
  const resolvedGroupId = groupOptions.some((group) => group.id === selectedGroupId)
    ? selectedGroupId
    : groupOptions[0]?.id ?? '';
  const groupFilteredStandings = hasGroupTables
    ? standings.filter((standing) => (standing.groupId || 'overall') === resolvedGroupId)
    : standings;
  const visibleStandings = maxRows ? groupFilteredStandings.slice(0, maxRows) : groupFilteredStandings;

  return (
    <section className={`min-w-0 rounded-lg border border-border/70 bg-card/60 ${className}`}>
      <div className="flex min-h-10 items-center justify-center gap-1.5 border-b border-border/60 px-2 py-2">
        <Trophy className="h-3.5 w-3.5 text-primary" />
        <h2 className="text-center text-xs font-bold sm:text-sm">{title}</h2>
      </div>
      <div className="space-y-1.5 px-2 py-2 sm:px-3">
        {competitionsQuery.isLoading ? (
          <p className="py-1 text-center text-[10px] text-muted-foreground"><Loader2 className="mr-1 inline h-3 w-3 animate-spin" />Loading leagues…</p>
        ) : options.length > 0 ? (
          <LeagueSelector
            leagues={options}
            selectedIds={resolvedCompetitionId ? [resolvedCompetitionId] : []}
            onChange={(ids) => setSelectedCompetitionId(ids[0] ?? '')}
          />
        ) : <p className="py-1 text-center text-[10px] text-muted-foreground">No active leagues are available.</p>}
        {hasGroupTables && groupOptions.length > 0 && (
          <div className="flex items-center justify-center gap-2 pt-1">
            <label htmlFor={groupSelectId} className="text-[10px] font-medium text-muted-foreground">Group</label>
            <select
              id={groupSelectId}
              value={resolvedGroupId}
              onChange={(event) => setSelectedGroupId(event.target.value)}
              className="max-w-[180px] rounded-md border border-border bg-background px-2 py-1 text-[10px] text-foreground outline-none focus:ring-2 focus:ring-primary/30"
            >
              {groupOptions.map((group) => <option key={group.id} value={group.id}>{group.label}</option>)}
            </select>
          </div>
        )}
      </div>
      <div className="w-full overflow-x-auto">
        <table className="w-full min-w-[390px] border-collapse text-left text-[10px] leading-4 sm:text-[11px]">
          <thead className="bg-muted/60 text-[8px] font-semibold uppercase tracking-wide text-muted-foreground sm:text-[9px]">
            <tr>
              <th className="w-7 px-1.5 py-1.5">#</th>
              <th className="px-1.5 py-1.5">Team</th>
              <th className="w-7 px-1 py-1.5 text-right" title="Played">P</th>
              <th className="w-7 px-1 py-1.5 text-right">W</th>
              <th className="w-7 px-1 py-1.5 text-right">D</th>
              <th className="w-7 px-1 py-1.5 text-right">L</th>
              <th className="w-9 px-1 py-1.5 text-right">GD</th>
              <th className="px-1 py-1.5 text-center" title="Last five matches">Form</th>
              <th className="w-9 px-1.5 py-1.5 text-right">Pts</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border/50">
            {competitionsQuery.isLoading || tableQuery.isLoading ? (
              <tr><td colSpan={9} className="px-2 py-5 text-center text-muted-foreground"><Loader2 className="mr-1.5 inline h-3.5 w-3.5 animate-spin" />Loading standings…</td></tr>
            ) : tableQuery.isError ? (
              <tr><td colSpan={9} className="px-2 py-5 text-center text-destructive">Standings could not be loaded.</td></tr>
            ) : visibleStandings.length === 0 ? (
              <tr><td colSpan={9} className="px-2 py-5 text-center text-muted-foreground">No standings are available for this league.</td></tr>
            ) : visibleStandings.map((standing) => {
              const team = teamById.get(String(standing.teamId));
              const logo = resolveLogo(team, standing);
              const name = resolveTeamName(team, standing);
              return (
                <tr key={`${standing.leagueId}-${standing.season}-${standing.groupId ?? 'overall'}-${standing.teamId}`} className="hover:bg-muted/30">
                  <td className="px-2 py-1.5 font-bold tabular-nums">{standing.rank}</td>
                  <td className="max-w-[180px] px-2 py-1.5">
                    <div className="flex min-w-0 items-center gap-1.5">
                      {logo ? <img src={logo} alt="" aria-hidden="true" className="h-3.5 w-3.5 shrink-0 object-contain" loading="lazy" /> : <span className="h-3.5 w-3.5 shrink-0 rounded-full bg-muted" />}
                      <span className="truncate font-medium" title={name}>{name}</span>
                    </div>
                  </td>
                  <td className="px-1.5 py-1.5 text-right tabular-nums">{standing.played ?? '—'}</td>
                  <td className="px-1.5 py-1.5 text-right tabular-nums">{standing.wins ?? '—'}</td>
                  <td className="px-1.5 py-1.5 text-right tabular-nums">{standing.draws ?? '—'}</td>
                  <td className="px-1.5 py-1.5 text-right tabular-nums">{standing.losses ?? '—'}</td>
                  <td className="px-1 py-1.5 text-right tabular-nums">{standing.goalDifference === undefined ? '—' : standing.goalDifference > 0 ? `+${standing.goalDifference}` : standing.goalDifference}</td>
                  <td className="px-1 py-1.5">
                    <div className="flex items-center justify-center gap-0.5" aria-label={`Last five: ${(standing.lastFiveResults ?? []).join(', ') || standing.form || 'unavailable'}`}>
                      {(standing.lastFiveResults?.length ? standing.lastFiveResults : (standing.form ?? '').toUpperCase().split('').filter((result) => ['W', 'D', 'L'].includes(result)).slice(-5)).map((result, index) => (
                        <span key={`${standing.teamId}-${index}`} className={`inline-flex h-4 w-4 items-center justify-center rounded text-[8px] font-bold ${result === 'W' ? 'bg-emerald-500/15 text-emerald-700 dark:text-emerald-400' : result === 'D' ? 'bg-amber-500/15 text-amber-700 dark:text-amber-400' : 'bg-rose-500/15 text-rose-700 dark:text-rose-400'}`}>{result}</span>
                      ))}
                    </div>
                  </td>
                  <td className="px-1.5 py-1.5 text-right font-bold tabular-nums">{standing.points ?? '—'}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
      <div className="border-t border-border/60 px-2 py-1.5 text-[9px] text-muted-foreground sm:px-3">{groupFilteredStandings.length} team{groupFilteredStandings.length === 1 ? '' : 's'}</div>
    </section>
  );
}

export default StandingsTable;
