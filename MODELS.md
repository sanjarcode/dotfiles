# Models

## Architecture

Two env functions configure Claude Code to use alternative LLM backends via the Anthropic-compatible API:

| Function | Backend | Key env var |
|----------|---------|-------------|
| `env_deepseek` | api.deepseek.com | `DEEPSEEK_API_KEY` |
| `env_openrouter` | openrouter.ai | `OPENROUTER_API_KEY` |

The mapping:

| Slot | DeepSeek direct | OpenRouter |
|------|----------------|------------|
| Default (`ANTHROPIC_MODEL`) | `deepseek-v4-flash` | `deepseek/deepseek-v4-flash` |
| Opus (`DEFAULT_OPUS_MODEL`) | `deepseek-v4-pro[1m]` | `deepseek/deepseek-v4-pro` |
| Sonnet (`DEFAULT_SONNET_MODEL`) | `deepseek-v4-flash` | `deepseek/deepseek-v4-flash` |
| Haiku (`DEFAULT_HAIKU_MODEL`) | `deepseek-v4-flash` | `deepseek/deepseek-v4-flash` |
| Subagent | `deepseek-v4-flash` | `deepseek/deepseek-v4-flash` |

## Model tiers (DeepSeek V4)

Only two tiers exist. No intermediate "standard" model.

|  | Flash | Pro |
|---|---|---|
| Params (total/active) | 284B / 13B | 1.6T / 49B |
| SWE-bench Verified | 79.0 | 80.6 |
| GPQA Diamond | 88.1 | 90.1 |
| Price (in/out per 1M) | $0.14 / $0.28 | $0.145 / $1.74 |

Flash is slightly below Claude Sonnet 4.6 on most benchmarks (within ~2 points). Pro is tied with Claude Opus 4.7 on SWE-bench and leads on LiveCodeBench. See `env_deepseek --help` or the [DeepSeek V4 guide](https://codersera.com/blog/deepseek-v4-complete-guide-2026/) for current numbers.

## Why put model config on the provider side

Models change fast (biweekly cadence is common). Storing exact model names in dotfiles means commits every time a provider ships a new version. OpenRouter solves this:

- **One API key** for all providers (no new `.env` entries per model)
- **Change models on their dashboard** — Settings > Plugins, or per-request `plugins` param
- **Auto Router** — `openrouter/auto` picks the best model for each prompt; restrict the pool with glob patterns (`anthropic/*`, `deepseek/*`)
- **Model Fallbacks** — chain fallback models if primary is down/slow

The `env_openrouter` function sets sensible defaults. Override per-session:

```sh
env_openrouter
export ANTHROPIC_MODEL=openrouter/auto  # let OpenRouter pick
```

Or narrow the auto-router pool via the OpenRouter dashboard (Settings > Plugins > Auto Router). No dotfile edits needed.
