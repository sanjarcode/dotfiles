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
My second brain / life notes / state of affairs are stored in Notion. When I say common entity nouns like tasks, activities, feedback, goals, ideas, for example - "add to my task". These are the entities I mean by default.
1. "Tasks" - tasks-db database. URL: $SECOND_BRAIN_TASKS_LIST
2. "Activities" - these are facets of life. activities-db database. URL: $SECOND_BRAIN_ACTIVITIES_LIST
3. "Feedback" (here I store my frictions, new ideas etc) - in feedback-db database. URL: $SECOND_BRAIN_FEEDBACK_LIST
4. "Goals" (database) - these are top level goals per activity. Tasks try to make goals succeed. URL: $SECOND_BRAIN_GOALS_LIST
5. "Content" - content-db database. URL: $SECOND_BRAIN_CONTENT_LIST
6. "Startup ideas" - these are a subset of feedback, that are worth pursuing as companies of themes (new sectors). URL: $SECOND_BRAIN_IDEAS_LIST
7. "Current living situation/location/setup". URL: $SECOND_BRAIN_CURRENT_LIVING_SITUATION

## 2nd-brain database relationships
- Tasks → Activities: Tasks use the `Activity` relation; the reciprocal Activities property is `All tasks`.
- Routines are not a separate entity or database. They are rows in Tasks where the `isRoutine` checkbox is true.
- Feedback → Activities: Feedback uses the `a.Activity` relation; the reciprocal Activities property is `Feedback`.
- Content → Activities: Content uses the `Activity` relation; the reciprocal Activities property is `Content 📒`.
- When retrieving tasks, routines, feedback, or content for an activity, resolve the Activity page and query the relevant database using its relation property. For routines, additionally filter `isRoutine = true`; avoid broad text search.

## Work/job preferences
Task lists and associated context is stored here. Emails are used for Google Workspace, tasks, calendar etc.
1. Zoomcar (Job 1). Company setup/context: $ZOOMCAR_WORK_NOTION_URL. Email is $ZOOMCAR_WORK_EMAIL. Slack workspace: $ZOOMCAR_SLACK_WORKSPACE_URL.
2. Houzed.ai (Job 2) tasks: $HOUZED_WORK_NOTION_URL. They have Tag `houzed`. Email is $HOUZED_WORK_EMAIL. Slack workspace: $HOUZED_SLACK_WORKSPACE_URL.

When I ask to send a message to a team member, use the Slack workspace URL for the relevant company. Prefer the Slack MCP; if it is unavailable, use Slack in the browser at that workspace URL.

## 2nd brain hygiene
- When fetching pages or documents, especially from Notion. always include discussions and comments from the start. If a page body is blank, proactively check comments, linked pages, and related properties before concluding there's no answer.
- When something important has been discussed or researched, offer to save it at a proper place in Notion.
- for long stuff / new discussion, create a new page and add it to the corresponding entity - add as page to some activity, or save as feedback in the db, or add to tasks (especially if its a task that cannot be finished right now) with the proper basic columns like associated activity, priority and eta.

## MCP and tools
- When I say the word dotfiles (I mean ~/.dotfiles folder). It has all my custom scripts, tools, and helpers. If you need to do something that is not possible via the usual MCPs, check if there is a script in dotfiles that can help. And when I ask to read/write to the dotfiles, you should edit things in this folder, and ask to commit and push.
  - After making changes under `~/.dotfiles` that have been **tested and confirmed working**, automatically run `dot_refresh` (shell function from `.function_declarations.sh`) so home copies are reinstalled and the shell is reloaded. Report clearly that `dot_refresh` was run. Do **not** run it for untested, speculative, or in-progress edits — only after the change is verified.
- When accessing an external service, use this preference order: the harness's native connector or MCP → an MCP gateway such as Composio → browser automation, preferably ego-browser → the Chrome browser.
- Notion: if running in code mode over chat mode (i.e. Claude/Codex Code/Cowork), prefer using Notion CLI skill over Notion MCP. Notion CLI skill is more powerful and can do more things than the MCP.
- ego-browser profile: ego-lite keeps several internal browser profiles, and task spaces won't automatically use the one holding your real logins. Pick the right profile explicitly — a work task should use the profile whose name contains `work` (case-insensitive), otherwise use `main`. Resolve it by name (name and id can differ), then pass its id to `createTaskSpace(taskName, profileId)` and switch with `useTaskSpace(taskId)` rather than relying on `useOrCreateTaskSpace`'s default.

## If using `gh` (GitHub cli)
When passing markdown to gh CLI via a heredoc, use triple backticks directly — do not escape them with backslashes. In a single-quoted heredoc (<<'EOF'), backticks are not special and need no escaping.

## GitHub CLI (only relevant for Codex)
- Before using `gh`, run `source ~/.zshrc && source ~/.env` in the same command.
- Networked or authentication-validating `gh` commands must run with escalated permissions because the normal Codex sandbox cannot reach GitHub.
- Do not conclude that credentials are invalid from a sandboxed `gh auth status`; retry outside the sandbox first.
- Prefer the GitHub MCP when it has repository access. If it returns 404 or lacks the repository, fall back to escalated `gh`.

## Git command usage
Always chain these sources before any command that depends on them.

Maintain a Git cleanliness invariant: start with a clean worktree and leave it clean after each completed change.

Check `git status --porcelain` once before editing. If clean, treat subsequent changes as yours: after appropriate tests pass, run `git add -A`, commit, and push the current branch without asking. Do not repeatedly inspect status, diffs, or file contents merely to prepare a commit.

If the worktree starts dirty, preserve existing changes and stage only your own files or hunks. Never discard or commit unrelated work.

Use content-level checks for implementation correctness, not redundant Git housekeeping. Investigate further only when a command fails or unexpected changes appear. Do not merge branches or force-push without authorization.

## Git worktrees
Do not use Git worktrees unless the user explicitly asks you to. By default, work directly in the currently checked-out working directory.

Create a new branch when the requested task is materially different in nature from the work associated with the current branch.

## Shell environment setup
Before running shell commands that require credentials, environment variables, or CLI tools (aliases, functions, etc.), always source the following as a pre-step in the same command chain:

```bash
source ~/.zshrc && source ~/.env
```

- `~/.env` — contains credentials and environment variables
- `~/.zshrc` — loads shell configuration, aliases, and functions
- `~/.dotfiles/` — contains custom CLI tools and helpers (e.g. deployment scripts, company-specific utilities)

## UX and feedback

Prioritize UX in every tool, script, and workflow. Long-running operations must provide timely, meaningful feedback: what is happening, how much is done, how much remains, and whether work succeeded, failed, or was skipped.

Process work in natural units, such as scanning and migrating one activity before starting the next. Avoid buffering the entire workload unless correctness requires it. Isolate failures so unrelated work can continue.

Silence makes healthy work look stuck and invites abrupt interruption, leaving partial state and creating manual recovery work. Treat progress visibility and clear outcomes as operational correctness, not optional polish.
