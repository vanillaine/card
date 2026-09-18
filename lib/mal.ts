import { fetchWithRetry } from "./fetchWithRetry";
import { malUsername } from "@/data/curated";

export type MalStatusEntry = {
  title: string;
  image: string;
  progress: string;
};

const MAL_BASE = "https://myanimelist.net";
const STATUS_IN_PROGRESS = 1;

type MalAnimeRow = {
  anime_title: string;
  anime_image_path: string;
  num_watched_episodes: number;
  anime_num_episodes: number;
  updated_at: number;
};

type MalMangaRow = {
  manga_title: string;
  manga_image_path: string;
  num_read_chapters: number;
  manga_num_chapters: number;
};

async function fetchList<T>(kind: "anime" | "manga"): Promise<T[] | null> {
  try {
    const res = await fetchWithRetry(
      `${MAL_BASE}/${kind}list/${malUsername}/load.json?offset=0&status=${STATUS_IN_PROGRESS}`,
      { retries: 1, next: { revalidate: 120 } },
    );
    if (!res.ok) return null;

    const json = await res.json();
    return Array.isArray(json) ? json : null;
  } catch {
    return null;
  }
}

const total = (n: number) => (n > 0 ? n : "?");

export async function fetchMalActivity(): Promise<{
  anime: MalStatusEntry[];
  manga: MalStatusEntry[];
} | null> {
  const [animeRows, mangaRows] = await Promise.all([
    fetchList<MalAnimeRow>("anime"),
    fetchList<MalMangaRow>("manga"),
  ]);

  if (!animeRows && !mangaRows) return null;

  const anime = (animeRows ?? [])
    .sort((a, b) => b.updated_at - a.updated_at)
    .slice(0, 3)
    .map((a) => ({
      title: a.anime_title,
      image: a.anime_image_path,
      progress: `Episodes: ${a.num_watched_episodes}/${total(a.anime_num_episodes)}`,
    }));

  const manga = (mangaRows ?? []).slice(0, 3).map((m) => ({
    title: m.manga_title,
    image: m.manga_image_path,
    progress: `Chapters: ${m.num_read_chapters}/${total(m.manga_num_chapters)}`,
  }));

  return { anime, manga };
}
