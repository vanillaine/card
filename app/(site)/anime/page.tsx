import PosterGrid from "@/components/PosterGrid";
import { RichText } from "@/components/RichText";
import { fetchFavorites, type FavoritePoster } from "@/lib/favorites";
import { animeFallback, mangaFallback } from "@/data/curated";
import { getPageDescriptions } from "@/lib/content";

const toItem = (p: FavoritePoster) => ({ title: p.title, topLabel: `${p.type} • ${p.year}`, image: p.image });

export default async function AnimePage() {
  const [favorites, descriptions] = await Promise.all([fetchFavorites(), getPageDescriptions("anime")]);

  const anime = (favorites && favorites.anime.length > 0 ? favorites.anime : animeFallback).map(toItem);
  const manga = (favorites && favorites.manga.length > 0 ? favorites.manga : mangaFallback).map(toItem);

  return (
    <section>
      <h1 className="section-name">Anime & Manga</h1>
      <div className="media-category">
        <p>
          <span className="badge">ani-manga</span>
          <RichText text={descriptions["ani-manga"]} />
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
