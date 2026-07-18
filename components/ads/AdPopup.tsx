'use client';


import {
  useEffect,
  useState,
} from 'react';


import Image from 'next/image';



import {
  X,
  ExternalLink,
} from 'lucide-react';



import {
  Button,
} from '@/components/ui/button';



import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';



import {
  AdminAd,
} from '@/types/ad';



import {
  useRecordAdClick,
  useRecordAdImpression,
} from '@/hooks/useAds';







interface AdPopupProps {

  ads:AdminAd[];

}







export function AdPopup({

  ads,

}:AdPopupProps){



  const [
    open,
    setOpen,
  ] = useState(false);




  const [
    currentAd,
    setCurrentAd,
  ] = useState<AdminAd | null>(null);





  const impressionMutation =
    useRecordAdImpression();



  const clickMutation =
    useRecordAdClick();







  useEffect(()=>{


    if(!ads.length){

      return;

    }



    const ad =
      ads[0];



    setCurrentAd(ad);

    setOpen(true);



    impressionMutation.mutate(
      ad._id,
    );



  },[ads]);











  function closePopup(){


    setOpen(false);


  }









  if(
    !open ||
    !currentAd
  ){

    return null;

  }










  return (

    <div

      className="
        fixed
        inset-0
        z-50
        flex
        items-center
        justify-center
        bg-black/50
        p-4
      "

    >




      <Card

        className="
          relative
          w-full
          max-w-lg
          surface
        "

      >




        <Button

          size="icon"

          variant="ghost"

          className="
            absolute
            right-3
            top-3
          "

          onClick={closePopup}

        >

          <X className="size-4"/>

        </Button>









        {/* IMAGE */}



        <div

          className="
            relative
            h-64
            overflow-hidden
            rounded-t-xl
          "

        >


          <Image

            src={currentAd.image.url}

            alt={currentAd.title}

            fill

            className="
              object-cover
            "

          />


        </div>









        <CardHeader>


          <CardTitle>

            {currentAd.title}

          </CardTitle>



          {
            currentAd.subTitle && (

              <p
                className="
                  text-sm
                  text-muted-foreground
                "
              >

                {currentAd.subTitle}

              </p>

            )
          }



        </CardHeader>









        <CardContent>


          {
            currentAd.description && (

              <p
                className="
                  text-sm
                  text-muted-foreground
                "
              >

                {currentAd.description}

              </p>

            )
          }



        </CardContent>









        {
          currentAd.actions.length > 0 && (


            <CardFooter

              className="
                flex
                flex-wrap
                gap-3
              "

            >



              {
                currentAd.actions.map(
                  (action)=>(


                    <Button

                      key={action.label}

                      asChild


                    >

                      <a

                        href={action.url}

                        target="_blank"

                        rel="noopener noreferrer"


                        onClick={()=>


                          clickMutation.mutate(
                            currentAd._id,
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



            </CardFooter>


          )
        }



      </Card>



    </div>

  );


}