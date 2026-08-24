---
tags: [flashcards, agents, architecture, patterns, domain/ai-agents, maturity/emerging, source-type/practitioner]
sr-due: 2026-08-24
sr-interval: 1
sr-ease: 250
---

# Interchangeable agentic architectures — Flashcards

#flashcards/agents

## Definition <!-- kb:card:061fa7 -->
What does treating agentic architectures as 'interchangeable' mean?
?
Named agent patterns (reflection, tree/Monte-Carlo search, corrective retrieval, tiered memory, supervisor-specialist teams, sandboxed tool agents) are treated as alternative implementations of one uniform contract — same task in, same result shape out — so the pattern becomes a swappable parameter rather than an architectural commitment.

## What the contract enables <!-- kb:card:ca7b05 -->
What does the uniform contract make possible that separate per-paper implementations don't?
?
Running every pattern against the same shared task suite, producing a per-task result grid directly comparable across patterns, rather than a stack of incomparable per-paper claims.

## What the benchmark actually shows <!-- kb:card:c12a90 -->
What is the informative output of running the patterns against a shared suite — the aggregate score or something else?
?
The pattern-fit failures it exposes — mismatches between a pattern's inductive bias and a task's shape — not the aggregate accuracy score.

## Documented pattern-fit failures <!-- kb:card:084a6a -->
Give two documented pattern-fit failures from the benchmark.
?
Any two of: tree-search patterns collapsing on arithmetic tasks with no branching structure to search; debate/ensemble patterns confidently converging on a wrong answer to a trick question via group-think; memory patterns failing raw-fact recall because they store conversation turns or workflow recipes, not facts.

## Evidence caveat <!-- kb:card:a1f6a1 -->
What should the catalog's quantitative benchmark numbers NOT be read as?
?
A ranking of the patterns — they come from one run on one model over a small task suite for about a dollar and a half of tokens, a snapshot rather than a rigorous evaluation.
