import IdolGrid from "@/components/IdolGrid";
import { Accent, ExternalLink } from "@/components/Prose";
import { jpopIdols, kpopIdols } from "@/data/curated";

export default function IdolsPage() {
  return (
    <section>
      <h1 className="section-name">Idols</h1>
      <div className="media-category">
        <p>
          <span className="badge">j-pop</span>I used to be a <Accent>JKT48</Accent> &amp; <Accent>AKB48</Accent> wota
          since 2013, but now just casually. In 2020 I found out about Sakamichi series and has been a wota of them ever
          since, mostly <Accent>Nogizaka46</Accent>. I also watch sakamichi variety shows religiously. I listen to lots
          of Kayōkyoku idols too such as Nakamori Akina, Wink etc.
        </p>
        <IdolGrid items={jpopIdols} />
      </div>
      <div className="media-category">
        <p>
          <span className="badge">k-pop</span>Weirdly enough <Accent>MAMAMOO</Accent> was the group that got me into
          k-pop in 2016. Finally settled with <Accent>LOONA</Accent>-derivatives, <Accent>Hearts2Hearts</Accent>,{" "}
          <Accent>Billlie</Accent>, and <Accent>NMIXX</Accent> (while the rest are more casual). Oh, and I&apos;m also
          one half of the first two people to discover the{" "}
          <ExternalLink href="https://www.reddit.com/r/LOONA/comments/1pzjihy/went_to_the_hihigh_pool_for_orbit_pilgrimage_but/">
            LOONA Hi High pool demolition
          </ExternalLink>{" "}
          🥀
        </p>
        <IdolGrid items={kpopIdols} />
      </div>
    </section>
  );
}
