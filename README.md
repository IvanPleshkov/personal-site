# ivanpleshkov.dev

Personal site of [Ivan Pleshkov](https://github.com/IvanPleshkov). Bilingual (EN default, RU under `/ru/`), editorial-styled, statically built with [Astro](https://astro.build).

## Stack

- **Astro 6** — static output
- **TypeScript**, **MDX** for blog posts
- **Google Fonts** via Astro Fonts API: Newsreader (display), Inter (body), JetBrains Mono (chrome)
- **satori + @resvg/resvg-js** — build-time generation of per-page Open Graph images
- **JSON-LD** structured data: Person + WebSite baseline, ProfilePage on `/about`, BlogPosting on each post
- **i18n** built-in: `prefixDefaultLocale: false` (English at root, Russian at `/ru/`)
- Dark theme via `data-theme` attribute set by inline script (respects `prefers-color-scheme`, persists in `localStorage`)

## Layout

```
src/
├── assets/
│   ├── portrait.jpeg          # /about photo
│   └── fonts/                 # legacy Atkinson, unused
├── components/
│   ├── BaseHead.astro         # <head>: meta, fonts, theme bootstrap, JSON-LD, OG
│   ├── Header.astro           # sticky bar: nav, lang switch, theme toggle
│   ├── Footer.astro           # mono footer with social links + colophon
│   ├── HeaderLink.astro
│   └── FormattedDate.astro
├── content/blog/              # posts (md / mdx). Schema in src/content.config.ts
├── i18n/ui.ts                 # translations + getLangFromUrl + getAlternateLocale
├── layouts/BlogPost.astro     # post page layout
├── lib/
│   ├── og.ts                  # satori-based OG image renderer
│   └── schema.ts              # JSON-LD Person/WebSite/ProfilePage/BlogPosting
├── pages/
│   ├── index.astro            # / (EN home)
│   ├── about.astro            # /about
│   ├── blog/
│   │   ├── index.astro        # /blog list
│   │   └── [...slug].astro    # /blog/<post>
│   ├── ru/                    # Russian mirrors of home and about
│   ├── og.png.ts              # /og.png — homepage default OG
│   ├── og/about.png.ts        # /og/about.png
│   ├── og/blog.png.ts         # /og/blog.png
│   ├── og/blog/[slug].png.ts  # per-post OG, getStaticPaths from collection
│   └── rss.xml.js             # RSS feed
├── styles/global.css          # editorial palette, dark mode tokens, type scale
└── consts.ts                  # SITE_TITLE, SITE_DESCRIPTION, SOCIAL_LINKS
```

## Commands

| Command         | Action                                         |
| :-------------- | :--------------------------------------------- |
| `pnpm install`  | Install dependencies (Node ≥ 22.12)            |
| `pnpm dev`      | Dev server at `http://localhost:4321`          |
| `pnpm build`    | Static build to `./dist/`                      |
| `pnpm preview`  | Serve `./dist/` for a final pre-deploy check   |
| `pnpm astro …`  | Astro CLI (e.g. `astro check` for type errors) |

OG fonts are fetched from Google Fonts on first build and cached in
`node_modules/.cache/og-fonts/`. CI builds will redownload (≈100 KB total),
local rebuilds reuse the cache.

## Adding a blog post

1. Create `src/content/blog/<slug>.md` (or `.mdx` for JSX-in-Markdown).
2. Frontmatter:
   ```yaml
   ---
   title: "Post title"
   description: "1–2 sentence teaser, also used for <meta description>"
   pubDate: "2026-04-30"
   # updatedDate: "2026-05-15"   # optional
   # heroImage: "./hero.jpg"     # optional, place next to the .md
   ---
   ```
3. Write Markdown / MDX. The post page, RSS entry, and a custom OG image at
   `/og/blog/<lang>/<slug>.png` are generated automatically.

### Drafts

Add `draft: true` to a post's frontmatter to keep it private:

```yaml
draft: true
```

Drafts behave like this:

- **Visible in `pnpm dev`** — preview locally as you write.
- **Hidden in production builds** (what Cloudflare deploys) — no post page,
  no entry in `/blog` or `/ru/blog`, no RSS item, no sitemap URL, no OG card.

Remove the line (or set `draft: false`) when you're ready to publish.

## Design language

- Light theme: warm paper (`#f6f2e8`) with rust accent (`#b8451e`).
- Dark theme: graphite (`#14130f`) with amber accent (`#f59e3c`).
- Display: Newsreader Italic for headings and titles.
- Mono: JetBrains Mono for nav, dates, handles, OG metadata.
- Dashed rules separate sections; `§` markers and numbered nav (`01`, `02`, `03`).
- Restraint: no boxes, no shadows, no second accent color.

## Deploy

Wired up for **Cloudflare Workers Static Assets** via [`wrangler.jsonc`](./wrangler.jsonc).
The build outputs static files to `./dist/`, and `wrangler deploy` uploads
them as a Workers asset binding (no SSR runtime, no adapter).

Important: `astro.config.mjs` pins `output: 'static'`. The Cloudflare deploy
wizard auto-detects Astro and tries to run `astro add cloudflare`, which would
flip the build to `server` mode and break OG generation (resvg-js native binary
won't run in Workers). Keeping `output: 'static'` + an existing `wrangler.jsonc`
signals to the wizard that the project is already configured.

Manual deploy (after `wrangler login`):

```sh
pnpm run deploy   # = pnpm run build && wrangler deploy
```

CI deploy through Cloudflare's Git integration uses the same scripts.

The site can also be deployed to any other static host (Vercel, Netlify,
GitHub Pages, etc.) — just drop `./dist/` on it. `astro.config.mjs` already
sets `site: 'https://ivanpleshkov.dev'` so canonical URLs, sitemap, RSS,
and OG `og:url` tags resolve to the production domain.

## Credits

- Based on the [Astro blog starter](https://github.com/withastro/astro/tree/main/examples/blog), itself
  inspired by [Bear Blog](https://github.com/HermanMartinus/bearblog/). Both heavily restyled.
