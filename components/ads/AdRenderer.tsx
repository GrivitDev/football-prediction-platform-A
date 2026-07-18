'use client';


import {
  AdminAd,
} from '@/types/ad';


import {
  AdPosition,
} from '@/constants/ads/ad-position';



import {
  AdPopup,
} from './AdPopup';



import {
  AdBanner,
} from './AdBanner';



import {
  AdInline,
} from './AdInline';





interface AdRendererProps {


  ads:AdminAd[];


  position:AdPosition;


}






export function AdRenderer({

  ads,

  position,

}:AdRendererProps){



  const filteredAds =
    ads.filter(
      (ad)=>
        ad.displays.some(
          (display)=>
            display.position === position,
        ),
    );






  if(!filteredAds.length){

    return null;

  }









  switch(position){



    case AdPosition.POPUP:


      return (

        <AdPopup

          ads={filteredAds}

        />

      );








    case AdPosition.HERO:


    case AdPosition.TOP_BANNER:



      return (

        <AdBanner

          ads={filteredAds}

        />

      );









    case AdPosition.INLINE:


      return (

        <AdInline

          ads={filteredAds}

        />

      );








    case AdPosition.SIDEBAR_LEFT:


    case AdPosition.SIDEBAR_RIGHT:



      return (

        <AdBanner

          ads={filteredAds}

        />

      );









    case AdPosition.BOTTOM:


    case AdPosition.FOOTER:



      return (

        <AdBanner

          ads={filteredAds}

        />

      );









    default:

      return null;


  }


}