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

The copy on those pages (intro, byf/dni, the little description under each page's header, badges) isn't
hardcoded — it lives in a database and I edit it at [admin.vanillaine.my.id](https://admin.vanillaine.my.id).
See [Admin panel](#admin-panel) below. Everything else (the actual anime/film/game/idol entries) still comes
straight from the APIs.

## Stack

| What | Used for |
| --- | --- |
| [Next.js 16](https://nextjs.org) (App Router, Turbopack) | Routing, server components, ISR caching |
| [React 19](https://react.dev) | UI |
| [TypeScript](https://www.typescriptlang.org) | Types |
| [Tailwind CSS v4](https://tailwindcss.com) | Styling, CSS-first config in `app/globals.css` |
| [Prisma 7](https://www.prisma.io) + [Supabase](https://supabase.com) (Postgres) | Editable content + admin sessions |
| [Better Auth](https://www.better-auth.com) | Google sign-in for the admin panel |
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

## Running it locally

```bash
npm install
cp .env.example .env.local   # then fill it in
npm run db:migrate           # creates the tables
npm run db:seed              # seeds the starting copy
npm run dev
```

Open <http://localhost:3000> for the public site. The admin panel is hostname-routed (see below); Google OAuth
won't authorize a `*.localhost` subdomain origin, so testing it locally needs a second dev server on a
different port instead: `npm run dev:admin`, then open <http://localhost:3001>. Other scripts: `npm run build`,
`npm start`, `npm run typecheck`.

## Admin panel

`admin.vanillaine.my.id` is the same Next.js app as the public site, deployed once, on the same Vercel
project — [proxy.ts](proxy.ts) looks at the request's `Host` header and serves the admin routes only there.
Visiting an admin path (`/dashboard`, `/pages`, `/login`) on the public domain just 301s over to the admin one.

Login is Google OAuth via Better Auth. There's no invite/whitelist table — signing in works for anyone with a
Google account, but [`requireAdmin()`](lib/admin/require-admin.ts) only grants edit access when the signed-in
email matches `OWNER_EMAIL`. Anyone else just gets bounced, with an inert, capability-less account row left
behind.

What's editable:

| Screen | Editable | Rules |
| --- | --- | --- |
| `/dashboard` — Badges | The badges next to "age" (pronouns, MBTI, language, ...) | `age` itself isn't here — it's always computed from my birthdate |
| `/dashboard` — Sections | Homepage sections (introduction, seasonals, ...) | `introduction` can't be deleted (its content still can be edited); add/reorder/remove the rest freely |
| `/dashboard` — byf / dni | The bullet points under each | At least one bullet per list always has to stay |
| `/pages` | The one description paragraph under each page's header (`ani-manga`, `films`, `books`, `games`, `j-pop`, `k-pop`) | Fixed set, edit-only — the page layouts wire these slots in directly |

Any of those text fields accepts a tiny markdown subset — see [components/RichText.tsx](components/RichText.tsx):
`**bold**`, `_italic_`, `***bold italic***`, `[text](url)`. No nesting, nothing block-level (no headers/lists
inside a field).

An edit shows up on the public site right away: every admin Server Action calls `revalidateTag` on the way
out, so the next request to the public page picks it up — no redeploy needed.

### One-time setup for a fresh environment

1. **Supabase** — new project, then Project Settings → Database → Connect for the pooled (`DATABASE_URL`)
   and direct (`DIRECT_URL`) connection strings.
2. **Google OAuth** — Google Cloud Console → APIs & Services → Credentials → OAuth client ID (Web
   application). Authorized redirect URI: `<BETTER_AUTH_URL>/api/auth/callback/google`.
3. **DNS + Vercel** — add an `admin` subdomain record at the registrar pointing at Vercel (same as the apex),
   then add `admin.vanillaine.my.id` as a second domain on the same Vercel project.
4. Fill in the rest of `.env.example`'s admin section (`BETTER_AUTH_SECRET`, `BETTER_AUTH_URL`,
   `NEXT_PUBLIC_ADMIN_HOST`, `OWNER_EMAIL`) and set the same variables in Vercel.
