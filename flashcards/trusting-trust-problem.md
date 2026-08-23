---
tags: [flashcards, security]
sr-due: 2026-07-17
sr-interval: 1
sr-ease: 250
---

# Trusting Trust Problem — Flashcards

#flashcards/security

## Definition <!-- kb:card:6477ca -->
What is the Trusting Trust Problem?
?
The principle (from Ken Thompson's 1984 Turing Award lecture) that you cannot establish a system's trustworthiness by inspecting only what's directly in front of you — you must also trust everything used to build it, recursively, because a compromise can be inherited through the build chain without leaving any trace in the artefact's own visible source.

## Application <!-- kb:card:bf14bd -->
When would you invoke the Trusting Trust Problem in a security review?
?
When auditing a build pipeline (compilers, CI runners, base images, or AI training infrastructure) — instead of stopping at "does this tool's source look clean," ask "what built the thing that built this," since a compromise could live one or more levels back in the lineage.

## Relationship <!-- kb:card:ccfd2a -->
How does the Trusting Trust Problem relate to AI Model Black-Box Risk?
?
It's the foundational security principle that AI Model Black-Box Risk applies to modern AI training pipelines: a model's lineage (parent checkpoints, undisclosed fine-tuning, training data) can carry inherited behaviour the same way Thompson's backdoored compiler propagated itself into every future compiler build, invisibly.

## Historical Origin <!-- kb:card:6ef31f -->
What was the original 1984 demonstration behind this problem?
?
Ken Thompson described a modified C compiler that inserted a backdoor into the login program it compiled, and also inserted itself into any new compiler it compiled — so the backdoor propagated forward forever into every future build, even though the compiler's own visible source code showed no trace of it.
