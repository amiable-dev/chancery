---
tags: [flashcards, openclaw, ai-agents, infrastructure, platform]
sr-due: 2026-04-15
sr-interval: 1
sr-ease: 250
---

# OpenClaw — Flashcards

#flashcards/ai-agents

## Definition <!-- kb:card:6f644f -->
What is OpenClaw?
?
An open-source AI gateway and agent runtime that connects messaging platforms (Signal, Telegram, Discord, WhatsApp, etc.) to AI assistants. Provides persistent agent sessions, skill-based extensibility, cron scheduling, multi-node support, and a memory system — enabling an always-on personal AI agent that lives in existing messaging contexts.

## Architecture <!-- kb:card:4b7ea4 -->
What are OpenClaw's five core architectural components?
?
1. **Gateway daemon** — connects to messaging platform APIs; routes messages to agent sessions
2. **Agent sessions** — isolated conversation contexts (main, isolated/cron, sub-agent)
3. **Skills** — SKILL.md files that instruct the agent how to handle specific task domains
4. **Cron/TaskFlow** — structured job scheduling; isolated delivery without main session involvement
5. **Memory system** — MEMORY.md (long-term) + daily notes + semantic search for continuity across session restarts

## Skills <!-- kb:card:ea17be -->
What makes OpenClaw skills distinctive vs code-based plugins?
?
Skills are written in natural language (Markdown SKILL.md files) rather than code. The LLM reads and interprets them at task time. This makes skills auditable by humans, writable without programming, and adaptable without redeployment — but execution fidelity depends on the LLM's instruction-following.

## Application <!-- kb:card:68442b -->
How does OpenClaw differ from chat-UI AI interfaces?
?
Chat UIs require the user to go to a dedicated app and start a conversation. OpenClaw brings the agent to wherever the user communicates — Signal, Telegram, Discord — and makes it always-on (proactive scheduling, heartbeats, cron jobs). The agent can initiate contact, not just respond.

## Relationship <!-- kb:card:1660e9 -->
How does this PKM knowledge pipeline relate to OpenClaw?
?
The entire pipeline runs on OpenClaw: webhook triggers → isolated agent session → research → Obsidian note creation → results file. OpenClaw provides the session isolation, skill routing (pkm-synthesis), cron scheduling, and tool access (web_fetch, read, write) that make the pipeline possible.
