---
tags: [flashcards, context-debt, ai-agents, governance, technical-debt]
sr-due: 2026-06-05
sr-interval: 1
sr-ease: 250
---

# Context Debt — Flashcards

#flashcards/ai-agents

## Definition <!-- kb:card:ebcb28 -->
What is context debt?
?
The accumulated risk from governance artifacts (`boundaries.md`, `threat-model.md`, Semgrep rules) that have become stale or incorrect — causing the enforcement pipeline to enforce *wrong* constraints with full authority. The governance system still runs and appears to work, but is enforcing outdated or incorrect rules.

## The Authoritative Failure <!-- kb:card:49e839 -->
Why is context debt potentially worse than having no governance artifacts at all?
?
A codebase **without** governance fails **open** — no enforcement, but everyone knows it.
A codebase with **stale** governance fails with **false confidence** — the team believes the system is governed when it may not be, or developers are blocked by rules that no longer apply. The authority of the enforcement mechanism amplifies the incorrectness of the artifacts.

## Distinction from Context Rot <!-- kb:card:9f1edf -->
How does context debt differ from context rot?
?
**Context rot** is a *model* performance issue — recall accuracy degrades as the context window grows longer (a transformer attention problem).
**Context debt** is a *governance artifact* correctness issue — boundary declarations become wrong over time as the codebase evolves but the artifacts are not updated. Different problem, different remedy.

## Forms <!-- kb:card:4b5bc1 -->
Name three forms context debt can take.
?
1. **Overly restrictive stale rules** — block a pattern that has since been deliberately adopted; spurious CI failures erode trust in governance
2. **Overly permissive stale rules** — fail to cover a new integration surface; governance appears to pass but actual risk has grown
3. **Orphaned ownership** — no one is responsible for updating artifacts, so they drift toward staleness proportionally to architectural change pace

## Mitigation <!-- kb:card:485f8b -->
What practices prevent or manage context debt?
?
- Treat governance artifacts as **production code**: version control, peer review, explicit ownership
- Assign **explicit owners** to each artifact (individual or team), analogous to CODEOWNERS
- Include `/context/**` artifacts in **sprint-level review** when their bounded context changes
- Review **last-modified dates** of threat models and boundary files as an audit signal for debt risk
