import { config } from "dotenv";
config({ path: ".env.local" });

import { PrismaClient } from "../generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import { Pool } from "pg";
import { PAGE_DESCRIPTION_SLOTS } from "../lib/content-schema";

const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

const badges = [
  { label: "pronouns", value: "any" },
  { label: "MBTI", value: "INFP-T" },
  { label: "language", value: "ENG/ID" },
];

const sections = [
  {
    label: "introduction",
    required: true,
    body: "Goes by **Jen**. Just a generic person who craves for more media to be a fan of then logging them in their respective logging apps. I used to be very active on various fandoms, but I lost the spirit because of how toxic & hostile most of them are. However, I still talk about them casually.",
  },
  {
    label: "seasonals",
    required: false,
    body: "Since I have various hobbies, I talk about each of them highly depending on my mood and current hyperfixations. So, don't expect to see me tweet about your faves at all times when you initially found my tweet regarding your faves (I refuse to make & manage dedicated accounts for each of them).",
  },
];

const byf = [
  "This a **personal account** so there are lots of personal IRL tweets, especially in bahasa indonesia.",
  "I'm pretty opinionated on certain things so I might actually shade on something but as long as it's not on my dni list, I don't really care if you like them (you do you).",
  "So yes, I might dislike your faves, but don't take it as a personal attack (pls have some sense).",
  "I don't mind shipping & RPFs.",
  "I also don't interact that much either... I'm an anxious person, and am awkward & dry af in the dm so... sorry.",
];

const dni = ["The usuals.", "Can't comprehend the concept of nuance.", "Unnecessarily rude/hostile."];

const pageDescriptions: Record<(typeof PAGE_DESCRIPTION_SLOTS)[number]["slug"], string> = {
  "ani-manga":
    "Been a weeb since I could remember. I'm more of a manga reader. I used to watch lots of seasonal anime but not so much anymore. My taste might look like some pretentious edgy weeb, but hey I just watch things that I like. Go check out my [MyAnimeList](https://myanimelist.net/profile/vanillaine)!",
  films:
    "Started ***really actually*** watching films in 2020. Honestly kinda burnt out of films as of late. Go check out my [Letterboxd](https://letterboxd.com/Vanillaine/)!",
  books:
    "Started reading actual books/novels in 2025, so my reads are still a tad bit few. I don't have a social book logging app because I'm using Bookmory.",
  games:
    "Been a PC gamer my whole life too. I'm more of a single player games gamer, but I do occasionally still play Overwatch. Finally getting back into PC gaming in 2025 because I finally got a decent laptop, since my long-time PC died in 2020. From time to time playing my homebrewed 3DS and PS4 Pro. Go check out my [Backloggd](https://backloggd.com/u/vanillaine)!",
  "j-pop":
    "I used to be a **JKT48** & **AKB48** wota since 2013, but now just casually. In 2020 I found out about Sakamichi series and has been a wota of them ever since, mostly **Nogizaka46**. I also watch sakamichi variety shows religiously. I listen to lots of Kayōkyoku idols too such as Nakamori Akina, Wink etc.",
  "k-pop":
    "Weirdly enough **MAMAMOO** was the group that got me into k-pop in 2016. Finally settled with **LOONA**-derivatives, **Hearts2Hearts**, **Billlie**, and **NMIXX** (while the rest are more casual). Oh, and I'm also one half of the first two people to discover the [LOONA Hi High pool demolition](https://www.reddit.com/r/LOONA/comments/1pzjihy/went_to_the_hihigh_pool_for_orbit_pilgrimage_but/) 🥀",
};

async function main() {
  if ((await prisma.badge.count()) === 0) {
    await prisma.badge.createMany({
      data: badges.map((b, order) => ({ ...b, order })),
    });
  }

  if ((await prisma.section.count()) === 0) {
    await prisma.section.createMany({
      data: sections.map((s, order) => ({ ...s, order })),
    });
  }

  if ((await prisma.pointer.count({ where: { type: "byf" } })) === 0) {
    await prisma.pointer.createMany({
      data: byf.map((body, order) => ({ type: "byf" as const, body, order })),
    });
  }

  if ((await prisma.pointer.count({ where: { type: "dni" } })) === 0) {
    await prisma.pointer.createMany({
      data: dni.map((body, order) => ({ type: "dni" as const, body, order })),
    });
  }

  for (const slot of PAGE_DESCRIPTION_SLOTS) {
    await prisma.pageDescription.upsert({
      where: { slug: slot.slug },
      update: {},
      create: { page: slot.page, slug: slot.slug, body: pageDescriptions[slot.slug] },
    });
  }

  console.log("Seed done.");
}

main()
  .catch((err) => {
    console.error(err);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
