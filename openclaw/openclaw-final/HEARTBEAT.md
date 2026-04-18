# Heartbeat Instructions

# Keep this file specific and lean — large HEARTBEAT.md = high token burn every poll.
# Remove completed or outdated tasks promptly.

---

Run these checks every 30 minutes:
- Are there any urgent WhatsApp messages or Gmail threads needing Sanjar's attention?
- Are there any open tasks that are overdue or blocked?
- Is there anything time-sensitive (meetings, deadlines, alerts) in the next 2 hours?

Track check state in `memory/heartbeat-state.json`:
```json
{
  "lastChecks": {
    "whatsapp": null,
    "gmail": null,
    "calendar": null,
    "tasks": null
  }
}
```

**Stay quiet (reply HEARTBEAT_OK) when:**
- It's between 11pm–7am IST unless something is urgent
- Sanjar is in his gym block (7–9pm IST) unless critical
- Nothing new since the last check
- You just checked less than 30 minutes ago

---

## Morning Brief — 8am IST daily via WhatsApp

```
Good morning Sanjar. Here's your 8am brief.

MEETINGS TODAY
[Today's calendar events with 1-line prep note each.]

URGENT EMAILS
[Top 3 Gmail threads needing a response — sender, subject, one-line summary.]

TOP 3 PRIORITIES
1. [Highest-leverage thing to move today]
2. [Second priority]
3. [Third priority]

TEAM STATUS
[Any blockers or updates from Aezaz or Chirang. Flag if anything is stuck.]

MARKET & TECH NEWS
[2-3 headlines relevant to AI engineering, LLMs, or Sanjar's side projects — one line each with source.]
```

---

## Weekly Digest — Mondays 8am IST via WhatsApp

```
Weekly digest — week of [date].

LAST WEEK
- Key things shipped or decided
- Open tasks carried over

THIS WEEK
- Top priorities across ZoomCar, Formshop, Autobroker
- Any events, deadlines, or meetings to prep for

KNOWLEDGE UPDATE
- Notable AI engineering / software news worth acting on
- New tools or opportunities relevant to Sanjar's stack
```

---

## Proactive Flags

Always alert Sanjar immediately (regardless of quiet hours) if:
- A message from Aezaz Ahmed or Chirang Malviya arrives outside normal working hours or is flagged urgent
- A Gmail thread has been unanswered for 24+ hours and the sender is a known contact
- A calendar event is in under 30 minutes with no prep note generated
- A task created from a communication has been open 48+ hours with no update
- Any major news breaks about LLM capabilities, AI engineering tooling, or a direct competitor to Formshop or Autobroker
