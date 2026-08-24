---
title: Narrow reviewer ensembles
date: 2026-08-24
domain: security
maturity: emerging
source_type: vendor-doc
tags: [concept, code-review, agents, security, domain/security, maturity/emerging, source-type/vendor-doc]
status: draft
sources:
  - url: https://claude.com/blog/how-anthropic-secures-its-ai-native-software-development-lifecycle
    class: external-primary
---

# Narrow reviewer ensembles

## Definition

A **narrow reviewer ensemble** replaces one broad review agent with several, each scoped to a single specific question and running in its own context window. The rationale is decorrelation rather than throughput: separately scoped reviewers do not share a blind spot, a reviewer that is compromised or simply mistaken can be caught by another that never saw its framing, and attention is not spread thin across competing focus areas as it is inside one mega-prompt.

## Explanation

A single reviewer asked to check authorization, injection, secret handling and business logic at once divides finite attention among them and applies one framing to all of them, which makes its misses systematic — the same class of issue is missed on every pull request rather than randomly. Splitting the job changes the shape of that failure. Each reviewer carries its own instructions, its own retrieved context such as past incidents and adjacent code, and its own window, so their errors are closer to independent and the ensemble's coverage approaches the union of what they catch rather than the average. The security argument is separate from and stronger than the quality one: if one reviewer is manipulated by content inside the diff it is reading, the others are not reading that content under the same framing and can catch what it lets through. Precision comes from a second mechanism entirely — requiring each agent to write a proof that its finding is valid before reporting it, which the account credits with the confidence that let the share of pull requests receiving substantive review comments rise from 16% to 54%. Deterministic scanners run alongside and post to the same surface, on the reasoning that static and agentic analysis fail in different places. The economics are consumption-based, so cost rises with code throughput and coverage becomes an explicit budget decision instead of a default. This is a vendor's first-person account of its own practice: the 16-to-54% figure and the estimate that roughly a third of past incident-causing bugs would now be caught are self-reported, and the corroborating data points cited — another company auto-approving 19% of its pull requests, a CI-repair agent doubling task-to-pull-request conversion — are other vendors' blog posts rather than independent evaluation.

## Key Properties

- Each reviewer answers one narrow question inside its own context window
- The purpose is decorrelated blind spots, not parallel throughput
- A reviewer manipulated by content in the diff can be caught by peers that never read that framing
- Requiring a written proof of validity for each finding is what makes findings trustworthy enough to act on
- Cost is consumption-based and scales with code throughput, making coverage an explicit budget decision

## Relationships

- [[risk-tiered-agent-change-control]] — places these reviewers inside a wider gate structure, layering deterministic checks, narrow reviewers and named human approvers according to failure class
- [[comprehension-gate]] — keeps an obligation the ensemble cannot discharge, since a set of passing reviewers establishes that a change was checked and not that the accountable person understands it
- [[agent-loop-governance]] — supplies the controls that keep an ensemble honest over time, because a reviewer whose quality degrades produces silence rather than errors

## Applications

Decomposing an automated code-review step into separately scoped agents — authorization, secrets, injection, invariants — instead of one prompt covering everything; requiring each agent to justify a finding before it is posted, so the signal is precise enough that developers keep reading it.

## Sources

- https://claude.com/blog/how-anthropic-secures-its-ai-native-software-development-lifecycle

## See Also

- [[risk-tiered-agent-change-control]]
- [[comprehension-gate]]
- [[agent-loop-governance]]
