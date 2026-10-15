'use client';

import Link from 'next/link';

import {
  UserRound,
  LogOut,
  LayoutDashboard,
  User,
  ShoppingCart,
  Gift,
  CreditCard,
  Monitor,
  PlusCircle,
  List,
  FileText,
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

  /*
   * ================================================================
   * LOADING
   * ================================================================
   */

  if (loading) {
    return (
      <Button
        variant="ghost"
        size="icon"
        disabled
        aria-label="Account"
        className="
          h-10
          w-10
          rounded-xl
          border
          border-border/50
          bg-background/40
        "
      >
        <UserRound className="h-5 w-5" />
      </Button>
    );
  }

  /*
   * ================================================================
   * LOGGED OUT
   * ================================================================
   */

  if (!user) {
    return (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="ghost"
            size="icon"
            aria-label="Account"
            className="
              h-10
              w-10
              rounded-xl
              border
              border-border/50
              bg-background/40
              backdrop-blur-md
              transition-all
              duration-200
              hover:border-primary/30
              hover:bg-primary/10
              hover:text-primary
            "
          >
            <UserRound className="h-5 w-5" />
          </Button>
        </DropdownMenuTrigger>

<DropdownMenuContent
  align="end"
  sideOffset={8}
  className="
    z-[10000]
    w-56
    rounded-2xl
    border
    border-border/50
    bg-background/95
    p-2
    shadow-xl
    backdrop-blur-xl
  "
>
          <div
            className="
              mb-2
              h-px
              w-full
              bg-gradient-to-r
              from-primary/50
              via-emerald-500/50
              to-transparent
            "
          />

          <DropdownMenuItem
            asChild
            className="
              cursor-pointer
              rounded-xl
              py-2.5
            "
          >
            <Link
              href="/login"
              className="flex items-center"
            >
              <UserRound
                className="
                  mr-3
                  h-4
                  w-4
                  text-muted-foreground
                "
              />
              Login
            </Link>
          </DropdownMenuItem>

          <DropdownMenuItem
            asChild
            className="
              cursor-pointer
              rounded-xl
              py-2.5
            "
          >
            <Link
              href="/register"
              className="flex items-center"
            >
              <User
                className="
                  mr-3
                  h-4
                  w-4
                  text-muted-foreground
                "
              />
              Register
            </Link>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    );
  }

  /*
   * ================================================================
   * ADMIN
   *
   * Admins see all admin navigation links.
   * Admins never see regular user/dashboard pages.
   * ================================================================
   */

  if (user.role === 'admin') {
    return (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="ghost"
            size="icon"
            aria-label="Admin account"
            className="
              h-10
              w-10
              rounded-xl
              border
              border-border/50
              bg-background/40
              backdrop-blur-md
              transition-all
              duration-200
              hover:border-primary/30
              hover:bg-primary/10
              hover:text-primary
            "
          >
            <UserRound className="h-5 w-5" />
          </Button>
        </DropdownMenuTrigger>

<DropdownMenuContent
  align="end"
  sideOffset={8}
  className="
    z-[10000]
    w-56
    rounded-2xl
    border
    border-border/50
    bg-background/95
    p-2
    shadow-xl
    backdrop-blur-xl
  "
>
          {/* ========================================================
              OVERVIEW
          ======================================================== */}

          <p
            className="
              px-3
              pb-2
              pt-1
              text-[10px]
              font-semibold
              uppercase
              tracking-[0.18em]
              text-muted-foreground/70
            "
          >
            Overview
          </p>

          <DropdownMenuItem
            asChild
            className="
              cursor-pointer
              rounded-xl
              py-2.5
            "
          >
            <Link
              href="/admin"
              className="flex items-center"
            >
              <LayoutDashboard
                className="
                  mr-3
                  h-4
                  w-4
                  text-muted-foreground
                "
              />
              Dashboard
            </Link>
          </DropdownMenuItem>

          <DropdownMenuItem
            asChild
            className="
              cursor-pointer
              rounded-xl
              py-2.5
            "
          >
            <Link
              href="/admin/system-monitor"
              className="flex items-center"
            >
              <Monitor
                className="
                  mr-3
                  h-4
                  w-4
                  text-muted-foreground
                "
              />
              System Monitor
            </Link>
          </DropdownMenuItem>

          <div className="my-2 border-t border-border/50" />

          {/* ========================================================
              PREDICTIONS
          ======================================================== */}

          <p
            className="
              px-3
              pb-2
              pt-1
              text-[10px]
              font-semibold
              uppercase
              tracking-[0.18em]
              text-muted-foreground/70
            "
          >
            Predictions
          </p>

          <DropdownMenuItem
            asChild
            className="
              cursor-pointer
              rounded-xl
              py-2.5
            "
          >
            <Link
              href="/admin/create-prediction"
              className="flex items-center"
            >
              <PlusCircle
                className="
                  mr-3
                  h-4
                  w-4
                  text-muted-foreground
                "
              />
              Create Prediction
            </Link>
          </DropdownMenuItem>

          <DropdownMenuItem
            asChild
            className="
              cursor-pointer
              rounded-xl
              py-2.5
            "
          >
            <Link
              href="/admin/predictions"
              className="flex items-center"
            >
              <List
                className="
                  mr-3
                  h-4
                  w-4
                  text-muted-foreground
                "
              />
              Predictions
            </Link>
          </DropdownMenuItem>

          <div className="my-2 border-t border-border/50" />

          {/* ========================================================
              CONTENT
          ======================================================== */}

          <p
            className="
              px-3
              pb-2
              pt-1
              text-[10px]
              font-semibold
              uppercase
              tracking-[0.18em]
              text-muted-foreground/70
            "
          >
            Content
          </p>

          <DropdownMenuItem
            asChild
            className="
              cursor-pointer
              rounded-xl
              py-2.5
            "
          >
            <Link
              href="/admin/create-article"
              className="flex items-center"
            >
              <FileText
                className="
                  mr-3
                  h-4
                  w-4
                  text-muted-foreground
                "
              />
              Create Article
            </Link>
          </DropdownMenuItem>

          <DropdownMenuItem
            asChild
            className="
              cursor-pointer
              rounded-xl
              py-2.5
            "
          >
            <Link
              href="/admin/articles"
              className="flex items-center"
            >
              <FileText
                className="
                  mr-3
                  h-4
                  w-4
                  text-muted-foreground
                "
              />
              Articles
            </Link>
          </DropdownMenuItem>

          <div className="my-2 border-t border-border/50" />


          <div
            className="
              my-2
              border-t
              border-border/50
            "
          />

          {/* ========================================================
              LOGOUT
          ======================================================== */}

          <DropdownMenuItem
            onClick={logout}
            className="
              cursor-pointer
              rounded-xl
              py-2.5
              text-destructive
              focus:bg-destructive/10
              focus:text-destructive
            "
          >
            <LogOut
              className="
                mr-3
                h-4
                w-4
              "
            />
            Logout
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    );
  }

  /*
   * ================================================================
   * REGULAR USER
   *
   * Regular users never see admin pages.
   * ================================================================
   */

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          aria-label="Account"
          className="
            h-10
            w-10
            rounded-xl
            border
            border-border/50
            bg-background/40
            backdrop-blur-md
            transition-all
            duration-200
            hover:border-primary/30
            hover:bg-primary/10
            hover:text-primary
          "
        >
          <UserRound className="h-5 w-5" />
        </Button>
      </DropdownMenuTrigger>

<DropdownMenuContent
  align="end"
  sideOffset={8}
  className="
    z-[10000]
    w-56
    rounded-2xl
    border
    border-border/50
    bg-background/95
    p-2
    shadow-xl
    backdrop-blur-xl
  "
>
        <DropdownMenuItem
          asChild
          className="
            cursor-pointer
            rounded-xl
            py-2.5
          "
        >
          <Link
            href="/dashboard"
            className="flex items-center"
          >
            <LayoutDashboard
              className="
                mr-3
                h-4
                w-4
                text-muted-foreground
              "
            />
            Dashboard
          </Link>
        </DropdownMenuItem>

        <DropdownMenuItem
          asChild
          className="
            cursor-pointer
            rounded-xl
            py-2.5
          "
        >
          <Link
            href="/dashboard/profile"
            className="flex items-center"
          >
            <User
              className="
                mr-3
                h-4
                w-4
                text-muted-foreground
              "
            />
            Profile
          </Link>
        </DropdownMenuItem>

        <DropdownMenuItem
          asChild
          className="
            cursor-pointer
            rounded-xl
            py-2.5
          "
        >
          <Link
            href="/dashboard/purchases"
            className="flex items-center"
          >
            <ShoppingCart
              className="
                mr-3
                h-4
                w-4
                text-muted-foreground
              "
            />
            Purchases
          </Link>
        </DropdownMenuItem>

        <DropdownMenuItem
          asChild
          className="
            cursor-pointer
            rounded-xl
            py-2.5
          "
        >
          <Link
            href="/dashboard/referrals"
            className="flex items-center"
          >
            <Gift
              className="
                mr-3
                h-4
                w-4
                text-muted-foreground
              "
            />
            Referrals
          </Link>
        </DropdownMenuItem>

        <DropdownMenuItem
          asChild
          className="
            cursor-pointer
            rounded-xl
            py-2.5
          "
        >
          <Link
            href="/dashboard/subscriptions"
            className="flex items-center"
          >
            <CreditCard
              className="
                mr-3
                h-4
                w-4
                text-muted-foreground
              "
            />
            Subscriptions
          </Link>
        </DropdownMenuItem>

        <div
          className="
            my-2
            border-t
            border-border/50
          "
        />

        <DropdownMenuItem
          onClick={logout}
          className="
            cursor-pointer
            rounded-xl
            py-2.5
            text-destructive
            focus:bg-destructive/10
            focus:text-destructive
          "
        >
          <LogOut
            className="
              mr-3
              h-4
              w-4
            "
          />
          Logout
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}