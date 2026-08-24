---
tags: [flashcards, security, ai-agents, architecture]
sr-due: 2026-08-24
sr-interval: 1
sr-ease: 250
---

# Agent security as OS security — Flashcards

#flashcards/security

## Core framing <!-- kb:card:7232d3 -->
What structural framing does 'agent security as OS security' apply to securing an autonomous LLM agent's execution?
?
The same framing an OS uses for any untrusted process: isolate resources, separate privileges, and mediate every communication path — not treat safety as a property of the model's judgment alone.

## Three structural problems <!-- kb:card:56a1bf -->
What three structural problems does this framing say an LLM agent and an OS process both face?
?
Resource isolation (what can it read/write), privilege separation (what is it allowed to do), and mediated communication (how does it talk to anything else).

## OS mechanisms mapped <!-- kb:card:9907c7 -->
What established OS mechanisms map onto each of the three structural problems?
?
Process/namespace isolation for resource isolation, least-privilege restricted accounts for privilege separation, gated IPC and network egress control for mediated communication.

## Empirical validation <!-- kb:card:3f9a51 -->
What did the empirical case study against real deployed agents find about the attacker capability needed to defeat existing protections?
?
Only modest attacker capability was needed to defeat several agents' existing protections — showing default configurations are not enough.

## Limits of the fix <!-- kb:card:eb9c2a -->
Does applying established OS security techniques to agents close every security gap?
?
No — some agentic capabilities remain insecure by design even after applying every established OS technique; it narrows the attack surface rather than closing it.

## Deployment audit questions <!-- kb:card:b44724 -->
What three audit questions does this framing suggest for evaluating an agent deployment?
?
Does it run under its own restricted, non-privileged identity; is its resource access scoped to only what the task needs; and is every outbound effect forced through a mediation point that can inspect or block it?
