# Run the docs-drift check on your Claude subscription (local schedule)

The [weekly docs-drift check](docs-drift-check.md) runs from **local cron** on your
machine, against your Claude Code subscription — no Anthropic API key, no per-run API
charge:

| | Local cron (this doc) |
|---|---|
| **Auth** | Your **Claude Code subscription** — no API key |
| **Runs when** | Only while **this machine is awake + WSL running** |
| **Cost** | Counted against your Claude subscription limits |

It runs the same `claude` CLI you use interactively, so it bills your subscription, not
the API. The only real trade-off: **if the computer is asleep at the scheduled time, that
run is skipped** (the next week's run still fires).

> A cloud **GitHub Actions** variant used to live at `.github/workflows/docs-drift.yml`.
> It was removed because it required an `ANTHROPIC_API_KEY` secret that was never set, so
> it would have failed every week. If you later want an always-on cloud run that never
> misses a week, re-add a scheduled workflow that runs the same playbook and set that
> secret — see the fallback note below.

## Setup (WSL / Linux cron)

The wrapper script `scripts/docs-drift-local.sh` sets up PATH, forces subscription auth
(`unset ANTHROPIC_API_KEY`), pulls latest, and runs the playbook headless with `claude -p`.

1. **Make sure cron is running** (WSL doesn't start it automatically):
   ```bash
   sudo service cron start
   ```
   To start it every time WSL launches, add `sudo service cron start` to your `~/.bashrc`
   (or enable it via a systemd unit if your WSL has systemd).

2. **Confirm you're logged into Claude Code on your subscription** (not an API key):
   ```bash
   echo "$ANTHROPIC_API_KEY"   # should be empty
   claude -p "say hi" --output-format text   # should respond using your plan
   ```

3. **Add the cron entry** (`crontab -e`), Mondays 08:17 local:
   ```cron
   17 8 * * 1 /home/nadeemramli/workspace/github.com/nadeemramli/metrimap-docs/scripts/docs-drift-local.sh >> $HOME/.docs-drift.log 2>&1
   ```
   Unlike GitHub Actions (UTC), local cron uses your machine's local time.

4. **Test it now** without waiting for Monday:
   ```bash
   ~/workspace/github.com/nadeemramli/metrimap-docs/scripts/docs-drift-local.sh
   tail -n 40 ~/.docs-drift.log
   ```

## Making it reliable on a laptop (optional)

WSL cron only fires while WSL is running. If you close WSL or the machine sleeps, the run
is missed. Options:

- **Windows Task Scheduler** can launch the job even when no WSL window is open, and can
  "run task as soon as possible after a missed start":
  - Action → Program: `wsl.exe`
  - Arguments: `-e bash -lc "$HOME/workspace/github.com/nadeemramli/metrimap-docs/scripts/docs-drift-local.sh"`
  - Trigger: Weekly, Monday 08:17; check **"Run task as soon as possible after a scheduled start is missed."**
- Or add an always-on **cloud** fallback: a scheduled GitHub Actions workflow that runs
  the same playbook (needs an `ANTHROPIC_API_KEY` repo secret). Running both is fine — the
  check dedupes into one weekly issue.

## Keeping it running (usage & limits)

- Each run counts against your Claude subscription usage like any interactive session. A
  weekly triage on Sonnet is light; the wrapper uses `--model claude-sonnet-5` for that
  reason (bump to `--model claude-opus-4-8` in the script for deeper analysis).
- Nothing is stored between runs; the check uses a rolling 8-day window, so a missed week
  is picked up by the next run's overlap.

## What about `CronCreate` (in-session cron)?

Claude Code's in-session `CronCreate` also uses your subscription, but its jobs are
**session-only and auto-expire after 7 days** — they vanish when you close Claude Code. Fine
for a "run this a few times while I'm working today" trial, not for a standing weekly
watchdog. Use local cron (above) for the durable version.
