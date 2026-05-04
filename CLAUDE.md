# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Overview

Personal dotfiles repo cloned to `~/.dotfiles`. Manages zsh shell configuration, AI tool configuration (Claude Code, Cursor), and system setup documentation. The shell config is modular — `.zshrc` is a thin entry point that sources files from `~/` (not from the repo directory; `install.sh` copies them there).

## Shell architecture

```
.zshrc                    → Entry point; sources everything below
  .terminal_tool.sh       → Oh-My-Zsh, zinit plugin manager, Powerlevel10k prompt, history, completions, keybindings
  .path_declarations.sh   → PATH, pyenv, rbenv, nvm, sdkman, brew, Android SDK, Rust, pnpm
  .function_declarations.sh → Custom functions and aliases (git helpers, dotfile management, portkill, etc.)
  .invocations.sh         → Calls nvm_setup, copyAndPaste, setupEditorShortcut
  .env                    → API keys (not tracked; see .env.example for structure)
```

## Install

```
source ~/.dotfiles/install.sh   # copies shell files to ~/ and reloads
```

`install.sh` copies files to home directory. After editing any shell file in the repo, run `dot_refresh` (defined in `.function_declarations.sh`) to re-install and reload.

## Key dotfile commands

| Command | Purpose |
|---------|---------|
| `dot_refresh` | Re-copy all dotfiles to `~/` and reload |
| `dot_status` | List dotfiles present in `~/` |
| `dot_remove` | Remove dotfiles from `~/` |
| `dot_test` | Verify `jp` (jump) command and completions work |
| `dot_speed` | Time how long `.zshrc` takes to source |

## Claude Code config

- `.claude/settings.local.json` — project-level permissions and MCP server settings
- `claude_desktop_config.json` — reference copy of the Claude Desktop config (Docker MCPs, etc.)
- `.mcp.json` — MCP server definitions (currently `comet-bridge`)
- `claude-setup-files/` — Claude Desktop agent configs (`.claude/` subdir for agents)
- `openclaw/` — OpenClaw configuration files and defaults

## Other notable files

- `.finicky.ts` — Browser routing rules (Finicky app). Routes x.com → xcancel.com, bsky.app → Comet browser
- `.gitconfig` — Global git config (user, editor=code, aliases, autoSetupRemote)
- `prompts.md` — Personal coding preferences (TypeScript/Effect, UI libraries, Docker)
- `SKILLS/` — Custom Claude Code skills (currently hackathon-prep)
- `1-os.md`, `2-apps.md`, `3-settings.md` — Manual OS/app setup checklists for new machines
- `.ssh/config` — SSH configuration

## Git helpers (from `.function_declarations.sh`)

- `mkpr [base] [compare]` — Open browser to create a GitHub PR. Defaults configured via `git config --local mkpr.baseBranch` / `mkpr.compareBranch`
- `gup [base]` — Pull latest from base branch and merge into current
- `gplo <branch>` — Fetch and update a non-current branch from origin
- `gcan` — `git commit --amend --no-edit`
- `gsave` / `gload` — Named git stash save/apply with autocomplete
- `ghcc` — Copy GitHub commit URL (not tree URL) to clipboard
