---
tags: [flashcards, security, agents, verification, domain/security, maturity/emerging, source-type/vendor-doc]
sr-due: 2026-08-24
sr-interval: 1
sr-ease: 250
---

# Self-falsification as a finding filter — Flashcards

#flashcards/security

## Definition <!-- kb:card:b1b2eb -->
What is self-falsification as a finding filter?
?
A structured second pass whose objective is to try to disprove a candidate finding — locating the flawed assumption or blocking control — and discarding any finding that survives only on unsupported assumptions.

## Why it must be a separate stage <!-- kb:card:708b78 -->
Why must falsification run as a separate stage rather than just asking the original process "is this real?"
?
A process that produced the finding will defend a conclusion it's already committed to; a separate stage changes the question from confirming the finding to actively refuting it.

## Blockers it enumerates <!-- kb:card:8b3f91 -->
What kinds of blockers does the falsification pass explicitly enumerate?
?
Upstream input validation, an authorization check between entry and sink, a type coercion that neutralizes the payload, and unverified deployment assumptions.

## Disposal rule <!-- kb:card:67f826 -->
What happens to a finding that rests on an unsupported assumption — is it flagged or removed?
?
It is discarded outright, not annotated with a caveat and forwarded.

## Precision/miss trade-off <!-- kb:card:29289e -->
What trade-off does this filter make, and when is that trade-off the right call?
?
It buys precision at the cost of accepting some misses — right when the consumer's scarce resource is attention (a noisy backlog goes unread), wrong when a miss is catastrophic and reviewers are plentiful.
