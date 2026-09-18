import PosterGrid from "@/components/PosterGrid";
import { ExternalLink } from "@/components/Prose";
import { fetchFavorites, type FavoritePoster } from "@/lib/favorites";
import { animeFallback, mangaFallback } from "@/data/curated";

const toItem = (p: FavoritePoster) => ({ title: p.title, topLabel: `${p.type} • ${p.year}`, image: p.image });

export default async function AnimePage() {
  const favorites = await fetchFavorites();

  const anime = (favorites && favorites.anime.length > 0 ? favorites.anime : animeFallback).map(toItem);
  const manga = (favorites && favorites.manga.length > 0 ? favorites.manga : mangaFallback).map(toItem);

  return (
    <section>
      <h1 className="section-name">Anime & Manga</h1>
      <div className="media-category">
        <p>
          <span className="badge">ani-manga</span>Been a weeb since I could remember. I&apos;m more of a manga
          reader. I used to watch lots of seasonal anime but not so much anymore. My taste might look like some
          pretentious edgy weeb, but hey I just watch things that I like. Go check out my{" "}
          <ExternalLink href="https://myanimelist.net/profile/vanillaine">MyAnimeList</ExternalLink>!
        </p>
        <h2>Anime</h2>
        <PosterGrid items={anime} />
      </div>

      <hr />

      <div className="media-category">
        <h2>Manga</h2>
        <PosterGrid items={manga} />
      </div>
    </section>
  );
}
