---
title: "OpenClaw"
date: 2026-04-15
domain: ai-agents
maturity: emerging
source_type: practitioner
topics: [orchestration]
tags: [concept, openclaw, ai-agents, infrastructure, platform, homelab, domain/ai-agents, maturity/emerging, source-type/practitioner, topic/orchestration]
status: draft
sources:
  - url: https://docs.openclaw.ai
    hash: sha256:1bf54fcb8ead4b21f161812c687325200dae73da98928cb3bfddf6ab6e4bfccf
    retrieved: 2026-08-21
    class: unclassified
    reachability: ok
  - url: https://github.com/openclaw/openclaw
    hash: sha256:e82740ebd0118a825fc031e4b060923cca6570fb72f27ec6f8322c55db86ff6d
    retrieved: 2026-08-21
    class: unclassified
    reachability: ok
  - url: https://discord.com/invite/clawd
    unreachable: true
    reason: no extractable text
    checked: 2026-08-21
    class: unclassified
    reachability: js-required
---

# OpenClaw

## Definition
An open-source AI gateway and agent runtime that connects messaging platforms (Signal, Telegram, Discord, WhatsApp, etc.) to AI coding agents and personal AI assistants. OpenClaw provides a persistent agent session model, skill-based extensibility, cron scheduling, multi-node support, and a plugin architecture — enabling a personal AI agent that is always-on, context-aware, and connected to the user's tools and messaging life.

## Explanation
OpenClaw sits between two worlds: the messaging platforms where humans live their digital lives, and the AI models and tools that can act on their behalf. Rather than requiring a user to switch to a dedicated app or chat interface, OpenClaw brings the agent to wherever the user already communicates.

**Core architecture:**

- **Gateway daemon** — persistent background service that connects to messaging platform APIs (Signal via signal-cli, Telegram Bot API, Discord gateway, etc.) and routes messages to agent sessions
- **Agent sessions** — isolated conversation contexts with persistent memory, per-session model selection, and tool access. Sessions can be main (interactive), isolated (ephemeral cron tasks), or sub-agents (spawned workers)
- **Skills** — the extensibility primitive. A Skill is a directory containing a `SKILL.md` that instructs the agent how to handle a specific task domain (e.g., kanban card management, Obsidian PKM, GitHub operations). Skills are read on-demand when matched to a task.
- **Cron/TaskFlow** — structured job scheduling system. Jobs can spawn isolated sessions, deliver to specific channels, and use payload-driven turn execution without main session involvement.
- **Multi-node** — agents can operate across multiple machines (Mac mini, VPS, Pi); node-specific skills handle hardware capabilities (screen recording, canvas UI, TTS)
- **Canvas** — local web-based rendering layer for rich output (dashboards, HTML reports) served to the user's machine
- **Memory system** — `MEMORY.md` (long-term curated), `memory/YYYY-MM-DD.md` (daily notes), and semantic search via `memory_search` tool. The agent's continuity across session restarts.

**Knowledge pipeline integration:**
The PKM knowledge pipeline (this vault) runs on OpenClaw: webhook triggers → agent session → research → Obsidian notes. The pipeline skill reads staging notes, runs web research, produces concept notes and flashcards, and writes results back to the vault.

**Comparison to other agent platforms:**
| | OpenClaw | LangChain/LangGraph | AutoGen |
|---|---|---|---|
| Primary use case | Personal AI, homelab | Enterprise pipelines | Multi-agent research |
| Messaging integration | Native | External | External |
| Skill system | SKILL.md (natural language) | Python code | Python code |
| Hosting | Self-hosted daemon | Deployed app | Deployed app |
| Memory | File-based + semantic search | Vector stores + custom | In-memory / custom |

## Key Properties
- **Always-on gateway** — unlike chat interfaces, OpenClaw runs continuously and can initiate contact (proactive, scheduled)
- **Channel-native** — messages arrive and are delivered in the platforms users already use; no app switching
- **Skills as documentation** — skill logic is written in natural language (Markdown), not code; the LLM interprets and executes. Skills are auditable by humans.
- **Session isolation** — cron/webhook tasks run in isolated sessions; they don't pollute or block the main interactive session
- **Node-aware** — skills can route execution to specific nodes (e.g., `exec host=node` for macOS-specific operations)
- **Open source** — self-hosted; no vendor lock-in for the gateway itself (model provider is separate choice)

## Relationships
- The runtime environment for this PKM knowledge pipeline and all skills in this vault
- Related to [[model-context-protocol|MCP]]: OpenClaw skills could be exposed as MCP servers; external MCP clients could invoke them via standard protocol
- Related to [[multi-agent-systems]]: OpenClaw's sub-agent spawning (sessions_spawn) implements multi-agent coordination at the session level
- Related to [[agentic-ai-platform-architecture]]: OpenClaw at homelab scale is a three-layer architecture in miniature — gateway/skills (orchestration), heartbeat/monitoring (analytics), vault/homelab services (data)
- Related to [[agent-harness]]: OpenClaw is a personal agent harness — it defines the runtime environment, tool access, and memory model for the agent
- Related to [[memory-as-harness]]: OpenClaw's file-based memory system (MEMORY.md + daily notes + semantic search) exemplifies memory as a first-class harness concern

## Applications
- **Personal assistant:** Process Signal/Telegram messages, answer questions, set reminders, manage tasks, research topics — all without leaving the messaging app
- **Homelab automation:** Trigger deployments, monitor services, receive Telegram alerts with inline approve/reject — all mediated through the agent
- **PKM pipeline:** This vault's knowledge pipeline. Articles → staging → concept notes → flashcards, orchestrated by OpenClaw cron jobs and webhook receivers
- **Multi-agent research:** Sub-agents spawned per research topic, running in parallel, results synthesised by the main session
- **Discord community participation:** Agent participates in Discord channels, responds to mentions, reacts to messages — real social presence, not a bot

## Study

> [!tip] Flashcards
> [[flashcards/openclaw|Review flashcards for this concept]]

## Sources
- [OpenClaw documentation](https://docs.openclaw.ai) — official docs
- [OpenClaw source (GitHub)](https://github.com/openclaw/openclaw) — open-source repository
- [Community Discord](https://discord.com/invite/clawd) — user community

## See Also
- [[agent-harness]]
- [[memory-as-harness]]
- [[agentic-ai-platform-architecture]]
- [[model-context-protocol]]
- [[multi-agent-systems]]
- [[mcp-tool-patterns]]
