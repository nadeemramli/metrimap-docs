# Content quality, search, feedback & metadata

Internal note (not published). How docs.canvasm.app stays searchable, measurable,
link-preview ready, and protected against stale or broken pages.

## Required frontmatter (enforced)

Every page in `content/docs/**` must declare:

| Field | Rule |
|---|---|
| `title` | non-empty |
| `description` | non-empty (used for meta description, OG, and search) |
| `owner` | who maintains the page |
| `status` | one of `draft` \| `review` \| `stable` |
| `lastReviewed` | `YYYY-MM-DD` |

## The quality gate

`npm run check` (`scripts/check-content.mjs`) fails the build if any page:

- is missing required frontmatter or uses an invalid `status` / `lastReviewed`, or
- links to a `/docs/...` path that doesn't exist (internal link check, anchors ignored).

Run it locally before a PR, and in CI:

```bash
npm run check
```

It's intentionally dependency-free (plain Node) so it runs anywhere without install
steps. Keep it green — a red check means a broken link or a page missing its
frontmatter contract.

## Search

Search is **Orama**, built into the site — no external service and no API keys. The
endpoint at `/api/search` is created from the same content source that renders the
docs (`createFromSource(source)`), so **every** section (Concepts, Learn, Product
System, Guides, Reference, Release notes) is indexed automatically. New pages are
searchable as soon as they build.

## Feedback

Each docs page renders a footer (`src/components/DocsFooter.tsx`) with:

- **Was this page helpful? Yes / No** — opens a prefilled GitHub issue on
  `nadeemramli/metrimap-docs` (there is no analytics backend, so we don't pretend to
  record a silent vote).
- **Report an issue** — prefilled bug report for the page.
- **Edit this page** — links to the MDX source on GitHub.

No Linear credentials ever reach the browser — same rule as the app.

## Metadata, sitemap, robots, OG

- **Per-page metadata** comes from frontmatter via `generateMetadata` (title,
  description), including a **canonical URL** on `https://docs.canvasm.app`, Open Graph,
  and Twitter card tags. `metadataBase` is set in the root layout.
- **OG images** are generated per page by the scaffolded route `/og/docs/[...slug]`.
- **`app/sitemap.ts`** emits the home page + every docs page on the canonical origin.
- **`app/robots.ts`** allows all crawlers and points at the sitemap.

## Analytics (planned)

No analytics provider is wired yet, so nothing is collected. When one is chosen, these
are the events to emit (documented now so instrumentation is consistent later):

| Event | When |
|---|---|
| `page_view` | a docs page is viewed |
| `search` | a search query is run |
| `search_no_results` | a search returns nothing |
| `cta_app_click` | a link to use.canvasm.app is clicked |
| `cta_site_click` | a link to canvasm.app is clicked |

Instrumentation must not block static rendering. Until a provider is decided, treat
this table as the contract, not shipped behavior.
