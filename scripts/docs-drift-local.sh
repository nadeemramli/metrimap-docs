#!/usr/bin/env bash
#
# Run the weekly docs-drift check on your Claude Code SUBSCRIPTION (no API key),
# on this machine. Intended to be called from cron — see
# docs/automation/local-schedule.md for the crontab line and caveats.
#
# It uses the Claude Code CLI you're already logged into, so nothing is billed to
# the Anthropic API. Requires the machine to be awake and WSL running at fire time.

set -uo pipefail

# cron runs with a bare PATH — make node/claude and gh resolvable.
NODE_BIN="$(ls -d "$HOME"/.nvm/versions/node/*/bin 2>/dev/null | sort -V | tail -1)"
export PATH="${NODE_BIN}:$HOME/.local/bin:/usr/local/bin:/usr/bin:/bin:$PATH"
export NVM_DIR="$HOME/.nvm"
[ -s "$NVM_DIR/nvm.sh" ] && . "$NVM_DIR/nvm.sh" >/dev/null 2>&1 || true

# Force subscription auth — never fall back to a stray API key.
unset ANTHROPIC_API_KEY

REPO="$HOME/workspace/github.com/nadeemramli/metrimap-docs"
cd "$REPO" || { echo "docs repo not found at $REPO"; exit 1; }

echo "=== docs-drift-check $(date -u +%FT%TZ) ==="
git pull --ff-only origin main >/dev/null 2>&1 || true

# Sonnet is plenty for a routine weekly triage and is easier on subscription
# limits; bump to --model claude-opus-4-8 if you want deeper analysis.
exec claude -p "Follow the playbook in docs/automation/docs-drift-check.md exactly. Report only; do not edit any files." \
  --model claude-sonnet-5 \
  --allowedTools "Bash,Read,Grep,Glob" \
  --output-format text
