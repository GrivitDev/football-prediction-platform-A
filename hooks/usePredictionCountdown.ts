import { useEffect, useMemo, useState } from 'react';
import { getReleaseTime } from '@/lib/predictionRelease';

export function usePredictionCountdown(
  matchDate: string,
  accessType: 'free' | 'regular' | 'vip',
) {
  const releaseTime = useMemo(() => {
    if (!matchDate) return 0;

    return getReleaseTime(matchDate, accessType);
  }, [matchDate, accessType]);

  const calculate = () => {
    if (!releaseTime) {
      return {
        released: false,
        days: 0,
        hours: 0,
        minutes: 0,
        seconds: 0,
      };
    }

    const diff = releaseTime - Date.now();

    if (diff <= 0) {
      return {
        released: true,
        days: 0,
        hours: 0,
        minutes: 0,
        seconds: 0,
      };
    }

    return {
      released: false,
      days: Math.floor(diff / (1000 * 60 * 60 * 24)),
      hours: Math.floor((diff / (1000 * 60 * 60)) % 24),
      minutes: Math.floor((diff / (1000 * 60)) % 60),
      seconds: Math.floor((diff / 1000) % 60),
    };
  };

  const [time, setTime] = useState(calculate);

  useEffect(() => {
    setTime(calculate());

    const timer = setInterval(() => {
      setTime(calculate());
    }, 1000);

    return () => clearInterval(timer);
  }, [releaseTime]);

  return time;
}