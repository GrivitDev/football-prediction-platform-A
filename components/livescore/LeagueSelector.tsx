'use client';


import Link from 'next/link';

import {
  useLivescoreLeagues
} from '@/hooks/useLivescore';



export default function LeagueSelector(){

  const {
    data: leagues,
    isLoading,
  } = useLivescoreLeagues();



  if(isLoading){

    return (
      <div>
        Loading leagues...
      </div>
    );

  }



  return (

    <div className="
      grid
      grid-cols-1
      sm:grid-cols-2
      md:grid-cols-3
      lg:grid-cols-4
      gap-4
    ">


      {
        leagues
        ?.filter(
          league =>
            league.isTracked
        )
        .map(
          league=>(

          <Link

            key={league.code}

            href={
              `/livescore/${league.code}`
            }

            className="
              rounded-xl
              border
              border-border
              bg-card
              p-5
              hover:border-primary
              transition
            "

          >

            <div className="
              flex
              items-center
              gap-3
            ">


              {
                league.emblem && (

                  <img

                    src={league.emblem}

                    alt={league.name}

                    className="
                      h-10
                      w-10
                      object-contain
                    "

                  />

                )
              }


              <div>

                <h3 className="
                  font-semibold
                ">

                  {league.name}

                </h3>


                <p className="
                  text-sm
                  text-muted-foreground
                ">

                  {league.country}

                </p>


              </div>


            </div>


          </Link>


        ))

      }


    </div>

  );

}