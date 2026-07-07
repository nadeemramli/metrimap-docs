# Information architecture — docs.canvasm.app

Internal note (not published). The public docs live in `content/docs/**`; this
file records the launch IA, ownership, and the stable deep-links other surfaces
(canvasm.app, the app, marketing) can point at.

Inspiration: [Bouncer concepts](https://doc.bouncer.my/concepts) — a concept-first
shell with concise pages — extended with education and product-system tracks.

## Principles

- **Concept-first.** Explain the model before the mechanics.
- **Education is separate from reference.** `learn/` is non-technical and
  narrative; `reference/` is precise and integration-focused.
- **Every page carries frontmatter** (`title`, `description`, `owner`, `status`,
  `lastReviewed`). Stubs use the `<Stub>` component, never lorem ipsum.
- **Current vs Planned** is explicit in reference pages.

## Sidebar structure

Ordering lives in `content/docs/**/meta.json`. Top level (`content/docs/meta.json`):

```
Start here
  index          (/docs)                     Welcome / overview
  quickstart     (/docs/quickstart)          First canvas in ~10 min
Concepts         (/docs/concepts)            [CVS-293]
Learn            (/docs/learn)               [CVS-294]
Product System   (/docs/product-system)      [CVS-295]
Guides           (/docs/guides)              task how-tos
Reference        (/docs/reference)           [CVS-296]
Release notes    (/docs/release-notes)
```

## Full page map + ownership

| Section | Page | URL | Owner | Priority |
|---|---|---|---|---|
| Start here | Overview | `/docs` | docs | P1 |
| Start here | Quickstart | `/docs/quickstart` | docs | P1 |
| Concepts | Overview | `/docs/concepts` | CVS-293 | P1 |
| Concepts | Organizations & workspaces | `/docs/concepts/organizations-workspaces` | CVS-293 | P1 |
| Concepts | Canvases | `/docs/concepts/canvases` | CVS-293 | P1 |
| Concepts | Metrics & sources | `/docs/concepts/metrics-and-sources` | CVS-293 | P1 |
| Concepts | Dashboards | `/docs/concepts/dashboards` | CVS-293 | P1 |
| Concepts | Strategy & impact | `/docs/concepts/strategy-impact` | CVS-293 | P1 |
| Concepts | Groups & visibility | `/docs/concepts/groups-and-visibility` | CVS-293 | P1 |
| Learn | Overview | `/docs/learn` | CVS-294 | P1 |
| Learn | Metric mapping basics | `/docs/learn/metric-mapping-basics` | CVS-294 | P1 |
| Learn | Strategy breakdown | `/docs/learn/strategy-breakdown` | CVS-294 | P1 |
| Learn | Dashboard cadence | `/docs/learn/dashboard-cadence` | CVS-294 | P1 |
| Learn | Team visibility | `/docs/learn/team-visibility` | CVS-294 | P1 |
| Learn | Example: growth map | `/docs/learn/example-growth-map` | CVS-294 | P1 |
| Product System | Overview | `/docs/product-system` | CVS-295 | P1 |
| Product System | Strategy to impact | `/docs/product-system/strategy-to-impact` | CVS-295 | P1 |
| Product System | Impact contracts | `/docs/product-system/impact-contracts` | CVS-295 | P1 |
| Product System | Group to dashboard | `/docs/product-system/group-to-dashboard` | CVS-295 | P1 |
| Product System | Evidence & governance | `/docs/product-system/evidence-and-governance` | CVS-295 | P2 |
| Guides | Overview | `/docs/guides` | docs | P2 |
| Guides | Create a canvas | `/docs/guides/create-a-canvas` | docs | P2 |
| Guides | Add metrics | `/docs/guides/add-metrics` | docs | P2 |
| Guides | Connect data | `/docs/guides/connect-data` | docs | P2 |
| Guides | Build dashboards | `/docs/guides/build-dashboards` | docs | P2 |
| Guides | Share views | `/docs/guides/share-views` | docs | P2 |
| Reference | Overview | `/docs/reference` | CVS-296 | P1 |
| Reference | MCP / agent connection | `/docs/reference/mcp` | CVS-296 | P1 |
| Reference | API & auth | `/docs/reference/api` | CVS-296 | P1 |
| Reference | Connectors | `/docs/reference/connectors` | CVS-296 | P1 |
| Reference | Data model | `/docs/reference/data-model` | CVS-296 | P1 |
| Reference | Security & access | `/docs/reference/security-access` | CVS-296 | P1 |
| Reference | Troubleshooting | `/docs/reference/troubleshooting` | CVS-296 | P2 |
| Release notes | Index | `/docs/release-notes` | docs | P3 |

## Deep-links for other surfaces (canvasm.app, app, marketing)

These paths are the contract — keep them stable. Good targets to link from
product/marketing surfaces:

- Landing / "Docs" nav → `https://docs.canvasm.app/docs`
- "Get started" → `https://docs.canvasm.app/docs/quickstart`
- "What is Canvasm" → `https://docs.canvasm.app/docs/concepts`
- In-app "Connect your agent" → `https://docs.canvasm.app/docs/reference/mcp`
- In-app "Connect data" → `https://docs.canvasm.app/docs/reference/connectors`
- In-app access/sharing help → `https://docs.canvasm.app/docs/reference/security-access`

If a URL must change, add a redirect rather than breaking the link.
