import { fetchWithRetry } from "./fetchWithRetry";
import { malUsername } from "@/data/curated";

const JIKAN_BASE = "https://api.jikan.moe/v4";
const EDGE_BASE = "https://jikan.lucashdo.com/v1";

export type FavoritePoster = {
  title: string;
  type: string;
  year: string | number;
  image: string;
};

export type Favorites = { anime: FavoritePoster[]; manga: FavoritePoster[] };

type JikanEntry = {
  title: string;
  type?: string;
  start_year?: number | null;
  images: {
    webp?: { image_url?: string; large_image_url?: string };
    jpg?: { image_url?: string; large_image_url?: string };
  };
};

type EdgeEntry = {
  title: string;
  type?: string;
  startYear?: number | null;
  imageUrl?: string;
};

const toLargeImage = (url = "") => url.replace(/(?<!l)(\.\w+)(\?.*)?$/, "l$1$2");

function normalize(favs: Favorites): Favorites | null {
  return favs.anime.length + favs.manga.length > 0 ? favs : null;
}

async function fromJikan(): Promise<Favorites | null> {
  try {
    const res = await fetchWithRetry(`${JIKAN_BASE}/users/${malUsername}/favorites`, {
      retries: 0,
      next: { revalidate: 3600 },
    });
    if (!res.ok) return null;

    const json = await res.json();
    const toPoster = (defaultType: string) => (e: JikanEntry): FavoritePoster => ({
      title: e.title || "Unknown Title",
      type: e.type || defaultType,
      year: e.start_year ?? "?",
      image:
        e.images.webp?.large_image_url ??
        e.images.jpg?.large_image_url ??
        e.images.webp?.image_url ??
        e.images.jpg?.image_url ??
        "",
    });

    return normalize({
      anime: (json?.data?.anime ?? []).map(toPoster("Anime")),
      manga: (json?.data?.manga ?? []).map(toPoster("Manga")),
    });
  } catch {
    return null;
  }
}

async function fromEdge(): Promise<Favorites | null> {
  try {
    const res = await fetchWithRetry(`${EDGE_BASE}/users/${malUsername}/favorites`, {
      retries: 1,
      next: { revalidate: 3600 },
    });
    if (!res.ok) return null;

    const json = await res.json();
    const toPoster = (defaultType: string) => (e: EdgeEntry): FavoritePoster => ({
      title: e.title || "Unknown Title",
      type: e.type || defaultType,
      year: e.startYear ?? "?",
      image: toLargeImage(e.imageUrl),
    });

    return normalize({
      anime: (json?.data?.anime ?? []).map(toPoster("Anime")),
      manga: (json?.data?.manga ?? []).map(toPoster("Manga")),
    });
  } catch {
    return null;
  }
}

export async function fetchFavorites(): Promise<Favorites | null> {
  return (await fromJikan()) ?? (await fromEdge());
}
