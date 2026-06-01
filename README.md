# When you have a blank machine

Steps: follow 1, 2, 3 .md files, and execute.

# Usage

## Install

```sh
git clone git@github.com:sanjarcode/.dotfiles.git ~/.dotfiles # clone as a hidden folder
source ~/.dotfiles/install.sh
```

## Uninstall

```sh
source dot_remove # uninstall
rm -rf ~/.dotfiles # cleanup files
```

## What each file does

1. zshrc - just a caller
2. terminal_tool - Oh-my-zsh
3. path_declarations - complilers/interpreters
4. function_declarations - custom functions

## AI stuff

### Claude

This repo is the backup for your Claude setup. Below is every config file, where it lives, and how it maps to the repo.

#### Settings Inventory

| What | System Location | Repo Location | Restore Command |
|------|----------------|---------------|-----------------|
| Claude Desktop config (MCP servers, prefs) | `~/Library/Application Support/Claude/claude_desktop_config.json` | `claude_desktop_config.json` | `cp claude_desktop_config.json ~/Library/Application\ Support/Claude/` |
| Global Claude Code settings (model, plugins, effort) | `~/.claude/settings.json` | `claude-global-settings.json` | `cp claude-global-settings.json ~/.claude/settings.json` |
| Project-level permissions + MCP servers | — | `.claude/settings.local.json` | auto-loaded when cwd is this repo |
| MCP server definitions (comet-bridge) | — | `.mcp.json` | auto-loaded by Claude Code |
| Agent sub-configs | — | `claude-setup-files/.claude/settings.local.json` | copy to agent's `.claude/` |
| Auth & account state (Claude Code) | `~/.claude.json` | `claude-credentials-backup.json` | `cp claude-credentials-backup.json ~/.claude.json` — contains email/org UUIDs (machine-specific, not secrets) |
| Custom commands (spec-kitty, etc.) | `~/.claude/commands/*.md` | 🔴 Installed by plugins | Re-install plugins → commands reappear |

**Restore everything in one shot:**
```sh
cp claude_desktop_config.json ~/Library/Application\ Support/Claude/
cp claude-global-settings.json ~/.claude/settings.json
cp claude-credentials-backup.json ~/.claude.json
source ~/.dotfiles/install.sh
```

> Automated backup alternative: https://github.com/SuperClaude-Org/SuperClaude_Plugin

### Claude Code — `.claude/` backup

The `.claude/` directory in this repo is a partial backup of `~/.claude/` (Claude Code's global config directory).

#### What's backed up

| Path | Contents | Machine-general? |
|------|----------|-----------------|
| `settings.json` | Global prefs, permissions, enabled plugins | Mostly yes. MCP permission rules with UUID-based server names (e.g. `mcp__9278cfb4-...`) are tied to how plugins register on this machine — they'll be silently ignored if the UUID differs on another machine, but won't break anything. |
| `commands/` | Custom slash commands (markdown) | Yes — fully portable |
| `skills/` | Custom skills (markdown/YAML) | Yes — fully portable |
| `plans/` | Saved plans (markdown) | Yes — fully portable |
| `plugins/installed_plugins.json` | List of installed plugins with versions | Mostly yes. The `installPath` field contains absolute paths (`/Users/sanjar.afaq/...`) but Claude Code overwrites these on first run. |

#### What's NOT backed up (and why)

- `projects/` (98 MB) — session transcripts with absolute local paths
- `plugins/cache/` (44 MB) — downloaded plugin code, re-fetched automatically
- `sessions/`, `file-history/`, `shell-snapshots/` — ephemeral, machine-local state
- `history.jsonl`, `mcp-needs-auth-cache.json` — ephemeral

#### Restore on a new machine

```sh
# After cloning this repo:
cp -r ~/.dotfiles/.claude/commands ~/.claude/commands
cp -r ~/.dotfiles/.claude/skills   ~/.claude/skills
cp -r ~/.dotfiles/.claude/plans    ~/.claude/plans
cp    ~/.dotfiles/.claude/settings.json ~/.claude/settings.json
# Then open Claude Code — it will re-install plugins listed in settings.json automatically.
# If plugins don't auto-install, run: claude plugins install
```

#### Keep the backup up to date

Run this whenever you add new commands, skills, or change settings:

```sh
cp ~/.claude/settings.json ~/.dotfiles/.claude/settings.json
cp -r ~/.claude/commands/. ~/.dotfiles/.claude/commands/
cp -r ~/.claude/skills/.   ~/.dotfiles/.claude/skills/
cp -r ~/.claude/plans/.    ~/.dotfiles/.claude/plans/
cp ~/.claude/plugins/installed_plugins.json ~/.dotfiles/.claude/plugins/installed_plugins.json
cd ~/.dotfiles && git add .claude/ && git commit -m "Update Claude backup" && git push
```

### AI prompts

Add prompts here. Version them too.

### AI rules

<details><summary>Why store AI stuff here</summary>

#### Using AI to Skip Low-Level Skill Learning

The core idea is a division of labor: you understand the what and why of a technology (via docs, architecture understanding), and AI handles the how in code. This keeps you architecturally in control without needing to memorize syntax, API quirks, or boilerplate patterns.

The right form factor to achieve this is **rules files** — persistent context that encodes best practices for a library so you don't re-explain every prompt.

**Language/framework rules** (TypeScript, React, Django) are well-covered by community directories since they're fairly universal.
**Infra library rules** (RabbitMQ, Redis, Kafka) are thinner in the wild because they're context-dependent — the right patterns vary by language, framework, and your architecture.
For these, the best move is to paste the relevant docs section and ask AI to generate the rules for your specific stack. You review against your conceptual understanding, and that becomes your owned artifact.
**Directories:** [cursor.directory](https://cursor.directory/plugins), [awesome-cursorrules](https://github.com/PatrickJS/awesome-cursorrules) on GitHub, and GitHub search via `filename:.cursorrules <library>` or filename:CLAUDE.md surfaces real production setups teams have made public. There's "Tessl.io" too.

#### Don't write rules by hand

What actually works well in practice?
Rather than writing rules yourself, ask AI to generate the rules file for you. For example: "Generate a .cursorrules section for using RabbitMQ with Node.js and amqplib, covering best practices for connection management, manual acks, durable queues, and dead-letter exchanges." You get a solid starting file without needing to know the specifics, and you can validate it against what you read in the docs.
This is a good loop: docs give you the concepts, AI generates the rules, rules make future AI output consistent.

---

#### Rules Files by Tool

| Tool           | Convention                        |
| -------------- | --------------------------------- |
| Cursor         | `.cursor/rules/*.mdc`             |
| Claude Code    | `CLAUDE.md`, also has Projects    |
| Codex (OpenAI) | `AGENTS.md`                       |
| GitHub Copilot | `.github/copilot-instructions.md` |
| Windsurf       | `.windsurfrules`                  |

No shared standard exists yet — content is portable, filenames are not. Since they're all plain text, the install script approach above handles the fragmentation cleanly.

---

#### Managing and Version Controlling Your Rules

Keep all your rules in a **personal dotfiles or `ai-rules` repo** on GitHub. Structure it like:

```
ai-rules/
  infra/
    rabbitmq.md
    redis.md
    kafka.md
  frameworks/
    nextjs.md
    fastapi.md
  install.sh
```

The `install.sh` script symlinks or copies the relevant rules into any project. For example, starting a new project with RabbitMQ and Next.js: `./install.sh nextjs rabbitmq` drops the right content into `.cursorrules`, `CLAUDE.md`, and `AGENTS.md` in one shot.

This way your rules evolve with your experience, are versioned, diffable, and portable across every project and every AI tool — with no repeated setup cost.

---

#### Conclusion: The educated AI user mindset

The trap is becoming dependent without being discerning. What you're describing — reading the docs, understanding internals, then delegating implementation — is exactly the right order. You maintain the ability to review, debug, and make architectural decisions. AI just removes the friction of translating understanding into working code. That's the sweet spot.

</details>

### MCP (wip, don't follow strictly)

? I prefer using Docker as the source of truth when it comes to MCP. It has a lot of MCPs, and there's a clear documentation for installing (one click) and verifying (first company to do so).
But Claude Desktop themselves is quite proper as they literally made MCP.

1. Docker MCP servers - Open Docker > MCP Toolkit, and add MCP servers.
2. Docker connect MCP clients - install Claude Desktop, Cursor, Antigravity, Visual Studio Code, and then, go to Docker and connect them.
3. Potentially redundant - install MCP into Visual Studio Code, Antigravity, Cursor from their own interfaces. But this may not be needed.
4. Add Google MCP - https://developers.google.com/workspace/guides/configure-mcp-servers
5. Google Sheets MCP - https://github.com/xing5/mcp-google-sheets#method-a-service-account-recommended-for-serversautomation-

- Trust Claude Desktop and Docker MCP https://docs.docker.com/ai/mcp-catalog-and-toolkit/[toolkit/](https://docs.docker.com/ai/mcp-catalog-and-toolkit/toolkit/) for reliable tooling.
- Docker GenAI stack: https://github.com/docker/genai-stack
