import PosterGrid from "@/components/PosterGrid";
import { ExternalLink } from "@/components/Prose";
import { fetchBackloggdFavorites, fetchBackloggdRecentlyPlayed } from "@/lib/backloggd";
import { fetchGamePosters, fetchReleaseYearsByCover } from "@/lib/igdb";
import { backloggdUsername } from "@/data/curated";

const coverId = (url: string) =>
  url
    .split("/")
    .pop()
    ?.replace(/\.\w+$/, "") ?? "";

async function loadGames() {
  const favorites = await fetchBackloggdFavorites(backloggdUsername);

  if (favorites) {
    const years = await fetchReleaseYearsByCover(
      favorites.map((f) => coverId(f.image)),
    );

    return [
      ...favorites.filter((f) => f.crowned),
      ...favorites.filter((f) => !f.crowned),
    ].map((f) => ({
      title: f.name,
      topLabel: [f.crowned ? "Crowned" : "", years[coverId(f.image)]]
        .filter(Boolean)
        .join(" • "),
      image: f.image,
    }));
  }

  const games = await fetchGamePosters();
  return games.map((g) => ({
    title: g.title,
    topLabel: g.year,
    image: g.image,
  }));
}

async function loadRecentlyPlayed() {
  const played = await fetchBackloggdRecentlyPlayed(backloggdUsername);

  return (played ?? []).map((g) => ({
    title: g.name,
    topLabel: [g.date, g.rating !== undefined ? `★ ${g.rating}` : ""].filter(Boolean).join(" • "),
    image: g.image,
  }));
}

export default async function GamesPage() {
  const [items, recentlyPlayed] = await Promise.all([loadGames(), loadRecentlyPlayed()]);

  return (
    <section>
      <h1 className="section-name">Games</h1>
      <div className="media-category">
        <p>
          <span className="badge">games</span>Been a PC gamer my whole life too.
          I&apos;m more of a single player games gamer, but I do occasionally
          still play Overwatch. Finally getting back into PC gaming in 2025
          because I finally got a decent laptop, since my long-time PC died in
          2020. From time to time playing my homebrewed 3DS and PS4 Pro. Go
          check out my <ExternalLink href="https://backloggd.com/u/vanillaine">Backloggd</ExternalLink>!
        </p>
        <h2>Favorites</h2>
        <PosterGrid items={items} />
      </div>

      {recentlyPlayed.length > 0 && (
        <>
          <hr />

          <div className="media-category">
            <h2>Recently Played</h2>
            <PosterGrid items={recentlyPlayed} />
          </div>
        </>
      )}
    </section>
  );
}
