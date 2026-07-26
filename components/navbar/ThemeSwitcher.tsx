'use client';

import { useEffect, useState } from 'react';

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


  const [mounted,setMounted] = useState(false);


  useEffect(() => {
    setMounted(true);
  },[]);


  if (!mounted) {
    return null;
  }



  const themes = [
    {
      name:'Light',
      value:'light',
      icon:Sun,
    },

    {
      name:'Dark',
      value:'dark',
      icon:Moon,
    },

    {
      name:'System',
      value:'system',
      icon:Monitor,
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
    className="
      group
      flex
      h-10
      w-10
      items-center
      justify-center
      rounded-xl
      border
      border-border/60
      bg-background/40
      p-0
      backdrop-blur-xl
      transition-all
      hover:border-primary/30
      hover:bg-primary/10

      lg:h-10
      lg:w-10
    "
  >

    <div
      className="
        flex
        h-7
        w-7
        items-center
        justify-center
        rounded-lg
        bg-primary/10
        text-primary
        transition-transform
        group-hover:scale-110
      "
    >

      <ActiveIcon size={16}/>

    </div>

  </Button>

</DropdownMenuTrigger>




      <DropdownMenuContent
        align="start"
        className="
          w-54
          rounded-2xl
          border
          border-border/60
          bg-background/95
          p-1
          shadow-xl
          backdrop-blur-xl
        "
      >



        {
          themes.map(item => {

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
                  px-2
                  py-2
                  transition
                  hover:bg-accent
                "
              >


                <div
                  className="
                    flex
                    items-center
                    gap-1
                  "
                >

                  <div
                    className={`
                      flex
                      h-5
                      w-5
                      items-center
                      justify-center
                      rounded-xl

                      ${
                        active
                          ? 'bg-primary/10 text-primary'
                          : 'bg-muted text-muted-foreground'
                      }
                    `}
                  >

                    <Icon size={18}/>

                  </div>


                  <div>

                    <p
                      className="
                        text-sm
                        font-medium
                      "
                    >
                      {item.name}
                    </p>

                  </div>


                </div>



                {
                  active && (
                    <Check
                      size={18}
                      className="text-primary"
                    />
                  )
                }


              </DropdownMenuItem>

            );

          })
        }


      </DropdownMenuContent>


    </DropdownMenu>

  );

}