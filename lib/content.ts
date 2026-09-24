import { unstable_cache } from "next/cache";
import { prisma } from "@/lib/prisma";
import { PAGE_DESCRIPTION_SLOTS, type PageDescriptionSlug, type PageSlot } from "@/lib/content-schema";

export const CONTENT_TAG = "card-content";

export type BadgeItem = { id: string; label: string; value: string };
export type SectionItem = { id: string; label: string; body: string; required: boolean };
export type PointerItem = { id: string; type: "byf" | "dni"; body: string };
export type PageDescriptionRow = { slug: string; body: string };

export const fetchBadges = (): Promise<BadgeItem[]> =>
  prisma.badge.findMany({ orderBy: { order: "asc" }, select: { id: true, label: true, value: true } });

export const fetchSections = (): Promise<SectionItem[]> =>
  prisma.section.findMany({
    orderBy: { order: "asc" },
    select: { id: true, label: true, body: true, required: true },
  });

export const fetchPointers = (): Promise<PointerItem[]> =>
  prisma.pointer.findMany({
    orderBy: [{ type: "asc" }, { order: "asc" }],
    select: { id: true, type: true, body: true },
  });

export const fetchPageDescriptionRows = (): Promise<PageDescriptionRow[]> =>
  prisma.pageDescription.findMany({ select: { slug: true, body: true } });

const readBadges = unstable_cache(fetchBadges, ["card-content:badges"], { tags: [CONTENT_TAG] });
const readSections = unstable_cache(fetchSections, ["card-content:sections"], { tags: [CONTENT_TAG] });
const readPointers = unstable_cache(fetchPointers, ["card-content:pointers"], { tags: [CONTENT_TAG] });
const readPageDescriptions = unstable_cache(fetchPageDescriptionRows, ["card-content:page-descriptions"], {
  tags: [CONTENT_TAG],
});

export async function getHomeContent(): Promise<{
  badges: BadgeItem[];
  sections: SectionItem[];
  byf: PointerItem[];
  dni: PointerItem[];
}> {
  const [badges, sections, pointers] = await Promise.all([readBadges(), readSections(), readPointers()]);

  return {
    badges,
    sections,
    byf: pointers.filter((p) => p.type === "byf"),
    dni: pointers.filter((p) => p.type === "dni"),
  };
}

export async function getPageDescriptions(page: PageSlot): Promise<Record<PageDescriptionSlug, string>> {
  const rows = await readPageDescriptions();
  const bodyBySlug = new Map(rows.map((r) => [r.slug, r.body]));

  return Object.fromEntries(
    PAGE_DESCRIPTION_SLOTS.filter((s) => s.page === page).map((s) => [s.slug, bodyBySlug.get(s.slug) ?? ""]),
  ) as Record<PageDescriptionSlug, string>;
}
