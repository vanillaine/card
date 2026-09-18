# Yes this is my Car(r)d

I initially used carrd but I refuse to pay for more elements, so I decided to make my own. It started as a
single HTML file, then grew into a full Next.js site. Live at [vanillaine.my.id](https://vanillaine.my.id).

Five pages, one sidebar full of socials, and a "currently playing / watching / reading" column on the right
that updates itself:

| Page | What's there |
| --- | --- |
| `/` | Intro, live Discord status + what I'm listening to / playing |
| `/anime` | Favorite anime & manga (straight from MyAnimeList) |
| `/films` | Films (TMDB) & books |
| `/games` | Favorites + recently played (from Backloggd) |
| `/idols` | J-pop & K-pop faves, hover to reveal the photo/video |

## Stack

| What | Used for |
| --- | --- |
| [Next.js 16](https://nextjs.org) (App Router, Turbopack) | Routing, server components, ISR caching |
| [React 19](https://react.dev) | UI |
| [TypeScript](https://www.typescriptlang.org) | Types |
| [Tailwind CSS v4](https://tailwindcss.com) | Styling, CSS-first config in `app/globals.css` |
| [Vercel](https://vercel.com) | Hosting |
| [Plus Jakarta Sans](https://fonts.google.com/specimen/Plus+Jakarta+Sans) via `next/font` | Body font |
| Ting Tong, ACaslonPro, ITC Avant Garde (self-hosted) | Name, headings, poster labels |
| [Font Awesome](https://fontawesome.com) (kit) | Nav & social icons |

## APIs & credits

A lot of these are **unofficial** (community projects, undocumented endpoints, or plain HTML scraping), so
they can break or disappear whenever. Every one of them has a fallback, so the site never shows an error, it
just shows the hand-written version from `data/curated.ts` instead.

| Source | Used for | Official? | Notes |
| --- | --- | --- | --- |
| [MyAnimeList](https://myanimelist.net) `animelist/<user>/load.json` | Currently watching / reading | **Unofficial** | The undocumented JSON MAL's own list pages load. No key. |
| [Jikan](https://jikan.moe) | Anime & manga favorites | **Unofficial** | Community MAL scraper. Its user endpoints have been down since Aug 28 2026 ([jikan-rest#612](https://github.com/jikan-me/jikan-rest/issues/612)). |
| [jikan-edge](https://jikan.lucashdo.com) | Same, as a fallback | **Unofficial** | Community Jikan mirror, tried when Jikan is down. |
| [TMDB](https://www.themoviedb.org) | Film posters, directors, years | Official | Needs a free API key. |
| [IGDB](https://api-docs.igdb.com) (via Twitch) | Game covers & release years | Official | Twitch client-credentials login. |
| [Backloggd](https://backloggd.com) | Favorite & recently played games | **Scraped** | No API exists, so the profile HTML is parsed. Selectors ported from [Qewertyy/Backloggd-API](https://github.com/Qewertyy/Backloggd-API) (MIT). |
| [Lodestone](https://na.finalfantasyxiv.com/lodestone/) | FFXIV character card | **Scraped** | No character API exists anymore, so the public page is parsed. |
| [OverFast API](https://overfast-api.tekrop.fr) | Overwatch name & rank | **Unofficial** | Community project that parses Blizzard's career pages. |
| [Lanyard](https://github.com/Phineas/lanyard) | Discord status & activity | **Unofficial** | Third-party service; needs to be in their Discord server. Polled every 15s from the browser. |
| [uma.moe](https://uma.moe/api/docs) | Umamusume trainer & inheritance parent | **Unofficial** | Community site, API key from their Discord. |
| [umapyoi.net](https://umapyoi.net) | Umamusume character names | **Unofficial** | Community database, open API. |

Other credits:

- This product uses the TMDB API but is not endorsed or certified by TMDB.
- Posters, covers, and photos belong to their respective owners (MAL, TMDB, IGDB, Backloggd, and the
  artists/labels/agencies). This is a fan page.
- Small icons: [Simple Icons](https://simpleicons.org) CDN and [SteamGridDB](https://www.steamgriddb.com)
  (the monochrome FFXIV icon is by Peggin).
