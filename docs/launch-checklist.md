# Production launch checklist — docs.canvasm.app

Owner-executed manual QA for launch (Linear **CVS-299**, `type:manual-test`). Work top
to bottom and record pass/fail at the end. File any failure as a follow-up issue.

## 0. Prerequisite

- [ ] **Domain attached.** `docs.canvasm.app` is added to the `metrimap-docs` Vercel
      project and shows **Valid Configuration** with SSL. (Steps: [`deploy.md`](deploy.md);
      tracked in **CVS-291**.) Until this is done, run the smoke tests against the current
      production URL `https://metrimap-docs.vercel.app` and re-check the domain items once
      it's live.

## 1. Production deployment & SSL

- [ ] `https://docs.canvasm.app` loads (landing page).
- [ ] Certificate is valid (padlock, no warning); HTTP redirects to HTTPS.
- [ ] `https://docs.canvasm.app/docs` loads the docs shell.

## 2. Page smoke tests (desktop + mobile)

Open each page; confirm it renders, has a title/description, a working sidebar, and no
raw MDX or broken layout. Check a few on a phone (or DevTools device mode) for the mobile
sidebar/menu.

**Start here**
- [ ] `/docs` (overview)
- [ ] `/docs/quickstart`

**Concepts** (real content)
- [ ] `/docs/concepts`
- [ ] `/docs/concepts/organizations-workspaces`
- [ ] `/docs/concepts/canvases`
- [ ] `/docs/concepts/metrics-and-sources`
- [ ] `/docs/concepts/dashboards`
- [ ] `/docs/concepts/strategy-impact`
- [ ] `/docs/concepts/groups-and-visibility`

**Learn** (real content)
- [ ] `/docs/learn`
- [ ] `/docs/learn/metric-mapping-basics`
- [ ] `/docs/learn/strategy-breakdown`
- [ ] `/docs/learn/dashboard-cadence`
- [ ] `/docs/learn/team-visibility`
- [ ] `/docs/learn/example-growth-map`

**Product System** (real content)
- [ ] `/docs/product-system`
- [ ] `/docs/product-system/strategy-to-impact`
- [ ] `/docs/product-system/impact-contracts`
- [ ] `/docs/product-system/group-to-dashboard`
- [ ] `/docs/product-system/evidence-and-governance`

**Reference** (real content)
- [ ] `/docs/reference`
- [ ] `/docs/reference/mcp`
- [ ] `/docs/reference/api`
- [ ] `/docs/reference/connectors`
- [ ] `/docs/reference/data-model`
- [ ] `/docs/reference/security-access`
- [ ] `/docs/reference/troubleshooting`

**Intentional stubs** — these should each show a yellow **"This page is a stub"** callout.
That is expected at launch (Guides and Release notes weren't in the content scope). Confirm
they render the stub, not a crash:
- [ ] `/docs/guides` and its 5 subpages (`create-a-canvas`, `add-metrics`, `connect-data`,
      `build-dashboards`, `share-views`)
- [ ] `/docs/release-notes`

## 3. Docs shell & MDX components

- [ ] **Sidebar** — all seven groups show with icons; expanding/collapsing works; the
      current page is highlighted.
- [ ] **Table of contents** — appears on a long page (e.g. `/docs/concepts/canvases`) and
      scroll-highlights.
- [ ] **Search** — press `/` or click search; query `dashboard`, `impact contract`,
      `MCP` each return relevant results across sections; a nonsense query shows the empty
      state.
- [ ] **MDX components** render: `<Callout>` (Concepts), `<Cards>`/`<Card>` (overview
      pages), tables (Reference data model), fenced code / ASCII diagrams (Quickstart,
      Product System).
- [ ] **Feedback footer** on every docs page: *Was this helpful? Yes/No*, *Report an
      issue*, *Edit this page* — each opens a prefilled GitHub issue / the source file.
- [ ] **Light/dark theme** toggle works.

## 4. Console, network, links

- [ ] No console errors on a sample of pages.
- [ ] No failed network requests (404/500) in the Network tab.
- [ ] Internal links resolve (the CI gate `npm run check` already blocks broken `/docs`
      links; spot-check a few cross-links anyway).
- [ ] External links (use.canvasm.app, GitHub) open correctly.

## 5. SEO / share assets

- [ ] `https://docs.canvasm.app/robots.txt` returns allow-all + the sitemap line.
- [ ] `https://docs.canvasm.app/sitemap.xml` lists the home page + docs pages on the
      canonical origin.
- [ ] View-source on a docs page shows `<link rel="canonical">` on `docs.canvasm.app` and
      Open Graph / Twitter tags.
- [ ] An OG image renders, e.g. `https://docs.canvasm.app/og/docs/concepts/canvases/image.png`.
- [ ] Paste a docs URL into a link-preview tool (or Slack/X) and confirm the card shows a
      title, description, and image.

## 6. Cross-surface linking

- [ ] `canvasm.app` (marketing) can link into docs (e.g. a "Docs" nav item →
      `https://docs.canvasm.app/docs`).
- [ ] `use.canvasm.app` (app) surfaces can deep-link (e.g. "Connect your agent" →
      `/docs/reference/mcp`). Canonical deep-links are listed in [`ia.md`](ia.md).

## 7. Content safety review

- [ ] **No internal-only content** exposed: no table names, RLS/policy text, API/JWT
      secrets, server IPs, private URLs, or internal Linear links. (A grep scan on the
      Reference section was clean during authoring; re-verify anything that changed.)
- [ ] **No stale placeholders** in the 27 real pages (only Guides + Release notes should
      show stub callouts — see §2).
- [ ] **No misleading roadmap claims** — features not yet shipped are labelled **Planned**
      (native connectors/GA4, public REST API, per-key scopes, proxy departments).

## 8. Record the result

| Area | Pass/Fail | Notes / follow-up issue |
|---|---|---|
| Deployment & SSL | | |
| Page smoke (desktop) | | |
| Page smoke (mobile) | | |
| Shell & MDX | | |
| Console/network/links | | |
| SEO/share | | |
| Cross-surface linking | | |
| Content safety | | |

Do **not** mark CVS-299 done until every area passes (or failures are filed as follow-ups
and accepted).

## Repo-side pre-checks (already green)

These run in the repo and back the manual QA above:

- `npm run check` — required frontmatter + internal-link gate (34 pages, passing).
- `npm run build` — production build (108 static routes incl. per-page OG images).
- Runtime spot-check performed during CVS-297: `robots.txt`, `sitemap.xml`, canonical
  tags, feedback footer, and `/api/search` all confirmed correct.
