---
tags: [flashcards, data, analytics, architecture, domain/data, maturity/emerging, source-type/practitioner]
sr-due: 2026-08-24
sr-interval: 1
sr-ease: 250
---

# Semantic layer — Flashcards

#flashcards/data

## Definition <!-- kb:card:d465fb -->
What is a semantic layer?
?
A shared definition tier between raw data stores and their consumers (dashboards, APIs, agents) that holds metric formulas, joins, access rules and vocabulary in one place, so a term has exactly one computable meaning.

## How it compiles requests <!-- kb:card:169a74 -->
How does a semantic layer turn a consumer's request into a warehouse query?
?
Consumers request a named metric with dimensions and filters; the layer compiles that into the actual query, applying the joins and business rules the definition implies.

## What it prevents <!-- kb:card:e5806b -->
What failure mode does a semantic layer prevent?
?
Definition drift — business logic forking into ad-hoc tables, dashboard-local formulas and application code that are each correct on the day written but quietly diverge afterward.

## Why agentic access sharpens the need <!-- kb:card:4865c3 -->
Why does agent-driven text-to-SQL make the lack of a semantic layer more dangerous, not less?
?
A model translating a question into SQL can only use rules present in the schema; when the real definition (e.g. revenue recognition timing) lives outside the tables, it produces answers that are confidently wrong and structurally plausible.

## Rollout cost and pitfall <!-- kb:card:9f626a -->
What is the cost of adopting a semantic layer, and what mistake reintroduces the problem it solves?
?
It requires upfront modelling work; rolling it out one domain at a time is recommended, because enterprise-wide rollouts tend to leave legacy reports running in parallel, recreating the inconsistency the layer was meant to remove.
