import { overwatch } from "@/data/curated";

export type OverwatchSummary = {
  username: string;
  rankLabel: string;
};

export async function fetchOverwatchSummary(): Promise<OverwatchSummary> {
  try {
    const res = await fetch(`https://overfast-api.tekrop.fr/players/${overwatch.playerId}`, {
      next: { revalidate: 900 },
    });
    if (!res.ok) throw new Error("Failed fetching Overwatch data");

    const data = await res.json();
    const username = data.summary?.username || overwatch.name;
    const support = data.summary?.competitive?.pc?.support;

    if (!support) return { username, rankLabel: "Support - Unranked" };

    const division = support.division
      ? support.division.charAt(0).toUpperCase() + support.division.slice(1)
      : "Unranked";
    const tier = support.tier ?? "";

    return { username, rankLabel: `Support - ${division} ${tier}`.trim() };
  } catch {
    return { username: overwatch.name, rankLabel: "Support - Unknown" };
  }
}
