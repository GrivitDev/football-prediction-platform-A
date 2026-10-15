'use client';

import { LogOut, ShieldCheck } from 'lucide-react';

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';

import { Button } from '@/components/ui/button';

import { useSessions } from '@/hooks/useSessions';

export default function LogoutDialog() {
  const { logoutCurrent, loggingOut } = useSessions();

  async function handleLogout() {
    await logoutCurrent();
  }

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button
          variant="outline"
          className="
            h-8
            shrink-0
            rounded-md
            border-amber-500/25
            px-2.5
            text-[11px]
            font-medium
            text-amber-600
            hover:bg-amber-500/5
            hover:text-amber-600
            dark:text-amber-400
          "
        >
          <LogOut className="mr-1.5 h-3.5 w-3.5" />
          Logout
        </Button>
      </AlertDialogTrigger>

      <AlertDialogContent className="sm:max-w-md">
        <AlertDialogHeader className="space-y-2">
          <div className="flex items-center gap-2.5">
            <div
              className="
                flex
                h-8
                w-8
                shrink-0
                items-center
                justify-center
                rounded-lg
                border
                border-amber-500/20
                bg-amber-500/10
                text-amber-600
                dark:text-amber-400
              "
            >
              <LogOut className="h-4 w-4" />
            </div>

            <AlertDialogTitle className="text-base">
              Logout
            </AlertDialogTitle>
          </div>

          <AlertDialogDescription className="text-xs leading-5">
            You are about to sign out of your account on this device.
          </AlertDialogDescription>
        </AlertDialogHeader>

        <div
          className="
            flex
            items-start
            gap-2.5
            rounded-lg
            border
            border-border
            bg-muted/30
            p-3
          "
        >
          <ShieldCheck className="mt-0.5 h-4 w-4 shrink-0 text-muted-foreground" />

          <p className="text-xs leading-5 text-muted-foreground">
            Your account and subscription remain unchanged. You can sign in
            again at any time.
          </p>
        </div>

        <AlertDialogFooter className="gap-2">
          <AlertDialogCancel className="h-8 rounded-md px-3 text-xs">
            Stay Logged In
          </AlertDialogCancel>

          <AlertDialogAction
            onClick={handleLogout}
            disabled={loggingOut}
            className="
              h-8
              rounded-md
              bg-amber-500
              px-3
              text-xs
              text-black
              hover:bg-amber-400
            "
          >
            <LogOut className="mr-1.5 h-3.5 w-3.5" />

            {loggingOut ? 'Logging out...' : 'Logout'}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}