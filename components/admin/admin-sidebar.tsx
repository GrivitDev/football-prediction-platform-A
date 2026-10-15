'use client';

import Link from 'next/link';

import { usePathname } from 'next/navigation';

import {
  Activity,
  BarChart3,
  BookOpenText,
  CreditCard,
  FilePlus2,
  Gift,
  LayoutDashboard,
  ListChecks,
  LogOut,
  Megaphone,
  TicketPercent,
  UserRound,
} from 'lucide-react';

import { useAuth } from '@/providers/auth-provider';


interface Props {
  open: boolean;
  onClose: () => void;
}


export default function AdminSidebar({
  open,
  onClose,
}: Props) {

  const pathname = usePathname();

  const { logout } = useAuth();


  const sections = [
    {
      items: [
        {
          name: 'Dashboard',
          description: 'Platform overview and administration dashboard',
          href: '/admin',
          icon: LayoutDashboard,
        },
        {
          name: 'System Monitor',
          description: 'Monitor platform systems, providers and infrastructure',
          href: '/admin/system-monitor',
          icon: Activity,
        },
      ],
    },

    {
      items: [
        {
          name: 'Create Prediction',
          description: 'Create and publish a new prediction',
          href: '/admin/create-prediction',
          icon: BarChart3,
        },
        {
          name: 'Predictions',
          description: 'Manage existing predictions and settlements',
          href: '/admin/predictions',
          icon: ListChecks,
        },
      ],
    },

    {
      items: [
        {
          name: 'Create Article',
          description: 'Write and publish a new article',
          href: '/admin/create-article',
          icon: FilePlus2,
        },
        {
          name: 'Articles',
          description: 'Manage published and draft articles',
          href: '/admin/articles',
          icon: BookOpenText,
        },
      ],
    },

    {
      items: [
        {
          name: 'Users',
          description: 'Manage platform users and accounts',
          href: '/admin/users',
          icon: UserRound,
        },
        {
          name: 'Subscriptions',
          description: 'Manage subscriptions and membership access',
          href: '/admin/subscriptions',
          icon: CreditCard,
        },
        {
          name: 'Ads',
          description: 'Manage advertising placements and settings',
          href: '/admin/ads',
          icon: Megaphone,
        },
        {
          name: 'Promos',
          description: 'Manage promotional campaigns and offers',
          href: '/admin/promos',
          icon: Gift,
        },
        {
          name: 'Referrals',
          description: 'Manage referral programmes and rewards',
          href: '/admin/referrals',
          icon: TicketPercent,
        },
      ],
    },
  ];


  return (
    <aside
      className={`
        ${open ? 'flex' : 'hidden'}
        h-screen
        w-[10vw]
        min-w-[92px]
        max-w-[140px]
        shrink-0
        flex-col
        border-r
        border-border/70
        bg-background/97
        backdrop-blur-xl
        lg:flex
      `}
    >

      {/* ================================================================
          NAVIGATION
      ================================================================ */}

      <nav
        className="
          flex-1
          overflow-y-auto
          overflow-x-visible
          px-1.5
          py-3
          scrollbar-hide
        "
      >

        {sections.map((section, sectionIndex) => (

          <div
            key={`section-${sectionIndex}`}
            className="
              relative
            "
          >

            {sectionIndex > 0 && (
              <div
                className="
                  mx-3
                  my-3
                  border-t
                  border-border/60
                "
              />
            )}


            <div
              className="
                flex
                flex-col
                gap-1
              "
            >

              {section.items.map(item => {

                const Icon = item.icon;

                const active =
                  pathname === item.href;


                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={onClose}
                    aria-current={
                      active
                        ? 'page'
                        : undefined
                    }
                    className={`
                      group
                      relative
                      flex
                      min-h-[66px]
                      w-full
                      flex-col
                      items-center
                      justify-center
                      rounded-xl
                      px-1
                      py-2
                      text-center
                      transition-all
                      duration-200

                      ${
                        active
                          ? `
                            bg-primary
                            text-primary-foreground
                            shadow-md
                            shadow-primary/15
                          `
                          : `
                            text-muted-foreground
                            hover:bg-secondary
                            hover:text-secondary-foreground
                          `
                      }
                    `}
                  >

                    {/* ICON */}

                    <div
                      className={`
                        flex
                        h-8
                        w-8
                        items-center
                        justify-center
                        rounded-lg
                        transition-all
                        duration-200

                        ${
                          active
                            ? 'bg-black/10'
                            : 'group-hover:bg-accent/15'
                        }
                      `}
                    >

                      <Icon
                        size={18}
                        strokeWidth={2}
                        className="
                          transition-transform
                          duration-200
                          group-hover:scale-110
                        "
                      />

                    </div>


                    {/* NAME */}

                    <span
                      className={`
                        mt-1
                        max-w-full
                        truncate
                        px-0.5
                        text-[9px]
                        font-semibold
                        leading-tight
                        tracking-tight

                        ${
                          active
                            ? 'text-primary-foreground'
                            : 'text-current'
                        }
                      `}
                    >
                      {item.name}
                    </span>


                    {/* HOVER DESCRIPTION */}

                    <div
                      className="
                        pointer-events-none
                        absolute
                        left-full
                        top-1/2
                        z-[100]
                        ml-3
                        w-56
                        -translate-y-1/2
                        translate-x-1
                        rounded-xl
                        border
                        border-border
                        bg-popover
                        px-3
                        py-2.5
                        text-left
                        opacity-0
                        shadow-xl
                        transition-all
                        duration-150
                        group-hover:translate-x-0
                        group-hover:opacity-100
                      "
                    >

                      <div
                        className="
                          flex
                          items-center
                          gap-2
                        "
                      >

                        <Icon
                          size={15}
                          className="
                            shrink-0
                            text-primary
                          "
                        />

                        <span
                          className="
                            text-xs
                            font-bold
                            text-popover-foreground
                          "
                        >
                          {item.name}
                        </span>

                      </div>


                      <p
                        className="
                          mt-1.5
                          text-[11px]
                          leading-relaxed
                          text-muted-foreground
                        "
                      >
                        {item.description}
                      </p>

                    </div>

                  </Link>
                );

              })}

            </div>

          </div>

        ))}

      </nav>


      {/* ================================================================
          LOGOUT
      ================================================================ */}

      <div
        className="
          shrink-0
          border-t
          border-border/70
          px-1.5
          py-3
        "
      >

        <button
          onClick={logout}
          className="
            group
            relative
            flex
            min-h-[62px]
            w-full
            flex-col
            items-center
            justify-center
            rounded-xl
            px-1
            py-2
            text-center
            text-muted-foreground
            transition-all
            duration-200
            hover:bg-secondary
            hover:text-secondary-foreground
          "
        >

          <div
            className="
              flex
              h-8
              w-8
              items-center
              justify-center
              rounded-lg
              transition-colors
              group-hover:bg-accent/15
            "
          >

            <LogOut
              size={18}
              className="
                transition-transform
                duration-200
                group-hover:-translate-x-0.5
              "
            />

          </div>


          <span
            className="
              mt-1
              text-[9px]
              font-semibold
            "
          >
            Logout
          </span>


          {/* LOGOUT TOOLTIP */}

          <div
            className="
              pointer-events-none
              absolute
              left-full
              top-1/2
              z-[100]
              ml-3
              w-52
              -translate-y-1/2
              translate-x-1
              rounded-xl
              border
              border-border
              bg-popover
              px-3
              py-2.5
              text-left
              opacity-0
              shadow-xl
              transition-all
              duration-150
              group-hover:translate-x-0
              group-hover:opacity-100
            "
          >

            <div
              className="
                flex
                items-center
                gap-2
              "
            >

              <LogOut
                size={15}
                className="
                  text-primary
                "
              />

              <span
                className="
                  text-xs
                  font-bold
                  text-popover-foreground
                "
              >
                Logout
              </span>

            </div>


            <p
              className="
                mt-1.5
                text-[11px]
                leading-relaxed
                text-muted-foreground
              "
            >
              Sign out of the administration panel.
            </p>

          </div>

        </button>

      </div>

    </aside>
  );
}