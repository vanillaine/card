export const PAGE_DESCRIPTION_SLOTS = [
  { page: "anime", slug: "ani-manga", label: "Anime & Manga — ani-manga" },
  { page: "films", slug: "films", label: "Films & Books — films" },
  { page: "films", slug: "books", label: "Films & Books — books" },
  { page: "games", slug: "games", label: "Games — games" },
  { page: "idols", slug: "j-pop", label: "Idols — j-pop" },
  { page: "idols", slug: "k-pop", label: "Idols — k-pop" },
] as const;

export type PageDescriptionSlug = (typeof PAGE_DESCRIPTION_SLOTS)[number]["slug"];
export type PageSlot = (typeof PAGE_DESCRIPTION_SLOTS)[number]["page"];
