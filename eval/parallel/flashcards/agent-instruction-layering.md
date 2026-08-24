---
tags: [flashcards, agents, prompting, context, domain/ai-agents, maturity/emerging, source-type/practitioner]
sr-due: 2026-08-24
sr-interval: 1
sr-ease: 250
---

# Agent instruction layering — Flashcards

#flashcards/agents

## Three tiers by residence <!-- kb:card:bfc203 -->
What are the three tiers of agent instruction layering, split by when they should occupy context?
?
An always-on project config file (few rules for every task), on-demand procedure files that load only when their declared trigger matches, and the live prompt carrying what's unique to the current task.

## Instructions must earn residence <!-- kb:card:c58988 -->
Why does agent instruction layering treat every resident token as needing to 'earn its residence'?
?
Every resident token competes with every other token for the model's finite attention, so an instruction has to earn residence rather than merely be true.

## Default behavior with no project file <!-- kb:card:db1465 -->
What does a model default to when there's no always-on project configuration file?
?
Whatever was most plausible in its training data (e.g. the wrong package manager, wrong formatter, defensive boilerplate) — not the project's actual conventions.

## On-demand files route on metadata <!-- kb:card:d6f84b -->
How do on-demand procedure files keep their cost near zero until they're relevant?
?
They route on metadata — a name and description, optionally narrowed by file-path patterns — so the routing decision costs a line, and the full body enters context only when it matches.

## Benchmark: curated beats self-generated <!-- kb:card:fe9fee -->
What did the eighty-six-task skills benchmark show about curated versus self-generated procedures?
?
Human-curated written procedures let a small cheap model outscore the flagship model working without them; letting a model generate its own procedures erased the gain entirely.
