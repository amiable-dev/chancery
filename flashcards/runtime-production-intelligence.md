---
tags: [flashcards, observability, code-quality, production, static-analysis]
sr-due: 2026-05-02
sr-interval: 1
sr-ease: 250
---

# Runtime Production Intelligence — Flashcards

#flashcards/observability

## Definition <!-- kb:card:a7486c -->
What is runtime production intelligence?
?
Instrumenting production systems to collect function/module-level execution data (what code actually runs, how often), then joining that signal with static analysis to identify hot paths (frequently called) and cold paths (never/rarely called in production) as evidence for code decisions.

## Static vs Runtime Dead Code <!-- kb:card:dbd168 -->
What is the difference between statically dead code and a runtime cold path?
?
Statically dead code has no import path reaching it — it's unreachable by definition. A cold path is statically reachable (something imports it) but never actually called in production. Cold paths are evidence-backed deletion candidates; static dead code is guaranteed safe to remove.

## Evidence Backing <!-- kb:card:e4f753 -->
Why is "0 production hits in 90 days" a stronger deletion argument than static analysis alone?
?
Static analysis can only prove something *could* be unused (no import path). Production data proves it *is* unused by real users. Combined, they eliminate uncertainty: the code has a path to it AND no one takes that path. Much harder to argue against deleting it.

## Contrast with Test Coverage <!-- kb:card:0d76f9 -->
How does runtime production intelligence differ from test coverage?
?
Test coverage measures which code is exercised by tests. Production intelligence measures which code is exercised by real users. A function can be 100% test-covered but never called in production if the tested path doesn't match actual user behavior.

## Application <!-- kb:card:033cc5 -->
How would you use runtime production intelligence in an AI-assisted development workflow?
?
After merging AI-generated features, monitor production hit counts. Code that was generated and merged but never executed in production over 30-90 days → cold path → evidence-backed deletion candidate. Creates a hygiene feedback loop for AI-generated code.
