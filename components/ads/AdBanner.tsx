'use client';


import Image from 'next/image';



import {
  useEffect,
} from 'react';



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







interface AdBannerProps {

  ads:AdminAd[];

}






export function AdBanner({

  ads,

}:AdBannerProps){



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


      }
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
                overflow-hidden
              "

            >



              <CardContent
                className="
                  flex
                  flex-col
                  gap-5
                  p-5
                  md:flex-row
                  md:items-center
                "
              >





                {/* IMAGE */}



                <div
                  className="
                    relative
                    h-40
                    w-full
                    overflow-hidden
                    rounded-xl
                    md:w-72
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
                    space-y-3
                  "
                >



                  <h3
                    className="
                      text-xl
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
                    ad.description && (

                      <p
                        className="
                          text-sm
                          text-muted-foreground
                        "
                      >

                        {ad.description}

                      </p>

                    )
                  }









                  {
                    ad.actions.length > 0 && (

                      <div
                        className="
                          flex
                          flex-wrap
                          gap-3
                        "
                      >


                        {
                          ad.actions.map(
                            (action)=>(


                              <Button

                                key={
                                  action.label
                                }

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
                                      size-4
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