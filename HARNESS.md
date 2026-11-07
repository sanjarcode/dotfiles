# Harness requirements and switching policy

## Required functionality (evaluate the entire toolchain, not just one harness)

| Requirement | Acceptance criterion | Current baseline / evidence |
| --- | --- | --- |
| GUI-first UX | Mature, discoverable desktop/web UI; routine setup and management should not require JSON editing or complicated terminal workflows. | Codex has the best UI in these notes. |
| MCP management | Add, authenticate (including OAuth), enable/disable, inspect, and troubleshoot MCP servers easily; failures should have useful logs. | Codex/Claude MCPs work, but failure diagnostics are limited; OpenCode desktop lacks a visible add-MCP flow. |
| Skills and plugins | Install, discover, manage, and reuse skills/plugins without extensive manual setup. | Already supported by existing harness workflows; see comparisons below. |
| Browser automation | Let the agent work with authenticated websites and existing browser sessions, with reliable human handoff. | **Already solved at toolchain level via ego-lite**, even if a harness lacks native browser control. |
| Model access | Use capable models without unnecessary lock-in; alternative model routing is a bonus, not a reason alone to migrate. | Models already available in existing tools. |
| Reliability and speed | Predictable execution, intelligible error messages, reasonable latency, and few integration/installation failures. | Reliability matters more than having a larger feature list. |
| Configuration portability | Prefer easy backup/restore and syncing of MCPs, skills, plugins, and preferences across machines; don't leak credentials. | Desirable convenience, not necessarily a blocker. |
| Usage economics | Sufficient rate/token limits for regular work, at acceptable cost. | Codex 5-hour usage limit is a documented friction below. |

## Stop rule: avoid harness hopping

- **A requirement counts as solved if the current *combined setup* solves it**, including external tools (e.g., Codex + ego-lite for browser control). Native integration is not automatically new functionality.
- **Do not switch for parity or marginal polish.** A new browser integration, plugin catalog, or UI improvement is insufficient when the current workflow already works.
- Consider switching only if the candidate **(a)** reliably solves an important currently unsolved requirement, **or (b)** yields a substantial, measurable improvement in a frequent workflow, **and** that benefit exceeds installation, migration, learning, reliability, and maintenance costs.
- Prefer fixing a single gap with a small interoperable tool rather than migrating the entire harness.
- Apply a short pre-install check: *What exact job cannot I do today? How often does this block me? What measurable improvement would the new harness deliver? Can my existing setup achieve the same result?*
- **Default decision: stay with the current stable setup.** Don't browse or trial new harnesses without a concrete unmet need. If a trial is justified, time-box it and abort quickly when setup becomes complex or unstable.
- Example: OpenCode Browse duplicates the browser control already available through ego-lite. OpenCode Manager's difficult/failed installation increases switching cost without providing a new capability. **No migration justified solely for browsing.**

---

## VS code
- Didn't try
- Skills (work, pulls from all harnesses)
- MCPs (work, pulls from all harnesses)
- What about browser (Chrome) use?
- Models can be added definitely

## Cursor
- MCPs are buggy
- Models are great

## Codex
- The best UI
- MCPs are fine. No failure logs though
- Token limit (5h) is too small
- Very good Chrome use

## Claude Code
- MCPs work, no logs on failure
- Model is fine. Has been slow since August 2026
- Chrome use is poor

## DeepSeek
- Desktop and cli are separate. Only CLI is needed. Install CLI using `npm install -g @deepseek-ai/dsh`. To see UI, run `dsh web`
- Upgrade: `npm install -g @deepseek-ai/dsh@latest`
- Install important plugins:
  - Settings back up: `dsh plugin --profile web add dsh-config-manager`, then add the backup private repo (https://github.com/sanjarcode/deepseek-settings-backup) and set the token (saved in password manager), and hit "Sync". Hopefully none of the other things would then be needed.
  - Plugin manager: `dsh plugin --profile web add dsh-plugin`, includes marketplace. All plugins marketplace: https://dsh-plugin.org
  - MCP manager: `dsh plugin --profile web add github:hyqhyq3/dsh-mcp-manager`. Has outh click.
    - GitHub MCP, needs URL (https://api.githubcopilot.com/mcp/), select auth as "No auth", add headers (Authorization: Bearer github_xxx).
  - Skills: `dsh plugin --profile web add github:zh0uhx/dsh-skills`. Skills search exists.
  - Chat import: https://github.com/Nwflower/dsh-chat-import `dsh plugin --profile web add dsh-chat-import`
  - Context usage (per chat): `dsh plugin --profile web add dsh-context`
  - Annotation `dsh plugin --profile web add @changfenhuang/dsh-annotation`
  - Auto authorization review
  - Automation tasks (Scheduled tasks)
- Extra plugins. Path: Home page > Plugins button click
  - Voice mode
  - Agent teams
- Performance - the thinking trace is bloated, and the AI is a little less intelligent. It could be a harness problem.

## Antigravity (didn't try)
- Chrome had problems
## OpenCode
- No way to install MCP
## Goose (not tried)

## Pi (not tried)
## Hermes (not tried)
## Openclaw
Too many errors, slow response on WhatsApp.
