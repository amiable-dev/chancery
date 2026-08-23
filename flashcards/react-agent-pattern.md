---
sr-due: 2026-04-14
sr-ease: 250
sr-interval: 1
tags:
- flashcards
- ai-agents
- patterns
---


# ReAct Agent Pattern — Flashcards

#flashcards/ai-agents


## Definition <!-- kb:card:068c68 -->
What is the ReAct agent pattern?
?
An agentic loop based on **Reason → Act → Observe** iterations. The LLM reasons about the next action, executes a tool call (Act), observes the result, and repeats until a terminal condition is met. From Yao et al. (2022), arXiv:2210.03629.

## Mechanics <!-- kb:card:8e63df -->
What happens in each iteration of a ReAct loop?
?
1. **Reason** — LLM receives full conversation history and decides: call a tool or produce a final answer
2. **Act** — if a tool is chosen, execute it with LLM-provided arguments; append result to history
3. **Observe** — check the breaking condition (goal achieved, max iterations, escalation signal). If not met, loop again.

## Value <!-- kb:card:30de3f -->
Why does ReAct outperform zero-shot LLM calls?
?
It's self-correcting — the LLM sees prior tool results and can adjust its approach. A zero-shot GPT-4 achieves ~67% on coding benchmarks; agentic iteration with the same model achieves dramatically higher accuracy because it can recover from wrong first attempts.

## Breaking Conditions <!-- kb:card:c90a44 -->
What are the breaking conditions in a ReAct loop?
?
- LLM signals task completion (no more tool calls needed)
- Maximum iteration count reached (safety valve)
- Error state requiring human escalation is detected (triggers [[human-in-the-loop-pattern|Human-in-the-Loop Pattern]])
These must be explicitly designed — without them, the loop runs indefinitely.

## When NOT to use <!-- kb:card:227dcb -->
When should you avoid the ReAct pattern?
?
When a single LLM call or deterministic logic is sufficient. Each iteration adds LLM latency (visible in traces). If a fixed rule can make the decision, or one LLM call is enough, ReAct is unnecessary overhead.
