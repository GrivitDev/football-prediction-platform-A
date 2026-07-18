'use client';


import {
  useQuery,
} from '@tanstack/react-query';



import {
  Gift,
  Crown,
  Wallet,
  CheckCircle,
  Clock,
} from 'lucide-react';



import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';



import {
  getMyRewards,
} from '@/services/promos.service';





export function RewardHistory(){


  const {
    data:rewards = [],
    isLoading,
  } = useQuery({

    queryKey:[
      'my-rewards',
    ],


    queryFn:
      getMyRewards,

  });






  if(isLoading){

    return (

      <Card>

        <CardContent className="p-6">

          Loading rewards...

        </CardContent>

      </Card>

    );

  }






  if(rewards.length === 0){

    return (

      <Card className="surface-card">


        <CardContent className="p-6 text-muted-foreground">


          No rewards earned yet.


        </CardContent>


      </Card>

    );

  }






  return (

    <Card className="surface-card">


      <CardHeader>


        <CardTitle className="flex items-center gap-2">


          <Gift className="h-5 w-5"/>


          Reward History


        </CardTitle>


      </CardHeader>





      <CardContent className="space-y-4">


        {
          rewards.map((reward:any)=>{


            return (

              <div

                key={reward._id}

                className="rounded-lg border p-4 flex items-center justify-between"

              >


                <div className="space-y-1">


                  <div className="flex items-center gap-2">


                    {
                      reward.type === 'cash'

                      ?

                      <Wallet className="h-4 w-4"/>

                      :

                      <Crown className="h-4 w-4"/>

                    }



                    <p className="font-semibold">

                      {
                        reward.promoId?.name ??
                        'Promo Reward'
                      }

                    </p>


                  </div>





                  <p className="text-sm text-muted-foreground">


                    {
                      reward.type === 'cash'

                      ?

                      `₦${reward.amount}`

                      :

                      `${reward.plan} subscription (${reward.durationDays} days)`

                    }


                  </p>




                  <p className="text-xs text-muted-foreground">


                    {
                      new Date(
                        reward.createdAt,
                      )
                      .toLocaleDateString()

                    }


                  </p>


                </div>








                <div>


                  {
                    reward.status === 'paid'

                    ?

                    <CheckCircle className="h-5 w-5"/>

                    :

                    <Clock className="h-5 w-5"/>

                  }


                </div>




              </div>

            );


          })
        }



      </CardContent>



    </Card>

  );

}