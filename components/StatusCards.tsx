import { fetchOverwatchSummary } from "@/lib/overfast";
import { fetchMalActivity } from "@/lib/mal";
import { fetchFfxivProfile } from "@/lib/lodestone";
import { fetchUmaProfile, formatParent } from "@/lib/umamoe";
import { monsterHunterWilds, staticAnimeStatus, staticMangaStatus, umamusume } from "@/data/curated";

type StatusItem = { title: string; image: string; lines: string[] };

function StatusRow({ variant, title, image, lines }: StatusItem & { variant: "game" | "poster" }) {
  return (
    <div className={`status-${variant}`}>
      <img src={image} alt={title} />
      <div className="status-info">
        <span className="status-title">{title}</span>
        {lines.map((line) => (
          <span key={line} className="status-desc">
            {line}
          </span>
        ))}
      </div>
    </div>
  );
}

function StatusCard({
  icon,
  heading,
  variant,
  items,
}: {
  icon: string;
  heading: string;
  variant: "game" | "poster";
  items: StatusItem[];
}) {
  return (
    <div className="status-card">
      <h3>
        <i className={icon}></i> {heading}
      </h3>
      {items.map((item) => (
        <StatusRow key={item.title} variant={variant} {...item} />
      ))}
    </div>
  );
}

const fromMal = (items: { title: string; image: string; progress: string }[] = []): StatusItem[] =>
  items.map((i) => ({ title: i.title, image: i.image, lines: [i.progress] }));

export default async function StatusCards() {
  const [overwatch, activity, ffxiv, uma] = await Promise.all([
    fetchOverwatchSummary(),
    fetchMalActivity(),
    fetchFfxivProfile(),
    fetchUmaProfile(umamusume.accountId),
  ]);

  const watching = [...fromMal(activity?.anime), staticAnimeStatus];
  const reading = [...fromMal(activity?.manga), staticMangaStatus];

  const games: StatusItem[] = [
    ...(ffxiv
      ? [
          {
            title: "Final Fantasy XIV",
            image: ffxiv.avatar,
            lines: [`${ffxiv.name} (${ffxiv.world})`, [ffxiv.job, `Lv ${ffxiv.level}`].filter(Boolean).join(" ")],
          },
        ]
      : []),
    {
      title: "Monster Hunter Wilds",
      image: "https://cdn2.steamgriddb.com/icon_thumb/a82115443df2caf9fd37795fe824a039.png",
      lines: [monsterHunterWilds.hunterName, monsterHunterWilds.weapons],
    },
    {
      title: "Overwatch",
      image: "https://cdn2.steamgriddb.com/icon_thumb/0cf7b480289c0c4b07b6d3bd72fef0c9.png",
      lines: [overwatch.username, overwatch.rankLabel],
    },
    {
      title: "Umamusume",
      image: "https://cdn2.steamgriddb.com/icon/19cba97c59c6ddc49816b65a9cdddd6d/32/256x256.png",
      lines: uma ? [uma.name, ...(uma.parent ? [formatParent(uma.parent)] : [])] : [umamusume.trainerName],
    },
  ];

  return (
    <>
      <StatusCard icon="fa-solid fa-gamepad" heading="Currently Playing" variant="game" items={games} />
      <StatusCard icon="fa-solid fa-tv" heading="Currently Watching" variant="poster" items={watching} />
      <StatusCard icon="fa-solid fa-book-open" heading="Currently Reading" variant="poster" items={reading} />
    </>
  );
}
