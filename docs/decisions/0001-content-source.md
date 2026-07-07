# 0001 — Docs content source & CMS threshold

- **Status:** Accepted
- **Date:** 2026-07-08
- **Decision owner:** Nadeem (docs lane)
- **Applies to:** `docs.canvasm.app` (this repo)

## Decision

**Launch with Git-backed MDX in this repo.** Documentation is authored as MDX under
`content/docs/**`, reviewed and published through GitHub pull requests, and rendered
by Fumadocs on Vercel.

**Do not use Supabase (or any app database) for docs content.** Documentation is
public, versioned, and edited by developers; it does not need to live beside — or share
a security surface with — application production data. Keeping docs in Git keeps the two
concerns cleanly separated.

Adopt a CMS **only** if specific thresholds (below) are crossed. If that happens, the
evaluation is **Hetzner-hosted Directus vs Hetzner-hosted Payload**, not Supabase.

## Why Git-backed MDX for launch

- **Right-sized.** Launch content is a modest set of pages maintained by the same people
  who write the code. PRs already give review, history, rollback, and preview
  deployments for free.
- **No new infrastructure.** No database, no server to patch, no backups to own. Vercel
  builds from `main`; Orama search runs at build/edge time with no external service.
- **Versioned with intent.** Docs change alongside product changes and travel in the
  same review flow. `lastReviewed`/`status` frontmatter plus `npm run check` keep pages
  honest (see [`../quality-gates.md`](../quality-gates.md)).
- **Separation from production data.** Public docs never touch app RLS, keys, or
  customer data. That boundary is a feature, not a limitation.

### Content directories

```
content/docs/
  index.mdx, quickstart.mdx     # Start here
  concepts/                     # the product model
  learn/                        # education track
  product-system/               # operating model
  guides/                       # task how-tos
  reference/                    # MCP, API, connectors, data model, access
  release-notes/
```

Ordering and sidebar structure live in each folder's `meta.json`. The full map is in
[`../ia.md`](../ia.md).

### Frontmatter schema (required on every page)

| Field | Rule |
|---|---|
| `title` | non-empty |
| `description` | non-empty |
| `owner` | who maintains the page |
| `status` | `draft` \| `review` \| `stable` |
| `lastReviewed` | `YYYY-MM-DD` |

`title`/`description` are enforced by Fumadocs' schema; all five are enforced by
`npm run check`, which also fails on broken internal links.

### Authoring → review → publish flow

1. Branch from `main`.
2. Add or edit MDX in `content/docs/**`; wire new pages into `meta.json`.
3. `npm run check && npm run build` locally.
4. Open a PR → Vercel builds a **preview deployment**; review the rendered pages.
5. Merge to `main` → production deploy to `docs.canvasm.app`.

## When Git-backed MDX stops being enough

Reconsider (and evaluate a CMS) when **any** of these become a real, recurring need —
not a hypothetical:

1. **Non-developer publishing.** Marketing/support/PM need to publish without touching
   Git or waiting on a developer.
2. **Editorial roles & workflow.** Draft → review → approve → schedule, with
   role-based permissions and an audit trail, managed by non-engineers.
3. **Media workflows.** Managed image/video uploads, transformations, and a media
   library beyond committing files to the repo.
4. **Scheduled/timed publishing.** Content that must go live at a set time
   (announcements, embargoed release notes) without a human merging at that moment.
5. **High article volume / velocity.** A blog or knowledge base large and fast-moving
   enough that PR-per-change becomes the bottleneck.
6. **Localization at scale.** Many locales with translator workflows that Git branches
   handle poorly.

Until then, prefer improving the Git flow (templates, a docs template PR, better
`check` rules) over adopting a CMS.

## If the threshold is crossed: Directus vs Payload (Hetzner)

Both are self-hostable headless CMSes deployed to Hetzner and consumed by this Next.js
site over their APIs at build and/or request time. The docs remain a Fumadocs site; the
CMS becomes a **content source** alongside (or instead of) MDX.

| Dimension | Directus | Payload |
|---|---|---|
| **Model** | Wraps a **PostgreSQL** database; admin app + REST/GraphQL over your schema | **Code-first** (TypeScript) config; app framework; MongoDB or Postgres |
| **Language/stack** | Node app + Postgres | Node/TypeScript + Next-friendly; can run inside a Next app |
| **Editorial UX** | Mature admin UI, roles, flows, file library out of the box | Strong TypeScript DX; admin UI generated from config |
| **Fit with this repo** | Separate service; fetch content over API | Can co-locate with a Next app; tighter TS types |
| **Ops burden** | Container + Postgres + backups | Container + Mongo/Postgres + backups |
| **Best when** | Non-devs need a polished admin now | Team wants content modeled in code with strong types |

**Leaning:** if the trigger is **non-developer/editorial publishing**, Directus' admin
UX is the lower-friction choice. If the trigger is **structured content owned by
engineers** with strong typing, Payload fits the existing TypeScript stack better.
Decide against the actual trigger when it arrives.

### Caching / fetching behavior (if a CMS is adopted)

- **Prefer build-time fetching / SSG** with Incremental Static Regeneration so pages stay
  fast and the CMS is not in the hot path for every request. Trigger rebuilds via a
  deploy hook on publish.
- Keep the CMS **private** (not directly public); the docs site is the only public
  surface. Read content over a scoped API token, server-side only.
- Cache aggressively at the edge; use on-demand revalidation for scheduled/late edits.
- Keep MDX as a fallback/source of truth during migration; migrate section by section.

### Ops & security checklist for a Hetzner-hosted CMS

- [ ] Run in Docker behind a reverse proxy (Caddy/Traefik) with automatic TLS.
- [ ] Firewall: expose only 443; database not reachable from the public internet.
- [ ] Separate least-privilege DB user; secrets in env, never in the repo.
- [ ] Admin behind SSO/strong auth + 2FA; scoped read-only API token for the site.
- [ ] Automated **daily database backups** + periodic media backups, stored off-box;
      test restores.
- [ ] Unattended security updates for the host; pinned, regularly updated CMS image.
- [ ] Audit logging on content changes; monitoring/alerts on the service and disk.
- [ ] Documented **migration path** MDX → CMS (and a rollback), run incrementally.

## Consequences

- Launch ships with zero docs infrastructure to operate and a clean separation from app
  data.
- Contributors need Git familiarity; non-devs can't self-publish yet (accepted for now).
- The CMS decision is deferred with explicit triggers, so it's revisited on evidence
  rather than speculation.

## Links

- Authoring conventions & scripts: [`../../README.md`](../../README.md)
- Quality gates: [`../quality-gates.md`](../quality-gates.md)
- Information architecture: [`../ia.md`](../ia.md)
- Directus self-host: https://directus.io/docs/getting-started/create-a-project
- Payload: https://payloadcms.com/docs/getting-started/what-is-payload
