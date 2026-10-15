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
  status: string;
  setStatus: (value: string) => void;
  access: string;
  setAccess: (value: string) => void;
  league: string;
  setLeague: (value: string) => void;
  leagues: { code: string; name: string }[];
}

export default function PredictionsFilters({
  search,
  setSearch,
  status,
  setStatus,
  access,
  setAccess,
  league,
  setLeague,
  leagues,
}: Props) {
  return (
    <div className="rounded-lg border bg-card p-2.5">
      <div className="grid gap-2 md:grid-cols-[1.5fr_repeat(3,minmax(0,1fr))]">
        <div className="relative">
          <Search className="pointer-events-none absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" />
          <Input
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Search teams or league"
            className="h-8 rounded-md pl-8 text-xs shadow-none"
          />
        </div>

        <FilterSelect value={status} onChange={setStatus} placeholder="Status">
          <SelectItem value="all">All status</SelectItem>
          <SelectItem value="Upcoming">Upcoming</SelectItem>
          <SelectItem value="In Play">In Play</SelectItem>
          <SelectItem value="Needs Settlement">Needs settlement</SelectItem>
          <SelectItem value="Settled">Settled</SelectItem>
        </FilterSelect>

        <FilterSelect value={access} onChange={setAccess} placeholder="Access">
          <SelectItem value="all">All access</SelectItem>
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
