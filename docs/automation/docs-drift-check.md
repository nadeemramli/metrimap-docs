# Playbook — weekly docs-drift check

You are a **report-only** agent. Your job: detect where the Canvasm app has shipped
changes that the public docs (this repo, `docs.canvasm.app`) don't yet reflect, and
file a single GitHub issue summarizing the drift. **You never edit docs content and you
never expose app internals** (no table names, secrets, RLS text, private URLs, internal
Linear links). If nothing has drifted, stay silent.

## Repos & tools

- **Docs repo (this checkout):** `nadeemramli/metrimap-docs` — the content you're checking.
- **App repo:** `nadeemramli/metrimap` (public) — read via `gh api` / `gh pr list`. This is
  the source of "what shipped" and deploys to `use.canvasm.app`.
- **Linear (optional):** if the Linear MCP tools are available, use them; if not, skip —
  the GitHub signal is enough. Team **Canvasm**, docs project **"Docs site - docs.canvasm.app"**.

Use `gh` for everything GitHub. `GH_TOKEN` is in the environment.

## Step 1 — Establish the window

```bash
SINCE=$(date -u -d '8 days ago' +%F)   # weekly run + 1 day overlap
WEEK=$(date -u -d 'monday this week' +%F 2>/dev/null || date -u +%F)
```

Everything below considers app changes since `$SINCE`.

## Step 2 — Gather what shipped in the app

1. **Merged PRs** (richest signal):
   ```bash
   gh pr list --repo nadeemramli/metrimap --state merged \
     --search "merged:>=$SINCE" --limit 50 \
     --json number,title,url,mergedAt,labels
   ```
   Keep the ones that plausibly affect user-facing behavior: `feat`, `fix`, and anything
   touching **connectors, MCP, API, permissions/visibility, dashboards, strategy/impact,
   evidence, catalog**. Ignore pure `chore`/`test`/`ci`/dependency PRs. Note the `CVS-###`
   id in each title.

2. **Production deployments** (confirms it's live on use.canvasm.app):
   ```bash
   gh api "repos/nadeemramli/metrimap/deployments?environment=Production&per_page=20" \
     --jq '.[] | "\(.created_at[0:10]) \(.ref[0:12])"'
   ```

3. **Linear (optional, only if MCP present):** list Canvasm issues updated since `$SINCE`
   whose state is `Done` or `Waiting for Manual Test` with a feature-ish label. Use these
   to confirm a PR actually shipped vs. is still in review.

If there are **no** qualifying changes, stop here — do not open an issue.

## Step 3 — Read the current docs

From this checkout:

- `content/docs/reference/*.mdx` — pay attention to every **Current** vs **Planned**
  claim (search: `grep -rn "Planned" content/docs`). These are the highest-risk drift.
- `content/docs/**` frontmatter `lastReviewed` — flag pages older than ~90 days that sit in
  an area that changed.
- `docs/ia.md` — the page map, to spot a shipped feature with **no page at all**.

## Step 4 — Decide what drifted

For each qualifying app change, classify:

| Type | Trigger | Example |
|---|---|---|
| **Planned → Current** | A capability the docs mark *Planned* has shipped | GA4 connector (CVS-146) shipped → `reference/connectors.mdx` still says GA4 is Planned |
| **New, undocumented** | A shipped feature with no docs page | a new connector/tool with no reference entry |
| **Changed behavior** | A page describes something that changed | MCP tool list, auth flow, roles/visibility rules |
| **Stale review** | Old `lastReviewed` in a changed area | `reference/mcp.mdx` untouched for 90d while MCP changed |

Be conservative: only report a change you can tie to a specific PR/issue **and** a specific
docs page (or a clear coverage gap). When unsure, list it under "Worth a look" rather than
asserting drift.

## Step 5 — File one issue (only if drift found)

Deduplicate — don't spam a new issue every week:

```bash
# ensure the label exists (ignore error if it already does)
gh label create docs-drift --repo nadeemramli/metrimap-docs \
  --color BFD4F2 --description "Automated docs-freshness findings" 2>/dev/null || true

EXISTING=$(gh issue list --repo nadeemramli/metrimap-docs --label docs-drift \
  --state open --search "Docs drift — week of $WEEK in:title" \
  --json number --jq '.[0].number')
```

- If `$EXISTING` is set → **update** that issue's body (`gh issue edit $EXISTING --body-file -`).
- Else → **create** a new issue:
  ```bash
  gh issue create --repo nadeemramli/metrimap-docs --label docs-drift \
    --title "Docs drift — week of $WEEK" --body-file -
  ```

**Issue body format** (Markdown, grouped by docs page):

```
_Automated weekly docs-drift check. Window: since <SINCE>. Report only — verify each item._

## Likely needs updating
- [ ] `reference/connectors.mdx` — GA4 connector shipped (metrimap#137, CVS-146); page still marks GA4 **Planned**. Flip to Current or update status.
- [ ] `<page>` — <what changed> (<PR/issue refs>)

## Worth a look (unsure)
- [ ] `<page>` — <signal>, may or may not need a change.

## Reviewed, no docs change needed
- <PR/issue> — <why it doesn't affect docs>

<!-- generated-by: docs-drift-check; week: <WEEK> -->
```

Rules for the body:
- Reference app changes by number/CVS id only (`metrimap#137`, `CVS-146`) — **never paste
  internal details, secrets, or private URLs**.
- Every actionable item names the exact docs file and the concrete edit.
- Keep it a checklist a human can burn down.

## Step 6 — Finish

- If you opened/updated an issue, print its URL.
- If there was no drift, print `No docs drift this week.` and exit without creating anything.
- Do **not** commit, push, or edit any docs files. This agent only reports.
