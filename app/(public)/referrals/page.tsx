'use client';

import { PageHero } from '@/components/dashboard/shared/PageHero';
import { DashboardSection } from '@/components/dashboard/shared/DashboardSection';
import { SectionTitle } from '@/components/dashboard/shared/SectionTitle';

import { ReferralLinkCard } from '@/components/dashboard/referrals/ReferralLinkCard';
import { ReferralStatsCards } from '@/components/dashboard/referrals/ReferralStatsCards';
import { AvailableCampaigns } from '@/components/dashboard/referrals/AvailableCampaigns copy';
import { ActiveCampaigns } from '@/components/dashboard/referrals/ActiveCampaigns copy';
import { ReferralActivity } from '@/components/dashboard/referrals/ReferralActivity';
import { RewardHistory } from '@/components/dashboard/referrals/RewardHistory';

export default function ReferralDashboardPage() {
  return (
    <div className="min-w-0 max-w-full space-y-5 overflow-x-hidden">

      <DashboardSection>
        <SectionTitle
          title="Your Referral Link"
          description="Share your unique link and start earning rewards."
        />

        <ReferralLinkCard />
      </DashboardSection>

      <DashboardSection>

        <ReferralStatsCards />
      </DashboardSection>

      <div className="grid min-w-0 gap-5 xl:grid-cols-2">
        <DashboardSection>
          <AvailableCampaigns />
        </DashboardSection>

        <DashboardSection>
          <ActiveCampaigns />
        </DashboardSection>
      </div>

      <div className="grid min-w-0 gap-5 xl:grid-cols-2">
        <DashboardSection>
          <ReferralActivity />
        </DashboardSection>

        <DashboardSection>

          <RewardHistory />
        </DashboardSection>
      </div>
    </div>
  );
}