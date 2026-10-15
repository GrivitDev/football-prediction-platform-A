import { Badge } from '@/components/ui/badge';
import { TrendingUp, Users, Wallet } from 'lucide-react';
import type { AnalyticsDashboardResponse } from '@/types/analytics.types';

interface AnalyticsHeaderProps {
  data: AnalyticsDashboardResponse;
}

export default function AnalyticsHeader({ data }: AnalyticsHeaderProps) {
  return (
    <header className="flex min-w-0 flex-wrap items-center justify-between gap-x-3 gap-y-2 border-b pb-2">
      <h1 className="text-base font-semibold tracking-tight">Admin Analytics</h1>

      <div className="flex flex-wrap items-center gap-1">
        <Badge variant="secondary" className="h-5 gap-1 rounded-md px-1.5 text-[9px] font-medium">
          <Users size={11} aria-hidden="true" />
          <span>{data.users.totalUsers.toLocaleString()}</span>
        </Badge>
        <Badge variant="secondary" className="h-5 gap-1 rounded-md px-1.5 text-[9px] font-medium">
          <Wallet size={11} aria-hidden="true" />
          <span>₦{data.revenue.totalRevenue.NGN.toLocaleString()}</span>
        </Badge>
        <Badge className="h-5 gap-1 rounded-md px-1.5 text-[9px] font-medium">
          <TrendingUp size={11} aria-hidden="true" />
          Live
        </Badge>
      </div>
    </header>
  );
}
