---
tags: [flashcards, provenance, agents, data, domain/standards, maturity/emerging, source-type/vendor-doc]
sr-due: 2026-08-24
sr-interval: 1
sr-ease: 250
---

# Attested computation — Flashcards

#flashcards/provenance

## Definition: attested computation <!-- kb:card:db6eb6 -->
What is an attested computation, and what does it let a consumer confirm?
?
A document carrying not just what a value means but the sanctioned way to produce it — runtime, typed parameters, the computation, an executor-plus-receipt, and a deterministic checker — so a consumer can mechanically confirm a shown number came from running the blessed computation, not something an agent improvised.

## Mechanism: parameter-only agent surface <!-- kb:card:effbe8 -->
What is the agent allowed to supply in an attested computation, and how does that turn verification into a string comparison?
?
Only values for declared parameters — it must never author or edit the computation itself; the checker re-derives the same binding and compares it against the actual expanded, compiled artifact the receipt carries, so a rewritten query or swapped file simply fails to match.

## Fidelity: re-read, not agent-reported <!-- kb:card:552541 -->
How is fidelity established for the value an agent displays, and what gap does this close?
?
The displayed value is re-read from the receipt's authoritative source by job identifier, not taken from the agent's own text — closing the gap where a correct run is reported alongside an incorrect number.

## Verification vs. attestation <!-- kb:card:baf0e8 -->
How do verification and attestation differ in this pattern, and why are both required?
?
Verification confirms a definition still matches policy (document-level, slow, stored); attestation confirms one run produced its value legitimately (per-call, runtime, never stored) — so a stale definition can still attest cleanly, and a freshly verified definition still needs attestation on every run.

## Why trust state is per computation <!-- kb:card:a0973b -->
Why is each computation its own document, with its own trust state?
?
Because the runtime gives parameters their meaning, one computation can back many consumers, and trust is per computation — revenue, profit and margin, for instance, each expire and attest independently.
