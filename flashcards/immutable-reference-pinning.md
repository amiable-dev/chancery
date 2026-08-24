---
tags: [flashcards, security, supply-chain, ci-cd]
sr-due: 2026-08-24
sr-interval: 1
sr-ease: 250
---

# Immutable reference pinning against mutable-name substitution — Flashcards

#flashcards/security

## Definition <!-- kb:card:8dae31 -->
What is immutable reference pinning?
?
Making a dependency, action, or plugin source resolve to an exact, content-addressed identifier (a full commit SHA) instead of a mutable branch or tag name, so the content consumed cannot change without the pin itself changing.

## Why SHA beats a tag <!-- kb:card:097cd9 -->
Why can't a full commit SHA be silently repointed to different content, unlike a tag or branch?
?
Forging content behind an existing SHA would require generating a SHA-1 collision for a valid Git object payload, not merely gaining push access to the repository — which is all it takes to move a tag or branch.

## Stakes in CI <!-- kb:card:26d6e7 -->
Why does immutable pinning matter disproportionately in CI/CD?
?
A compromised action inherits access to every secret configured on the repository and can write back through the workflow's own token, so a single repointed dependency is not a contained failure.

## Provenance caveat <!-- kb:card:7c8508 -->
What is the sharp caveat to immutable reference pinning?
?
A pin is only as good as its provenance — a SHA copied from a fork or a compromised mirror pins just as confidently to the wrong content, so it must be verified against the genuine upstream repository before it's trusted.

## Cross-ecosystem pattern <!-- kb:card:3c1a72 -->
Name two ecosystems besides CI actions that independently arrived at the same content-hash pinning discipline.
?
Container images pinned by @sha256 digest instead of a floating :latest tag, and Go modules locked to a content hash via go.sum (Nix store paths are also content-addressed by construction).
