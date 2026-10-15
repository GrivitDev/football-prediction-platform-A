'use client';

import { AlertTriangle, Trash2 } from 'lucide-react';

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

import { useProfile } from '@/hooks/useProfile';

export default function DeleteAccountDialog() {
  const { deleteAccount, deleting } = useProfile();

  async function handleDelete() {
    await deleteAccount();
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
            border-destructive/25
            px-2.5
            text-[11px]
            font-medium
            text-destructive
            hover:bg-destructive/5
            hover:text-destructive
          "
        >
          <Trash2 className="mr-1.5 h-3.5 w-3.5" />
          Delete
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
                border-destructive/20
                bg-destructive/10
                text-destructive
              "
            >
              <AlertTriangle className="h-4 w-4" />
            </div>

            <AlertDialogTitle className="text-base">
              Delete Account
            </AlertDialogTitle>
          </div>

          <AlertDialogDescription className="text-xs leading-5">
            This action is permanent and cannot be undone.
          </AlertDialogDescription>
        </AlertDialogHeader>

        <div
          className="
            rounded-lg
            border
            border-destructive/20
            bg-destructive/5
            p-3
            text-xs
          "
        >
          <p className="font-medium text-destructive">
            The following will be removed:
          </p>

          <ul className="mt-2 space-y-1 text-muted-foreground">
            <li>• Profile information</li>
            <li>• Prediction history</li>
            <li>• Purchases and subscriptions</li>
            <li>• Referral and reward records</li>
          </ul>
        </div>

        <AlertDialogFooter className="gap-2">
          <AlertDialogCancel className="h-8 rounded-md px-3 text-xs">
            Cancel
          </AlertDialogCancel>

          <AlertDialogAction
            onClick={handleDelete}
            disabled={deleting}
            className="
              h-8
              rounded-md
              bg-destructive
              px-3
              text-xs
              text-destructive-foreground
              hover:bg-destructive/90
            "
          >
            <Trash2 className="mr-1.5 h-3.5 w-3.5" />

            {deleting ? 'Deleting...' : 'Delete Account'}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}