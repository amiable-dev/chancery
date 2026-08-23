---
tags: [flashcards, ai-agents, observability, audit, security, production]
sr-due: 2026-04-29
sr-interval: 1
sr-ease: 250
---

# Agent Audit Gap — Flashcards

#flashcards/observability

## Definition <!-- kb:card:3a6e12 -->
What is the Agent Audit Gap?
?
The lack of production-grade auditability for AI agent actions — when an agent causes an unexpected outcome in production, there is no reliable, tamper-proof record of what it did, in what order, and why, making root cause analysis, compliance verification, and accountability impossible without external instrumentation.

## Why Agents Are Different <!-- kb:card:bd1401 -->
Why do AI agents create a new class of accountability problem compared to traditional software?
?
Four reasons: (1) Non-determinism — same prompt produces different outputs, so you can't reproduce state by replaying inputs. (2) Multi-step opacity — dozens of intermediate steps modify context. (3) Tool invocations are side effects — agents call APIs, write DBs, send messages. (4) No standard audit format exists for agent actions.

## Two Complementary Responses <!-- kb:card:11e0ac -->
What are the two complementary responses to the Agent Audit Gap, as formulated by Paper Compute?
?
1. **Observability** (Tapes) — "shows you what happened" — durable session capture with cryptographic signing
2. **Containment** (StereOS) — "makes sure it can't go further than it should" — sandboxed execution limiting blast radius

## Addressing the Gap <!-- kb:card:83fcef -->
What four capabilities are needed to close the Agent Audit Gap?
?
1. **Session capture** — durable records of every agent action (prompt, completion, tool call, retry)
2. **Tamper resistance** — cryptographically signed records that can't be retroactively modified
3. **Contextual completeness** — capture at the right granularity including full context at call time
4. **Containment** — limiting what agents can do to bound blast radius

## Real-Time vs Forensic <!-- kb:card:49cc17 -->
What are the two forms of the Agent Audit Gap?
?
**Online (real-time monitoring)** — detecting anomalous behaviour as it happens, and **Forensic (post-incident analysis)** — reconstructing what happened after something went wrong. Both require durable, structured session records.

## Replay Insufficiency <!-- kb:card:0b7940 -->
Why is replay insufficient for agent audit, unlike traditional software debugging?
?
Because agent tool calls produce real-world side effects (API calls, database writes, message sends) that cannot be undone by replaying the agent. Additionally, non-determinism means replaying the same inputs won't reproduce the same execution path.
