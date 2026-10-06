import { useQuery } from "@tanstack/react-query";
import { CITY_SPOTS, MIN_COUNT_TO_SHOW, RECENT_MIN, type CityKey } from "@/config";

// Counts include the owner's verified existing waitlist plus new confirmed rows.
export type Stats = {
  total: number;
  remaining: number;
  cities: Record<CityKey, number>;
  recent7d: number;
  recent: { trade: string | null; place: string; when: "today" | "yesterday" | "this week" }[];
};

export function useStats() {
  return useQuery<Stats>({
    queryKey: ["stats"],
    queryFn: async () => {
      const r = await fetch("/api/public/stats");
      if (!r.ok) throw new Error("stats");
      return r.json();
    },
    staleTime: 60_000,
    retry: 1,
  });
}

export function spotsLeft(stats: Stats | undefined, city: CityKey | null): number | null {
  if (!stats || !city || city === "other") return null;
  const cap = CITY_SPOTS[city];
  if (cap == null) return null;
  return Math.max(0, cap - (stats.cities[city] ?? 0));
}

export const showCounts = (s?: Stats) => !!s && s.total >= MIN_COUNT_TO_SHOW;
export const showRecent = (s?: Stats) => showCounts(s) && s!.recent7d >= RECENT_MIN && s!.recent.length > 0;
