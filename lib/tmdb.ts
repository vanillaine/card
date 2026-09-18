import { filmPicks } from "@/data/curated";

const TMDB_BASE = "https://api.themoviedb.org/3";
const TMDB_IMAGE_BASE = "https://image.tmdb.org/t/p/w500";

export type FilmPoster = {
  title: string;
  director: string;
  year: string;
  image: string;
};

type TmdbSearchResult = {
  id: number;
  poster_path: string | null;
  release_date?: string;
};

type TmdbCredits = {
  crew: { job: string; name: string }[];
};

async function searchMovie(title: string, year: number): Promise<TmdbSearchResult | null> {
  const apiKey = process.env.TMDB_API_KEY;
  if (!apiKey) return null;

  const params = new URLSearchParams({ api_key: apiKey, query: title, year: String(year) });
  const res = await fetch(`${TMDB_BASE}/search/movie?${params}`, {
    next: { revalidate: 86400 },
  });
  if (!res.ok) return null;

  const json = await res.json();
  return json.results?.[0] ?? null;
}

async function getDirector(movieId: number): Promise<string> {
  const apiKey = process.env.TMDB_API_KEY;
  if (!apiKey) return "";

  const res = await fetch(`${TMDB_BASE}/movie/${movieId}/credits?api_key=${apiKey}`, {
    next: { revalidate: 86400 },
  });
  if (!res.ok) return "";

  const json: TmdbCredits = await res.json();
  return json.crew?.find((c) => c.job === "Director")?.name ?? "";
}

export async function fetchFilmPosters(): Promise<FilmPoster[]> {
  if (!process.env.TMDB_API_KEY) {
    return filmPicks.map((f) => ({ title: f.title, director: "", year: String(f.year), image: "" }));
  }

  const results = await Promise.all(
    filmPicks.map(async (pick) => {
      try {
        const match = await searchMovie(pick.title, pick.year);
        if (!match) return { title: pick.title, director: "", year: String(pick.year), image: "" };

        const director = await getDirector(match.id);
        return {
          title: pick.title,
          director,
          year: match.release_date?.slice(0, 4) ?? String(pick.year),
          image: match.poster_path ? `${TMDB_IMAGE_BASE}${match.poster_path}` : "",
        };
      } catch {
        return { title: pick.title, director: "", year: String(pick.year), image: "" };
      }
    }),
  );

  return results;
}
