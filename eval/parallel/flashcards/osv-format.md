---
tags: [flashcards, security, supply-chain, standards, domain/security, maturity/established, source-type/practitioner]
sr-due: 2026-08-24
sr-interval: 1
sr-ease: 250
---

# OSV format — Flashcards

#flashcards/security

## Definition <!-- kb:card:dc050b -->
What is the OSV format, and what is its defining design choice?
?
A minimal JSON schema for describing open source vulnerabilities. Its defining choice is identifying affected code by git commit hashes or package-manager versions, rather than the looser product descriptions general vulnerability standards use.

## Why precision enables automation <!-- kb:card:142d8c -->
Why does pinning vulnerability ranges to commits or package versions matter for automation?
?
It lets both producing and consuming vulnerability advisories be automated with little human interpretation, unlike prose-based product-range descriptions.

## Origin and adoption <!-- kb:card:415a1e -->
Where did the OSV format originate, and how widely is it adopted?
?
It grew out of communicating OSS-Fuzz findings and became an OpenSSF project (announced 2021). It's adopted across 18+ ecosystems — including GitHub Security Advisories, Rust, Go, Python, and Linux distributions — and aggregated at osv.dev.

## Distributed maintenance <!-- kb:card:310589 -->
What distributed maintenance model does OSV's precision enable for GitHub's advisory database?
?
GitHub's advisory database accepts community pull-request edits submitted directly in OSV form.

## Influence on CVE 5.0 <!-- kb:card:8e1e03 -->
What evidence suggests OSV's version-range design solved a real gap in prior standards?
?
Its affected-version-range schema directly informed the design of CVE 5.0, the successor to the incumbent CVE standard.
