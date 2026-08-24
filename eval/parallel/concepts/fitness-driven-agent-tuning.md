---
title: Fitness-driven agent tuning
date: 2026-08-24
domain: ai-agents
maturity: emerging
source_type: practitioner
tags: [concept, ai-agents, evaluation, optimization, domain/ai-agents, maturity/emerging, source-type/practitioner]
status: draft
sources:
  - url: https://briandouglas.me/posts/2026/03/10/what-i-learned-running-10-pokemon-bots-in-36-seconds/
    class: external-primary
---

# Fitness-driven agent tuning

## Definition

**Fitness-driven agent tuning** replaces hand-tuning an agent's heuristic constants with a measured race: the tunable parameters are lifted out of the code into an external configuration, a scalar fitness function is defined over the agent's end state, many parameter variants run at once in isolated subprocesses, and the ranking decides. It applies only once the heuristics already exist — human observation remains the only way to notice that a capability is missing — and it is gated on the agent running headless fast enough that a full run costs seconds, so an entire population finishes in the time a single supervised run used to take.

## Explanation

Four pieces of infrastructure make the substitution possible, and each is load-bearing: the agent runs headless at roughly a hundred times real time, so one run to a checkpoint costs about five seconds; every run emits a structured fitness record as JSON — turns taken, sub-goals reached, final position, failure counters — instead of terminal output a human has to squint at; the tunable parameters are read from the environment rather than compiled in, so a driver process can set them per run; and each variant executes in its own subprocess so runs cannot contaminate each other. With those in place, ten variants finish in about eleven seconds and return a ranked table rather than an anecdote. The concrete payoff in the source was a cooldown constant chosen by intuition during earlier debugging — eight units, because eight seemed like enough — which a half-size value beat consistently across ten independent runs, converting a guess into a measurement. The hard part is not the parallelism but the fitness function: running agents is easy, defining good is not. Weighting a progress counter alone invites degenerate strategies that increment it without real progress, and over-penalising a failure counter teaches the agent to avoid the situations that produce it, so the weights are themselves parameters and tuning them is a meta-problem. The decisive observation is that the fitness function's vocabulary — which counters are worth scoring at all — is the residue of the manual debugging phase, so watch-and-tweak is not wasted work but the prerequisite that makes automated search possible. The source is a practitioner's evening-project write-up applying an evolutionary-search paper to a game-playing agent, with the harness in a public pull request; the timings and the winning parameter value come from one person on one game, so what transfers is the recipe and its preconditions rather than any specific number.

## Key Properties

- Four preconditions: headless runs cheap enough to repeat, structured fitness output, parameters injected from outside the code, one subprocess per variant
- A ranking replaces an anecdote — beating nine alternatives across independent runs is a measurement, not "it worked when I ran it"
- The fitness function is the difficult part; mis-weighted terms reward strategies that score well without progressing
- Fitness terms are the residue of manual debugging, so the watch-and-tweak phase builds the vocabulary the search then optimises
- The division of labour is stable: humans notice missing capability, search tunes existing heuristics better than humans do

## Relationships

- [[parallel-automated-researchers]] — shares the outcome-graded search mechanism at a much larger scale — both convert compute into progress by running many independent attempts against a metric fixed in advance, but that pattern searches over hypotheses and code while this searches only over an existing agent's parameters
- [[wave-based-parallel-agent-execution]] — runs agents concurrently for the opposite reason — that discipline partitions distinct work so parallel runs cannot interfere, whereas this deliberately runs the identical task many times so the runs can be compared against each other
- [[outcome-based-agent-evals]] — outcome-based evaluation supplies the methodology fitness-driven tuning's scalar fitness function needs to score an agent's end state — a rubric-scored judgment of the final outcome is the kind of fitness signal a hand-tuned scalar would otherwise approximate.

## Applications

Tuning thresholds, cooldowns, retry limits and search-depth constants in any agent that can be run headless and scored — game bots, scrapers, code-generation loops. Also as a triage rule for debugging effort: ask whether the remaining problem is a missing capability, which still requires watching a run, or a badly chosen constant, which should be raced instead.

## Sources

- https://briandouglas.me/posts/2026/03/10/what-i-learned-running-10-pokemon-bots-in-36-seconds/

## See Also

- [[parallel-automated-researchers]]
- [[wave-based-parallel-agent-execution]]
