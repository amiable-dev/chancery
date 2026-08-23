---
tags: [flashcards, ai-agents, loop-engineering, safety]
sr-due: 2026-07-26
sr-interval: 1
sr-ease: 250
---

# Loop Termination Condition — Flashcards

#flashcards/ai-agents

## Definition <!-- kb:card:869d60 -->
What are the two required exits of a well-designed agentic loop?
?
1. **Success** — a deterministic verifier confirms the goal is met (not a self-report from the acting model)
2. **Escalation** — a failure signal (exhausted iteration/token/time budget, or repeated identical errors with no progress) hands the problem to a human rather than continuing indefinitely

## Application <!-- kb:card:df2b30 -->
Why is "make the app better" a poor loop goal, while "make every test in the auth module pass" is a good one?
?
The first gives the agent nothing to mechanically check against, so the loop either runs forever or stops on a guess. The second is checkable in a literal sense (test runner returns pass/fail) — termination quality is largely a restatement of how testable the underlying goal is.

## Relationship <!-- kb:card:a33d57 -->
How does "no-progress" detection differ from a simple time/token budget cap, and why does a loop need both?
?
A budget cap stops the loop after a fixed resource threshold regardless of behavior. No-progress detection specifically catches a loop that is *spinning* — retrying the same action after the same error, or leaving state unchanged — which can happen well within budget. Without no-progress detection, a loop can burn its entire budget on a dead end instead of escalating early.
