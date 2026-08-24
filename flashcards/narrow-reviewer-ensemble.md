---
tags: [flashcards, code-review, agents, security, domain/security, maturity/emerging, source-type/vendor-doc]
sr-due: 2026-08-24
sr-interval: 1
sr-ease: 250
---

# Narrow reviewer ensembles — Flashcards

#flashcards/code-review

## Definition and rationale <!-- kb:card:f9a1ad -->
What is a narrow reviewer ensemble, and what is its rationale?
?
Replacing one broad code-review agent with several agents, each scoped to a single specific question in its own context window. The rationale is decorrelating blind spots, not parallelizing for throughput.

## Why splitting changes failure shape <!-- kb:card:a89a18 -->
Why does splitting one broad reviewer into several narrow ones change the shape of its failures?
?
A single reviewer dividing attention across many concerns applies one framing to all of them, so it misses the same issue class on every PR. Separately scoped reviewers, each with its own instructions and context, produce closer-to-independent errors, so the ensemble's coverage approaches the union of what each one catches.

## Defense against manipulated reviewers <!-- kb:card:a5a58b -->
How does a narrow reviewer ensemble defend against one reviewer being manipulated by adversarial content in the diff it reads?
?
The other reviewers are not reading that content under the same framing, so they can catch what the compromised or misled reviewer lets through.

## Precision mechanism <!-- kb:card:33b7b8 -->
What specific requirement made ensemble findings precise enough that developers kept reading them, and what result is credited to it?
?
Requiring each agent to write a proof that its finding is valid before reporting it. This is credited with raising the share of pull requests receiving substantive review comments from 16% to 54%.

## Cost as a coverage decision <!-- kb:card:325a03 -->
How does the cost model of a narrow reviewer ensemble affect review coverage decisions?
?
Costs are consumption-based and scale with code throughput, so coverage becomes an explicit budget decision rather than a free default.
