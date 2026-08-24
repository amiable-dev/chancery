---
tags: [flashcards, static-analysis, dead-code-detection, dependency-graph]
sr-due: 2026-08-24
sr-interval: 1
sr-ease: 250
---

# Reachability-based dead code detection — Flashcards

#flashcards/static-analysis

## Core mechanism <!-- kb:card:f5c763 -->
How does reachability-based dead code detection prove code is dead?
?
By showing no path connects it to any declared entry point in the import/reference graph — not by pattern-matching suspicious code file by file.

## Two-phase design <!-- kb:card:72ef1a -->
What are the two phases of reachability-based dead code detection?
?
A build phase that constructs the graph once by parsing imports/exports from the entry points, and a query phase that classifies unused files, exports and dependencies by walking that graph without re-parsing.

## Accuracy bound <!-- kb:card:59db3c -->
What determines the accuracy of reachability-based dead code detection?
?
Entry-point completeness, not analysis sophistication — a missing entry point silently shrinks the graph rather than producing a visible error.

## Cascading findings <!-- kb:card:b94d0b -->
What happens to unused-code findings when one entry point is missing from the root set?
?
One unlisted entry can surface as dozens of separate unused-file, unused-export and unused-dependency findings, all of which disappear at once when the true root is restored.

## Debugging discipline <!-- kb:card:4bf735 -->
How should a surprising 'unused' result be treated when using this technique?
?
As evidence the root set is incomplete — such as a missing entry, unresolvable dynamic import, or implicit transitive dependency — not as a bug in the tool, and traced from the root down.

## Related applications <!-- kb:card:9ba28e -->
What other techniques share the same forward-reachability-from-roots idea?
?
Tree-shaking in JS bundlers, mark-and-sweep garbage collection tracing live objects from GC roots, and dead-code checkers in other language ecosystems.
