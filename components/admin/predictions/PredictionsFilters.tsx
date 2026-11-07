'use client';

import { Search } from 'lucide-react';
import type { ReactNode } from 'react';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

interface Props {
  search: string;
  setSearch: (value: string) => void;
  matchStatus: string;
  setMatchStatus: (value: string) => void;
  settlement: string;
  setSettlement: (value: string) => void;
  access: string;
  setAccess: (value: string) => void;
  league: string;
  setLeague: (value: string) => void;
  leagues: { code: string; name: string }[];
}

export default function PredictionsFilters({
  search,
  setSearch,
  matchStatus,
  setMatchStatus,
  settlement,
  setSettlement,
  access,
  setAccess,
  league,
  setLeague,
  leagues,
}: Props) {
  return (
    <div className="rounded-lg border bg-card p-2.5">
      <div className="grid gap-2 sm:grid-cols-2 xl:grid-cols-[1.5fr_repeat(4,minmax(0,1fr))]">
        <div className="relative sm:col-span-2 xl:col-span-1">
          <Search className="pointer-events-none absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" />
          <Input
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Search teams, league or match ID"
            className="h-8 rounded-md pl-8 text-xs shadow-none"
          />
        </div>

        <FilterSelect value={matchStatus} onChange={setMatchStatus} placeholder="Match status">
          <SelectItem value="all">All match statuses</SelectItem>
          <SelectItem value="UPCOMING">Upcoming</SelectItem>
          <SelectItem value="LIVE">Live</SelectItem>
          <SelectItem value="FINISHED">Finished</SelectItem>
          <SelectItem value="POSTPONED">Postponed</SelectItem>
          <SelectItem value="CANCELLED">Cancelled</SelectItem>
          <SelectItem value="UNKNOWN">Unknown</SelectItem>
        </FilterSelect>

        <FilterSelect value={settlement} onChange={setSettlement} placeholder="Settlement">
          <SelectItem value="all">All settlement states</SelectItem>
          <SelectItem value="PENDING">Pending</SelectItem>
          <SelectItem value="PARTIAL">Partially settled</SelectItem>
          <SelectItem value="SETTLED">Fully settled</SelectItem>
          <SelectItem value="NEEDS_SETTLEMENT">Finished · awaiting settlement</SelectItem>
        </FilterSelect>

        <FilterSelect value={access} onChange={setAccess} placeholder="Access">
          <SelectItem value="all">All access plans</SelectItem>
          <SelectItem value="free">Free</SelectItem>
          <SelectItem value="regular">Regular</SelectItem>
          <SelectItem value="vip">VIP</SelectItem>
          <SelectItem value="premium">Premium</SelectItem>
        </FilterSelect>

        <FilterSelect value={league} onChange={setLeague} placeholder="League">
          <SelectItem value="all">All leagues</SelectItem>
          {leagues.map((item) => (
            <SelectItem key={item.code} value={item.code}>
              {item.name}
            </SelectItem>
          ))}
        </FilterSelect>
      </div>
    </div>
  );
}

function FilterSelect({
  value,
  onChange,
  placeholder,
  children,
}: {
  value: string;
  onChange: (value: string) => void;
  placeholder: string;
  children: ReactNode;
}) {
  return (
    <Select value={value} onValueChange={onChange}>
      <SelectTrigger className="h-8 rounded-md text-xs shadow-none">
        <SelectValue placeholder={placeholder} />
      </SelectTrigger>
      <SelectContent>{children}</SelectContent>
    </Select>
  );
}
