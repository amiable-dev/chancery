---
tags: [flashcards, security, developer-experience, tooling, design-principles]
sr-due: 2026-06-07
sr-interval: 1
sr-ease: 250
---

# Remediation-First Security Tooling — Flashcards

#flashcards/security

## Definition <!-- kb:card:66f5bd -->
What is remediation-first security tooling?
?
A design philosophy where a vulnerability scanner's primary output for each finding is a validated, actionable fix command — not just a CVE ID or severity score. The tool computes and validates the specific package-manager command needed to resolve the vulnerability in your current dependency graph, so a developer can act immediately without research overhead.

## Contrast <!-- kb:card:a93af3 -->
What is the traditional "detection-and-report" approach, and what are its two failure modes?
?
Traditional approach: find the vulnerability, report its CVE ID and severity, leave remediation to the developer.
Failure mode 1 — Alert fatigue: developers receive lists of CVE IDs with no clear action and eventually stop engaging.
Failure mode 2 — Research overhead: deriving the correct fix for a specific lockfile/package manager requires manual graph traversal that's error-prone and time-consuming.

## Application <!-- kb:card:df0a9d -->
What makes a remediation command "validated" vs just templated?
?
A validated fix command is computed, not templated. The tool resolves whether the parent package's semver constraint allows a version that includes the fix, simulates the resolution, and confirms the vulnerable package would actually be replaced. If the semver range doesn't permit a fix, the tool escalates to a major upgrade recommendation or explicitly states "no fix available" — rather than generating a command that looks right but won't work.

## Design Principles <!-- kb:card:595525 -->
Name three design principles of remediation-first tools.
?
1. Every finding has a recommended action ("no fix available" is valid, but must be stated explicitly — not implied by omission)
2. Actions are package-manager-native (npm/pnpm/yarn/bun get their own native commands, not generic instructions)
3. Confidence levels are explicit — "confident fix," "breaking change required," and "no fix available" are communicated differently

## Relationship <!-- kb:card:8367f3 -->
Why does remediation-first tooling address alert fatigue, and how does reachability analysis amplify the effect?
?
Alert fatigue is caused by alerts with no clear path forward — not by alert volume per se. When every alert comes with a validated fix, the cost of acting drops to near zero. Reachability analysis amplifies this by eliminating alerts for packages that aren't imported — so the remaining alerts are both actionable (have a fix) and relevant (the code is actually reachable). The combination makes it rational to act on every alert.
