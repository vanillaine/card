import { fetchWithRetry } from "./fetchWithRetry";
import { decodeEntities, stripTags } from "./html";

export type FfxivProfile = {
  name: string;
  world: string;
  dataCenter: string;
  job: string;
  level: number;
  avatar: string;
};

const LODESTONE = "https://na.finalfantasyxiv.com/lodestone/character";

export const lodestoneProfileUrl = (lodestoneId: string) => `${LODESTONE}/${lodestoneId}/`;

const text = (s: string) => decodeEntities(stripTags(s)).trim();

function parseLodestoneCharacter(html: string): FfxivProfile | null {
  const name = html.match(/<p class="frame__chara__name">([^<]+)</)?.[1];
  const worldRaw = html.match(/<p class="frame__chara__world">([\s\S]*?)<\/p>/)?.[1];
  const level = html.match(/character__class__data"><p>LEVEL (\d+)/)?.[1];
  const activeIcon = html.match(/character__class_icon"><img src="([^"]+)"/)?.[1];
  const avatar = html.match(/<div class="frame__chara__face">\s*<img src="([^"]+)"/)?.[1];

  if (!name || !worldRaw || !level) return null;

  const world = text(worldRaw).match(/^(.*?)\s*\[(.*?)\]/);

  const listStart = html.indexOf("character__level__list");
  const list = listStart >= 0 ? html.slice(listStart, listStart + 8000) : "";
  const entries = [...list.matchAll(/<li><img src="([^"]+)"[^>]*data-tooltip="([^"]+)"[^>]*>/g)];
  const tooltip = entries.find((m) => m[1] === activeIcon)?.[2] ?? "";
  const job = text(tooltip).split("/")[0].replace(/\(.*?\)/, "").trim();

  return {
    name: text(name),
    world: world?.[1] ?? "",
    dataCenter: world?.[2] ?? "",
    job,
    level: Number(level),
    avatar: avatar ?? "",
  };
}

export async function fetchFfxivProfile(lodestoneId = process.env.FFXIV_LODESTONE_ID): Promise<FfxivProfile | null> {
  if (!lodestoneId) return null;

  try {
    const res = await fetchWithRetry(lodestoneProfileUrl(lodestoneId), {
      retries: 1,
      headers: { "Accept-Language": "en-US,en;q=0.9" },
      next: { revalidate: 3600 },
    });
    if (!res.ok) return null;

    return parseLodestoneCharacter(await res.text());
  } catch {
    return null;
  }
}
