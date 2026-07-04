const DAY = 24 * 60 * 60 * 1000;

export function getReleaseHours(
  accessType: 'free' | 'regular' | 'vip',
) {
  return accessType === 'vip' ? 72 : 24;
}

export function getReleaseTime(
  matchDate: string,
  accessType: 'free' | 'regular' | 'vip',
) {
  return (
    new Date(matchDate).getTime() -
    getReleaseHours(accessType) * 60 * 60 * 1000
  );
}

export function isReleased(
  matchDate: string,
  accessType: 'free' | 'regular' | 'vip',
) {
  return Date.now() >= getReleaseTime(matchDate, accessType);
}