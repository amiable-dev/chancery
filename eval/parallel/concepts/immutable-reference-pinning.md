---
title: Immutable reference pinning against mutable-name substitution
aliases:
  - SHA pinning
  - Commit-SHA pinning
  - Content-addressed pinning
date: 2026-08-24
tags:
  - concept
  - security
  - supply-chain
  - ci-cd
status: draft
sources:
  - url: https://docs.github.com/en/actions/reference/security/secure-use
    hash: sha256:31daa96f5d8355bc4207e3888958095e9ce8d5e28d1471347cb0c8ca31cce988
    retrieved: 2026-08-24
    reachability: ok
---

# Immutable reference pinning against mutable-name substitution

## Definition

Immutable reference pinning is the practice of making a dependency, action, or plugin source resolve to an exact, content-addressed identifier — a full commit SHA rather than a branch or version tag — so that the content actually consumed cannot change without the pin itself changing, closing the gap that a mutable name such as a tag or branch leaves open: anyone who can push to the upstream repository can repoint that name at different content at any time, silently and after the fact, without the consumer's pin ever being touched.

## Explanation

GitHub's own guidance for third-party Actions states that pinning to a full-length commit SHA is currently the only way to use an action as an immutable release, and grounds this in a concrete mechanism: forging a backdoored action behind an existing SHA would require generating a SHA-1 collision for a valid Git object payload, not merely gaining push access to a repository. This matters disproportionately in CI because a compromised action in a workflow inherits access to every secret configured on the repository and can write back through the workflow's own token, so a single repointed dependency is not a contained failure. The practice carries one sharp caveat: a pin is only as good as its provenance, and a SHA copied from a fork or a compromised mirror pins just as confidently to the wrong content, so the SHA must be verified against the genuine upstream repository before it is trusted. Pinning to a tag remains acceptable, but only as a deliberate trade for convenience against a specific, trusted creator — because for as long as a reference is a name rather than a hash, whoever controls the upstream repository can move it. None of this is specific to GitHub Actions: the same discipline is why container images are referenced by an @sha256 digest instead of a floating :latest tag, why Go's go.sum locks a module to a specific content hash, and why Nix's store paths are content-addressed by construction — each ecosystem independently arrived at content-hash pinning as the answer to the same underlying problem, a name that can be silently redefined after you have already decided to trust it.

## Key Properties

- A full commit SHA (or equivalent content hash) is the only reference type that cannot be silently repointed to different content after the fact — a tag or branch name can be moved by anyone with push access to the upstream repository
- Pinning defends against a specific attack: a trusted-looking, previously-reviewed dependency being swapped for malicious content without the consumer's own configuration ever changing
- A pin is only as trustworthy as its provenance — a correct-looking SHA copied from a fork or a compromised mirror pins to the wrong content just as confidently as one from the real upstream
- The same discipline generalizes beyond one platform: content-addressed digests (Docker's @sha256, Go's go.sum, Nix's store paths) are all the same answer to the same problem in different ecosystems

## Relationships

- [[unsandboxed-extension-marketplace-defenses]] — addresses a different point in the same supply chain — that concept catalogs what a marketplace does to vet what it distributes, while this one is what a consumer does to keep receiving exactly the content they already vetted, regardless of what the marketplace allows
- [[exposure-first-supply-chain-defense]] — is a sibling CI/CD supply-chain hardening practice defending against a different specific threat — that concept closes the credential-theft path through install hooks and long-lived tokens, this one closes the silent-substitution path through a repointable dependency reference

## Applications

Pin any dependency, CI action, or plugin source that cannot be personally re-reviewed on every use to its full content hash rather than a mutable tag or branch, verify that hash was taken from the genuine upstream repository rather than a fork, and reserve tag-based references for sources whose maintainers are trusted enough to accept that the content behind the tag can change without notice.

## Sources

- https://docs.github.com/en/actions/reference/security/secure-use

## See Also

- _None yet._
