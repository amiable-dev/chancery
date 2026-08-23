---
tags: [flashcards, comprehension-debt, ai-agents, technical-debt, code-quality]
sr-due: 2026-06-05
sr-interval: 1
sr-ease: 250
---

# Comprehension Debt — Flashcards

#flashcards/ai-agents

## Definition <!-- kb:card:5742f5 -->
What is comprehension debt?
?
The silent, compounding accumulation of architectural ungoverability when AI code generation outpaces human capacity to read and maintain structural integrity of the output. Coined by Addy Osmani. Code is technically functional but architecturally opaque at the speed it's produced.

## Velocity Asymmetry <!-- kb:card:bc7a95 -->
What is the core asymmetry that creates comprehension debt?
?
- AI generates syntax in **seconds per feature**
- Humans comprehend architecture over **hours to days**
- CI pipelines designed for human-speed output pass tests **without checking bounded contexts**
Result: architectural violations accumulate as fast as tokens are generated, with no automatic gate to stop them.

## Distinction from Cognitive Debt <!-- kb:card:78ee49 -->
How does comprehension debt differ from cognitive debt?
?
**Cognitive debt** is about the *developer's own skills* atrophying from AI reliance (neural dimming, reduced cognitive capacity).
**Comprehension debt** is about the *codebase itself* becoming architecturally ungovernable — it's a systemic property of the generated system, not the generating human.

## Why It's Silent <!-- kb:card:457f0f -->
Why does comprehension debt accumulate silently, without triggering alerts?
?
- Feature tests make no assertions about bounded contexts
- CI pipelines check syntax and unit behaviour, not architectural invariants
- Generated code is *working* — failures are governance failures under scrutiny, not operational alerts
- The debt only becomes visible when someone must audit, extend, or prove liability for the system

## Mitigation <!-- kb:card:c09d82 -->
What is the primary mitigation for comprehension debt?
?
The [[context-compilation-pattern]]: build-time governance via versioned context artifacts + deterministic CI enforcement. This makes architectural invariants explicit *before* generation and unviolatable at merge time — stopping debt accumulation at source rather than detecting it retrospectively.
