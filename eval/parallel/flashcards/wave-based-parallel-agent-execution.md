---
tags: [flashcards, agents, software-process, parallelism, domain/software-engineering, maturity/emerging, source-type/vendor-doc]
sr-due: 2026-08-24
sr-interval: 1
sr-ease: 250
---

# Wave-based parallel agent execution — Flashcards

#flashcards/agents

## Wave-based execution: definition <!-- kb:card:ca5ba7 -->
What is wave-based parallel agent execution?
?
A concurrency-control discipline for running multiple coding agents at once: an epic is decomposed into stories that each declare exclusive ownership of a set of files; independent stories are grouped into a wave and each runs on its own branch; the next wave starts only after every PR in the current wave clears one shared review gate.

## Guaranteeing non-interference <!-- kb:card:86a791 -->
How does wave-based parallel agent execution prevent concurrent agents from interfering with each other's work?
?
By decomposition at plan time, not negotiation at merge time: each story declares exclusive ownership of its files, and the dependency graph groups only mutually independent stories into the same wave, each on its own branch.

## Fixed fields in a story <!-- kb:card:aaff38 -->
What fixed fields does each story specify in wave-based parallel agent execution?
?
The files it creates or modifies, interfaces it must satisfy, invariants it must not break, testable acceptance criteria, negative constraints (what it must not do), dependencies, and an exclusive file-ownership table.

## Why review batches at the wave <!-- kb:card:901d38 -->
Why is review done as one gate at the wave boundary rather than per pull request?
?
It gives the human a coherent increment to judge and a natural point to redirect before more work is built on unvalidated assumptions.

## Three self-correcting metrics <!-- kb:card:caa484 -->
In wave-based parallel agent execution, what does each of merge conflicts, first-pass acceptance rate, and escaped defects indict?
?
Merge conflicts indict the decomposition (should be zero), first-pass acceptance rate indicts specification quality, and escaped defects indict the review gate.

## Evidence behind the claim <!-- kb:card:c0f69b -->
What is the evidentiary basis for wave-based parallel agent execution, and what part of it remains untested?
?
Worked examples and one team's project history from a vendor-published starter template, not a controlled comparison. The mechanism and three metrics transfer regardless, but the production-readiness claim is unverified.
