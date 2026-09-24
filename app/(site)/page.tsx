import HomeHeader from "@/components/HomeHeader";
import { RichText } from "@/components/RichText";
import { ageOn } from "@/lib/age";
import { birthDate } from "@/data/curated";
import { getHomeContent } from "@/lib/content";

export default async function HomePage() {
  const { badges, sections, byf, dni } = await getHomeContent();

  return (
    <section>
      <HomeHeader age={ageOn(birthDate)} badges={badges} />

      {sections.map((section) => (
        <p key={section.id}>
          <span className="badge">{section.label}</span> <RichText text={section.body} />
        </p>
      ))}

      <div>
        <p className="mb-[10px]">
          <span className="badge">byf</span>
        </p>
        <ul>
          {byf.map((item) => (
            <li key={item.id}>
              <RichText text={item.body} />
            </li>
          ))}
        </ul>
      </div>

      <div>
        <p className="mb-[10px]">
          <span className="badge">dni</span>
        </p>
        <ul>
          {dni.map((item) => (
            <li key={item.id}>
              <RichText text={item.body} />
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
