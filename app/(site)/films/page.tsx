import PosterGrid from "@/components/PosterGrid";
import { RichText } from "@/components/RichText";
import { fetchFilmPosters } from "@/lib/tmdb";
import { bookPicks } from "@/data/curated";
import { getPageDescriptions } from "@/lib/content";

export default async function FilmsPage() {
  const [films, descriptions] = await Promise.all([fetchFilmPosters(), getPageDescriptions("films")]);

  const filmItems = films.map((f) => ({
    title: f.title,
    topLabel: [f.director, f.year].filter(Boolean).join(" • "),
    image: f.image,
  }));

  const bookItems = bookPicks.map((b) => ({
    title: b.title,
    topLabel: `${b.author} • ${b.year}`,
    image: b.image,
  }));

  return (
    <section>
      <h1 className="section-name">Films & Books</h1>
      <div className="media-category">
        <p>
          <span className="badge">films</span>
          <RichText text={descriptions.films} />
        </p>
        <PosterGrid items={filmItems} />
      </div>
      <div className="media-category">
        <p>
          <span className="badge">books</span>
          <RichText text={descriptions.books} />
        </p>
        <PosterGrid items={bookItems} />
      </div>

      <a
        href="https://www.themoviedb.org"
        target="_blank"
        rel="noreferrer"
        className="flex items-center gap-4 max-md:flex-col max-md:items-start no-underline"
      >
        <img src="/assets/tmdb-logo.svg" alt="TMDB" className="h-3.5 w-auto shrink-0" />
        <span className="font-jakarta text-xs text-text-muted">
          This product uses the TMDB API but is not endorsed or certified by TMDB.
        </span>
      </a>
    </section>
  );
}
