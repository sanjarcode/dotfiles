## Note
- This file is used to populate Claude Desktop/ChatGPT user prompt.
- Update any $VARIABLES with .env file

## Personal info of the user
- occupation: Senior Software Engineer at Zoomcar
- email: $PERSONAL_EMAIL_ADDRESS (used for Google Workspace things, viz tasks, calendar etc).
- phone number is $PHONE_NUMBER (same as WhatsApp)
- address: $HOME_ADDRESS

## Preferences of the user
- He values a quick and first principles approach to work, and being an engineer, is always looking for efficient ways to do stuff.
- When conversations are not about work, keep it simple and concise.
- Ensure his routine is taken into account when adding tasks to calendar. https://www.notion.so/sanjarcode/Productivity-4da31bcbb842494289e200eb82415515?source=copy_link#35520b93200480918aa8d406af53243b and Google Calendar are where his availablity can be known.

## 2nd-brain major entities
His second brain / life notes / state of affairs are stored in Notion. Most important things are:
1. Tasks - tasks-db database. URL: https://www.notion.so/sanjarcode/6fb6e6a3e6f84aee82ba5d872cd55ec3?v=29a20b93200480fab055000c79a5889f&source=copy_link
2. Activities - these are facets of life. activities-db database. URL: https://www.notion.so/sanjarcode/76741bf175ee4e06927d41acbb112e62?v=946355104a7a44ad8b6e01a449efa036&source=copy_link
3. "Feedback" (here I store my frictions, new ideas etc) - in feedback-db database. URL: https://www.notion.so/sanjarcode/32199b4ef1794b01a791d032cc679f1b?v=01a413ce79d4442da41d1aca73e6516b&source=copy_link
4. Startup ideas - these are a subset of feedback, that are worth pursuing as companies of themes (new sectors). URL: https://www.notion.so/sanjarcode/32199b4ef1794b01a791d032cc679f1b?v=23f20b932004801e8640000c84596486&source=copy_link
5. Current living situation/location/setup - https://www.notion.so/sanjarcode/Living-Solved-35320b93200481deb9e2dfbc1885f7a2?source=copy_link

## Work/job preferences
Task lists and associated context is stored here. Emails are used for Google Workspace, tasks, calendar etc.
1. Zoomcar (Job 1) tasks - https://app.notion.com/p/sanjarcode/Current-job-Zoomcar-37420b9320048038b377f56a8378463e?source=copy_link. They have Tag `zoomcar`. Email is $ZOOMCAR_WORK_EMAIL
2. Houzed.ai (Job 2) tasks - https://app.notion.com/p/sanjarcode/Current-job-Houzed-3ac20b93200480da8f47ff2b55cdc347?source=copy_link. They have Tag `houzed`. Email is $HOUZED_WORK_EMAIL

## 2nd brain hygiene
- When fetching pages or documents, especially from Notion. always include discussions and comments from the start. If a page body is blank, proactively check comments, linked pages, and related properties before concluding there's no answer.
- When something important has been discussed or researched, offer to save it at a proper place in Notion.
- for long stuff / new discussion, create a new page and add it to the corresponding entity - add as page to some activity, or save as feedback in the db, or add to tasks (especially if its a task that cannot be finished right now) with the proper basic columns like associated activity, priority and eta.

## MCP and tools
- Native MCP: Prefer native MCPs instead of via Composio. Notion for example is a native MCP.
- MCP - apart from the usually configured MCP, there are a lot indirect MCPs that can be accessed via the Composio MCP. Use Composio when you cannot see a MCP directly.

## If using `gh` (GitHub cli)
When passing markdown to gh CLI via a heredoc, use triple backticks directly — do not escape them with backslashes. In a single-quoted heredoc (<<'EOF'), backticks are not special and need no escaping.

## Git worktrees
When starting work on a codebase, always ask for a branch name and default to working via a git worktree. Set up the worktree at a predictable path (e.g. `<repo-parent>/.worktrees/<branch-name>`). All edits, commits, and pushes should happen from the worktree directory, leaving the main working directory untouched. To create a worktree from an existing branch: `git worktree add <path> <branch-name>`.

## Shell environment setup
Before running shell commands that require credentials, environment variables, or CLI tools (aliases, functions, etc.), always source the following as a pre-step in the same command chain:

```bash
source ~/.zshrc && source ~/.env
```

- `~/.env` — contains credentials and environment variables
- `~/.zshrc` — loads shell configuration, aliases, and functions
- `~/.dotfiles/` — contains custom CLI tools and helpers (e.g. deployment scripts, company-specific utilities)

Always chain these sources before any command that depends on them.
