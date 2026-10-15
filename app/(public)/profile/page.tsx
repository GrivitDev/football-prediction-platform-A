'use client';

import {
  AtSign,
  LockKeyhole,
  LogOut,
  Mail,
  Phone,
  Shield,
  Trash2,
  User,
  UserRound,
} from 'lucide-react';

import { PageHero } from '@/components/dashboard/shared/PageHero';
import { DashboardCard } from '@/components/dashboard/shared/DashboardCard';
import { DashboardSection } from '@/components/dashboard/shared/DashboardSection';
import { LoadingCard } from '@/components/dashboard/shared/LoadingCard';
import { SectionTitle } from '@/components/dashboard/shared/SectionTitle';

import EditProfileDialog from '@/components/dashboard/profile/EditProfileDialog';
import ChangePasswordDialog from '@/components/dashboard/profile/ChangePasswordDialog';
import LogoutDialog from '@/components/dashboard/profile/LogoutDialog';
import DeleteAccountDialog from '@/components/dashboard/profile/DeleteAccountDialog';

import { useProfile } from '@/hooks/useProfile';
import { usePurchases } from '@/hooks/usePurchases';

export default function ProfilePage() {
  const { user, loading } = useProfile();
  const { plan } = usePurchases();

  if (loading || !user) {
    return <LoadingCard />;
  }

  const profileItems = [
    {
      label: 'Full Name',
      value: user.fullName,
      icon: User,
    },
    {
      label: 'Username',
      value: `@${user.username}`,
      icon: AtSign,
    },
    {
      label: 'Email Address',
      value: user.email,
      icon: Mail,
    },
    {
      label: 'Phone Number',
      value: user.phoneNumber || 'N/A',
      icon: Phone,
    },
  ];

  return (
    <div className="space-y-5">


      <DashboardSection>
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <SectionTitle
            title="Personal Information"
            description="View and update your profile information."
            icon={UserRound}
          />

          <EditProfileDialog user={user} />
        </div>

        <DashboardCard>
          <div className="grid gap-3 p-3 sm:grid-cols-2">
            {profileItems.map((item) => {
              const Icon = item.icon;

              return (
                <div
                  key={item.label}
                  className="flex min-w-0 items-center gap-3 rounded-lg border border-border bg-background/60 p-3"
                >
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md bg-primary/10 text-primary">
                    <Icon size={15} />
                  </div>

                  <div className="min-w-0">
                    <p className="text-[11px] font-medium text-muted-foreground">
                      {item.label}
                    </p>

                    <p className="mt-0.5 break-all text-sm font-medium">
                      {item.value}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </DashboardCard>
      </DashboardSection>

      <DashboardSection>
        <SectionTitle
          title="Security"
          description="Manage your account password."
          icon={Shield}
        />

        <DashboardCard>
          <div className="flex flex-col gap-3 p-3 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex min-w-0 items-center gap-3">
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
                <LockKeyhole size={15} />
              </div>

              <div className="min-w-0">
                <p className="text-xs text-muted-foreground">Password</p>

                <p className="text-sm font-medium tracking-[0.25em]">
                  ••••••••••••
                </p>
              </div>
            </div>

            <ChangePasswordDialog />
          </div>
        </DashboardCard>
      </DashboardSection>

      <DashboardSection>
        <SectionTitle
          title="Account Actions"
          description="Manage your account session."
        />

        <div className="grid gap-3 md:grid-cols-2">
          <DashboardCard>
            <div className="flex items-center gap-3 p-3">
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md bg-primary/10 text-primary">
                <LogOut size={15} />
              </div>

              <div className="min-w-0 flex-1">
                <h3 className="text-sm font-medium">Logout</h3>

                <p className="text-[11px] text-muted-foreground">
                  End your current session securely.
                </p>
              </div>

              <LogoutDialog />
            </div>
          </DashboardCard>

          <DashboardCard>
            <div className="flex items-center gap-2 p-3">
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md bg-destructive/10 text-destructive">
                <Trash2 size={15} />
              </div>

              <div className="min-w-0 flex-1">
                <h3 className="text-sm font-medium">Delete Account</h3>

                <p className="text-[11px] text-muted-foreground">
                  Permanently remove your account.
                </p>
              </div>

              <DeleteAccountDialog />
            </div>
          </DashboardCard>
        </div>
      </DashboardSection>
    </div>
  );
}