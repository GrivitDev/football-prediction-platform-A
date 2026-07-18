'use client';


import {
  useQuery,
} from '@tanstack/react-query';


import {
  Copy,
  Share2,
  Link as LinkIcon,
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
  getMyReferralLink,
} from '@/services/referrals.service';


import {
  toast,
} from 'sonner';





export function ReferralLinkCard(){


  const {
    data,
    isLoading,
  } = useQuery({

    queryKey:[
      'my-referral-link',
    ],


    queryFn:
      getMyReferralLink,

  });




  async function copyLink(){


    if(!data?.referralUrl){
      return;
    }


    await navigator.clipboard.writeText(
      data.referralUrl,
    );


    toast.success(
      'Referral link copied',
    );

  }





  async function shareLink(){


    if(!data?.referralUrl){
      return;
    }



    if(
      navigator.share
    ){

      await navigator.share({

        title:
          'Join Football Prediction Platform',


        text:
          'Join using my referral link and earn rewards',


        url:
          data.referralUrl,

      });


    }
    else{

      copyLink();

    }

  }





  if(isLoading){

    return (

      <Card>

        <CardContent className="p-6">

          Loading referral link...

        </CardContent>

      </Card>

    );

  }





  return (

    <Card className="surface-card">


      <CardHeader>


        <CardTitle className="flex items-center gap-2">


          <LinkIcon className="h-5 w-5"/>


          My Referral Link


        </CardTitle>


      </CardHeader>





      <CardContent className="space-y-5">



        <div>


          <p className="text-sm text-muted-foreground">

            Referral Code

          </p>


          <p className="mt-1 text-xl font-semibold">

            {data?.referralCode}

          </p>


        </div>





        <div className="rounded-lg border p-4 break-all">


          <p className="text-sm text-muted-foreground mb-2">

            Share this link

          </p>



          <p className="text-sm">

            {data?.referralUrl}

          </p>


        </div>





        <div className="flex gap-3">


          <Button
            onClick={copyLink}
          >

            <Copy className="mr-2 h-4 w-4"/>

            Copy

          </Button>





          <Button
            variant="outline"
            onClick={shareLink}
          >

            <Share2 className="mr-2 h-4 w-4"/>

            Share

          </Button>



        </div>



      </CardContent>



    </Card>

  );

}