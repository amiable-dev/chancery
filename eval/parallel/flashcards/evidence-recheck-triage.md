---
tags: [flashcards, agents, security, verification, domain/security, maturity/emerging, source-type/practitioner]
sr-due: 2026-08-24
sr-interval: 1
sr-ease: 250
---

# Triage as a separate evidence pass — Flashcards

#flashcards/agents

## Definition <!-- kb:card:74dcea -->
What is triage as a separate evidence pass?
?
The discipline of never letting the process that generates candidate findings also decide which of them are real: a distinct later pass re-checks each candidate against the evidence it cited.

## Why generation can't self-verify <!-- kb:card:f6769c -->
Why must finding-generation and finding-verification be separate passes rather than one step?
?
They are rewarded for opposite things: generation is rewarded for coverage and accepts thin reasoning to reach a candidate, while verification gains nothing from a candidate surviving, so combining them risks the same reasoning grading its own claim.

## De-duplication rule <!-- kb:card:66dba2 -->
What is the de-duplication rule in evidence-recheck triage, and why is it conservative?
?
Merge only demonstrable copies of the same issue; the pass never makes a keep-or-kill call on borderline findings.

## Uncertainty rule <!-- kb:card:1313c6 -->
What happens to a finding the triage pass is unsure about?
?
It is downgraded in confidence and still shown to the operator as a low-confidence entry, never silently dropped.

## Chosen failure direction <!-- kb:card:95626e -->
Which error does evidence-recheck triage deliberately favor, and why?
?
A noisier report over an invisible false negative, because a missed vulnerability is invisible while a false positive is merely irritating.
