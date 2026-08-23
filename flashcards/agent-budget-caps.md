---
tags: [flashcards, ai-agents, resource-governance, autonomy]
sr-due: 2026-05-29
sr-interval: 1
sr-ease: 250
---

# Agent Budget Caps — Flashcards

#flashcards/ai-agents

## Definition <!-- kb:card:f8afa7 -->
What are Agent Budget Caps?
?
Explicit, configurable upper bounds on an autonomous AI agent's resource consumption — typically across token count (LLM cost), tool-call count (action breadth), triage iterations (re-planning cycles), and wall-clock duration (elapsed time). When any cap is reached, the agent halts and returns what it has accumulated.

## Failure Modes <!-- kb:card:6f60bd -->
What are the two failure modes of miscalibrated agent budget caps?
?
**Under-budget:** Agent is cut mid-investigation; outputs are low-confidence stubs that *look* complete but aren't.
**Over-budget:** Agent wanders, burns spend, and adds noise — more output doesn't mean more signal.

## Calibration <!-- kb:card:4d1b60 -->
What is the recommended starting heuristic for setting agent budget caps?
?
Start tight, loosen only when genuine work is getting cut off. The signal for "too tight" is a specific finding that was truncated; the signal for "too loose" is repetitive or low-quality output filling the budget.

## Job Shapes <!-- kb:card:94d941 -->
How should budget cap profiles differ by job type?
?
- **Time-boxed CI runs:** lean on wall-clock + iteration caps (guarantees completion)
- **Deep-dive single target:** loosen tokens, let the agent re-plan
- **Broad sweeps:** keep per-target budgets tight (one rabbit-hole target eats all resources)

## Relationship <!-- kb:card:2a2b50 -->
How do agent budget caps differ from constrained agent actions?
?
**Constrained agent actions** limit the output *vocabulary* — restricting what decisions an agent can express.
**Agent budget caps** limit resource *consumption* — restricting how much inference, time, and tooling an agent can use. Both constrain autonomy but in orthogonal dimensions.
