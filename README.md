# metrimap-docs

Public documentation for **Canvasm** (the product is also called **Metrimap**),
served at **[docs.canvasm.app](https://docs.canvasm.app)**.

This repo is **docs only** — Git-backed MDX rendered with
[Fumadocs](https://fumadocs.dev) on Next.js. The Metrimap application lives in a
separate repo and deploys to **[use.canvasm.app](https://use.canvasm.app)**. No
Supabase, no CMS, and no application runtime code or data belong here. (See the
content-source decision: [`docs/decisions/0001-content-source.md`](docs/decisions/0001-content-source.md).)

## Stack

- **Next.js** (App Router) + **React 19**
- **Fumadocs** (`fumadocs-ui`, `fumadocs-core`, `fumadocs-mdx`) for the docs
  shell: sidebar, table of contents, search, and MDX components (callouts, cards,
  tabs, steps).
- **MDX** content in `content/docs/**`
- **Orama** local search (no external service, no API keys)
- Tailwind CSS v4

## Local setup

```bash
npm install          # installs deps and runs `fumadocs-mdx` (generates .source/)
npm run dev          # http://localhost:3001  (3001 avoids the app's 3000)
```

Other scripts:

```bash
npm run build        # production build — must pass before every PR
npm run type-check   # fumadocs-mdx + next typegen + tsc --noEmit
npm run lint         # eslint
npm run check        # content quality gate: frontmatter + internal links
npm start            # serve the production build on :3001
```

## Repo layout

```
content/docs/            # all documentation, as MDX (+ meta.json for nav)
src/app/                 # Next.js App Router
  (home)/                #   marketing/landing route
  docs/[[...slug]]/      #   docs renderer (sidebar/TOC/MDX)
  api/search/route.ts    #   Orama search endpoint
  og/docs/[...slug]/     #   per-page Open Graph images
  llms.txt, llms-full.txt, llms.mdx/  # machine-readable exports
src/lib/shared.ts        # site constants: name, canonical URL, GitHub repo
src/lib/source.ts        # Fumadocs content source loader
src/lib/layout.shared.tsx# shared nav/layout options
src/components/mdx.tsx    # MDX component overrides
source.config.ts         # Fumadocs collections + frontmatter schema
docs/                     # internal notes: IA map, decisions, deploy (not published)
```

## Authoring flow

1. **Branch.** Never commit docs to `main` directly — branch per change (keep the
   Linear `CVS-XXX` id in the branch/PR when applicable).
2. **Write MDX** under `content/docs/**`. Add a page to the sidebar via the
   folder's `meta.json` (`pages` list). Nesting mirrors the URL.
3. **Frontmatter is required** on every page (see below).
4. **Preview** with `npm run dev` (http://localhost:3001).
5. **Open a PR.** Vercel builds a preview deployment for the branch.
6. **Merge** after the production build passes and review is done. `main` deploys
   to `docs.canvasm.app`.

### Required frontmatter

Every page must carry:

```yaml
---
title: Page title            # required — sidebar + <title> + OG image
description: One-line summary # required — meta description + OG + search
owner: docs                  # who maintains this page
status: draft                # draft | review | stable
lastReviewed: 2026-07-08     # YYYY-MM-DD of the last content review
---
```

`title` and `description` are validated by Fumadocs' schema and the build fails
without them. `owner`, `status`, and `lastReviewed` are enforced by the content
quality gate (`npm run check`) — see [`docs/quality-gates.md`](docs/quality-gates.md),
which also covers search, the feedback footer, and metadata/sitemap/robots/OG.

### Content conventions

- **Plain language, concept-first.** Explain *what* and *why* before *how*.
- **Recurring example.** Use one running example — a subscription business with an
  **MRR** tree (MRR ← new / expansion / churn ← acquisition / activation drivers) —
  so readers build a mental model across pages.
- **Current vs Planned.** Reference pages must clearly separate shipped behavior
  from the roadmap. Never present planned work as available.
- **No internals.** Never expose table names, RLS policy text, API keys, server
  IPs, private URLs, or internal issue links. These docs are public.
- **Cross-link** related concept / guide / reference pages, and close each page
  with a **Next steps** pointer (into the app or the next doc).
- **Terminology** matches the app UI (e.g. canvas, card, tracked metric,
  dashboard, group, access tag).
- **Stubs** use a visible "This page is a stub" callout — never lorem ipsum.

### MDX components

Fumadocs UI components are available in MDX without imports, including
`<Callout>`, `<Cards>` / `<Card>`, `<Tabs>` / `<Tab>`, and `<Steps>` / `<Step>`.
See `src/components/mdx.tsx` to register custom components.

## Deployment

Hosted on **Vercel** as a project separate from the app. `main` → production
(`docs.canvasm.app`); every PR gets a preview URL. Orama search runs at build/edge
time and needs **no environment variables**. Full details and owner setup steps:
[`docs/deploy.md`](docs/deploy.md).

## License

Documentation content © Canvasm. See [LICENSE](LICENSE) if present.
