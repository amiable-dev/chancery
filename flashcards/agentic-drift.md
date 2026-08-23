---
tags: [flashcards, ai-agents, agentic-coding, autonomy, long-running]
sr-due: 2026-07-08
sr-interval: 1
sr-ease: 250
---

# Agentic Drift — Flashcards

#flashcards/ai-agents

## Definition <!-- kb:card:5d3c76 -->
What is agentic drift?
?
The progressive divergence of a long-running autonomous AI agent session from the original intent and constraints of the task — caused by accumulated context, cascading micro-decisions, and absence of realignment checkpoints — resulting in coherent-looking but misaligned output.

## Application <!-- kb:card:83fcc8 -->
When is agentic drift a significant risk?
?
In any autonomous AI session running for hours or days — particularly agentic coding runs, multi-step pipeline jobs, and autonomous research tasks where the agent makes many sequential decisions without human review gates.

## Mechanism <!-- kb:card:b1a2d4 -->
Why is agentic drift insidious?
?
Because the output looks correct and internally consistent at every step — the agent isn't making errors, it's making locally-reasonable decisions that compound. Drift is invisible until reviewed against original intent, and by then reversing it requires unpicking a long decision chain.

## Causes <!-- kb:card:07662a -->
What are the four main causes of agentic drift?
?
1. **Context compression** — long contexts compress earlier instructions, weighting recent context more heavily
2. **Cascading accommodation** — each small deviation creates a new local optimum that subsequent decisions optimise for
3. **Absence of invariants** — no "these things must remain true" checkpoints to challenge decisions against original intent
4. **In-context error propagation** — early misinterpretations get treated as facts by later steps

## Countermeasures <!-- kb:card:3572bf -->
What are the main countermeasures for agentic drift?
?
- **Explicit checkpoints:** Require decision summaries and alignment verification at defined points
- **Invariant declarations:** State upfront what must remain true regardless of implementation choices
- **Bounded autonomy windows:** Break long runs into shorter segments with human review gates
- **Decision logs:** Require the agent to log significant choices with rationale for spot-check auditing

## Contrast <!-- kb:card:5db1e3 -->
How does agentic drift differ from agent checkpoint-resume?
?
Checkpoint-resume handles **process continuity** — surviving crashes, restarts, and cold starts. Drift management handles **semantic continuity** — ensuring the agent's direction stays aligned with original intent over long runs. They address different dimensions of long-running agent reliability.

## Relationship <!-- kb:card:d4d3a7 -->
How does a blind spot pass help with agentic drift prevention?
?
A blind spot pass reduces drift risk at the *start* by surfacing intent more precisely before the run begins — giving the agent a clearer, more explicit target to stay aligned with. Checkpoints address drift *during* the run.
