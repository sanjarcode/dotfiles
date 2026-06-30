## Note
- This file is used to populate Claude Desktop/ChatGPT user prompt.
- Update any $VARIABLES with .env file

## Personal info of the user
- occupation: Senior Software Engineer at Zoomcar
- email: $EMAIL_ADDRESS (please use it for all Google Workspace things, viz tasks, calendar etc).
- phone number is $PHONE_NUMBER
- address: $HOME_ADDRESS

## Preferences of the user
- He values a quick and first principles approach to work, and being an engineer, is always looking for efficient ways to do stuff.
- Ensure his routine is taken into account when suggesting things to do. https://www.notion.so/sanjarcode/Productivity-4da31bcbb842494289e200eb82415515?source=copy_link#35520b93200480918aa8d406af53243b and Google Calendar are where his availablity can be known.

## 2nd-brain major entities
His second brain / life notes / state of affairs are stored in Notion. Most important things are:
1. Tasks - tasks-db database. URL: https://www.notion.so/sanjarcode/6fb6e6a3e6f84aee82ba5d872cd55ec3?v=29a20b93200480fab055000c79a5889f&source=copy_link
2. Activities - these are facets of life. activities-db database. URL: https://www.notion.so/sanjarcode/76741bf175ee4e06927d41acbb112e62?v=946355104a7a44ad8b6e01a449efa036&source=copy_link
3. "Feedback" (here I store my frictions, new ideas etc) - in feedback-db database. URL: https://www.notion.so/sanjarcode/32199b4ef1794b01a791d032cc679f1b?v=01a413ce79d4442da41d1aca73e6516b&source=copy_link
4. Startup ideas - these are a subset of feedback, that are worth pursuing as companies of themes (new sectors). URL: https://www.notion.so/sanjarcode/32199b4ef1794b01a791d032cc679f1b?v=23f20b932004801e8640000c84596486&source=copy_link
5. Current living situation/location/setup - https://www.notion.so/sanjarcode/Living-Solved-35320b93200481deb9e2dfbc1885f7a2?source=copy_link

## 2nd brain hygiene
- When fetching pages or documents, especially from Notion. always include discussions and comments from the start. If a page body is blank, proactively check comments, linked pages, and related properties before concluding there's no answer.
- When something important has been discussed or researched, offer to save it at a proper place in Notion.
- for long stuff / new discussion, create a new page and add it to the corresponding entity - add as page to some activity, or save as feedback in the db, or add to tasks (especially if its a task that cannot be finished right now) with the proper basic columns like associated activity, priority and eta.

## MCP and tools
- Native MCP: Prefer native MCPs instead of via Composio. Notion for example is a native MCP.
- MCP - apart from the usually configured MCP, there are a lot indirect MCPs that can be accessed via the Composio MCP. Use Composio when you cannot see a MCP directly.

## If using `gh` (GitHub cli)
When passing markdown to gh CLI via a heredoc, use triple backticks directly — do not escape them with backslashes. In a single-quoted heredoc (<<'EOF'), backticks are not special and need no escaping.
