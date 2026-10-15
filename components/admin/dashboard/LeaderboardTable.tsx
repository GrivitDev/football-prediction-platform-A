'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import type { AnalyticsLeaderboardUser } from '@/types/analytics.types';

interface Props {
  title: string;
  users: AnalyticsLeaderboardUser[];
  metric: keyof AnalyticsLeaderboardUser;
}

export default function LeaderboardTable({ title, users, metric }: Props) {
  return (
    <Card className="surface-card gap-0 overflow-hidden rounded-lg py-0 shadow-none">
      <CardHeader className="px-3 py-2">
        <CardTitle className="text-xs font-semibold">{title}</CardTitle>
      </CardHeader>

      <CardContent className="p-0">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="hover:bg-transparent">
                <TableHead className="w-10 px-2 py-1.5 text-[9px]">#</TableHead>
                <TableHead className="px-2 py-1.5 text-[9px]">User</TableHead>
                <TableHead className="px-2 py-1.5 text-[9px]">Email</TableHead>
                <TableHead className="px-2 py-1.5 text-right text-[9px]">Value</TableHead>
              </TableRow>
            </TableHeader>

            <TableBody>
              {users.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={4} className="py-4 text-center text-[10px] text-muted-foreground">
                    No data available.
                  </TableCell>
                </TableRow>
              ) : (
                users.map((user, index) => (
                  <TableRow key={user.userId}>
                    <TableCell className="px-2 py-1.5">
                      <Badge variant="secondary" className="h-4 min-w-6 justify-center rounded px-1 text-[9px] font-medium">
                        {index + 1}
                      </Badge>
                    </TableCell>
                    <TableCell className="max-w-40 px-2 py-1.5">
                      <div className="min-w-0">
                        <p className="truncate text-[10px] font-medium leading-3">{user.fullName}</p>
                        <p className="truncate text-[9px] leading-3 text-muted-foreground">@{user.username}</p>
                      </div>
                    </TableCell>
                    <TableCell className="max-w-52 truncate px-2 py-1.5 text-[10px] text-muted-foreground">
                      {user.email}
                    </TableCell>
                    <TableCell className="px-2 py-1.5 text-right text-[10px] font-semibold tabular-nums">
                      {user[metric] ?? 0}
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
}
