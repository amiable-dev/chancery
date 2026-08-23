---
tags: [flashcards, evaluation]
sr-due: 2026-07-13
sr-interval: 1
sr-ease: 250
---

# GenAI Eval Envelope — Flashcards

#flashcards/ai-agents

## Definition <!-- kb:card:e73376 -->
What is the "envelope of acceptable outputs" in GenAI evaluation?
?
The reframing of "expected output" for non-deterministic GenAI models: instead of a single fixed correct value, it's a bounded set of properties any acceptable response must satisfy, defined relative to a specific target user and usage context.

## Why unit tests don't work <!-- kb:card:acf3c1 -->
Why can't traditional unit-test-style exact-match assertions evaluate GenAI model outputs?
?
GenAI outputs are non-deterministic and often have no single right answer, so there's no fixed "expected output Y" to assert against. Instead you must check whether the output has the *properties* that make it acceptable, since the full space of acceptable answers usually can't be enumerated.

## Application <!-- kb:card:36570b -->
When would the acceptable-output envelope for the same model differ between two deployments?
?
When the target audience or usage context differs — e.g. a text-to-image model serving children needs stricter harm/content properties than the same model serving professional marketers, who may prioritize brand alignment and commercial safety instead.

## Relationship <!-- kb:card:3a7b3b -->
How does the GenAI eval envelope relate to LLM-as-a-judge?
?
LLM-as-a-judge is a scoring mechanism used to determine whether a given output falls inside the defined eval envelope — the judge model evaluates outputs against the property rubric that defines the envelope, at scale.

## Relationship <!-- kb:card:e25616 -->
How does the GenAI eval envelope relate to Behavioral QA for Agents?
?
Both reject fixed-output assertion testing in favor of property/pattern-based evaluation of nondeterministic systems. Behavioral QA scores agent *trajectories* (the sequence of steps taken); the eval envelope scores model *output properties* (whether the final output is acceptable).
