'use client';

import type { ReactNode } from 'react';

import type { LucideIcon } from 'lucide-react';

import {
  Card,
  CardContent,
} from '@/components/ui/card';

import { AnimatedCounter } from './AnimatedCounter';

import { cn } from '@/lib/utils';



interface StatCardProps {
  title: string;
  value: number | ReactNode;
  icon: LucideIcon;
  description?: string;
  className?: string;
}



export function StatCard({
  title,
  value,
  icon: Icon,
  description,
  className,
}: StatCardProps) {


  const isNumber =
    typeof value === 'number';



  return (

    <Card
      className={cn(
        `
          surface-card
          group
          relative
          overflow-hidden
          border-border/50
          bg-card/80
          backdrop-blur-xl
          transition-all
          duration-500
          hover:-translate-y-1
          hover:shadow-2xl
          active:scale-[0.99]
        `,
        className,
      )}
    >


      {/* Ambient glow */}

      <div
        className="
          pointer-events-none
          absolute
          -right-16
          -top-16
          h-40
          w-40
          rounded-full
          bg-primary/20
          blur-3xl
          opacity-70
          transition-transform
          duration-700
          group-hover:scale-125
        "
      />


      <div
        className="
          pointer-events-none
          absolute
          inset-0
          bg-gradient-to-br
          from-primary/10
          via-transparent
          to-transparent
        "
      />



      <CardContent
        className="
          relative
          z-10
          p-5
          sm:p-6
        "
      >


        <div
          className="
            flex
            flex-col
            gap-5
            sm:flex-row
            sm:items-start
            sm:justify-between
          "
        >


          <div
            className="
              min-w-0
              space-y-2
            "
          >


            <p
              className="
                text-xs
                font-semibold
                uppercase
                tracking-[0.15em]
                text-muted-foreground
                sm:text-sm
              "
            >
              {title}
            </p>



            <h3
              className="
                overflow-hidden
                text-xl
                font-black
                tracking-tight
                sm:text-xl
              "
            >

              {
                isNumber ? (

                  <AnimatedCounter
                    value={value as number}
                  />

                ) : (

                  value

                )
              }

            </h3>



            {
              description && (

                <p
                  className="
                    max-w-xs
                    text-xs
                    leading-relaxed
                    text-muted-foreground
                    sm:text-sm
                  "
                >
                  {description}
                </p>

              )
            }


          </div>




          {/* Icon */}

          <div
            className="
              relative
              flex
              h-12
              w-12
              shrink-0
              items-center
              justify-center
              self-end
              rounded-2xl
              border
              border-primary/20
              bg-gradient-to-br
              from-primary/20
              via-primary/10
              to-transparent
              shadow-lg
              transition-transform
              duration-500
              group-hover:-translate-y-1
              sm:self-auto
              sm:h-14
              sm:w-14
            "
          >

            <div
              className="
                absolute
                inset-0
                rounded-2xl
                bg-primary/20
                blur-xl
                opacity-40
              "
            />


            <Icon
              className="
                relative
                h-6
                w-6
                text-primary
                sm:h-7
                sm:w-7
              "
            />


          </div>


        </div>


      </CardContent>


    </Card>

  );

}