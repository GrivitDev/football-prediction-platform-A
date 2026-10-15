'use client';

import { useQuery } from '@tanstack/react-query';

import {
  Copy,
  Link2,
  Share2,
  Users,
} from 'lucide-react';

import { toast } from 'sonner';

import { Button } from '@/components/ui/button';

import {
  getMyReferralLink,
} from '@/services/referrals.service';

export function ReferralLinkCard() {
  const {
    data,
    isLoading,
  } = useQuery({
    queryKey: ['my-referral-link'],
    queryFn: getMyReferralLink,
  });

  async function copyLink() {
    if (!data?.referralLink) {
      return;
    }

    try {
      await navigator.clipboard.writeText(
        data.referralLink,
      );

      toast.success('Referral link copied');
    } catch {
      toast.error('Unable to copy referral link');
    }
  }

  async function shareLink() {
    if (!data?.referralLink) {
      return;
    }

    if (
      typeof navigator !== 'undefined' &&
      navigator.share
    ) {
      try {
        await navigator.share({
          title: 'Join Football Prediction Platform',
          text: 'Join using my referral link and earn rewards.',
          url: data.referralLink,
        });
      } catch {
        // User cancelled native share.
      }

      return;
    }

    await copyLink();
  }

  if (isLoading) {
    return (
      <div className="rounded-lg border border-border bg-card p-3">
        <div className="flex items-center gap-2.5">
          <div className="h-8 w-8 animate-pulse rounded-md bg-muted/50" />

          <div className="space-y-1">
            <div className="h-3 w-24 animate-pulse rounded bg-muted/50" />
            <div className="h-2.5 w-36 animate-pulse rounded bg-muted/40" />
          </div>
        </div>

        <div className="mt-3 grid gap-2 sm:grid-cols-[auto_1fr_auto]">
          <div className="h-8 animate-pulse rounded-md bg-muted/40" />
          <div className="h-8 min-w-0 animate-pulse rounded-md bg-muted/40" />
          <div className="grid grid-cols-2 gap-1.5">
            <div className="h-8 animate-pulse rounded-md bg-muted/40" />
            <div className="h-8 animate-pulse rounded-md bg-muted/40" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="rounded-lg border border-border bg-card p-3">
      <div className="flex items-center gap-2">
        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md bg-primary/10 text-primary">
          <Link2 className="h-4 w-4" />
        </div>

        <div className="min-w-0">
          <p className="text-xs font-semibold">
            Referral Link
          </p>

          <p className="text-[10px] text-muted-foreground">
            Invite users and earn rewards
          </p>
        </div>
      </div>

      <div className="mt-3 grid gap-2 sm:grid-cols-[auto_1fr_auto] sm:items-center">
        <div className="flex min-w-0 items-center gap-2 rounded-md border border-border bg-muted/20 px-2.5 py-1.5">
          <Users className="h-3.5 w-3.5 shrink-0 text-primary" />

          <span className="text-[10px] text-muted-foreground">
            Code
          </span>

          <span className="truncate text-xs font-semibold tracking-wide">
            {data?.referralCode || '—'}
          </span>
        </div>

        <div className="flex min-w-0 items-center gap-2 rounded-md border border-border bg-muted/20 px-2.5 py-1.5">
          <span className="shrink-0 text-[10px] text-muted-foreground">
            Link
          </span>

          <span className="min-w-0 flex-1 truncate text-[10px]">
            {data?.referralLink || '—'}
          </span>
        </div>

        <div className="grid grid-cols-2 gap-1.5">
          <Button
            type="button"
            onClick={copyLink}
            disabled={!data?.referralLink}
            className="h-8 rounded-md px-2.5 text-[10px]"
          >
            <Copy className="mr-1 h-3 w-3" />
            Copy
          </Button>

          <Button
            type="button"
            variant="outline"
            onClick={shareLink}
            disabled={!data?.referralLink}
            className="h-8 rounded-md px-2.5 text-[10px]"
          >
            <Share2 className="mr-1 h-3 w-3" />
            Share
          </Button>
        </div>
      </div>
    </div>
  );
}