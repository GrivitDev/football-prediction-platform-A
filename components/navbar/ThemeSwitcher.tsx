'use client';

import { Moon, Sun, Monitor } from 'lucide-react';
import { useTheme } from 'next-themes';

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

import { Button } from '@/components/ui/button';

export default function ThemeSwitcher() {
  const { setTheme } = useTheme();

  return (
    <DropdownMenu>

      {/* TRIGGER */}
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="
            relative rounded-full
            border border-border/60
            bg-muted/30 backdrop-blur-md
            text-foreground hover:bg-muted/50
            transition
          "
        >
          <Sun className="h-5 w-5 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
          <Moon className="absolute h-5 w-5 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />

          <span className="sr-only">Toggle Theme</span>
        </Button>
      </DropdownMenuTrigger>

      {/* CONTENT */}
      <DropdownMenuContent
        align="end"
        className="
          w-48 rounded-xl
          border border-border/60
          bg-background/95 backdrop-blur-xl
          text-foreground shadow-sm
        "
      >

        {/* subtle gradient top accent */}
        <div className="h-[1px] w-full bg-gradient-to-r from-indigo-500/20 via-sky-500/20 to-emerald-500/20" />

        <DropdownMenuItem
          onClick={() => setTheme('light')}
          className="
            cursor-pointer flex items-center gap-2
            rounded-md px-2 py-2
            focus:bg-muted/50
          "
        >
          <Sun className="h-4 w-4 opacity-70" />
          Light
        </DropdownMenuItem>

        <DropdownMenuItem
          onClick={() => setTheme('dark')}
          className="
            cursor-pointer flex items-center gap-2
            rounded-md px-2 py-2
            focus:bg-muted/50
          "
        >
          <Moon className="h-4 w-4 opacity-70" />
          Dark
        </DropdownMenuItem>

        <DropdownMenuItem
          onClick={() => setTheme('system')}
          className="
            cursor-pointer flex items-center gap-2
            rounded-md px-2 py-2
            focus:bg-muted/50
          "
        >
          <Monitor className="h-4 w-4 opacity-70" />
          System
        </DropdownMenuItem>

      </DropdownMenuContent>
    </DropdownMenu>
  );
}