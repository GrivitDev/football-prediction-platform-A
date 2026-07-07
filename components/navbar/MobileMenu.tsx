'use client';

import Image from 'next/image';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';

import {
  Menu,
  Home,
  Newspaper,
  Info,
  LayoutDashboard,
  User,
  Settings,
  LogOut,
  Trophy,
  Users,
  PlusCircle,
  List,
  FileText,
} from 'lucide-react';

import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';

import { Button } from '@/components/ui/button';

import { useAuth } from '@/providers/auth-provider';

import ThemeSwitcher from './ThemeSwitcher';

export default function MobileMenu() {
  const pathname = usePathname();
  const router = useRouter();
  const { user, logout } = useAuth();

  const publicLinks = [
    { name: 'Home', href: '/', icon: Home },
    { name: 'Live Scores', href: '/livescore', icon: Trophy },
    { name: 'Articles', href: '/articles', icon: Newspaper },
    { name: 'About', href: '/about', icon: Info },
  ];

  const userLinks = [
    { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
    { name: 'Profile', href: '/dashboard/profile', icon: User },
    { name: 'Settings', href: '/dashboard/settings', icon: Settings },
  ];

  const adminLinks = [
    { name: 'Admin Dashboard', href: '/admin', icon: LayoutDashboard },
    { name: 'Manage Users', href: '/admin/users', icon: Users },
    { name: 'Create Prediction', href: '/admin/create-prediction', icon: PlusCircle },
    { name: 'Manage Predictions', href: '/admin/predictions', icon: List },
    { name: 'Articles', href: '/admin/articles', icon: FileText },
  ];

  const dashboardLinks = user?.role === 'admin' ? adminLinks : userLinks;

  const linkClass = (active: boolean) =>
    active
      ? 'flex items-center gap-3 rounded-xl px-4 py-3 bg-gradient-to-r from-indigo-500/15 via-sky-500/10 to-emerald-500/10 border border-border text-foreground'
      : 'flex items-center gap-3 rounded-xl px-4 py-3 text-muted-foreground hover:bg-muted/40 hover:text-foreground transition';

  return (
    <div className="md:hidden">
      <Sheet>

        <SheetTrigger asChild>
          <Button variant="ghost" size="icon" className="text-foreground">
            <Menu className="h-6 w-6" />
          </Button>
        </SheetTrigger>

        {/* PREMIUM SHEET CONTAINER */}
        <SheetContent
          side="right"
          className="flex w-[320px] flex-col border-border bg-background/95 backdrop-blur-2xl"
        >

          {/* subtle top gradient accent */}
          <div className="pointer-events-none absolute top-0 left-0 right-0 h-24 bg-gradient-to-r from-indigo-500/10 via-sky-500/10 to-emerald-500/10 blur-xl" />

          {/* HEADER */}
          <SheetHeader>
            <SheetTitle>
              <Link href="/" className="flex items-center gap-3">

                <Image
                  src="/logo.png"
                  alt="PredictPro Logo"
                  width={40}
                  height={40}
                  className="rounded-md"
                />

                <span className="text-xl font-bold bg-gradient-to-r from-foreground via-indigo-500 to-emerald-500 bg-clip-text text-transparent">
                  PredictPro
                </span>

              </Link>
            </SheetTitle>
          </SheetHeader>

          {/* PUBLIC LINKS */}
          <div className="mt-6 space-y-2">
            {publicLinks.map((link) => {
              const Icon = link.icon;
              const active = pathname === link.href;

              return (
                <SheetClose asChild key={link.href}>
                  <Link href={link.href} className={linkClass(active)}>
                    <Icon size={18} />
                    {link.name}
                  </Link>
                </SheetClose>
              );
            })}
          </div>

          {/* divider */}
          <div className="my-6 border-t border-border/60" />

          {/* THEME */}
          <div className="space-y-2">
            <p className="px-4 text-xs font-semibold uppercase tracking-widest text-muted-foreground">
              Theme
            </p>

            <div className="rounded-xl border border-border/60 bg-muted/30 px-2 py-2">
              <ThemeSwitcher />
            </div>
          </div>

          {/* ACCOUNT */}
          {user && (
            <>
              <div className="my-6 border-t border-border/60" />

              <div className="space-y-2">
                <p className="px-4 text-xs font-semibold uppercase tracking-widest text-muted-foreground">
                  Account
                </p>

                {dashboardLinks.map((link) => {
                  const Icon = link.icon;
                  const active = pathname === link.href;

                  return (
                    <SheetClose asChild key={link.href}>
                      <Link href={link.href} className={linkClass(active)}>
                        <Icon size={18} />
                        {link.name}
                      </Link>
                    </SheetClose>
                  );
                })}
              </div>
            </>
          )}

          {/* FOOTER ACTIONS */}
          <div className="mt-auto pt-8">

            {!user ? (
              <div className="space-y-3">

                <SheetClose asChild>
                  <Link
                    href="/login"
                    className="block rounded-xl border border-border py-3 text-center text-foreground hover:bg-muted/40 transition"
                  >
                    Login
                  </Link>
                </SheetClose>

                <SheetClose asChild>
                  <Link
                    href="/register"
                    className="block rounded-xl bg-gradient-to-r from-indigo-500/80 via-sky-500/80 to-emerald-500/80 py-3 text-center font-medium text-white hover:opacity-90 transition"
                  >
                    Register
                  </Link>
                </SheetClose>

              </div>
            ) : (
              <SheetClose asChild>
                <Button
                  className="w-full rounded-xl bg-muted hover:bg-muted/70"
                  onClick={async () => {
                    await logout();
                    router.push('/login');
                    router.refresh();
                  }}
                >
                  <LogOut className="mr-2 h-4 w-4" />
                  Logout
                </Button>
              </SheetClose>
            )}

          </div>

        </SheetContent>
      </Sheet>
    </div>
  );
}