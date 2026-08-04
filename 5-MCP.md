List of MCP servers & connectors

MCP servers and connectors configured across agents on this machine (Claude Code, Claude Desktop, Cursor) plus the account-level connectors available to the hosted Claude Code/Cowork session. Source task: Notion `TASK-1324` — "Collect MCP + connectors from all agents like Claude Code Desktop, etc."

## MCPs & Connectors

Live config: `~/Library/Application Support/Claude/claude_desktop_config.json`.

`isMCP` = `Yes` for entries defined by a local server process/command (a dotfile-managed MCP config); `No` for account-level connectors authorized on the hosted session, with no local command.

| Name | isMCP | Command | Purpose | Checked |
| :--: | :---: | :-----: | :-----: | :-----: |
| `MCP_DOCKER` | Yes | `docker mcp gateway run` | Docker-hosted MCP gateway (bundles multiple tools: fetch, search, etc.) | 2026-08-04 |
| `notebooklm-mcp-cli` | Yes | `/Users/sanjar/.local/bin/notebooklm-mcp` | NotebookLM automation | 2026-08-04 |
| `tablepro` | Yes | `/Applications/TablePro.app/Contents/MacOS/tablepro-mcp` | TablePro spreadsheet app integration | 2026-08-04 |
| `markitdown` | Yes | `docker run markitdown-mcp:latest` | Document → Markdown conversion | 2026-08-04 |
| `kite` | Yes | `npx mcp-remote https://mcp.kite.trade/mcp` | Zerodha Kite trading/portfolio API | 2026-08-04 |
| Google Calendar | No | — | Events, scheduling | 2026-08-04 |
| Gmail | No | — | Drafts, labels, thread search | 2026-08-04 |
| Composio | No | — | Meta-tool: search/execute other Composio-integrated tools | 2026-08-04 |
| Vercel | No | — | Deployments, projects, domains, web analytics | 2026-08-04 |
| Google Drive | No | — | File search/download/metadata | 2026-08-04 |
| Notion (API) | No | — | Search, pages, comments, databases (separate from the `ntn` CLI) | 2026-08-04 |
| Context7-style library docs | No | — | `resolve-library-id` / `query-docs` | 2026-08-04 |
| Figma | No | — | Design context, screenshots, Code Connect, FigJam | 2026-08-04 |
| Kubernetes | No | — | `kubectl_*`, Helm, port-forward | 2026-08-04 |
| Supabase | No | — | Migrations, SQL, branches, logs, advisors | 2026-08-04 |
| Canva | No | — | Design generation/export | 2026-08-04 |
| Google Workspace Directory | No | — | Contacts, user profile, directory search | 2026-08-04 |
| Spotify | No | — | Search, playlists, now playing | 2026-08-04 |
| Kite | No | — | Trading API (duplicate — see notes) | 2026-08-04 |
| NotebookLM (x2: `notebooklm-mcp`, `notebooklm-mcp-cli`) | No | — | Notebook research/audio overviews | 2026-08-04 |
| Huggingface (`hugging-face`) | No | — | ML stuff | 2026-08-04 |
| Slack (`slack`) | No | — | ML stuff | 2026-08-04 |
| Atlassian (`atlassian`) | No | — | ML stuff | 2026-08-04 |

**Stale reference copy**: `claude_desktop_config.json` in this repo (meant to mirror the live config per `CLAUDE.md`) is out of date. It still lists `google-sheets`, `android-mcp`, `android-mcp-sanjar`, `discord-mcp`, `notebooklm`, `linkedin`, `ScraplingServer` — none of which are in the live config — and is missing `markitdown`, `kite`, `notebooklm-mcp-cli`. Needs a manual re-sync (`cp "~/Library/Application Support/Claude/claude_desktop_config.json" ~/.dotfiles/claude_desktop_config.json`, then strip the `preferences`/`coworkUserFilesPath` app-state noise it also carries).

## Notes

- `MCP_DOCKER`, `tablepro`, and NotebookLM entries are duplicated across Claude Desktop and Cursor — same binaries/gateway, configured twice.
- `kite` (Zerodha trading) is listed twice — duplicate entries from different sources.
- Cross-reference with [4-skills.md](4-skills.md) for skills that ship agent-side but serve similar "extend the agent" purposes (e.g. `notion-cli` uses the `ntn` CLI directly).
