import IdolGrid from "@/components/IdolGrid";
import { RichText } from "@/components/RichText";
import { jpopIdols, kpopIdols } from "@/data/curated";
import { getPageDescriptions } from "@/lib/content";

export default async function IdolsPage() {
  const descriptions = await getPageDescriptions("idols");

  return (
    <section>
      <h1 className="section-name">Idols</h1>
      <div className="media-category">
        <p>
          <span className="badge">j-pop</span>
          <RichText text={descriptions["j-pop"]} />
        </p>
        <IdolGrid items={jpopIdols} />
      </div>
      <div className="media-category">
        <p>
          <span className="badge">k-pop</span>
          <RichText text={descriptions["k-pop"]} />
        </p>
        <IdolGrid items={kpopIdols} />
      </div>
    </section>
  );
}
