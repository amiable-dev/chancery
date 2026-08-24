---
tags: [flashcards, platform-engineering, ai-agents, reliability, domain/infrastructure, maturity/emerging, source-type/vendor-doc]
sr-due: 2026-08-24
sr-interval: 1
sr-ease: 250
---

# Per-product agent runtime isolation — Flashcards

#flashcards/platform-engineering

## Definition <!-- kb:card:99960a -->
What is per-product agent runtime isolation?
?
Running each AI product on its own dedicated agent-runtime stack (own server process, database, cache) instead of one centralized runtime shared across the organization, so each squad owns the latency, cost, and incident response for its own agents.

## Organisational rationale <!-- kb:card:3ebaba -->
What is the organisational rationale for giving each squad its own agent runtime?
?
You-build-it-you-run-it: a squad's accountability for the latency, cost, and pager duty of its agents is only credible if the squad actually controls the runtime it built on.

## Blast-radius rationale <!-- kb:card:79fdd4 -->
What is the blast-radius rationale for per-product runtime isolation?
?
A shared central agent runtime is a systemic single point of failure — one bad deploy or one resource-hungry agent degrades every agent in the company at once. Per-product stacks confine an incident to a single use case.

## What prevents N snowflakes <!-- kb:card:5f79b4 -->
What stops per-product runtime isolation from turning into N different snowflake configurations?
?
Every product starts from the same templated runtime configuration — allow-listed base image, corporate certificate bundle, standard routes. Isolation without that shared template just multiplies drift.

## The admitted cost <!-- kb:card:b87ab0 -->
What cost does the team openly admit comes with running per-product agent runtimes?
?
More infrastructure to operate and more upgrades to coordinate (more charts to upgrade, more versions to pin) — named as their next, still-unsolved investment area.
