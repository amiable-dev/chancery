---
tags: [flashcards, ai-agents, evaluation, optimization, domain/ai-agents, maturity/emerging, source-type/practitioner]
sr-due: 2026-08-24
sr-interval: 1
sr-ease: 250
---

# Fitness-driven agent tuning — Flashcards

#flashcards/ai-agents

## Definition <!-- kb:card:140ffe -->
What does fitness-driven agent tuning replace, and with what mechanism?
?
It replaces hand-tuning an agent's heuristic constants with a measured race: parameters move to external config, a scalar fitness function scores the agent's end state, many variants run at once, and the ranking decides.

## Required infrastructure <!-- kb:card:2ab3f9 -->
What four pieces of infrastructure must be in place before fitness-driven tuning is possible?
?
Headless runs cheap enough to repeat (~100x real time), structured JSON fitness output instead of terminal text, parameters injected from outside the code, and one subprocess per variant so runs cannot contaminate each other.

## The hard part is the fitness function <!-- kb:card:dfd5af -->
What is the hardest part of fitness-driven agent tuning, and what goes wrong with a badly weighted fitness function?
?
Defining the fitness function, not the parallelism. Over-weighting a progress counter invites degenerate strategies that increment it without real progress; over-penalizing a failure counter teaches the agent to avoid the situations that produce it.

## Why manual debugging still matters <!-- kb:card:10bc04 -->
Why does manual watch-and-tweak debugging remain necessary even though search can tune constants automatically?
?
The fitness function's vocabulary — which counters are worth scoring at all — is the residue of that manual phase, so it is the prerequisite that makes automated search possible; humans are still needed to notice a missing capability.

## What generalizes from the source <!-- kb:card:24d5ab -->
From the practitioner write-up this concept is based on, what transfers to other projects and what does not?
?
The recipe and its four preconditions transfer; the specific timings and the winning parameter value (e.g. the halved cooldown constant) do not — they came from one person on one game.
