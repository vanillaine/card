import { overwatch } from "@/data/curated";

export type OverwatchSummary = {
  username: string;
  rankLabel: string;
};

const QUEUE_LABEL = "Open Queue";

export async function fetchOverwatchSummary(): Promise<OverwatchSummary> {
  try {
    const res = await fetch(`https://overfast-api.tekrop.fr/players/${overwatch.playerId}`, {
      next: { revalidate: 900 },
    });
    if (!res.ok) throw new Error("Failed fetching Overwatch data");

    const data = await res.json();
    const username = data.summary?.username || overwatch.name;
    const open = data.summary?.competitive?.pc?.open;

    if (!open) return { username, rankLabel: `${QUEUE_LABEL} - Unranked` };

    const division = open.division ? open.division.charAt(0).toUpperCase() + open.division.slice(1) : "Unranked";
    const tier = open.tier ?? "";

    return { username, rankLabel: `${QUEUE_LABEL} - ${division} ${tier}`.trim() };
  } catch {
    return { username: overwatch.name, rankLabel: `${QUEUE_LABEL} - Unknown` };
  }
}
