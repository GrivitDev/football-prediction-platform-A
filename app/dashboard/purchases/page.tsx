'use client';

import { useState } from 'react';

import {PageHero} from '@/components/dashboard/shared/PageHero';
import {DashboardSection} from '@/components/dashboard/shared/DashboardSection';
import {SectionTitle } from '@/components/dashboard/shared/SectionTitle';

import SubscriptionOverview from '@/components/dashboard/purchases/SubscriptionOverview';
import UpgradeCard from '@/components/dashboard/purchases/UpgradeCard';
import TransactionSummary from '@/components/dashboard/purchases/TransactionSummary';
import TransactionTable from '@/components/dashboard/purchases/TransactionTable';

import PaymentModal from '@/components/pricing/PaymentModal';

import { usePurchases } from '@/hooks/usePurchases';
import { usePlanConfig } from '@/hooks/usePlanConfig';



export default function PurchasesPage(){


  const {
    loading,
    payments,
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

    <>

      <PageHero

        title="Purchases"

        description="
          Manage your subscriptions and view all your payment activities.
        "

      />




      <DashboardSection>

        <SectionTitle

          title="Subscription"

          description="
            View your current membership status.
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

              title="Upgrade Membership"

              description="
                Get more benefits by upgrading your plan.
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







      <DashboardSection>

        <SectionTitle

          title="Payment Summary"

          description="
            Overview of your transaction history.
          "

        />


        <TransactionSummary

          payments={payments}

        />

      </DashboardSection>







      <DashboardSection>

        <SectionTitle

          title="Transaction History"

          description="
            All your payments and subscription activities.
          "

        />


        <TransactionTable

          loading={loading}

          payments={payments}

        />

      </DashboardSection>








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


    </>

  );

}