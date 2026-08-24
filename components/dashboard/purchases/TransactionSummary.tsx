'use client';

import {
  Wallet,
  CheckCircle2,
  Clock3,
} from 'lucide-react';

import {
  StatCard,
} from '@/components/dashboard/shared/StatCard';

import {
  useAuth,
} from '@/providers/auth-provider';


// ============================================================
// TYPES
// ============================================================

interface Props {
  payments: any[];
}


// ============================================================
// COMPONENT
// ============================================================

export default function TransactionSummary({
  payments = [],
}: Props) {

  // ==========================================================
  // AUTH
  // ==========================================================

  const {
    user,
  } = useAuth();


  // ==========================================================
  // USER CURRENCY
  // ==========================================================

  const currency =
    user?.currency ?? 'NGN';


  // ==========================================================
  // TOTAL
  // ==========================================================

  const total =
    payments.reduce(
      (
        sum,
        payment,
      ) =>
        sum +
        Number(
          payment.amount || 0,
        ),

      0,
    );


  // ==========================================================
  // PAYMENT COUNTS
  // ==========================================================

  const approved =
    payments.filter(
      (payment) =>
        payment.status === 'approved',
    ).length;


  const pending =
    payments.filter(
      (payment) =>
        payment.status === 'pending',
    ).length;


  // ==========================================================
  // FORMAT CURRENCY
  // ==========================================================

  const formattedTotal =
    new Intl.NumberFormat(
      currency === 'USD'
        ? 'en-US'
        : 'en-NG',
      {
        style: 'currency',
        currency,
        maximumFractionDigits: 0,
      },
    ).format(total);


  // ==========================================================
  // CARDS
  // ==========================================================

  const cards = [

    {
      title:
        'Total Spent',

      value:
        formattedTotal,

      icon:
        Wallet,

      description:
        `Lifetime payments in ${currency}`,

      className:
        `
          border-violet-500/20
          bg-gradient-to-br
          from-violet-500/15
          via-background
          to-background
        `,

      iconClass:
        'text-violet-500',
    },


    {
      title:
        'Approved',

      value:
        approved,

      icon:
        CheckCircle2,

      description:
        'Successful payments',

      className:
        `
          border-emerald-500/20
          bg-gradient-to-br
          from-emerald-500/15
          via-background
          to-background
        `,

      iconClass:
        'text-emerald-500',
    },


    {
      title:
        'Pending',

      value:
        pending,

      icon:
        Clock3,

      description:
        'Awaiting approval',

      className:
        `
          border-amber-500/20
          bg-gradient-to-br
          from-amber-500/15
          via-background
          to-background
        `,

      iconClass:
        'text-amber-500',
    },

  ];


  // ==========================================================
  // RENDER
  // ==========================================================

  return (

    <div
      className="
        relative
        grid
        gap-5
        md:grid-cols-3
      "
    >

      {/* Decorative Glow */}

      <div
        className="
          pointer-events-none
          absolute
          -right-20
          -top-20
          h-64
          w-64
          rounded-full
          bg-primary/20
          blur-3xl
        "
      />


      {/* Cards */}

      {
        cards.map(
          (card) => (

            <div
              key={
                card.title
              }
              className={`
                group
                relative
                overflow-hidden
                rounded-3xl
                border
                ${card.className}
                p-1
                transition-all
                duration-500
                hover:-translate-y-1
                hover:shadow-xl
              `}
            >

              {/* Hover Shine */}

              <div
                className="
                  pointer-events-none
                  absolute
                  inset-0
                  bg-gradient-to-r
                  from-transparent
                  via-white/10
                  to-transparent
                  opacity-0
                  transition-opacity
                  duration-500
                  group-hover:opacity-100
                  dark:via-white/5
                "
              />


              {/* Stat */}

              <div
                className="
                  relative
                "
              >

                <StatCard

                  title={
                    card.title
                  }

                  value={
                    card.value
                  }

                  icon={
                    card.icon
                  }

                  description={
                    card.description
                  }

                />

              </div>

            </div>

          ),
        )
      }

    </div>

  );

}