---
tags: [flashcards, ai-agents, architecture, anthropic]
sr-due: 2026-06-13
sr-interval: 1
sr-ease: 250
---

# Managed Agent Split-Plane Architecture — Flashcards

#flashcards/ai-agents

## Definition <!-- kb:card:54bf0c -->
What is managed agent split-plane architecture?
?
A deployment model where the AI reasoning/orchestration layer (control plane) runs in the provider's cloud while tool execution (execution plane) runs in infrastructure the customer controls. The model reasons on Anthropic's side; code, files, and processes run on your side.

## Core Split <!-- kb:card:37fdda -->
In Claude Managed Agents split-plane, what runs on Anthropic's side vs. the customer's side?
?
**Anthropic (control plane):** LLM reasoning, tool selection, prompt caching, context compaction, session state.
**Customer (execution plane):** Tool execution (bash, file ops), filesystem contents, spawned processes, network egress — nothing leaves the customer's boundary.

## Trade-off vs. fully self-hosted <!-- kb:card:3aaf13 -->
How does split-plane architecture differ from a fully self-hosted agent (e.g. OpenClaw)?
?
Fully self-hosted: both reasoning/orchestration AND execution stay on-prem — full sovereignty.
Split-plane: only execution stays on-prem; reasoning is delegated to the provider (Anthropic) in exchange for managed convenience (auto model updates, caching, compaction).

## Data crossing the boundary <!-- kb:card:0a1563 -->
What data crosses the boundary between customer and provider in split-plane architecture?
?
Tool *inputs* and *outputs* — the arguments sent to a tool call and the results returned. The tool's actual execution, the filesystem state, and internal network calls stay on the customer's side. Only what the model needs to continue reasoning crosses.

## Compliance consideration <!-- kb:card:67f06c -->
Why is split-plane architecture currently ineligible for Zero Data Retention or HIPAA BAA in Claude Managed Agents?
?
Because tool inputs and outputs still flow through Anthropic's control plane so the model can see results. Even though execution happens on-prem, that I/O transit means data touches Anthropic's infrastructure.

## Application <!-- kb:card:9867ac -->
When would you choose split-plane over fully self-hosted agent execution?
?
When you want managed provider conveniences (model updates, caching, session management) but need tool execution to stay inside your network boundary — e.g. to reach private internal services, maintain data residency, or reduce compliance surface area without operating a full agent infrastructure stack.
