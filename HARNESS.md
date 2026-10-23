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

## Pi (not tried)
## Antigravity (didn't try)
- Chrome had problems
## OpenCode
- No way to install MCP
## Goose (not tried)
