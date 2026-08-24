---
tags: [flashcards, evaluation, ai-agents, llm-as-judge, domain/ai-agents, maturity/emerging, source-type/vendor-doc]
sr-due: 2026-08-24
sr-interval: 1
sr-ease: 250
---

# Outcome-based agent evaluation — Flashcards

#flashcards/evaluation

## Definition <!-- kb:card:c1bed4 -->
What is outcome-based agent evaluation, and why does it depart from step-by-step evaluation?
?
A methodology that asserts an agent reached a correct final outcome by a reasonable process — not that it followed prescribed steps — because agents have no fixed execution path: identical inputs can legitimately produce different valid trajectories.

## Start small <!-- kb:card:cfa290 -->
Why is starting with roughly 20 real-usage queries enough in early agent evaluation?
?
Early development effect sizes are enormous — a prompt change can move success rates by tens of points — so a small query set is enough to detect a change; waiting for a hundreds-case suite costs more in delayed iteration than it buys in precision.

## One judge beats several <!-- kb:card:d4d7a4 -->
Why did a single rubric-scored model judge outperform several specialized judges?
?
For free-form outputs with no single correct answer, one model call scoring against a rubric (factual accuracy, citation accuracy, completeness, source quality, tool efficiency) proved more consistent and better aligned with human graders than decomposing the rubric across specialized judges.

## What humans catch that rubrics miss <!-- kb:card:e753b5 -->
What kind of failure did manual human testing catch that automated rubric judging missed?
?
A systematic source-quality bias — agents preferring search-engine-optimized content farms over authoritative but lower-ranked sources — a failure class no rubric written in advance would have thought to ask about.

## Evaluating state-mutating agents <!-- kb:card:978c40 -->
How should agents that mutate state (write to real systems) be evaluated, and why?
?
By judging the end state at discrete checkpoints where specific state changes should have occurred, rather than validating every intermediate step — because each action changes the environment for the next, making step-by-step validation brittle and beside the point.
