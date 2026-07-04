'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

import {
  LayoutDashboard,
  PlusCircle,
  List,
  Users,
  FileText,
  CreditCard,
  UserCog,
  LogOut,
} from 'lucide-react';

import { useAuth } from '@/providers/auth-provider';

export default function AdminSidebar() {
  const pathname = usePathname();
  const { logout } = useAuth();

  const links = [
    // =========================
    // CORE
    // =========================
    {
      name: 'Dashboard',
      href: '/admin',
      icon: LayoutDashboard,
    },

    // =========================
    // PREDICTIONS
    // =========================
    {
      name: 'Create Prediction',
      href: '/admin/create-prediction',
      icon: PlusCircle,
    },
    {
      name: 'Manage Predictions',
      href: '/admin/predictions',
      icon: List,
    },

    // =========================
    // CONTENT
    // =========================
    {
      name: 'Create Article',
      href: '/admin/create-article',
      icon: FileText,
    },
    {
      name: 'Manage Articles',
      href: '/admin/articles',
      icon: FileText,
    },

    // =========================
    // SYSTEM
    // =========================
    {
      name: 'Manage Users',
      href: '/admin/users',
      icon: Users,
    },
    {
      name: 'Manage Subscriptions',
      href: '/admin/subscriptions',
      icon: CreditCard,
    },
  ];

  return (
    <aside className="w-72 bg-slate-900 border-r border-slate-800 hidden md:flex flex-col">

      {/* HEADER */}
      <div className="p-8 border-b border-slate-800">
        <h1 className="text-3xl font-black">
          Admin Panel ⚡
        </h1>
      </div>

      {/* NAV */}
      <div className="flex-1 p-4 space-y-2">
        {links.map((link) => {
          const Icon = link.icon;
          const isActive = pathname === link.href;

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
              {link.name}
            </Link>
          );
        })}
      </div>

      {/* LOGOUT */}
      <div className="p-4 border-t border-slate-800">
        <button
          onClick={logout}
          className="w-full flex items-center gap-4 px-4 py-4 rounded-xl text-red-400 hover:bg-slate-800 transition"
        >
          <LogOut size={20} />
          Logout
        </button>
      </div>
    </aside>
  );
}