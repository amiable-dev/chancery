---
tags: [flashcards, ai-agents, software-maintenance, correctness, domain/software-engineering, maturity/emerging, source-type/practitioner]
sr-due: 2026-08-24
sr-interval: 1
sr-ease: 250
---

# Partitioned-edit consistency debt — Flashcards

#flashcards/ai-agents

## Definition <!-- kb:card:0bb19b -->
What is partitioned-edit consistency debt?
?
The residue left when a global change is executed as many independent local edits: each unit passes its own checks, but cross-unit invariants (type signatures, call contracts, shared schemas, naming conventions) are owned by no worker, so the aggregate lands locally valid but globally inconsistent.

## Why it happens <!-- kb:card:1dfc10 -->
Why does partitioning a change into independent units create this debt, rather than it being a sign of sloppy work?
?
It is structural: partitioning is what makes parallel work cheap, because each worker sees only its own unit — and that same narrowness makes any invariant spanning two or more units invisible to every worker.

## Worked example <!-- kb:card:5db5ba -->
In the reported case, a per-file type-tightening sweep hit a 100% fix rate on its lint backlog. What did it also produce?
?
61 downstream type errors in files the sweep never touched, because a signature tightened in one file broke a contract in its callers.

## Silent failure at the dashboard <!-- kb:card:43f6d3 -->
Why is a per-unit completion metric a bad signal for this kind of debt?
?
Per-unit success metrics stay green even when cross-unit invariants are broken, since only properties spanning two-plus units are affected — so a 'perfect' completion rate can coincide with exactly when the debt is largest.

## Mitigations and their cost <!-- kb:card:6a5302 -->
What do the three mitigations for partitioned-edit consistency debt have in common?
?
Each trades back some of the parallelism the partition bought: running a global check after the fan-out, partitioning along the invariant instead of the file, or reserving cross-boundary edit classes for a coordinating pass.
