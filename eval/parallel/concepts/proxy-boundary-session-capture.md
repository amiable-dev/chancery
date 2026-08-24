---
title: Proxy-boundary session capture
date: 2026-08-24
domain: observability
maturity: emerging
source_type: practitioner
tags: [concept, observability, ai-agents, reliability, domain/observability, maturity/emerging, source-type/practitioner]
status: draft
sources:
  - url: https://briandouglas.me/posts/2026/03/04/claude-failed-mid-session-tapes-brought-it-back/
---

# Proxy-boundary session capture

## Definition

**Proxy-boundary session capture** is the practice of recording every request and response between an application and its LLM providers at a transparent proxy you control — content-addressed, with each message stored as a hashed node carrying a parent pointer — so the full conversation tree survives, and is recoverable, independently of the harness that produced it.

## Explanation

The motivating failure is ordinary: an agent harness crashes mid-session and takes an hour of accumulated context with it, because the tool that held the state is the tool that died. The principle is to move capture to a boundary that does not share the harness's fate: a transparent proxy records every message — user prompts, assistant responses, tool calls, tool results — as nodes in a content-addressed tree (the source's implementation, tapes, uses a Merkle DAG in a local SQLite database), from which the conversation reconstructs exactly. Recovery is then mundane rather than heroic: start a fresh session, point it at the recorded tree, and continue. The evidence here is a single first-person war story about one tool, which is why this note's durability was rated weak at assessment and the concept was admitted by recorded owner override; the mechanism, though, is tool-agnostic — any logging proxy with durable, ordered, per-message storage supports the same recovery, and content addressing adds integrity (the hash tree makes tampering or truncation detectable) rather than being essential to it. The general rule the story instantiates: state you cannot afford to lose should be captured at an infrastructure boundary you control, not inside the process that can crash.

## Key Properties

- Capture sits at a proxy between application and provider, outside the harness's failure domain
- Every message is a content-addressed node with a parent pointer; the conversation tree reconstructs exactly
- Recovery workflow: fresh session, point it at the recorded tree, resume
- Tool-agnostic mechanism; content addressing adds integrity, not a prerequisite
- Admitted by owner override over a weak-durability rating — single-tool anecdote, transferable principle

## Relationships

- [[siem-agentic-visibility-gap]] — applies the same instinct to reliability that the SIEM argument applies to security: agent interactions must be recorded in infrastructure you control, because the tool itself is not a trustworthy custodian of its own record

## Applications

Session recovery after harness crashes; auditable replay of agent conversations; building memory or distillation pipelines on top of a complete interaction record rather than whatever the harness happens to persist.

## Sources

- https://briandouglas.me/posts/2026/03/04/claude-failed-mid-session-tapes-brought-it-back/

## See Also

- [[siem-agentic-visibility-gap]]
