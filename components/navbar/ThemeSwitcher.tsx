'use client';

import {
  useSyncExternalStore,
} from 'react';

import {
  Moon,
  Sun,
  Monitor,
  Check,
} from 'lucide-react';

import { useTheme } from 'next-themes';

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

import { Button } from '@/components/ui/button';

export default function ThemeSwitcher() {
  const {
    theme,
    setTheme,
  } = useTheme();

  const mounted = useSyncExternalStore(
    () => () => {},
    () => true,
    () => false,
  );


  if (!mounted) {
    return null;
  }


  const themes = [
    {
      name: 'Light',
      value: 'light',
      icon: Sun,
    },
    {
      name: 'Dark',
      value: 'dark',
      icon: Moon,
    },
    {
      name: 'System',
      value: 'system',
      icon: Monitor,
    },
  ];


  const ActiveIcon =
    theme === 'dark'
      ? Moon
      : theme === 'light'
        ? Sun
        : Monitor;


  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          aria-label="Change theme"
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
          <ActiveIcon className="h-4 w-4" />
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


        {themes.map((item) => {
          const Icon = item.icon;

          const active =
            theme === item.value;

          return (
            <DropdownMenuItem
              key={item.value}
              onClick={() => setTheme(item.value)}
              className="
                flex
                cursor-pointer
                items-center
                justify-between
                rounded-xl
                px-3
                py-2.5
                transition-all
                duration-200
                hover:bg-muted
              "
            >
              <div
                className="
                  flex
                  items-center
                  gap-3
                "
              >
                <span
                  className={`
                    flex
                    h-8
                    w-8
                    items-center
                    justify-center
                    rounded-xl

                    ${
                      active
                        ? `
                          bg-primary/10
                          text-primary
                        `
                        : `
                          bg-muted
                          text-muted-foreground
                        `
                    }
                  `}
                >
                  <Icon className="h-4 w-4" />
                </span>


                <span
                  className="
                    text-sm
                    font-medium
                  "
                >
                  {item.name}
                </span>
              </div>


              {active && (
                <Check
                  className="
                    h-4
                    w-4
                    text-primary
                  "
                />
              )}
            </DropdownMenuItem>
          );
        })}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}