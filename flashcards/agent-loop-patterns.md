---
tags: [flashcards, ai-agents, design-patterns, architecture, domain/ai-agents, maturity/emerging, source-type/practitioner]
sr-due: 2026-08-24
sr-interval: 1
sr-ease: 250
---

# Agent loop patterns — Flashcards

#flashcards/ai-agents

## The four agent loop patterns <!-- kb:card:d56ee9 -->
What are the four recurring shapes an agentic loop takes?
?
Retry, plan-execute-verify, explore-narrow, and human-in-the-loop — each fitted to a different kind of task and each with its own characteristic failure.

## Retry loop: fit and failure <!-- kb:card:341117 -->
What task fits a retry loop, and how does it characteristically fail?
?
Short atomic tasks with a clean pass-or-fail line; it fails by repeating the same broken approach indefinitely without an explicit variation or escalation rule.

## Plan-execute-verify: fit and failure <!-- kb:card:6162ff -->
What task fits plan-execute-verify, and how does it characteristically fail?
?
Multi-step work where order matters and an early mistake compounds; it fails by over-committing to a plan that turns out wrong partway through, unless it can revise the plan.

## Explore-narrow: fit and failure <!-- kb:card:b816a5 -->
What task fits explore-narrow, and how does it characteristically fail?
?
Genuinely unfamiliar territory; it fails on cost, since running several approaches in parallel consumes context and tokens, so early aggressive pruning matters most here.

## Human-in-the-loop: fit and failure <!-- kb:card:f0aae8 -->
What task fits human-in-the-loop, and how does it characteristically fail?
?
Anything whose wrong assumption is expensive to unwind; it fails by interrupting so often that the person saves no time by having an agent involved.

## Why human-in-the-loop is first-class <!-- kb:card:718b0a -->
Why does this taxonomy treat human-in-the-loop as a first-class pattern rather than a fallback?
?
It makes the interruption points a deliberate design decision chosen for stakes, instead of the thing that happens when the automation simply gives up.
