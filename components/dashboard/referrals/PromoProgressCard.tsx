'use client';


import {
  useQuery,
} from '@tanstack/react-query';



import {
  Gift,
  Target,
  Trophy,
  Crown,
  Wallet,
} from 'lucide-react';



import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';



import {
  getMyPromoProgress,
} from '@/services/promos.service';





export function PromoProgressCard(){


  const {
    data:progress = [],
    isLoading,
  } = useQuery({

    queryKey:[
      'promo-progress',
    ],


    queryFn:
      getMyPromoProgress,

  });






  if(isLoading){

    return (

      <Card>

        <CardContent className="p-6">

          Loading progress...

        </CardContent>

      </Card>

    );

  }







  if(progress.length === 0){

    return (

      <Card className="surface-card">


        <CardContent className="p-6 text-muted-foreground">


          Join a referral campaign to start earning rewards.


        </CardContent>


      </Card>

    );

  }







  return (

    <div className="space-y-5">



      <div>


        <h2 className="text-xl font-semibold">

          My Promo Progress

        </h2>


        <p className="text-sm text-muted-foreground">

          Track your referral rewards.

        </p>


      </div>








      <div className="grid gap-5">


        {
          progress.map((promo:any)=>{



            const percentage =

              promo.targetCount === 0

              ?

              0

              :

              Math.min(

                100,

                Math.round(

                  (
                    promo.currentProgress /

                    promo.targetCount

                  )

                  *

                  100,

                ),

              );






            return (

              <Card

                key={promo.promoId}

                className="surface-card"

              >


                <CardHeader>


                  <CardTitle className="flex items-center gap-2">


                    <Gift className="h-5 w-5"/>


                    {promo.name}


                  </CardTitle>


                </CardHeader>





                <CardContent className="space-y-5">





                  <p className="text-sm text-muted-foreground">

                    {promo.description}

                  </p>








                  <div>


                    <div className="flex justify-between text-sm">


                      <span>

                        Progress

                      </span>


                      <span>

                        {promo.currentProgress}

                        /

                        {promo.targetCount}

                      </span>


                    </div>





                    <div className="mt-2 h-3 rounded-full bg-muted overflow-hidden">


                      <div

                        className="h-full rounded-full bg-primary transition-all"

                        style={{

                          width:`${percentage}%`

                        }}

                      />



                    </div>


                  </div>








                  <div className="grid gap-4 md:grid-cols-3">





                    <div className="rounded-lg border p-4">


                      <div className="flex items-center gap-2 text-sm text-muted-foreground">


                        <Target className="h-4 w-4"/>


                        Next Reward


                      </div>


                      <p className="mt-1 font-semibold">


                        {
                          promo.remainingToNextReward
                        }

                        {' '}

                        referrals left


                      </p>


                    </div>








                    <div className="rounded-lg border p-4">


                      <div className="flex items-center gap-2 text-sm text-muted-foreground">


                        <Trophy className="h-4 w-4"/>


                        Claimed


                      </div>


                      <p className="mt-1 font-semibold">


                        {promo.completedClaims}


                      </p>


                    </div>








                    <div className="rounded-lg border p-4">


                      <div className="flex items-center gap-2 text-sm text-muted-foreground">


                        {
                          promo.rewardType === 'cash'

                          ?

                          <Wallet className="h-4 w-4"/>

                          :

                          <Crown className="h-4 w-4"/>

                        }


                        Reward


                      </div>


                      <p className="mt-1 font-semibold">


                        {

                          promo.rewardType === 'cash'

                          ?

                          `₦${promo.rewardAmount}`

                          :

                          `${promo.rewardPlan} ${promo.rewardDurationDays} days`

                        }


                      </p>


                    </div>





                  </div>






                  {
                    promo.completed && (

                      <div className="rounded-lg border p-4 flex items-center gap-2">


                        <Trophy className="h-5 w-5"/>


                        Campaign completed


                      </div>

                    )
                  }




                </CardContent>



              </Card>


            );



          })
        }



      </div>



    </div>

  );

}