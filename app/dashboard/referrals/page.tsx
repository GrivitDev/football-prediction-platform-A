'use client';


import {
  ReferralLinkCard,
} from '@/components/dashboard/referrals/ReferralLinkCard';




import {
  AvailablePromos,
} from '@/components/dashboard/referrals/AvailablePromos';


import {
  PromoProgressCard,
} from '@/components/dashboard/referrals/PromoProgressCard';
import { ReferralTable } from '@/components/dashboard/referrals/ReferralTable';
import { RewardHistory } from '@/components/dashboard/referrals/RewardHistory';
import { ReferralStatsCards } from '@/components/dashboard/referrals/ReferralStatsCards';



export default function ReferralDashboardPage(){


  return (

    <div className="space-y-8">


      <div>

        <h1 className="text-3xl font-bold">

          Referral Center

        </h1>


        <p className="text-muted-foreground">

          Invite friends and earn rewards.

        </p>


      </div>



      <ReferralLinkCard />



      <ReferralStatsCards />



      <AvailablePromos />



      <PromoProgressCard />

      <ReferralTable />

      <RewardHistory />


    </div>

  );

}