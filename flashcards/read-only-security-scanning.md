---
tags: [flashcards, read-only-security-scanning, security, supply-chain, design-principles]
sr-due: 2026-05-25
sr-interval: 1
sr-ease: 250
---

# Read-Only Security Scanning — Flashcards

#flashcards/security

## Definition <!-- kb:card:439bb9 -->
What is Read-Only Security Scanning?
?
A design principle for security tools that restricts the scanner to passively reading on-disk metadata and structured data files — never invoking package managers, executing install scripts, or lifecycle hooks — specifically to avoid triggering the class of attack the scanner is designed to detect.

## Core Risk <!-- kb:card:4e4eea -->
Why is it dangerous for a supply-chain scanner to call `npm ls` or `pip show`?
?
npm's `postinstall` scripts execute automatically when npm is invoked. If a malicious package has a `postinstall` hook, running `npm ls` re-triggers that hook — the scanner becomes the attack vector. Read-only scanning avoids this by never invoking the package manager binary at all.

## Alternative Sources <!-- kb:card:35979e -->
Instead of calling `npm ls`, what does a read-only scanner read?
?
It parses `package-lock.json`, `pnpm-lock.yaml`, `node_modules/.package-lock.json`, and other lockfiles/metadata files that the package manager writes at install time. These reflect the installed state without requiring any binary invocation.

## Confidence Trade-off <!-- kb:card:4f4fed -->
What's the downside of reading metadata files instead of querying package managers?
?
Some version information may be partial or inferred. A read-only scanner must explicitly model this uncertainty with confidence levels (high/medium/low), so responders know which findings are definitive and which need manual verification.

## Broader Principle <!-- kb:card:76ddb0 -->
What broader security principle does read-only scanning embody?
?
When auditing a potentially-compromised environment, the auditing tool must not trust the system it's auditing. Invoking system commands grants trust to the ecosystem's execution model. Reading files doesn't. This is analogous to "don't run untrusted code" — but applied to the security tool itself.

## When It Matters <!-- kb:card:3431f3 -->
In what scenario is read-only scanning most critical?
?
Active incident response — when scanning a machine that may already be compromised. Running installed binaries could compound the compromise or destroy forensic evidence. A read-only file scan can be run safely even on a suspected-compromised host.
