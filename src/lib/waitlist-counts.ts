// Owner-confirmed existing waitlist and remaining launch allocation.
export const EXISTING_WAITLIST_COUNT = 304;
export const NEW_LAUNCH_SPOTS = 200;

export function waitlistTotals(confirmed: number) {
  return {
    total: EXISTING_WAITLIST_COUNT + confirmed,
    remaining: Math.max(0, NEW_LAUNCH_SPOTS - confirmed),
  };
}

export function queuePosition(confirmedAheadIncludingSelf: number, referralCredit = 0) {
  return EXISTING_WAITLIST_COUNT + Math.max(1, confirmedAheadIncludingSelf - referralCredit);
}