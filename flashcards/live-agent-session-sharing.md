---
tags: [flashcards, ai-agents, collaboration, real-time]
sr-due: 2026-06-15
sr-interval: 1
sr-ease: 250
---

# Live Agent Session Sharing — Flashcards

#flashcards/ai-agents

## Definition <!-- kb:card:897513 -->
What is live agent session sharing?
?
A collaboration pattern in which an agent's running session — terminal output, file workspace, message stream, and sub-agent activity — is accessible to multiple participants simultaneously via a URL, without requiring any participant to copy-paste context or restart from scratch.

## What Can Participants Do? <!-- kb:card:440c02 -->
What actions can participants take in a shared agent session?
?
- **Watch** — observe output, tool calls, sub-agent activity in real time
- **Co-drive** — send commands into the same agent context
- **Comment on files** — annotate workspace files without interrupting execution
- **Fork** — create a divergent copy of session state for a different approach
- **Take over** — seamlessly hand off control without restarting

## Problem Solved <!-- kb:card:8d96e5 -->
What problem does live session sharing solve?
?
The **agent silo problem**: each harness holds sessions in isolation. Currently, collaboration happens *around* agents (screensharing, copy-pasting output to Slack). Live session sharing makes the agent session itself the coordination medium — like a shared doc, not a screenshot.

## Interface Parity <!-- kb:card:5f6166 -->
What interfaces are simultaneously available for a shared agent session in Omnigent?
?
Terminal, web UI (localhost:6767), native desktop app (macOS), and mobile app — all showing the same session state in real time, all capable of sending commands.

## Fork Semantics <!-- kb:card:b10449 -->
What does "forking" a session mean and why is it useful?
?
Forking creates an independent copy of the session state at a specific point, while the original continues. It enables parallel exploration: two approaches can be pursued simultaneously from the same starting point, and the better result chosen for merge. This is not possible with single-harness agents.

## Limitation <!-- kb:card:1f6596 -->
What is the key practical limitation of live session sharing?
?
For off-network teammates, the Omnigent server must be deployed to a publicly reachable host — `localhost:6767` only serves the originating machine. Collaboration benefit requires an always-on deployed server or VPN for remote participants.

## Relationship <!-- kb:card:37951a -->
How does live session sharing differ from Tapes agent observability?
?
Tapes records agent sessions for **after-the-fact** replay and analysis. Live session sharing provides **real-time** visibility and interaction — participants can observe and intervene *while the session runs*, not only review it post-hoc.
