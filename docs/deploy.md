# Deployment — docs.canvasm.app

How this repo deploys, and the one owner step left to route the production domain.

## Hosting

- **Platform:** Vercel.
- **Project:** `metrimap-docs` (team `nadeemramli's projects`), **separate** from the
  app project (`canvasm` → `use.canvasm.app`) and the marketing project
  (`metrimap-marketing` → `canvasm.app`). Keeping docs in their own project isolates
  builds, domains, and rollbacks.
- **Framework:** Next.js (auto-detected). Node 24.x. Build command `next build`,
  default output — no custom Vercel config needed.

## Git integration (working)

The project is linked to the GitHub repo **`nadeemramli/metrimap-docs`**:

- **Production:** every push/merge to **`main`** deploys to production. Verified —
  recent `main` commits built and reached `READY`.
- **Previews:** every pull request gets its own **preview deployment** and URL.
  Verified — recent PRs each produced a `READY` preview.

No action needed here; it already works.

## Environment variables

**None required.** Search is **Orama**, which runs at build/edge time with no external
service or keys. Analytics is not wired yet (see
[`quality-gates.md`](quality-gates.md) for the planned events); if a provider is added
later, document its env vars here and keep instrumentation out of the static-render path.

## Production domain — `docs.canvasm.app` (owner step)

The custom domain is **not yet attached**. Because `canvasm.app` is already managed on
Vercel (it's a domain on the `metrimap-marketing` project), adding the `docs` subdomain
is quick and needs **no external DNS provider** — Vercel creates the record and issues
SSL automatically.

**Owner steps (~1 minute), in the Vercel dashboard:**

1. Open the **`metrimap-docs`** project → **Settings → Domains**.
2. **Add** `docs.canvasm.app`.
3. Since Vercel manages `canvasm.app` DNS, accept the auto-created DNS record when
   prompted. (If DNS were external, you'd instead add a CNAME
   `docs` → `cname.vercel-dns.com`.)
4. Wait for **"Valid Configuration"** — Vercel provisions the TLS certificate
   automatically (Let's Encrypt). No manual SSL steps.
5. Confirm `https://docs.canvasm.app` loads the docs and `https://docs.canvasm.app/docs`
   shows the sidebar.

Assign the domain to **production** (the default) so `main` serves it.

### SSL / HTTPS

Vercel issues and renews the certificate automatically once the domain validates. HTTP
redirects to HTTPS by default.

## Linking to docs from the app and marketing site

Once the domain resolves, `use.canvasm.app` (app) and `canvasm.app` (marketing) can link
to stable docs paths. The canonical deep-links are listed in [`ia.md`](ia.md) — e.g.:

- Docs home → `https://docs.canvasm.app/docs`
- Quickstart → `https://docs.canvasm.app/docs/quickstart`
- Connect an agent → `https://docs.canvasm.app/docs/reference/mcp`

Canonical URLs, `sitemap.xml`, and `robots.txt` are already emitted for the
`docs.canvasm.app` origin, so search engines and link previews resolve correctly the
moment the domain is live.

## Rollback

Production deployments are rollback candidates in the Vercel dashboard — promote a
previous `main` deployment to roll back instantly if a bad merge ships.
