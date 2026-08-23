---
tags: [flashcards, security]
sr-due: 2026-07-21
sr-interval: 1
sr-ease: 250
---

# Attacker-First Forward Analysis — Flashcards

#flashcards/security

## Definition <!-- kb:card:2803ca -->
What is attacker-first forward analysis?
?
A vulnerability-discovery strategy that starts at attacker-accessible entry points (APIs, uploads, network messages) and reasons forward through the code to see if an attacker can actually reach and exploit a dangerous operation — the inverse of sink-first backward analysis.

## Contrast <!-- kb:card:26b7b0 -->
How does attacker-first forward analysis differ from the conventional "sink-first" approach used by most SAST tools?
?
Sink-first starts at a dangerous code pattern and searches backward for a hypothetical attacker-controlled source, which produces plausible-but-unconfirmed paths and false positives. Attacker-first starts at the real entry point and traces forward, producing an evidence-shaped path from input to impact rather than an inferred hypothesis.

## Application <!-- kb:card:29283d -->
Why does attacker-first forward analysis benefit from agent-grade reasoning rather than a purely mechanical taint-tracking engine?
?
Because distinguishing "a path exists to the sink" from "the path is actually exploitable" requires semantic judgment about whether intervening controls (validation, auth checks) truly block the attack — reasoning that a fixed rule engine can't reliably perform, but an LLM agent tracing the path can.

## Relationship <!-- kb:card:c3ab32 -->
How does attacker-first forward analysis relate to the Falsification Engine / adversarial self-falsification pattern in VulnHunter?
?
Forward analysis produces the candidate vulnerability by tracing an attacker-accessible path to a dangerous sink; adversarial self-falsification is the next pipeline stage that tries to disprove that candidate before it's reported, filtering out paths that rely on unsupported assumptions.
