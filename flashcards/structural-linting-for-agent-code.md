---
tags: [flashcards, agents, code-quality, static-analysis, domain/software-engineering, maturity/emerging, source-type/practitioner]
sr-due: 2026-08-24
sr-interval: 1
sr-ease: 250
---

# Structural linting for agent-written code — Flashcards

#flashcards/agents

## Structural linting: definition <!-- kb:card:f3f931 -->
What does structural linting match on, as opposed to a text-level linter?
?
The shape of a construct in the syntax tree (e.g. a function whose default parameter is a mutable literal), instead of characters, tokens, or formatting.

## Why agent code needs structural linting <!-- kb:card:248255 -->
Why is structural linting particularly valuable for agent-written code rather than human-written code?
?
Models rarely make typographic mistakes; instead they faithfully reproduce syntactically perfect, fluent patterns from training data that lack the caveat making them dangerous — a defect of shape, not spelling, that surface linters don't check for.

## Why these defects slip through <!-- kb:card:996c3e -->
Why do canonical structural defects (e.g. mutable default arguments, over-broad exception handlers) go undetected by existing tooling?
?
They pass linting, type checking, and often the tests, because the defect is a shape rather than a spelling and nothing in surface tooling looks at shapes.

## Turning a pattern into a permanent rule <!-- kb:card:a3d22f -->
What is the operational move that makes structural linting compound over time?
?
When the agent produces the same bad construct twice, encode it as a structural rule with its own tests wired into the commit gate and CI, so the correction becomes permanent and applies to every future agent and human.

## Where structural linting applies <!-- kb:card:c4c4d0 -->
What does structural linting require to be applicable to a language, and where does it run?
?
A parser to target for that language; it runs in the same commit and CI gates as ordinary linting.
