---
tags: [flashcards, ai-agents, security, code-review]
sr-due: 2026-07-26
sr-interval: 1
sr-ease: 250
---

# Risk-Tiered Code Review — Flashcards

#flashcards/ai-agents

## Definition <!-- kb:card:d91ef8 -->
What is risk-tiered code review?
?
A code-review architecture that assigns the type and number of required checks to a change based on assessed risk (what it touches) rather than uniform treatment, layering deterministic checks, narrow AI reviewers, and human approval — each catching a different failure class.

## Three Layers <!-- kb:card:39c0db -->
What are the three review layers in risk-tiered code review, and what does each catch?
?
Deterministic checks (provable facts: compile, tests, secret scans), narrow AI reviewers (contextual reasoning scoped to one question), and human approval (high-impact, accountable decisions). Each catches a distinct failure class the others miss.

## Key Statistic <!-- kb:card:c1778e -->
What happened when Anthropic required automated reviewers to prove their findings rather than just flag them?
?
The share of pull requests receiving substantive review comments rose from 16% to 54%.

## Application <!-- kb:card:90d1bf -->
Why is diff size a poor proxy for risk tier assignment?
?
Because a one-line authorization bug in a billing path can be far more dangerous than a 2,000-line generated test suite; risk tiers should be based on what the code touches (auth, payments, infra, tenant isolation) not how many lines changed.

## Relationship <!-- kb:card:1bfff7 -->
How does risk-tiered code review relate to separation of duties in the agentic SDLC?
?
Risk-tiered review implements the "checking" job of separation of duties — it defines *how* the checking job is actually carried out, once the identity boundary for who performs it is established.
