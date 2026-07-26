'use client';

import Link from 'next/link';

import {
  ChevronDown,
  LogOut,
  LayoutDashboard,
  User,
  Settings,
} from 'lucide-react';

import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from '@/components/ui/dropdown-menu';

import { Button } from '@/components/ui/button';

import { useAuth } from '@/providers/auth-provider';

export default function UserMenu() {
const {
  user,
  logout,
  loading,
} = useAuth();

if (loading) {
  return null;
}

  if (!user) {
    return (
      <div className="flex items-center gap-3">

        <Link
          href="/login"
          className="text-sm font-medium text-muted-foreground hover:text-foreground transition"
        >
          Login
        </Link>

        <Link
          href="/register"
          className="
            rounded-full px-4 py-2 text-sm font-medium
            bg-gradient-to-r from-indigo-500/80 via-sky-500/80 to-emerald-500/80
            text-white hover:opacity-90 transition
          "
        >
          Register
        </Link>

      </div>
    );
  }

  const dashboard = user.role === 'admin' ? '/admin' : '/dashboard';

  return (
    <DropdownMenu>

      {/* TRIGGER */}
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          className="
            rounded-full border border-border/60
            bg-muted/30 backdrop-blur-md
            text-foreground hover:bg-muted/50
            transition
          "
        >
          <span className="font-medium">
            {user.role === 'admin' ? 'Admin' : 'Dashboard'}
          </span>

          <ChevronDown className="ml-2 h-4 w-4 opacity-70" />
        </Button>
      </DropdownMenuTrigger>

      {/* CONTENT */}
      <DropdownMenuContent
        align="end"
        className="
          w-56 rounded-xl
          border border-border/60
          bg-background/95 backdrop-blur-xl
          text-foreground shadow-sm
        "
      >

        {/* subtle top accent line */}
        <div className="h-[1px] w-full bg-gradient-to-r from-indigo-500/20 via-sky-500/20 to-emerald-500/20" />

        <DropdownMenuItem asChild>
          <Link href={dashboard} className="flex items-center">
            <LayoutDashboard className="mr-2 h-4 w-4 opacity-70" />
            Dashboard
          </Link>
        </DropdownMenuItem>

        {user.role !== 'admin' && (
          <>
            <DropdownMenuItem asChild>
              <Link href="/dashboard/profile" className="flex items-center">
                <User className="mr-2 h-4 w-4 opacity-70" />
                Profile
              </Link>
            </DropdownMenuItem>

            <DropdownMenuItem asChild>
              <Link href="/dashboard/settings" className="flex items-center">
                <Settings className="mr-2 h-4 w-4 opacity-70" />
                Settings
              </Link>
            </DropdownMenuItem>
          </>
        )}

        <div className="my-1 border-t border-border/50" />

        <DropdownMenuItem
          onClick={logout}
          className="
            flex items-center text-red-500
            focus:bg-red-500/10 focus:text-red-500
          "
        >
          <LogOut className="mr-2 h-4 w-4 opacity-70" />
          Logout
        </DropdownMenuItem>

      </DropdownMenuContent>
    </DropdownMenu>
  );
}