---
tags: [flashcards, testing, quality, verification, domain/software-engineering, maturity/established, source-type/practitioner]
sr-due: 2026-08-24
sr-interval: 1
sr-ease: 250
---

# Mutation testing — Flashcards

#flashcards/testing

## Definition <!-- kb:card:8a059d -->
What does mutation testing measure, and how does that differ from code coverage?
?
Whether tests actually detect deliberate small code changes (mutants) — it measures verification. Coverage only measures execution: that a line ran, not that anything checked its result.

## The generate-and-kill loop <!-- kb:card:5da11a -->
How does mutation testing's core mechanism work?
?
For each mutable point, the tool creates a mutant with one small semantic edit (e.g. flip a comparison), reruns the test suite against it, and records whether a test fails (killed) or none does (survives).

## Catching perpetually green tests <!-- kb:card:4592d2 -->
What kind of broken test does mutation testing catch that coverage cannot?
?
'Perpetually green' tests that execute code but assert nothing meaningful, or that mock so thoroughly the code under test is no longer really exercised. They keep passing through refactors and logic inversions, but leave mutants alive.

## Cost trade-off <!-- kb:card:86c4e1 -->
Why is mutation testing typically applied only to core domain logic rather than a whole repository?
?
Cost scales with the number of mutants times the suite's runtime, since the whole test suite reruns once per mutant — too expensive to apply everywhere.

## Equivalent mutants <!-- kb:card:fdcfde -->
What is an equivalent mutant, and why does it complicate reading the mutation score?
?
A mutant whose edit can never change observable behavior, so no test can ever kill it. It survives despite being harmless, so a raw survivor count needs human judgement, not a literal read as uncaught defects.
