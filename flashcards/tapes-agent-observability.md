---
tags: [flashcards, ai-agents, observability, audit, security, infrastructure, paper-compute]
sr-due: 2026-04-29
sr-interval: 1
sr-ease: 250
---

# Tapes Agent Observability — Flashcards

#flashcards/observability

## Definition <!-- kb:card:2265a0 -->
What is Tapes?
?
A zero-instrumentation agent observability system that operates as a reverse proxy between an AI agent and its inference provider. Every request, tool call, retry, and model response is captured as a cryptographically signed, tamper-proof session record — providing a durable audit trail without any changes to agent code.

## Zero-Instrumentation Deployment <!-- kb:card:633521 -->
How do you deploy Tapes with an existing agent?
?
One environment variable change — point `OPENAI_BASE_URL` (or equivalent) at the Tapes proxy endpoint. No SDK, no framework lock-in. Works with any agent that speaks standard LLM HTTP APIs.

## What Tapes Captures <!-- kb:card:9a4022 -->
What data does Tapes capture per agent session?
?
Every prompt sent to the model, every completion returned, all tool/function call invocations and results, retries and errors, token consumption and cost per step, and timing data for latency analysis.

## Beyond Capture <!-- kb:card:3b76af -->
What three value-add features does Tapes provide beyond raw session recording?
?
1. **Anomaly detection** — statistical comparison of sessions surfaces unusual behaviour (e.g., a Pokémon bot spamming inputs during animations)
2. **Session replay** — captured sessions can be played back for debugging or sharing
3. **Skill generation** — successful runs are converted into reusable skill artifacts ("dead tokens into skills")

## Cryptographic Signing <!-- kb:card:6cf6f4 -->
Why does Tapes cryptographically sign session records?
?
To create compliance-grade evidence: you can *prove* an agent took a specific action, not just assert it from mutable logs. Records signed at capture time cannot be retroactively modified — essential for regulatory audits and incident investigation.

## Pokémon Example <!-- kb:card:06d7ca -->
What did Tapes' anomaly detection discover in the Pokémon bot example?
?
A Pokémon-playing agent was spamming inputs during battle animations — wasteful and potentially disruptive. Tapes flagged the unusual pattern automatically through statistical comparison of sessions, leading to a targeted fix.
