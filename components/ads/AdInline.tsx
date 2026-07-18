'use client';


import {
  useEffect,
} from 'react';



import Image from 'next/image';



import {
  ExternalLink,
} from 'lucide-react';



import {
  Button,
} from '@/components/ui/button';



import {
  Card,
  CardContent,
} from '@/components/ui/card';



import {
  AdminAd,
} from '@/types/ad';



import {
  useRecordAdClick,
  useRecordAdImpression,
} from '@/hooks/useAds';







interface AdInlineProps {

  ads:AdminAd[];

}








export function AdInline({

  ads,

}:AdInlineProps){



  const impressionMutation =
    useRecordAdImpression();



  const clickMutation =
    useRecordAdClick();








  useEffect(()=>{


    ads.forEach(
      (ad)=>{


        impressionMutation.mutate(
          ad._id,
        );


      },
    );



  },[]);








  if(!ads.length){

    return null;

  }









  return (

    <div
      className="
        space-y-4
      "
    >




      {
        ads.map(
          (ad)=>(


            <Card

              key={ad._id}

              className="
                surface
              "

            >



              <CardContent

                className="
                  flex
                  gap-4
                  p-4
                "

              >






                {/* IMAGE */}



                <div

                  className="
                    relative
                    h-24
                    w-24
                    shrink-0
                    overflow-hidden
                    rounded-lg
                  "

                >



                  <Image

                    src={ad.image.url}

                    alt={ad.title}

                    fill

                    className="
                      object-cover
                    "

                  />


                </div>









                {/* CONTENT */}



                <div
                  className="
                    flex-1
                    space-y-2
                  "
                >




                  <h3
                    className="
                      font-semibold
                    "
                  >

                    {ad.title}

                  </h3>






                  {
                    ad.subTitle && (

                      <p
                        className="
                          text-sm
                          text-muted-foreground
                        "
                      >

                        {ad.subTitle}

                      </p>

                    )
                  }







                  {
                    ad.actions.length > 0 && (

                      <div
                        className="
                          flex
                          flex-wrap
                          gap-2
                        "
                      >


                        {
                          ad.actions.map(
                            (action)=>(


                              <Button

                                key={
                                  action.label
                                }

                                size="sm"

                                asChild


                              >


                                <a

                                  href={action.url}

                                  target="_blank"

                                  rel="noopener noreferrer"



                                  onClick={()=>


                                    clickMutation.mutate(
                                      ad._id,
                                    )


                                  }


                                >

                                  {action.label}


                                  <ExternalLink

                                    className="
                                      ml-2
                                      size-3
                                    "

                                  />


                                </a>


                              </Button>


                            )
                          )
                        }



                      </div>

                    )
                  }





                </div>





              </CardContent>



            </Card>


          )
        )
      }





    </div>

  );


}