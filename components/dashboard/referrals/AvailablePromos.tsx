'use client';


import {
  useMutation,
  useQuery,
  useQueryClient,
} from '@tanstack/react-query';


import {
  Gift,
  Users,
  Crown,
  Wallet,
  Check,
} from 'lucide-react';



import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';



import {
  Button,
} from '@/components/ui/button';



import {
  getReferralPromos,
  joinPromo,
} from '@/services/promos.service';



import {
  toast,
} from 'sonner';





export function AvailablePromos(){


  const queryClient =
    useQueryClient();




  const {
    data:promos = [],
    isLoading,
  } = useQuery({

    queryKey:[
      'active-referral-promos',
    ],


    queryFn:
      getReferralPromos,

  });







  const joinMutation =
    useMutation({

      mutationFn:
        joinPromo,


      onSuccess(){

        toast.success(
          'Campaign joined successfully',
        );


        queryClient.invalidateQueries({

          queryKey:[
            'promo-progress',
          ],

        });


      },


      onError(){

        toast.error(
          'Unable to join campaign',
        );

      },

    });







  if(isLoading){

    return (

      <Card>

        <CardContent className="p-6">

          Loading campaigns...

        </CardContent>

      </Card>

    );

  }






  if(promos.length === 0){

    return (

      <Card className="surface-card">


        <CardContent className="p-6 text-muted-foreground">

          No active referral campaigns available.

        </CardContent>


      </Card>

    );

  }






  return (

    <div className="space-y-5">



      <div>


        <h2 className="text-xl font-semibold">

          Available Referral Campaigns

        </h2>


        <p className="text-sm text-muted-foreground">

          Join campaigns and unlock rewards.

        </p>


      </div>





      <div className="grid gap-5 md:grid-cols-2">



        {
          promos.map((promo:any)=>{


            return (

              <Card
                key={promo._id}
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






                  <div className="grid grid-cols-2 gap-4">


                    <div className="rounded-lg border p-3">


                      <div className="flex items-center gap-2 text-sm text-muted-foreground">


                        <Users className="h-4 w-4"/>


                        Requirement


                      </div>


                      <p className="mt-1 font-semibold">


                        {promo.targetCount} referrals


                      </p>


                    </div>







                    <div className="rounded-lg border p-3">


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






                  <Button

                    className="w-full"

                    onClick={()=>{

                      joinMutation.mutate(
                        promo._id,
                      );

                    }}

                    disabled={
                      joinMutation.isPending
                    }

                  >


                    <Check className="mr-2 h-4 w-4"/>


                    Join Campaign


                  </Button>






                </CardContent>


              </Card>

            );


          })
        }



      </div>



    </div>

  );

}