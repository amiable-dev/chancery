---
tags: [flashcards, ai-agents, security, audit]
sr-due: 2026-07-26
sr-interval: 1
sr-ease: 250
---

# Evidence Receipt — Flashcards

#flashcards/ai-agents

## Definition <!-- kb:card:5cd68e -->
What is an evidence receipt?
?
A compact, structured, redacted record attached to an accepted change that lets a person reconstruct why the change was approved — containing task, actors, versions, changed assets, checks run, findings, approvals, provenance, and rollback status.

## Receipt vs Transcript <!-- kb:card:6f86b8 -->
How does an evidence receipt differ from a raw agent transcript?
?
A transcript is noisy, unstructured, and may contain secrets. A receipt is structured (fixed fields), redacted (secrets stripped), and decision-oriented — purpose-built to answer "why was this accepted?" rather than to be a general debugging log.

## Success Metric <!-- kb:card:2811d1 -->
What does Anthropic name as the real success metric for its AI-native SDLC pipeline?
?
An accepted, safe change with a reconstructable receipt — not lines of code generated, review comments left, or tasks started.

## Application <!-- kb:card:1e4f86 -->
Where should the fields of an evidence receipt come from in a pipeline design?
?
Each layer of separation-of-duties and risk-tiered review contributes a piece: the creating identity and task, deterministic check results, narrow AI reviewer claims, the human approver's identity/authority, and the deploying identity's provenance record.

## Relationship <!-- kb:card:457b22 -->
How does an evidence receipt relate to agent attestation standards?
?
Attestation is the cryptographic, machine-verifiable evolution of the same idea — binding a commit to signed proof of agent/model/authorizer identity — while a receipt is a structured but not necessarily cryptographically-signed record; receipts are a practical precursor to full attestation.
