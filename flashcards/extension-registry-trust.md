---
tags: [flashcards, security, supply-chain, extensibility, domain/security, maturity/emerging, source-type/practitioner]
sr-due: 2026-08-24
sr-interval: 1
sr-ease: 250
---

# Extension registry trust model — Flashcards

#flashcards/security

## Definition <!-- kb:card:f406fb -->
What is the extension registry trust model?
?
The set of guarantees a distribution channel must supply when its extensions execute arbitrary code unsandboxed: provenance plus signing, untrusted-by-default with explicit opt-in, and curation of a small vetted set rather than open submission.

## What a signature actually proves <!-- kb:card:0a8ac6 -->
What does a code-signing signature establish, and what does it not establish?
?
It binds an artifact to an identity, enabling attribution and revocation after the fact; it makes no claim about the artifact's behavior or safety.

## Why compromise is total <!-- kb:card:cc273d -->
Why is a compromised unsandboxed extension a total compromise rather than a partial one?
?
An extension that can execute arbitrary commands and make session-aware HTTP requests inherits the full authority and network access of the host process it runs in.

## Why takedown doesn't help <!-- kb:card:ff0e36 -->
Why don't reputation and takedown mechanisms work as a defense against unsandboxed extension compromise?
?
They are remedies that operate after code has already run; against a total compromise, a takedown is only a post-mortem.

## The trade-off accepted <!-- kb:card:5b84c9 -->
What trade-off does the untrusted-by-default, curated posture accept compared to an open marketplace?
?
A smaller ecosystem in exchange for a bounded one: nothing is trusted until an operator explicitly enables it.
