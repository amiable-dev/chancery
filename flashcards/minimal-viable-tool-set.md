---
tags: [flashcards, minimal-viable-tool-set, ai-agents, llm, tools]
sr-due: 2026-04-29
sr-interval: 1
sr-ease: 250
---

# Minimal Viable Tool Set — Flashcards

#flashcards/ai-agents

## Definition <!-- kb:card:b6b120 -->
What is the minimal viable tool set principle?
?
The principle that an agent should be equipped with the smallest set of well-defined, non-overlapping tools sufficient to accomplish its task domain — and no more. Each tool should have a clearly distinct purpose, unambiguous decision criteria for invocation, and self-contained behaviour.

## Failure mode <!-- kb:card:a6bea2 -->
What is "tool bloat" and why does it degrade agent performance?
?
Tool bloat is providing an agent with a large, overlapping tool set expecting more options = better coverage. It degrades performance two ways:
1. **Decision confusion:** When multiple tools could apply, the model must reason about the choice — costing attention and increasing errors
2. **Context cost:** Tool definitions consume context tokens, leaving less room for task-relevant information

## Heuristic <!-- kb:card:d1de18 -->
What is Anthropic's practical heuristic for assessing whether a tool set has too much overlap?
?
"If a human engineer can't definitively say which tool should be used in a given situation, an AI agent can't be expected to do better." When two tools compete for the same input, either merge them or add explicit disambiguation rules.

## Design principles <!-- kb:card:7e69a9 -->
What are the key principles for designing individual tools in an agent's tool set?
?
- Single responsibility (one clear purpose)
- Non-overlapping (no two tools should apply to the same situation)
- Robust error handling (fail gracefully with useful messages)
- Token-efficient outputs (minimal by default, verbose on request)
- Descriptive, unambiguous parameter names (semantic over positional)

## Curation mindset <!-- kb:card:a07529 -->
How should a minimal viable tool set be developed over time?
?
Start with the minimum tools needed, observe where the agent gets stuck or makes wrong tool choices, then add targeted tools for *demonstrated* gaps — not anticipated ones. Periodically audit for tools that are never used, rarely used, or frequently confused with each other.
