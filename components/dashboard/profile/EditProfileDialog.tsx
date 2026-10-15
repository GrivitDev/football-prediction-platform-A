'use client';

import { useEffect } from 'react';

import {
  Pencil,
  User2,
  Phone,
} from 'lucide-react';

import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

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

import { useProfile } from '@/hooks/useProfile';

import type { User } from '@/types/user';

const schema = z.object({
  fullName: z
    .string()
    .min(
      3,
      'Full name is required',
    ),

  phoneNumber: z
    .string()
    .min(
      11,
      'Phone number is invalid',
    ),
});

type FormValues =
  z.infer<typeof schema>;

interface Props {
  user: User;
}

export default function EditProfileDialog({
  user,
}: Props) {
  const {
    updateProfile,
    updating,
  } = useProfile();

  const form =
    useForm<FormValues>({
      resolver:
        zodResolver(schema),

      defaultValues: {
        fullName:
          user.fullName,

        phoneNumber:
          user.phoneNumber || '',
      },
    });

  useEffect(() => {
    form.reset({
      fullName:
        user.fullName,

      phoneNumber:
        user.phoneNumber || '',
    });
  }, [user, form]);

  async function onSubmit(
    values: FormValues,
  ) {
    await updateProfile(values);
  }

  return (
    <Dialog>
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
          <Pencil className="mr-1.5 h-3.5 w-3.5" />
          Edit Profile
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
              <Pencil className="h-4 w-4" />
            </div>

            <div>
              <DialogTitle className="text-base">
                Edit Profile
              </DialogTitle>

              <DialogDescription className="text-xs">
                Update your basic account information.
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
              name="fullName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-xs">
                    Full Name
                  </FormLabel>

                  <FormControl>
                    <div className="relative">
                      <User2
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
                        {...field}
                        placeholder="John Doe"
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
              name="phoneNumber"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-xs">
                    Phone Number
                  </FormLabel>

                  <FormControl>
                    <div className="relative">
                      <Phone
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
                        {...field}
                        placeholder="+234..."
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
                disabled={updating}
                className="
                  h-9
                  rounded-lg
                  px-4
                  text-xs
                "
              >
                <Pencil className="mr-1.5 h-3.5 w-3.5" />

                {updating
                  ? 'Saving...'
                  : 'Save Changes'}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}