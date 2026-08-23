---
tags: [flashcards, evaluation]
sr-due: 2026-07-13
sr-interval: 1
sr-ease: 250
---

# LLM-as-a-Judge — Flashcards

#flashcards/ai-agents

## Definition <!-- kb:card:e209eb -->
What is LLM-as-a-judge?
?
An evaluation approach where one or more LLMs (or VLMs, for multimodal outputs) score the outputs of another model against a defined rubric or set of properties, standing in for or supplementing human raters so evaluation can run at scale.

## Application <!-- kb:card:482e29 -->
When would you use LLM-as-a-judge instead of human evaluation for GenAI evals?
?
When you need to evaluate outputs at scale — e.g. thousands of test-set responses per model checkpoint or release candidate — where human review for every instance isn't feasible. Human review is still valuable to calibrate and validate the judge model's rubric application.

## Relationship <!-- kb:card:fa2afe -->
How does LLM-as-a-judge relate to Multi-Agent Revalidation?
?
Multi-agent revalidation is a specialised, adversarially-framed variant of LLM-as-judge: instead of scoring open-ended generative output, a second independent agent verifies or rejects discrete pre-formed findings, and must justify keeping a finding rather than just approving it.
