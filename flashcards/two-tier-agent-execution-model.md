---
tags: [flashcards, ai-agents, safety, patterns]
sr-due: 2026-04-29
sr-interval: 1
sr-ease: 250
---

# Two-Tier Agent Execution Model — Flashcards

#flashcards/ai-agents

## Definition <!-- kb:card:5927d0 -->
What is the Two-Tier Agent Execution Model?
?
An agent safety architecture that divides a fleet into Tier 1 (advisory only — analyse and recommend, never execute) and Tier 2 (execution — compose and run commands against real targets, but only with explicit per-action human approval before each step).

## Tier Distinction <!-- kb:card:c3b222 -->
What is the fundamental difference between Tier 1 and Tier 2 agents in the two-tier model?
?
Tier 1 agents are architecturally incapable of executing commands — they only output text analysis and recommendations. Tier 2 agents can execute commands, but gate on per-action human approval. Tier 1 = advisory; Tier 2 = execution with approval gates.

## Approval Gate <!-- kb:card:c51c24 -->
What is an approval gate in the two-tier execution model and why does it matter?
?
An approval gate is the mandatory human sign-off required before each individual Tier 2 command executes. The agent displays the exact command it intends to run and waits for explicit confirmation. This ensures no command runs without human review — bounding risk at the lowest granularity.

## Cost Differentiation <!-- kb:card:6c174f -->
Why are Tier 1 agents typically run on cheaper/smaller models?
?
Tier 1 agents only analyse text input and produce text output — a smaller model (e.g., Claude Haiku) is sufficient. Tier 2 agents compose complex multi-step attack chains and reason about authorised scope, requiring larger, more capable models. Cost reflects risk and capability level.

## Application <!-- kb:card:7824e8 -->
When should you apply the two-tier execution model to an agent system?
?
When agents interact with real systems where actions are potentially irreversible, expensive, or outside an authorised scope — penetration testing, infrastructure automation, data pipeline management, or any domain where a wrong execution has serious consequences. The pattern enforces hard architectural separation between analysis and action.

## Relationship to HITL <!-- kb:card:64f4f1 -->
How does the two-tier execution model differ from the Human-in-the-Loop (HITL) pattern?
?
HITL describes human checkpoints at workflow milestones generally. The two-tier model is a specific structural implementation: agents are divided into two capability tiers at the fleet architecture level, and Tier 2 agents gate on *every individual command*, not just workflow decision points.
