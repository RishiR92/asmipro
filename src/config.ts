// Launch config. Only turn on what is true today. Empty or false hides the block.
export type CityKey = "bay_area" | "los_angeles" | "new_york" | "other";

export const SUPPORT_EMAIL = "support@asmiai.com";
export const SUPPORT_TEXT_NUMBER = ""; // US number pros can text; hidden when empty
export const CITY_SPOTS: Record<"bay_area" | "los_angeles" | "new_york", number | null> = {
  bay_area: null,
  los_angeles: null,
  new_york: null,
}; // real founding caps
export const MIN_COUNT_TO_SHOW = 100;
export const RECENT_MIN = 5;
export const REFERRAL_BUMP = 0;
export const COMMISSION_START_PERCENT = 15;
export const NEXT_STEPS_TIMING = "";
export const CREW_FREE = false;
export const NO_APP_NEEDED = false;
export const SPANISH_CALLS = false;
export const PAYOUT_TIMING = "";
export const SHOW_FOUNDER_PHOTOS = true;
export const HAS_PRO_QUOTE = false;
export const PRO_QUOTE = { text: "", name: "", trade: "", city: "" };

// Public site URL used in share links. Falls back to the current origin.
export const SITE_URL = "";
