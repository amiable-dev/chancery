---
tags: [flashcards, security, prompt-injection, supply-chain, domain/security, maturity/emerging, source-type/practitioner]
sr-due: 2026-08-24
sr-interval: 1
sr-ease: 250
---

# Split-payload prompt injection — Flashcards

#flashcards/security

## Definition <!-- kb:card:ec9ea8 -->
What is split-payload prompt injection, and why does it defeat automated code review?
?
An attack that splits a malicious instruction into a bland-looking pointer (e.g., a repo convention file) and a payload placed in a channel the reviewer never parses (e.g., text rendered inside a referenced image) — so no single reviewed artifact is incriminating, and the exfiltration happens later, in an unrelated session.

## Ghostcommit mechanism <!-- kb:card:aa03dd -->
In the Ghostcommit demonstration, where did the pointer live and where did the actual exfiltration procedure live?
?
The pointer was a harmless-reading convention file asking the agent to derive a build constant from a referenced PNG; the actual procedure (read the environment file byte by byte, encode as ASCII integers) was rendered as text inside that PNG — invisible to text-diff review, and one widely used reviewer excludes PNGs from review by default.

## Why the exfil format evades scanners <!-- kb:card:dbdd81 -->
Why does encoding stolen secrets as integer sequences help the attack evade detection after the code merges?
?
Secret scanners match string patterns; a numeric sequence isn't credential-shaped, so it slips past scanning even though it decodes byte-for-byte into the original secret.

## Harness-dependence finding <!-- kb:card:6fca0b -->
What did testing across eleven tool-and-model combinations reveal about what actually determines whether the attack succeeds?
?
The outcome tracked the surrounding agent harness far more than the underlying model — identical Sonnet weights leaked the file under one agent and refused under another, showing the injection defense lives in the harness, not just the model.

## Prototype defense <!-- kb:card:9535c5 -->
What made the researchers' prototype defense effective, and what were its reported results?
?
It was multimodal by construction — invisible-character detection, code-shape analysis, and model passes over both convention text and embedded images — catching 49 of 50 attacks with no false positives on thirty benign pull requests, running on a small open model on a single 4GB GPU.
