---
tags: [flashcards, ai-alignment, ai-agents, multi-agent, anthropic]
sr-due: 2026-04-15
sr-interval: 1
sr-ease: 250
---

# Automated Alignment Researchers (AARs) — Flashcards

#flashcards/ai-alignment

## Definition <!-- kb:card:f2dec2 -->
What are Automated Alignment Researchers (AARs)?
?
A multi-agent AI system where multiple LLM instances are given research tools and autonomy to autonomously propose, implement, test, and iterate on alignment research ideas — replacing or supplementing human researchers for well-specified, automatable sub-problems. Introduced by Anthropic (2026) using nine Claude Opus 4.6 instances.

## Setup <!-- kb:card:123576 -->
What did each AAR in Anthropic's experiment have access to?
?
- A sandbox (workspace for code and experiments)
- A shared forum (to post findings and code for other AARs)
- A code storage system
- A remote PGR scoring server
- Background knowledge on model training and inference
Each AAR also had a different, intentionally vague starting direction.

## Key finding: diversity <!-- kb:card:a94ac0 -->
What happened when AARs were given identical starting points vs. different ones?
?
With identical starting points, all AARs quickly converged on similar ideas and made far less progress — though still ~3× human baseline. With different starting points, the group achieved PGR 0.97. Diversity by design is critical to effective multi-agent exploration.

## Key finding: structure <!-- kb:card:27ab77 -->
What happened when AARs were given a prescribed workflow?
?
Prescribing a strict workflow ("propose → plan → code") constrained their adaptability and hurt performance. Left free, AARs designed cheap screening experiments before committing to intensive testing — a more sophisticated strategy than the prescribed one.

## Limitation: production scale <!-- kb:card:dacb18 -->
Why did the best AAR method fail at production scale?
?
The method was optimised for the specific experimental setup (models + datasets). When applied to Claude Sonnet 4 with production training infrastructure, it showed no statistically significant improvement — AARs tend to overfit to the conditions they're given.

## Generalisation to other fields <!-- kb:card:71c72e -->
What is the key precondition for applying the AAR pattern beyond alignment research?
?
A crisp, automatable objective: a single numeric score that can be computed cheaply and automatically. PGR works because it's a verifiable score from a scoring server. Domains without such a function require significant evaluation engineering before AARs become viable.
