---
tags: [flashcards, metrics, ai-assisted-development, delivery, domain/software-engineering, maturity/emerging, source-type/practitioner]
sr-due: 2026-08-24
sr-interval: 1
sr-ease: 250
---

# First-pass acceptance as a productivity measure — Flashcards

#flashcards/metrics

## Definition <!-- kb:card:0901a6 -->
What does first-pass acceptance measure, and what is it proposed to replace?
?
How often an agent's output is usable with minimal rework. It is proposed as the leading indicator to replace coding-throughput counts (lines generated, PRs opened, tasks completed).

## Why throughput metrics fail <!-- kb:card:942be5 -->
Why does measuring coding throughput (LOC, PR count) become misleading in AI-assisted workflows?
?
Generated volume is now the cheap step, not the constraint; throughput metrics rise precisely when a tool produces more material someone else must fix, rewarding the behaviour they were meant to detect.

## How acceptance is actually improved <!-- kb:card:318d53 -->
Through what kinds of actions can a team raise its first-pass acceptance rate?
?
Sharper specifications, better priming documents and shared instructions, more design conversation before generation, and narrower tasks — actions the team actually controls.

## Link to delivery outcomes <!-- kb:card:4b3159 -->
How does poor first-pass acceptance show up in established delivery metrics?
?
Low acceptance raises change failure rate, and the repeated iteration cycles it causes extend lead time.

## Measurement-level caution <!-- kb:card:4a5a83 -->
At what organizational level should first-pass acceptance be tracked, and why?
?
At team level, not individual level — measuring it per-individual would recreate the same incentive distortion that broke throughput metrics.
