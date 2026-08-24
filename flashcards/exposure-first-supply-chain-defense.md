---
tags: [flashcards, security, supply-chain, ci-cd, domain/security, maturity/emerging, source-type/vendor-doc]
sr-due: 2026-08-24
sr-interval: 1
sr-ease: 250
---

# Exposure-first supply chain defense — Flashcards

#flashcards/security

## Definition <!-- kb:card:0d3391 -->
What is exposure-first supply chain defense?
?
The argument that supply chain attacks harvest privileged developer credentials from build pipelines, and since execution-layer detection can't see this happen, the effective control is removing the enabling conditions (long-lived tokens, unpinned dependencies, install lifecycle hooks, over-privileged runners) rather than detecting the payload.

## Why detection is structurally late <!-- kb:card:b14d95 -->
Name the three properties that make execution-layer detection structurally late against CI/CD credential theft.
?
It is out of reach (no agent presence on ephemeral CI runners), too fast (steal-and-self-destruct completes before human triage), and fires on the wrong event (the payload executing, not the misconfiguration that enabled it).

## What's actually stolen <!-- kb:card:de075a -->
What is the actual asset being stolen in a modern software supply chain attack, according to this argument?
?
The privileged developer credential (API keys, cloud tokens, package-registry secrets); the compromised package is just the delivery mechanism.

## Concrete remedies <!-- kb:card:df5d22 -->
What are the two concrete remedies this argument recommends for CI/CD pipelines?
?
Disable package install-time lifecycle hooks (and audit lockfiles), and replace long-lived automation tokens with short-lived OIDC-issued credentials.

## Economic division of labor <!-- kb:card:3a84be -->
How does the source describe the attacker ecosystem behind the March 2026 incident cluster?
?
As specialized roles trading the same commodity: some actors do bulk credential harvesting via compromised dev/scanning tools, others do state-sponsored weaponization through popular packages, others do high-volume opportunistic theft via editor extensions.
