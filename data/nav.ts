export type NavItem = {
  href: string;
  label: string;
  icon?: string;
  image?: string;
  grayscale?: boolean;
};

export const pages: NavItem[] = [
  { href: "/", label: "Homepage", icon: "fa-solid fa-user" },
  { href: "/anime", label: "Anime & Manga", icon: "fa-solid fa-window-restore" },
  { href: "/films", label: "Films & Books", icon: "fa-solid fa-folder" },
  { href: "/games", label: "Games", icon: "fa-solid fa-gamepad" },
  { href: "/idols", label: "Idols", icon: "fa-solid fa-star" },
];

export const socials: NavItem[] = [
  { href: "https://twitter.com/vanillaine", label: "Twitter", icon: "fa-brands fa-twitter" },
  { href: "https://www.instagram.com/vanillaine_/", label: "Instagram", icon: "fa-brands fa-instagram" },
  { href: "https://www.last.fm/user/vanillaine", label: "Last.fm", icon: "fa-brands fa-lastfm" },
  { href: "https://letterboxd.com/Vanillaine/", label: "Letterboxd", icon: "fa-brands fa-letterboxd" },
  {
    href: "https://myanimelist.net/profile/vanillaine",
    label: "MyAnimeList",
    image: "https://cdn.simpleicons.org/myanimelist/ffffff",
  },
  {
    href: "https://mydramalist.com/profile/Jutrzenkaaa",
    label: "MyDramaList",
    image: "/assets/mydramalist bg removed.png",
    grayscale: true,
  },
  {
    href: "https://backloggd.com/u/vanillaine",
    label: "Backloggd",
    image: "/assets/backloggd bg removed.png",
    grayscale: true,
  },
  { href: "https://steamcommunity.com/id/vanillaine/", label: "Steam", icon: "fa-brands fa-steam-symbol" },
  { href: "https://psnprofiles.com/Vanillaine", label: "Playstation", icon: "fa-brands fa-playstation" },
  {
    href: "https://overwatch.blizzard.com/en-us/career/d04ca38cbf7e8dbee2e972bdd509a30e%7C19aadd5741b768317af03812fe8c8511/",
    label: "Overwatch",
    image: "https://cdn2.steamgriddb.com/icon_thumb/0cf7b480289c0c4b07b6d3bd72fef0c9.png",
    grayscale: true,
  },
];
