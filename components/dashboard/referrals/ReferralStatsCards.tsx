'use client';


import {
  useQuery,
} from '@tanstack/react-query';


import {
  Users,
  UserCheck,
  Crown,
  ShoppingBag,
} from 'lucide-react';


import {
  Card,
  CardContent,
} from '@/components/ui/card';


import {
  getReferralStats,
} from '@/services/referrals.service';





export function ReferralStatsCards(){


  const {
    data,
  } = useQuery({

    queryKey:[
      'referral-stats',
    ],


    queryFn:
      getReferralStats,

  });





  const stats = [

    {

      title:
        'Total Referrals',

      value:
        data?.total ?? 0,

      icon:
        Users,

    },


    {

      title:
        'Registered',

      value:
        data?.registered ?? 0,

      icon:
        UserCheck,

    },


    {

      title:
        'VIP Subscribers',

      value:
        data?.vipSubscribers ?? 0,

      icon:
        Crown,

    },


    {

      title:
        'Prediction Purchases',

      value:
        data?.predictionPurchases ?? 0,

      icon:
        ShoppingBag,

    },

  ];





  return (

    <div className="grid gap-4 md:grid-cols-4">


      {
        stats.map((item)=>{


          const Icon =
            item.icon;



          return (

            <Card
              key={item.title}
              className="surface-card"
            >

              <CardContent className="p-6">


                <div className="flex items-center justify-between">


                  <p className="text-sm text-muted-foreground">

                    {item.title}

                  </p>


                  <Icon className="h-5 w-5"/>


                </div>



                <p className="mt-3 text-3xl font-bold">

                  {item.value}

                </p>


              </CardContent>


            </Card>

          );


        })
      }


    </div>

  );

}