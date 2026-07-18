'use client';


import {
  useQuery,
} from '@tanstack/react-query';



import {
  CheckCircle,
  Clock,
  Crown,
  ShoppingBag,
  UserPlus,
} from 'lucide-react';



import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';



import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';



import {
  getMyReferrals,
} from '@/services/referrals.service';





export function ReferralTable(){


  const {
    data:referrals = [],
    isLoading,
  } = useQuery({

    queryKey:[
      'my-referrals',
    ],


    queryFn:
      getMyReferrals,

  });







  if(isLoading){

    return (

      <Card>

        <CardContent className="p-6">

          Loading referrals...

        </CardContent>


      </Card>

    );

  }







  if(referrals.length === 0){

    return (

      <Card className="surface-card">


        <CardContent className="p-6 text-muted-foreground">


          You have not referred anyone yet.


        </CardContent>


      </Card>

    );

  }







  return (

    <Card className="surface-card">


      <CardHeader>


        <CardTitle className="flex items-center gap-2">


          <UserPlus className="h-5 w-5"/>


          My Referrals


        </CardTitle>


      </CardHeader>





      <CardContent>


        <div className="rounded-lg border overflow-hidden">


          <Table>


            <TableHeader>


              <TableRow>


                <TableHead>

                  User

                </TableHead>



                <TableHead>

                  Registered

                </TableHead>



                <TableHead>

                  Regular

                </TableHead>



                <TableHead>

                  VIP

                </TableHead>



                <TableHead>

                  Purchase

                </TableHead>



                <TableHead>

                  Date

                </TableHead>


              </TableRow>


            </TableHeader>






            <TableBody>


              {
                referrals.map((referral:any)=>{


                  const user =
                    referral.referredUserId;





                  return (

                    <TableRow

                      key={referral._id}

                    >


                      <TableCell>


                        <div>


                          <p className="font-medium">

                            {
                              user?.username ??
                              'User'

                            }

                          </p>


                          <p className="text-sm text-muted-foreground">

                            {
                              user?.email

                            }

                          </p>


                        </div>


                      </TableCell>







                      <TableCell>


                        {
                          referral.registered

                          ?

                          <CheckCircle className="h-5 w-5"/>

                          :

                          <Clock className="h-5 w-5"/>

                        }


                      </TableCell>







                      <TableCell>


                        {
                          referral.regularSubscription

                          ?

                          <CheckCircle className="h-5 w-5"/>

                          :

                          '-'

                        }


                      </TableCell>







                      <TableCell>


                        {
                          referral.vipSubscription

                          ?

                          <Crown className="h-5 w-5"/>

                          :

                          '-'

                        }


                      </TableCell>







                      <TableCell>


                        {
                          referral.predictionPurchased

                          ?

                          <ShoppingBag className="h-5 w-5"/>

                          :

                          '-'

                        }


                      </TableCell>







                      <TableCell>


                        {
                          new Date(
                            referral.createdAt,
                          )
                          .toLocaleDateString()

                        }


                      </TableCell>




                    </TableRow>

                  );


                })
              }



            </TableBody>



          </Table>



        </div>


      </CardContent>



    </Card>

  );

}