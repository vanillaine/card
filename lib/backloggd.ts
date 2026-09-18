import { fetchWithRetry } from "./fetchWithRetry";
import { decodeEntities } from "./html";

export type BackloggdFavorite = {
  name: string;
  image: string;
  crowned: boolean;
};

export type BackloggdPlayed = {
  name: string;
  image: string;
  date?: string;
  rating?: number;
};

const coverOf = (chunk: string) => {
  const image = chunk.match(/<img[^>]*\ssrc="([^"]+)"/)?.[1];
  const name = chunk.match(/<img[^>]*\salt="([^"]*)"/)?.[1];
  return image && name ? { image, name: decodeEntities(name) } : null;
};

function parseBackloggdFavorites(html: string): BackloggdFavorite[] {
  const start = html.indexOf('id="profile-favorites"');
  if (start < 0) return [];

  const end = html.indexOf('id="profile-journal"', start);
  const block = html.slice(start, end > start ? end : start + 12000);

  return block
    .split('<div class="col-cus-5')
    .slice(1)
    .flatMap((chunk) => {
      const cover = coverOf(chunk);
      if (!cover) return [];

      const classes = chunk.slice(0, chunk.indexOf('"'));
      return [{ ...cover, crowned: classes.includes("ultimate_fav") }];
    });
}

function parseBackloggdRecentlyPlayed(html: string): BackloggdPlayed[] {
  const start = html.indexOf('id="profile-journal"');
  if (start < 0) return [];

  const end = html.indexOf("Recently Reviewed", start);
  const block = html.slice(start, end > start ? end : start + 20000);

  return block
    .split('<div class="col-cus-3')
    .slice(1)
    .flatMap((chunk) => {
      const cover = coverOf(chunk);
      if (!cover) return [];

      const date = chunk.match(/played-date">([^<]*)</)?.[1]?.trim();
      const width = chunk.match(/stars-top"\s+style="width:\s*([\d.]+)%/)?.[1];

      return [
        {
          ...cover,
          date: date || undefined,
          rating: width ? Math.round((Number(width) / 100) * 5 * 2) / 2 : undefined,
        },
      ];
    });
}

async function fetchProfileHtml(username: string): Promise<string | null> {
  try {
    const res = await fetchWithRetry(`https://backloggd.com/u/${username}/`, {
      retries: 1,
      headers: { "Accept-Language": "en-US,en;q=0.9" },
      next: { revalidate: 3600 },
    });
    return res.ok ? await res.text() : null;
  } catch {
    return null;
  }
}

export async function fetchBackloggdFavorites(username: string): Promise<BackloggdFavorite[] | null> {
  const html = await fetchProfileHtml(username);
  const favorites = html ? parseBackloggdFavorites(html) : [];
  return favorites.length > 0 ? favorites : null;
}

export async function fetchBackloggdRecentlyPlayed(username: string): Promise<BackloggdPlayed[] | null> {
  const html = await fetchProfileHtml(username);
  const played = html ? parseBackloggdRecentlyPlayed(html) : [];
  return played.length > 0 ? played : null;
}
