import PosterGrid from "@/components/PosterGrid";
import { Accent, ExternalLink } from "@/components/Prose";
import { fetchFilmPosters } from "@/lib/tmdb";
import { bookPicks } from "@/data/curated";

export default async function FilmsPage() {
  const films = await fetchFilmPosters();

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
          <span className="badge">films</span>Started <Accent italic>really actually</Accent> watching films in 2020.
          Honestly kinda burnt out of films as of late. Go check out my{" "}
          <ExternalLink href="https://letterboxd.com/Vanillaine/">Letterboxd</ExternalLink>!
        </p>
        <PosterGrid items={filmItems} />
      </div>
      <div className="media-category">
        <p>
          <span className="badge">books</span>Started reading actual books/novels in 2025, so my reads are still a
          tad bit few. I don&apos;t have a social book logging app because I&apos;m using Bookmory.
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
