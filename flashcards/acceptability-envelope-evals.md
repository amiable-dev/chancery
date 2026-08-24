---
tags: [flashcards, llm, evaluation, testing, domain/llm, maturity/emerging, source-type/practitioner]
sr-due: 2026-08-24
sr-interval: 1
sr-ease: 250
---

# Acceptability-envelope evals — Flashcards

#flashcards/llm

## Acceptability envelope: definition <!-- kb:card:50d2ea -->
In the acceptability-envelope framing of GenAI evaluation, what replaces the single 'expected output' a deterministic unit test asserts against?
?
An envelope of possible outputs acceptable to the target users — the eval asserts properties an output must exhibit, not a value it must equal.

## Three load-bearing terms <!-- kb:card:954235 -->
What are the three load-bearing terms in the acceptability-envelope proposal, and what does each mean?
?
Envelope (required properties, since acceptable answers often can't be enumerated), acceptability (a judgment, not an equality check), and target users (whose identity and context decide which properties matter).

## Property hierarchy follows the audience <!-- kb:card:2d811c -->
What determines which properties (technical quality, prompt alignment, harm potential, commercial safety, etc.) matter for a given eval?
?
The target users' identity and context — the property hierarchy follows the audience, and each top property decomposes into sub-properties like artifact rates or physical accuracy.

## Test set curation strategy <!-- kb:card:b187c2 -->
How should a test set be curated under the acceptability-envelope approach, given the input space is infinite?
?
Sample where the target audience actually operates, weighted toward likely usage, while also probing the outer limits for emergent capability and risk — not the full infinite input space.

## Signal aggregation, not pass/fail <!-- kb:card:5dce7e -->
How do individual acceptability-envelope checks combine into a signal used for shipping decisions?
?
Individual checks are neither deterministic nor pass/fail; aggregated over a test set with confidence bounds, they become the quantitative signal that tracks progress and gates shipping.
