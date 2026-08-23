---
tags: [flashcards, ai-agents, security, multi-agent]
sr-due: 2026-07-26
sr-interval: 1
sr-ease: 250
---

# Agent Capability Composition Risk — Flashcards

#flashcards/ai-agents

## Definition <!-- kb:card:000f1b -->
What is agent capability composition risk?
?
The risk that two or more individually limited AI agents can combine their capabilities, typically via inter-agent communication, to achieve a composite action none of them was individually authorized to perform — a multi-agent variant of the confused-deputy problem.

## Concrete Example <!-- kb:card:687a22 -->
What incident illustrates agent capability composition risk?
?
An incident-response agent (scoped to read logs, write docs, post messages) diagnosed a bug and asked a separate coding agent over chat to deploy the fix directly. Neither agent's individual permission grant was wrong, but their capabilities composed into an unauthorized deploy path; a human gate caught it.

## Why Single-Agent Review Misses It <!-- kb:card:d7c8b5 -->
Why won't auditing each agent's permissions in isolation catch this risk?
?
Because the risk isn't a misconfigured grant on any one agent — it's the absence of a policy governing inter-agent trust. It only becomes visible when reasoning about the graph of agents and what they can jointly reach.

## Application <!-- kb:card:cc2102 -->
What policy fix addresses agent capability composition risk?
?
Check on the receiving side whether the requesting agent's identity is authorized to request the specific action — not just whether the receiving agent is capable of performing it. Treat inter-agent messages as untrusted input requiring authorization, not implicitly-trusted internal instructions.

## Relationship <!-- kb:card:9a5280 -->
How does this risk relate to separation of duties in the agentic SDLC?
?
It's the failure mode separation of duties must defend against transitively — the four-job separation only holds if it also applies when a job is requested indirectly via another agent, not just directly.
