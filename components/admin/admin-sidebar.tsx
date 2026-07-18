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
  LogOut,
  ChevronRight,
  ShieldCheck,
  Megaphone,
  TicketPercent,
  Gift,
} from 'lucide-react';

import { useAuth } from '@/providers/auth-provider';

export default function AdminSidebar() {
  const pathname = usePathname();
  const { logout } = useAuth();

  const links = [
    {
      title: 'Overview',
      items: [
        {
          name: 'Dashboard',
          href: '/admin',
          icon: LayoutDashboard,
        },
      ],
    },

    {
      title: 'Predictions',
      items: [
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
      ],
    },

    {
      title: 'Content',
      items: [
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
      ],
    },

    {
      title: 'Management',
      items: [
        {
          name: 'Users',
          href: '/admin/users',
          icon: Users,
        },
        {
          name: 'Subscriptions',
          href: '/admin/subscriptions',
          icon: CreditCard,
        },
        {
          name: 'Ads',
          href: '/admin/ads',
          icon: Megaphone,
        },
        {
          name: 'Promos',
          href: '/admin/promos',
          icon: Gift,
        },
        {
          name: 'Referrals',
          href: '/admin/referrals',
          icon: TicketPercent,
        },
      ],
    },
  ];

  return (
    <aside
      className="
        hidden md:flex
        w-80
        flex-col
        border-r
        border-border/60
        bg-background/80
        backdrop-blur-xl
        relative
        overflow-hidden
      "
    >

      {/* Ambient Glow */}
      <div
        className="
          absolute
          -top-32
          -left-32
          h-72
          w-72
          rounded-full
          bg-primary/20
          blur-[120px]
          pointer-events-none
        "
      />

      <div
        className="
          absolute
          bottom-0
          right-0
          h-64
          w-64
          rounded-full
          bg-emerald-500/10
          blur-[120px]
          pointer-events-none
        "
      />


      {/* HEADER */}
      <div
        className="
          relative
          px-7
          py-8
          border-b
          border-border/60
        "
      >
        <div
          className="
            flex
            items-center
            gap-3
          "
        >
          <div
            className="
              flex
              h-12
              w-12
              items-center
              justify-center
              rounded-2xl
              bg-primary/10
              border
              border-primary/20
              text-primary
              shadow-lg
              shadow-primary/10
            "
          >
            <ShieldCheck size={26} />
          </div>

          <div>
            <h1
              className="
                text-xl
                font-black
                tracking-tight
              "
            >
              Admin Center
            </h1>

            <p
              className="
                text-xs
                text-muted-foreground
              "
            >
              Platform Control
            </p>
          </div>
        </div>
      </div>


      {/* NAVIGATION */}
      <nav
        className="
          relative
          flex-1
          overflow-y-auto
          px-5
          py-6
          space-y-7
        "
      >

        {links.map((section) => (
          <div key={section.title}>

            <p
              className="
                mb-3
                px-3
                text-[11px]
                uppercase
                tracking-[0.2em]
                text-muted-foreground/70
                font-semibold
              "
            >
              {section.title}
            </p>


            <div className="space-y-2">

              {section.items.map((link) => {
                const Icon = link.icon;

                const isActive =
                  pathname === link.href;

                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    className={`
                      group
                      relative
                      flex
                      items-center
                      gap-4
                      rounded-2xl
                      px-4
                      py-3.5
                      transition-all
                      duration-300
                      ${
                        isActive
                          ? `
                            bg-primary
                            text-primary-foreground
                            shadow-xl
                            shadow-primary/20
                          `
                          : `
                            text-muted-foreground
                            hover:bg-accent
                            hover:text-foreground
                          `
                      }
                    `}
                  >

                    {/* Active Glow */}
                    {isActive && (
                      <span
                        className="
                          absolute
                          inset-0
                          rounded-2xl
                          bg-primary
                          blur-xl
                          opacity-30
                          -z-10
                        "
                      />
                    )}


                    <Icon
                      size={20}
                      className={`
                        transition-transform
                        duration-300
                        ${
                          isActive
                            ? ''
                            : 'group-hover:scale-110'
                        }
                      `}
                    />


                    <span
                      className="
                        flex-1
                        font-medium
                      "
                    >
                      {link.name}
                    </span>


                    <ChevronRight
                      size={16}
                      className={`
                        transition-all
                        duration-300
                        ${
                          isActive
                            ? 'opacity-100 translate-x-0'
                            : 'opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0'
                        }
                      `}
                    />

                  </Link>
                );
              })}

            </div>

          </div>
        ))}

      </nav>


      {/* FOOTER */}
      <div
        className="
          relative
          p-5
          border-t
          border-border/60
        "
      >

        <button
          onClick={logout}
          className="
            group
            w-full
            flex
            items-center
            gap-4
            rounded-2xl
            px-4
            py-3.5
            text-red-500
            transition-all
            duration-300
            hover:bg-red-500/10
          "
        >

          <LogOut
            size={20}
            className="
              transition-transform
              duration-300
              group-hover:-translate-x-1
            "
          />

          <span className="font-medium">
            Logout
          </span>

        </button>

      </div>

    </aside>
  );
}