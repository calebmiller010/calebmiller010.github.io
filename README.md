# Caleb Miller — Portfolio

Personal portfolio site built with [Astro](https://astro.build). Bold, modern design. Dark/light mode. Deployed on Vercel.

## Stack

- **Framework:** Astro 4.x
- **Styling:** Scoped CSS + CSS custom properties
- **Fonts:** Cabinet Grotesk (display) + Satoshi (body) via Fontshare
- **Deployment:** Vercel

## Local Dev

```bash
npm install
npm run dev
```

## Deploy to Vercel

1. Push to GitHub
2. Import repo in [Vercel dashboard](https://vercel.com/new)
3. Vercel auto-detects Astro — hit Deploy

## Updating Content

- **Projects:** Edit entries directly in `src/pages/index.astro` under the `projects` array
- **Skills:** Edit the `skills` array in `src/pages/index.astro`
- **Work experience:** Edit the work card section in `src/pages/index.astro`
- **Global styles / design tokens:** `src/styles/global.css`

## Planned: Migrate to Astro Content Collections

Content is currently inline in `index.astro` for simplicity.
Future: move projects to `src/content/projects/*.md` using [Astro Content Collections](https://docs.astro.build/en/guides/content-collections/).
