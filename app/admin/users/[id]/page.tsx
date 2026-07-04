'use client';

import Link from 'next/link';
import { useParams } from 'next/navigation';
import { ArrowLeft } from 'lucide-react';

import { useUserDetails } from '@/hooks/useUserDetails';
import { useUserActions } from '@/hooks/useUserActions';

import PaymentSummaryCard from '@/components/admin/users/cards/PaymentSummaryCard';
import PurchaseSummaryCard from '@/components/admin/users/cards/PurchaseSummaryCard';
import SessionSummaryCard from '@/components/admin/users/cards/SessionSummaryCard';
import SubscriptionSummaryCard from '@/components/admin/users/cards/SubscriptionSummaryCard';

import PaymentHistoryTable from '@/components/admin/users/tables/PaymentHistoryTable';
import PurchaseHistoryTable from '@/components/admin/users/tables/PurchaseHistoryTable';
import SessionHistoryTable from '@/components/admin/users/tables/SessionHistoryTable';

export default function UserDetailsPage() {
  const { id } = useParams();

  const { user, loading, refetch } = useUserDetails(id as string);
  const actions = useUserActions(id as string, refetch);

  if (loading) {
    return <div className="p-8">Loading user...</div>;
  }

  if (!user) {
    return <div className="p-8">User not found.</div>;
  }

  return (
    <div className="space-y-8 p-8">

      {/* BACK BUTTON */}
      <Link
        href="/admin/users"
        className="inline-flex items-center gap-2 text-sm text-gray-400 hover:text-white"
      >
        <ArrowLeft size={18} />
        Back to Users
      </Link>

      {/* HEADER */}
      <div className="flex justify-between items-start">

        <div>
          <h1 className="text-4xl font-bold">
            {user.user?.fullName}
          </h1>

          <p className="text-gray-400 mt-2">
            {user.user?.email}
          </p>

          <div className="flex gap-3 mt-3">
            <span className="px-3 py-1 rounded-full bg-slate-800">
              {user.user?.role}
            </span>

            <span className="px-3 py-1 rounded-full bg-slate-800 capitalize">
              {user.user?.status}
            </span>
          </div>
        </div>

        {/* ACTIONS */}
        <div className="flex gap-3">
          <button
            onClick={() => actions.suspend('Manual Suspension')}
            className="px-4 py-2 rounded bg-yellow-600"
          >
            Suspend
          </button>

          <button
            onClick={actions.activate}
            className="px-4 py-2 rounded bg-green-600"
          >
            Activate
          </button>

          <button
            onClick={actions.forceLogoutAllDevices}
            className="px-4 py-2 rounded bg-blue-600"
          >
            Logout Devices
          </button>

          <button
            onClick={actions.remove}
            className="px-4 py-2 rounded bg-red-700"
          >
            Delete
          </button>
        </div>
      </div>

      {/* SUMMARY CARDS */}
      <div className="grid xl:grid-cols-4 md:grid-cols-2 gap-6">

        <PaymentSummaryCard
          summary={user.payments}
        />

        <SubscriptionSummaryCard
          summary={user.subscription}
        />

        <PurchaseSummaryCard
          summary={user.purchases}
        />

        <SessionSummaryCard
          summary={user.sessions}
        />
      </div>

      {/* HISTORY TABLES */}
      <div className="space-y-8">

        <PaymentHistoryTable
          payments={user.payments.latestPayments}
        />

        <PurchaseHistoryTable
          purchases={user.purchases.latestPurchases}
        />

        <SessionHistoryTable
          sessions={user.sessions.latestSessions}
        />
      </div>
    </div>
  );
}