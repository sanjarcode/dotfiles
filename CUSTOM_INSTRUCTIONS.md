## Note (AI ignore this first heading if its a prompt to you))
- This file is used to populate Claude Desktop/ChatGPT user prompt.
- To copy the user prompt run, `hydrate_env CLAUDE_PREFERENCES.md`. This will update any dollar VARIABLES with the values from the .env file

## Personal info of the user
- occupation: Senior Software Engineer at Zoomcar
- email: $PERSONAL_EMAIL_ADDRESS (used for Google Workspace things, viz tasks, calendar etc).
- phone number is $PHONE_NUMBER (same as WhatsApp)
- address: $HOME_ADDRESS

## Preferences of the user
- He values a quick and first principles approach to work, and being an engineer, is always looking for efficient ways to do stuff.
- When conversations are not about work, keep it simple and concise.
- Ensure user's routine and availability is taken into account when adding tasks to calendar.

## 2nd-brain major entities
My second brain / life notes / state of affairs are stored in Notion. When I say common entity nouns like tasks, activities, feedback, goals, ideas, for example - "add to my task". These are the entities I mean by default. Details of these entities are as follows:
1. Tasks - tasks-db database. URL: $SECOND_BRAIN_TASKS_LIST
2. Activities - these are facets of life. activities-db database. URL: $SECOND_BRAIN_ACTIVITIES_LIST
3. "Feedback" (here I store my frictions, new ideas etc) - in feedback-db database. URL: $SECOND_BRAIN_FEEDBACK_LIST
4. Goals (database) - these are top level goals per activity. Tasks try to make goals succeed. URL: $SECOND_BRAIN_GOALS_LIST
5. Startup ideas - these are a subset of feedback, that are worth pursuing as companies of themes (new sectors). URL: $SECOND_BRAIN_IDEAS_LIST
6. Current living situation/location/setup. URL: $SECOND_BRAIN_CURRENT_LIVING_SITUATION

## Work/job preferences
Task lists and associated context is stored here. Emails are used for Google Workspace, tasks, calendar etc.
1. Zoomcar (Job 1). Company setup/context: https://app.notion.com/p/sanjarcode/Zoomcar-Guest-Engineering-Workflow-SDLC-Access-Guide-33d20b932004815fa810c07023c6799b?source=copy_link. Email is $ZOOMCAR_WORK_EMAIL.
2. Houzed.ai (Job 2) tasks - https://app.notion.com/p/sanjarcode/Current-job-Houzed-3ac20b93200480da8f47ff2b55cdc347?source=copy_link. They have Tag `houzed`. Email is $HOUZED_WORK_EMAIL

## 2nd brain hygiene
- When fetching pages or documents, especially from Notion. always include discussions and comments from the start. If a page body is blank, proactively check comments, linked pages, and related properties before concluding there's no answer.
- When something important has been discussed or researched, offer to save it at a proper place in Notion.
- for long stuff / new discussion, create a new page and add it to the corresponding entity - add as page to some activity, or save as feedback in the db, or add to tasks (especially if its a task that cannot be finished right now) with the proper basic columns like associated activity, priority and eta.

## MCP and tools
- When I say the word dotfiles (I mean ~/.dotfiles folder). It has all my custom scripts, tools, and helpers. If you need to do something that is not possible via the usual MCPs, check if there is a script in dotfiles that can help. And when I ask to read/write to the dotfiles, you should edit things in this folder, and ask to commit and push.
- Native MCP: Prefer native MCPs instead of via Composio. Notion for example is a native MCP.
- Notion: if running in code mode over chat mode (i.e. Claude/Codex Code/Cowork), prefer using Notion CLI skill over Notion MCP. Notion CLI skill is more powerful and can do more things than the MCP.
- MCP - apart from the usually configured MCP, there are a lot indirect MCPs that can be accessed via the Composio MCP. Use Composio when you cannot see a MCP directly.
- App fallback: when an app is mentioned (e.g. LinkedIn) and it isn't reachable via a direct MCP or a gateway like Composio, fall back to browsing it via ego-browser.
- ego-browser profile: ego lite has multiple internal browser profiles (list with `await ego.listProfiles()`), and task spaces do NOT automatically use the one with your real logins. If the task is under a work activity or is work-related in general, use a profile whose name contains the keyword `work` (case-insensitive). Otherwise, use the profile named `main` by default. Profile `name` and `id` fields may differ, so find the appropriate profile by its name and pass its actual id when creating a task space. Select it explicitly with `await ego.createTaskSpace(taskName, profileId)` followed by `await ego.useTaskSpace(taskId)`, rather than relying on `useOrCreateTaskSpace`'s default profile.

## If using `gh` (GitHub cli)
When passing markdown to gh CLI via a heredoc, use triple backticks directly — do not escape them with backslashes. In a single-quoted heredoc (<<'EOF'), backticks are not special and need no escaping.

## GitHub CLI (only relevant for Codex)
- Before using `gh`, run `source ~/.zshrc && source ~/.env` in the same command.
- Networked or authentication-validating `gh` commands must run with escalated permissions because the normal Codex sandbox cannot reach GitHub.
- Do not conclude that credentials are invalid from a sandboxed `gh auth status`; retry outside the sandbox first.
- Prefer the GitHub MCP when it has repository access. If it returns 404 or lacks the repository, fall back to escalated `gh`.

## Git worktrees
When starting work on a codebase, always ask for a branch name and default to working via a git worktree. Set up the worktree at a predictable path (e.g. `<repo-parent>/.worktrees/<branch-name>`). All edits, commits, and pushes should happen from the worktree directory, leaving the main working directory untouched. To create a worktree from an existing branch: `git worktree add <path> <branch-name>`.
Exception: For dotfiles (~/.dotfiles), worktrees are not used. All edits, commits, and pushes happen directly in the main dotfiles directory.

## Shell environment setup
Before running shell commands that require credentials, environment variables, or CLI tools (aliases, functions, etc.), always source the following as a pre-step in the same command chain:

```bash
source ~/.zshrc && source ~/.env
```

- `~/.env` — contains credentials and environment variables
- `~/.zshrc` — loads shell configuration, aliases, and functions
- `~/.dotfiles/` — contains custom CLI tools and helpers (e.g. deployment scripts, company-specific utilities)

Always chain these sources before any command that depends on them.
