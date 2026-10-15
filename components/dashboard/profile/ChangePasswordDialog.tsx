'use client';

import { useState } from 'react';

import {
  KeyRound,
  Lock,
} from 'lucide-react';

import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

import { toast } from 'sonner';

import { changePassword } from '@/services/auth.service';

import { Button } from '@/components/ui/button';

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';

import { Input } from '@/components/ui/input';

const schema = z
  .object({
    currentPassword: z
      .string()
      .min(
        6,
        'Current password is required',
      ),

    newPassword: z
      .string()
      .min(
        6,
        'Password must be at least 6 characters',
      ),

    confirmPassword: z.string(),
  })
  .refine(
    (data) =>
      data.newPassword ===
      data.confirmPassword,
    {
      path: ['confirmPassword'],
      message: 'Passwords do not match',
    },
  );

type FormValues =
  z.infer<typeof schema>;

export default function ChangePasswordDialog() {
  const [open, setOpen] =
    useState(false);

  const [loading, setLoading] =
    useState(false);

  const form =
    useForm<FormValues>({
      resolver:
        zodResolver(schema),

      defaultValues: {
        currentPassword: '',
        newPassword: '',
        confirmPassword: '',
      },
    });

  async function onSubmit(
    values: FormValues,
  ) {
    try {
      setLoading(true);

      const response =
        await changePassword({
          currentPassword:
            values.currentPassword,

          newPassword:
            values.newPassword,
        });

      toast.success(
        response.message ??
          'Password changed successfully.',
      );

      form.reset();
      setOpen(false);
    } catch (error: any) {
      toast.error(
        error?.response?.data?.message ??
          'Failed to change password.',
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <Dialog
      open={open}
      onOpenChange={setOpen}
    >
      <DialogTrigger asChild>
        <Button
          variant="outline"
          className="
            h-9
            rounded-lg
            px-3
            text-xs
            font-medium
          "
        >
          <KeyRound className="mr-1.5 h-3.5 w-3.5" />
          Change Password
        </Button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-md">
        <DialogHeader className="space-y-1">
          <div className="flex items-center gap-2.5">
            <div
              className="
                flex
                h-8
                w-8
                items-center
                justify-center
                rounded-lg
                border
                bg-muted
                text-muted-foreground
              "
            >
              <KeyRound className="h-4 w-4" />
            </div>

            <div>
              <DialogTitle className="text-base">
                Change Password
              </DialogTitle>

              <DialogDescription className="text-xs">
                Update your account password.
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(
              onSubmit,
            )}
            className="space-y-4 pt-2"
          >
            <FormField
              control={form.control}
              name="currentPassword"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-xs">
                    Current Password
                  </FormLabel>

                  <FormControl>
                    <div className="relative">
                      <Lock
                        className="
                          absolute
                          left-3
                          top-1/2
                          h-3.5
                          w-3.5
                          -translate-y-1/2
                          text-muted-foreground
                        "
                      />

                      <Input
                        type="password"
                        {...field}
                        className="
                          h-9
                          rounded-lg
                          pl-9
                          text-sm
                        "
                      />
                    </div>
                  </FormControl>

                  <FormMessage className="text-xs" />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="newPassword"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-xs">
                    New Password
                  </FormLabel>

                  <FormControl>
                    <div className="relative">
                      <Lock
                        className="
                          absolute
                          left-3
                          top-1/2
                          h-3.5
                          w-3.5
                          -translate-y-1/2
                          text-muted-foreground
                        "
                      />

                      <Input
                        type="password"
                        {...field}
                        className="
                          h-9
                          rounded-lg
                          pl-9
                          text-sm
                        "
                      />
                    </div>
                  </FormControl>

                  <FormMessage className="text-xs" />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="confirmPassword"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-xs">
                    Confirm Password
                  </FormLabel>

                  <FormControl>
                    <div className="relative">
                      <Lock
                        className="
                          absolute
                          left-3
                          top-1/2
                          h-3.5
                          w-3.5
                          -translate-y-1/2
                          text-muted-foreground
                        "
                      />

                      <Input
                        type="password"
                        {...field}
                        className="
                          h-9
                          rounded-lg
                          pl-9
                          text-sm
                        "
                      />
                    </div>
                  </FormControl>

                  <FormMessage className="text-xs" />
                </FormItem>
              )}
            />

            <DialogFooter className="pt-1">
              <Button
                type="submit"
                disabled={loading}
                className="
                  h-9
                  rounded-lg
                  px-4
                  text-xs
                "
              >
                {loading
                  ? 'Updating...'
                  : 'Change Password'}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}