---
tags: [flashcards, security, agents, software-process, domain/security, maturity/emerging, source-type/vendor-doc]
sr-due: 2026-08-24
sr-interval: 1
sr-ease: 250
---

# Risk-tiered control of agent-authored change — Flashcards

#flashcards/security

## Definition <!-- kb:card:0c95cd -->
What is risk-tiered agent change control, in one sentence?
?
A security design for pipelines where agents author changes faster than humans can review them: it enforces structural separation of duties across the change lifecycle and requires verifiable evidence for every accepted change.

## Four jobs, four identities <!-- kb:card:9013ad -->
What are the four jobs that must be held by four separate identities?
?
Create, check, authorize, and deploy — no single agent identity owns all four.

## Why a prompt is not a control <!-- kb:card:5f1e8c -->
Why can't an instruction in an agent's prompt serve as a security control?
?
No instruction can enforce branch protection, revoke a credential, prove which binary ran, or stop a deployment — only structural boundaries (absent credentials, protected environments, branch rules, an independent release identity) can.

## Layered checking by failure class <!-- kb:card:e967b4 -->
How does the design layer its checks across different kinds of failure?
?
Deterministic checks under pinned versions for machine-provable facts, narrow review agents for reasoning that needs cross-file context, and named humans for decisions with expensive consequences.

## Tiering by consequence, not size <!-- kb:card:147eff -->
What decides which gate a change must pass — its size or something else?
?
The consequence class of what it touches: a one-line authorization change outranks a 2,000-line generated test suite.

## Capability composition risk <!-- kb:card:268f86 -->
What is 'capability composition' and how is it addressed?
?
Two individually limited agents joined by a shared message channel forming a privileged path (e.g. a read-only incident agent asking a coding agent to ship a patch); addressed by signing inter-agent requests and checking sender authority, not just recipient permission.
