import { useQuery } from "@tanstack/react-query";
import { CITY_SPOTS, MIN_COUNT_TO_SHOW, RECENT_MIN, type CityKey } from "@/config";

// Real counts only. Nothing here is seeded, padded or faked.
export type Stats = {
  total: number;
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
