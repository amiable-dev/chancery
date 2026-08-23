---
sr-due: 2026-04-14
sr-ease: 250
sr-interval: 1
tags:
- flashcards
- ai-agents
- memory
- vendor-lock-in
- agent-memory-lock-in
---


# Agent Memory Lock-in — Flashcards

#flashcards/ai-agents


## Definition <!-- kb:card:1507cb -->
What is agent memory lock-in?
?
The phenomenon where an agent's accumulated memory becomes non-portable, binding the user to a specific harness or platform because that entity controls how memory is stored, formatted, and retrieved.

## Lock-in Tiers <!-- kb:card:6b8f97 -->
Name the three tiers of agent memory lock-in from mild to worst.
?
1. **Mild:** Stateful APIs (OpenAI Responses API, Anthropic server-side compaction) — state on their servers, can't resume threads with another model.
2. **Bad:** Closed-source harness (Claude Agent SDK) — memory format is opaque and non-transferrable.
3. **Worst:** Full API encapsulation (Anthropic Claude Managed Agents) — zero visibility or ownership of any memory, including long-term.

## Differentiation <!-- kb:card:47ff57 -->
How does agent memory lock-in differ from model lock-in?
?
Model lock-in can be escaped by switching APIs (GPT → Claude). Memory lock-in ties accumulated knowledge, personalisation, and preferences to the platform — switching means losing all of it.

## Data Flywheel <!-- kb:card:3f0524 -->
Why are model providers incentivised to capture agent memory?
?
Model APIs are commoditised (any model can be swapped). But if a provider controls your agent's memory, switching models means starting fresh — losing months of accumulated personalisation. Memory lock-in is stickier than model lock-in.

## Application <!-- kb:card:bab75c -->
How can you avoid agent memory lock-in?
?
Use open-source harnesses that store memory in portable, local formats (plain files, open databases like Postgres or Redis). Avoid encrypted server-side compaction, closed-source harnesses, and full API encapsulation platforms.

## Example <!-- kb:card:09f551 -->
What's a real-world consequence of agent memory lock-in?
?
An internal email assistant that accumulated months of learned preferences (communication style, priorities, contacts) on a proprietary platform. When the team tried to switch providers, all that personalisation was lost — it lived only in the platform's opaque memory store.
