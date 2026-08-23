---
title: "Live Agent Session Sharing"
date: 2026-06-15
domain: ai-agents
maturity: emerging
source_type: practitioner
topics: [multi-agent, patterns]
tags: [concept, ai-agents, collaboration, architecture, multi-agent, real-time, domain/ai-agents, maturity/emerging, source-type/practitioner, topic/multi-agent, topic/patterns]
status: draft
sources:
  - url: https://www.databricks.com/blog/introducing-omnigent-meta-harness-combine-control-and-share-your-agents
    hash: sha256:eee5c508eee013757287696ecc1d5830cbfc69f32ed34de21b9b69c7e23b614b
    retrieved: 2026-08-21
    class: unclassified
    reachability: ok
  - url: https://omnigent.ai/quickstart/collaborate
    hash: sha256:7c0b3e326146d96b2d41c3a1dfd798f97407c44176e1661384c8b42f34202596
    retrieved: 2026-08-21
    class: unclassified
    reachability: ok
  - url: https://www.marktechpost.com/2026/06/13/databricks-open-sources-omnigent-a-meta-harness-that-composes-governs-and-shares-ai-agents-across-claude-code-codex-and-pi/
    hash: sha256:5707fa676606086cf31b8ff4282f139c2bbe641871fb90d7e8ed42c43f77ae9c
    retrieved: 2026-08-21
    class: unclassified
    reachability: ok
---

# Live Agent Session Sharing

## Definition
**Live agent session sharing** is a collaboration pattern in which an agent's running session — including its terminal output, file workspace, message stream, and sub-agent activity — is accessible to multiple participants simultaneously via a URL, without requiring any one of them to copy-paste context or restart from scratch.

## Explanation
The current default for collaborating on agent work is asynchronous and lossy: one engineer runs an agent, screenshots or pastes the output to a team channel, and others comment. The agent's internal state — what it tried, what it found, what tools it called — is invisible to anyone not watching the terminal.

Live agent session sharing inverts this: the session becomes the collaboration surface, the same way a shared Google Doc is the surface for collaborative writing.

**What participants can do in a shared session:**
- **Watch** — observe the agent's output, tool calls, and sub-agent activity in real time
- **Co-drive** — send commands or messages that go into the same agent context
- **Comment on files** — annotate files in the agent's workspace without interrupting execution
- **Fork** — create a divergent copy of the session state, pursuing a different approach while the original continues
- **Take over** — seamlessly hand off control from one person to another without restarting

**Interface parity:** In the Omnigent implementation, the same session is simultaneously accessible via:
- Terminal (original engineer)
- Web UI at `localhost:6767` (or hosted URL)
- Native desktop application (macOS)
- Mobile app

All interfaces stay in sync. Messages, sub-agents, file writes, and tool outputs appear across all surfaces in real time.

### Problem It Solves: The Agent Silo Problem

Each harness today holds its sessions in isolation. A session in Claude Code cannot be observed by someone on a different machine. A session in Codex cannot be handed to a colleague without copy-pasting the entire conversation. Coordination happens *around* the agent, not *through* it.

Live session sharing makes the agent session itself the coordination medium — analogous to screensharing but with interactivity, thread continuity, and workspace access.

### Offline-Teammate Constraint

For teammates outside the local network, the Omnigent server must be deployed to a publicly reachable host. Local `localhost:6767` only serves the originating machine. This is a practical limitation of alpha implementations: the collaboration benefit requires an always-on deployed server or a VPN for off-network participants.

### Comparison to Pair Programming

| Pair Programming | Live Agent Session Sharing |
|-----------------|--------------------------|
| Two humans at one codebase | Human + AI agent, observed by multiple humans |
| Synchronous attention required | Can be async (watch the replay, comment on files) |
| Context held in human working memory | Context held in the agent session + workspace |
| Handoff = explaining where you left off | Handoff = give them the session URL |
| No branching | Fork creates a divergent exploration |

## Key Properties
- **State continuity** — joining participants see the session's current state, not a fresh agent; no context re-establishment required
- **Multi-interface** — terminal, web, desktop, and mobile are all first-class surfaces; no single canonical interface
- **Real-time sync** — messages, file writes, sub-agent spawning, and tool outputs stream to all connected participants simultaneously
- **Fork semantics** — branching preserves the parent session while creating an independent child; enables parallel exploration of different approaches
- **Session URL as artifact** — the URL is a persistent handle to the work in progress; shareable in Slack, docs, or PR comments

## Relationships
- Enabled by the [[meta-harness-pattern]]: session sharing requires a meta-harness server that holds session state independently of any single terminal process
- Related to [[long-running-agent-architecture]]: long-running agents benefit most from live sharing — the session is too long to restart, so visibility into ongoing state is critical
- Related to [[agent-audit-gap]]: session sharing partially closes the audit gap by giving stakeholders a live view into what the agent is doing, not just a post-hoc log
- Related to [[human-in-the-loop-pattern]]: shared sessions enable lightweight HITL — teammates can inject guidance or approval without the agent being halted for every decision
- Related to [[agent-session-distillation]]: the shareable session accumulates the work that would later be distilled into a skill or handoff note
- Contrast with [[tapes-agent-observability]]: Tapes records sessions for *after-the-fact* review; live session sharing provides *real-time* visibility

## Applications
**Code review in flight:** A senior engineer joins an active coding agent session to watch the approach before it finalises — catching architectural issues before a PR is raised, not during review.

**Incident response:** Multiple engineers join an SRE agent's active session simultaneously. One watches, one sends targeted commands, one documents. No one is left out of context.

**Agent handoff:** Engineer A starts an exploration session, Engineer B joins when A goes offline, continues without re-establishing context.

**Parallel exploration:** Fork the session at the point where two approaches diverge. Both forks run independently; the better result gets merged.

**Client demos:** Share a live coding agent session URL with a client or PM so they can observe progress in real time, without the engineer having to narrate or screenshot.

**Async review:** Share the URL in a PR description. Reviewers open it post-run to see exactly what the agent did and what files it touched — richer than a git diff alone.

## Sources
- [Introducing Omnigent (Databricks Blog)](https://www.databricks.com/blog/introducing-omnigent-meta-harness-combine-control-and-share-your-agents) — primary source; describes the real-time collaboration model
- [Omnigent quickstart — Collaborate](https://omnigent.ai/quickstart/collaborate) — practical guide to session sharing
- [MarkTechPost overview](https://www.marktechpost.com/2026/06/13/databricks-open-sources-omnigent-a-meta-harness-that-composes-governs-and-shares-ai-agents-across-claude-code-codex-and-pi/) — interactive demo description

## See Also
- [[meta-harness-pattern]]
- [[long-running-agent-architecture]]
- [[human-in-the-loop-pattern]]
- [[agent-session-distillation]]
- [[agent-audit-gap]]
- [[tapes-agent-observability]]
