'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

import {
  LayoutDashboard,
  TrendingUp,
  Wallet,
  ShoppingCart,
  User,
  Settings,
  LogOut,
  Crown,
} from 'lucide-react';

import { useAuth } from '@/providers/auth-provider';
import { useRouter } from 'next/navigation';
export default function DashboardSidebar() {
  const router = useRouter();
  const pathname = usePathname();
  const { logout } = useAuth();

  const links = [
    {
      name: 'Dashboard',
      href: '/dashboard',
      icon: LayoutDashboard,
    },
    {
      name: 'Predictions',
      href: '/dashboard/predictions',
      icon: TrendingUp,
    },
    {
      name: 'Purchases',
      href: '/dashboard/purchases',
      icon: ShoppingCart,
    },
    {
      name: 'Payments',
      href: '/dashboard/payments',
      icon: Wallet,
    },
    {
      name: 'Subscription',
      href: '/dashboard/subscription',
      icon: Crown,
    },
    {
      name: 'Profile',
      href: '/dashboard/profile',
      icon: User,
    },
    {
      name: 'Settings',
      href: '/dashboard/settings',
      icon: Settings,
    },
  ];

  return (
    <aside className="w-72 border-r border-slate-800 bg-slate-900 hidden md:flex flex-col">

      {/* BRAND */}
      <div className="p-8 border-b border-slate-800">
        <h1 className="text-3xl font-black">
          PredictPro ⚽
        </h1>
      </div>

      {/* LINKS */}
      <div className="flex-1 p-4 space-y-2">
        {links.map((link) => {
          const Icon = link.icon;

          const isActive =
            pathname === link.href;

          return (
            <Link
              key={link.href}
              href={link.href}
              className={`flex items-center gap-4 px-4 py-4 rounded-xl transition ${
                isActive
                  ? 'bg-green-600 text-white'
                  : 'text-slate-400 hover:bg-slate-800'
              }`}
            >
              <Icon size={20} />
              <span>{link.name}</span>
            </Link>
          );
        })}
      </div>

      {/* LOGOUT */}
      <div className="p-4 border-t border-slate-800">
        <button
          onClick={async () => {
            await logout();
            router.push('/login');
            router.refresh();
          }}
          className="w-full flex items-center gap-4 px-4 py-4 rounded-xl text-red-400 hover:bg-slate-800 transition"
        >
          <LogOut size={20} />
          Logout
        </button>
      </div>
    </aside>
  );
}