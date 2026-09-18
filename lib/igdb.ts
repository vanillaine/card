import { gamePicks } from "@/data/curated";

const TWITCH_TOKEN_URL = "https://id.twitch.tv/oauth2/token";
const IGDB_GAMES_URL = "https://api.igdb.com/v4/games";

export type GamePoster = {
  title: string;
  year: string;
  image: string;
};

let cachedToken: { value: string; expiresAt: number } | null = null;

async function getIgdbToken(): Promise<string | null> {
  const clientId = process.env.IGDB_CLIENT_ID;
  const clientSecret = process.env.IGDB_CLIENT_SECRET;
  if (!clientId || !clientSecret) return null;

  if (cachedToken && cachedToken.expiresAt > Date.now()) {
    return cachedToken.value;
  }

  const params = new URLSearchParams({
    client_id: clientId,
    client_secret: clientSecret,
    grant_type: "client_credentials",
  });

  const res = await fetch(`${TWITCH_TOKEN_URL}?${params}`, { method: "POST" });
  if (!res.ok) return null;

  const json = await res.json();
  cachedToken = {
    value: json.access_token,
    expiresAt: Date.now() + (json.expires_in - 60) * 1000,
  };
  return cachedToken.value;
}

type IgdbGame = {
  name: string;
  first_release_date?: number;
  cover?: { url?: string };
};

function toBigCover(url: string | undefined): string {
  if (!url) return "";
  const withProtocol = url.startsWith("//") ? `https:${url}` : url;
  return withProtocol.replace("t_thumb", "t_cover_big");
}

export async function fetchReleaseYearsByCover(imageIds: string[]): Promise<Record<string, string>> {
  const token = await getIgdbToken();
  const clientId = process.env.IGDB_CLIENT_ID;
  if (!token || !clientId || imageIds.length === 0) return {};

  try {
    const ids = imageIds.map((id) => `"${id}"`).join(",");
    const res = await fetch("https://api.igdb.com/v4/covers", {
      method: "POST",
      headers: { "Client-ID": clientId, Authorization: `Bearer ${token}` },
      body: `fields image_id,game.first_release_date; where image_id = (${ids}); limit 50;`,
      next: { revalidate: 86400 },
    });
    if (!res.ok) return {};

    const rows: { image_id: string; game?: { first_release_date?: number } }[] = await res.json();
    return Object.fromEntries(
      rows.flatMap((r) =>
        r.game?.first_release_date
          ? [[r.image_id, String(new Date(r.game.first_release_date * 1000).getUTCFullYear())]]
          : [],
      ),
    );
  } catch {
    return {};
  }
}

export async function fetchGamePosters(): Promise<GamePoster[]> {
  const token = await getIgdbToken();
  const clientId = process.env.IGDB_CLIENT_ID;

  if (!token || !clientId) {
    return gamePicks.map((g) => ({ title: g.title, year: String(g.year), image: "" }));
  }

  const results = await Promise.all(
    gamePicks.map(async (pick) => {
      try {
        const query = `search "${pick.title.replace(/"/g, '\\"')}"; where version_parent = null & game_type = 0; fields name,first_release_date,cover.url; limit 1;`;
        const res = await fetch(IGDB_GAMES_URL, {
          method: "POST",
          headers: {
            "Client-ID": clientId,
            Authorization: `Bearer ${token}`,
          },
          body: query,
          next: { revalidate: 86400 },
        });

        if (!res.ok) return { title: pick.title, year: String(pick.year), image: "" };

        const [match]: IgdbGame[] = await res.json();
        if (!match) return { title: pick.title, year: String(pick.year), image: "" };

        return {
          title: pick.title,
          year: match.first_release_date
            ? String(new Date(match.first_release_date * 1000).getFullYear())
            : String(pick.year),
          image: toBigCover(match.cover?.url),
        };
      } catch {
        return { title: pick.title, year: String(pick.year), image: "" };
      }
    }),
  );

  return results;
}
