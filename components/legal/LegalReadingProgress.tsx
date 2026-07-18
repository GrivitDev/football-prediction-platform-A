'use client';

import { useEffect, useState } from 'react';

export default function LegalReadingProgress() {

  const [progress, setProgress] =
    useState(0);


  useEffect(() => {

    const updateProgress = () => {

      const scrollTop =
        window.scrollY;

      const documentHeight =
        document.documentElement.scrollHeight -
        window.innerHeight;


      const percentage =
        (scrollTop / documentHeight) * 100;


      setProgress(
        Math.min(
          100,
          Math.max(0, percentage)
        )
      );

    };


    window.addEventListener(
      'scroll',
      updateProgress
    );


    return () => {
      window.removeEventListener(
        'scroll',
        updateProgress
      );
    };

  }, []);


  return (
    <div
      className="
        fixed
        left-0
        top-0
        z-[100]
        h-1
        w-full
        bg-transparent
      "
    >
      <div
        className="
          h-full
          bg-primary
          transition-all
          duration-200
        "
        style={{
          width: `${progress}%`,
        }}
      />
    </div>
  );
}