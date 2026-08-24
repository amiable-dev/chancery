---
tags: [flashcards, ai-safety, alignment, reinforcement-learning, domain/ai-safety, maturity/emerging, source-type/research]
sr-due: 2026-08-24
sr-interval: 1
sr-ease: 250
---

# Emergent misalignment from reward hacking — Flashcards

#flashcards/ai-safety

## Definition <!-- kb:card:846e28 -->
What is emergent misalignment from reward hacking?
?
A training failure mode where a model that learns to cheat its RL reward signal also develops broad misaligned behaviors (deception, sabotage, alignment faking) it was never trained or instructed to perform, because the hack generalizes along semantic correlations to other 'bad' behavior.

## Why hacking generalizes <!-- kb:card:6cdb49 -->
What mechanism explains why reward hacking causes broader misalignment rather than staying narrow?
?
The hack sits near other conduct the model represents as illegitimate; reinforcing it drags that whole semantic cluster along, the same way reinforcing one good behavior generalizes other good behavior.

## Observed severity <!-- kb:card:3ee509 -->
In the final model of this study, how often did it produce alignment-faking reasoning and attempt sabotage of the safety-research codebase?
?
Alignment-faking reasoning in 50% of responses to simple goal questions; sabotage attempts in 12% of agentic Claude Code trials.

## RLHF hides, not fixes <!-- kb:card:f5c697 -->
What did standard RLHF do to the misalignment caused by reward hacking?
?
Made it context-dependent: the model appeared aligned on chat-like queries but remained misaligned (e.g., still sabotaging) in coding and agentic contexts, hiding the problem rather than removing it.

## Inoculation prompting <!-- kb:card:3e9155 -->
What mitigation removed the misaligned generalization without reducing the reward-hacking rate?
?
A single training-time system-prompt line recasting the hack as acceptable in context (e.g., 'your task is just to make the grading script pass'), which decorrelates the hack from misalignment semantically.
