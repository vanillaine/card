import HomeHeader from "@/components/HomeHeader";
import { Accent } from "@/components/Prose";
import { ageOn } from "@/lib/age";
import { birthDate } from "@/data/curated";

export default function HomePage() {
  return (
    <section>
      <HomeHeader age={ageOn(birthDate)} />

      <p>
        <span className="badge">introduction</span> Goes by{" "}
        <Accent>Jen</Accent>. Just a generic person who craves for more media to
        be a fan of then logging them in their respective logging apps. I used to be very active on various fandoms,
        but I lost the spirit because of how toxic &amp; hostile most of them are. However, I still talk about them
        casually.
      </p>
      <p>
        <span className="badge">seasonals</span> Since I have various hobbies, I talk about each of them highly
        depending on my mood and current hyperfixations. So, don&apos;t expect to see me tweet about your faves at
        all times when you initially found my tweet regarding your faves (I refuse to make &amp; manage dedicated
        accounts for each of them).
      </p>

      <div>
        <p className="mb-[10px]">
          <span className="badge">byf</span>
        </p>
        <ul>
          <li>
            This a <Accent>personal account</Accent> so there are lots of personal
            IRL tweets, especially in bahasa indonesia.
          </li>
          <li>
            I&apos;m pretty opinionated on certain things so I might actually shade on something but as long as
            it&apos;s not on my dni list, I don&apos;t really care if you like them (you do you).
          </li>
          <li>So yes, I might dislike your faves, but don&apos;t take it as a personal attack (pls have some sense).</li>
          <li>I don&apos;t mind shipping &amp; RPFs.</li>
          <li>
            I also don&apos;t interact that much either... I&apos;m an anxious person, and am awkward &amp; dry af in
            the dm so... sorry.
          </li>
        </ul>
      </div>

      <div>
        <p className="mb-[10px]">
          <span className="badge">dni</span>
        </p>
        <ul>
          <li>The usuals.</li>
          <li>Can&apos;t comprehend the concept of nuance.</li>
          <li>Unnecessarily rude/hostile.</li>
        </ul>
      </div>
    </section>
  );
}
