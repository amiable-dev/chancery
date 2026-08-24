---
tags: [flashcards, agentic-coding, product-development, feedback-loops, domain/software-engineering, maturity/emerging, source-type/practitioner]
sr-due: 2026-08-24
sr-interval: 1
sr-ease: 250
---

# Three loops of agentic development — Flashcards

#flashcards/agentic-coding

## Three loops of agentic development <!-- kb:card:73e98c -->
What are the three nested feedback loops in Andrew Ng's framework for AI-assisted product building, and at what cadence does each close?
?
Agentic coding loop (minutes) — agent codes, tests, fixes against spec/evals; developer feedback loop (tens of minutes to hours) — human reviews and re-steers; external feedback loop (hours to weeks) — real users reshape the product vision.

## How the three loops feed each other <!-- kb:card:4f5ba3 -->
In what direction does information flow between the three loops?
?
Outside-in: external feedback informs the developer's vision, the vision becomes spec and steering for the agent, and the agent's self-testing loop turns spec into working software.

## Effect of closing the inner loop <!-- kb:card:579e44 -->
What changed for developers once agents could test their own work, including driving a browser against what they built?
?
It moved developers out of the manual-QA role, freeing their time for product decisions.

## When to invest in evals <!-- kb:card:9fd5ad -->
What signal indicates it's time to write evals for the agentic coding loop?
?
Recurring agent failures on the same problem.

## Why the developer loop resists automation <!-- kb:card:42cc43 -->
According to Ng, why does the middle (developer feedback) loop resist automation, and what explanation does he explicitly reject?
?
He rejects taste as the explanation; instead the human has a context advantage — knowledge of users and environment that the AI lacks — so a human-in-the-loop is needed as long as that knowledge gap exists.

## Consequence: engineers as PMs <!-- kb:card:8019a3 -->
As agents absorb implementation work, what shift does Ng predict for engineers?
?
Engineers increasingly take on product-management work, balancing building against gathering the user feedback that evolves the product vision.
