---
tags: [flashcards, code-intelligence, static-analysis, graphs, domain/software-engineering, maturity/emerging, source-type/vendor-doc]
sr-due: 2026-08-24
sr-interval: 1
sr-ease: 250
---

# Language-agnostic code graph — Flashcards

#flashcards/code-intelligence

## Definition <!-- kb:card:19b2b0 -->
What does a language-agnostic code graph normalize, and what does that enable that per-file ASTs cannot?
?
It normalizes every language's parse tree into one shared vocabulary of node kinds (module, class, function, call, etc.) and typed edges (calls, imports, inherits, data-flow, etc.), holding the whole codebase as one graph — enabling relationships like a call crossing a language boundary, which per-file ASTs can't express at all.

## The adapter mechanism <!-- kb:card:0ff7c0 -->
How does the system support a new language without changing its core analysis engine?
?
Per-language adapters sit behind one common interface, each parsing its own language and emitting universal nodes and edges — supporting a new language means implementing that interface, not modifying the engine.

## Why traversal is cheap <!-- kb:card:3791b5 -->
What makes traversal queries, like every caller of a function, cheap instead of requiring a re-parse?
?
Relationship-first storage — nodes hold entities, edges hold typed relations — plus side indexes on symbols, types and dependencies, which converts such questions into index lookups.

## Incremental updates <!-- kb:card:e2e084 -->
How does the graph stay current without a full rebuild on every edit?
?
A bidirectional file-dependency graph lets a breadth-first walk over a changed file's dependents compute just the affected set; only those files are reparsed and their nodes and indexes atomically replaced — cost scales with what changed, not repository size.

## Fidelity trade-off <!-- kb:card:9158da -->
What kind of code does this representation resolve only heuristically, and how is that uncertainty marked?
?
Dynamic features — dynamic imports, metaclasses, prototype assignment — are resolved heuristically and carry a confidence value rather than being recorded as fact.
