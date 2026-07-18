'use client';


import {
  useEffect,
} from 'react';



import {
  AdminAd,
} from '@/types/ad';



import {
  useRecordAdClick,
  useRecordAdImpression,
} from '@/hooks/useAds';






interface AdTrackerProps {


  ad:AdminAd;


  children:React.ReactNode;


}







export function AdTracker({

  ad,

  children,

}:AdTrackerProps){



  const impressionMutation =
    useRecordAdImpression();



  const clickMutation =
    useRecordAdClick();








  useEffect(()=>{


    impressionMutation.mutate(
      ad._id,
    );


  },[ad._id]);









  function handleClick(){


    clickMutation.mutate(
      ad._id,
    );


  }









  return (

    <div

      onClick={handleClick}

    >

      {children}


    </div>

  );


}