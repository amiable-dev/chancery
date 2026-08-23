---
tags: [flashcards, ai-agents, governance, enterprise, observability, streaming]
sr-due: 2026-07-05
sr-interval: 1
sr-ease: 250
---

# AI Agent Activity Streaming — Flashcards

#flashcards/ai-governance

## Definition <!-- kb:card:686806 -->
What is AI agent activity streaming?
?
The practice of continuously exporting structured records of AI agent sessions — prompts, model responses, and tool calls — to external systems (SIEM, DLP, compliance platforms) in real time or near-real time, so that agent behaviour is observable outside the AI vendor's own platform.

## Delivery Patterns <!-- kb:card:306ffc -->
What are the two delivery patterns for AI agent activity streaming, and when is each appropriate?
?
**Streaming endpoint** — persistent real-time push to an event collector or SIEM; best for live alerting and anomaly detection.  
**REST pull** — on-demand batch query returning the last N hours of records (e.g., 48h in GitHub Copilot's implementation); best for scheduled compliance reporting and retrospective analysis.

## Data Content <!-- kb:card:8d0646 -->
What data does an AI agent session record typically contain?
?
Session ID, timestamps, user identity, prompts submitted, model responses, tool calls (name + input arguments + results), client type (IDE, CLI, cloud), model version, and session duration.

## Key Distinction <!-- kb:card:888957 -->
How does AI agent activity streaming differ from agent-side observability (e.g., an agent emitting its own logs)?
?
Activity streaming is captured at the **platform level**, independently of the agent's internal state. If an agent misbehaves or fails, it may fail to log accurately. Platform-level capture is resistant to this — making records suitable as compliance evidence, not just debugging artefacts.

## GitHub Copilot Example <!-- kb:card:8a2d05 -->
What clients does GitHub Copilot's agent session streaming cover (as of public preview, July 2026)?
?
All Copilot clients: cloud agents on github.com/ghe.com, Copilot CLI, Visual Studio Code, Visual Studio, and partner IDEs (JetBrains, Eclipse).

## Governance Shift <!-- kb:card:5cd8e7 -->
How does AI agent activity streaming change the governance question from reactive to proactive?
?
Before streaming: "Did the agent do anything problematic?" — only answerable retrospectively via vendor logs.  
After streaming: "Is the agent doing anything problematic *right now*?" — SIEM detection rules fire on live events within seconds of a suspicious prompt or tool call.

## Problem it Solves <!-- kb:card:5b000c -->
Which existing concept does AI agent activity streaming directly address, and how?
?
It directly addresses the **[[agent-audit-gap]]** — the lack of production-grade auditability for AI agent actions. Activity streaming provides the missing session record that makes agents auditable from outside the AI platform.
