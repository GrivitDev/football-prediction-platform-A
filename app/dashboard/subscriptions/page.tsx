'use client';

import { useState } from 'react';

import {PageHero} from '@/components/dashboard/shared/PageHero';
import {DashboardSection} from '@/components/dashboard/shared/DashboardSection';
import {SectionTitle } from '@/components/dashboard/shared/SectionTitle';

import SubscriptionOverview from '@/components/dashboard/purchases/SubscriptionOverview';
import UpgradeCard from '@/components/dashboard/purchases/UpgradeCard';

import PaymentModal from '@/components/pricing/PaymentModal';

import { usePurchases } from '@/hooks/usePurchases';
import { usePlanConfig } from '@/hooks/usePlanConfig';



export default function PurchasesPage(){


  const {
    loading,
    subscription,
    plan,
  } = usePurchases();



  const {
    config,
  } = usePlanConfig();




  const [upgrade,setUpgrade] =
    useState<
      'regular' | 'vip' | null
    >(null);





  return (

      <div className="w-full min-w-0 max-w-full overflow-x-hidden">

      <PageHero

        title="Subscription"

        description="
          Manage your subscriptions.
        "

      />




      <DashboardSection>

        <SectionTitle

          title=""

          description="
         your current membership status.
          "

        />


        <SubscriptionOverview

          loading={loading}

          subscription={subscription}

          plan={plan}

        />

      </DashboardSection>






      {
        config && (

          <DashboardSection>

            <SectionTitle

              title=""

              description="
              "

            />


            <UpgradeCard

              plan={plan}

              config={config}

              onUpgrade={(target)=>
                setUpgrade(target)
              }

            />

          </DashboardSection>

        )
      }



      {
        upgrade && config && (

          <PaymentModal

            type="vip_upgrade"

            target={upgrade}

            amount={
              upgrade === 'regular'
                ? config.regularPrice
                : config.vipPrice
            }

            config={config}

            title={
              `Upgrade to ${
                upgrade.toUpperCase()
              }`
            }

            description="
              Complete payment to upgrade your membership.
            "

            onClose={()=>
              setUpgrade(null)
            }

          />

        )
      }


   </div>

  );

}