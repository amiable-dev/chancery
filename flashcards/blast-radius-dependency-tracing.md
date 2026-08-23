---
sr-due: 2026-04-14
sr-ease: 250
sr-interval: 1
tags:
- flashcards
- blast-radius
- dependency-analysis
- impact-analysis
---


# Blast-Radius Dependency Tracing — Flashcards

#flashcards/blast-radius


## Definition <!-- kb:card:2423df -->
What is blast-radius dependency tracing?
?
A static impact analysis technique that traverses a codebase's dependency graph from a set of changed entities to compute the full set of callers, dependent modules, and associated tests that could be affected by the change — analogous to the radius of potential damage from an explosion.

## Algorithm <!-- kb:card:75c47f -->
Describe the blast-radius tracing algorithm.
?
Starting from changed entities, perform a BFS/DFS over the dependency graph: find direct dependents via call and import edges, add them to the impact set, then recursively find their dependents. Continue until no new nodes are added. Collect all test files referencing any node in the impact set.

## Trade-off <!-- kb:card:284b38 -->
Why is blast-radius analysis biased toward over-inclusion (false positives)?
?
A false negative (missing an affected file) could cause a reviewer to miss a breaking change. A false positive (including an unaffected file) wastes only a few tokens. Better to flag too many files than to miss a broken dependency.

## Performance <!-- kb:card:c67b1b -->
What token reduction does blast-radius tracing achieve in code-review-graph benchmarks?
?
8.2× average reduction compared to naive full-repo reading (13 commits across 6 OSS repos). In monorepo scenarios with large codebases, reductions up to 49× have been observed. Recall is 100% — no impacted file is missed.

## Application <!-- kb:card:eda73d -->
How could blast-radius tracing benefit AI council code reviews?
?
Before sending a PR to reviewing LLMs, query the blast radius to get the minimal context set. Instead of attaching entire repo files, attach only the blast-radius scope. With 4 high-tier models running in parallel, an 8× token reduction translates directly to cost savings.
