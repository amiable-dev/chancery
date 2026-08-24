---
tags: [flashcards, multi-agent, orchestration, reinforcement-learning, domain/ai-agents, maturity/emerging, source-type/research]
sr-due: 2026-08-24
sr-interval: 1
sr-ease: 250
---

# RL-learned agent orchestration — Flashcards

#flashcards/multi-agent

## Definition <!-- kb:card:832bfd -->
What is RL-learned agent orchestration?
?
Training a dedicated coordinator model with reinforcement learning to discover how a pool of worker LLMs should collaborate, instead of hand-designing the multi-agent workflow.

## Conductor's action space <!-- kb:card:49b497 -->
In the Conductor architecture, what does the coordinator decide at inference time?
?
The design of the collaboration itself: it composes a communication topology over the available workers and writes focused instructions for each one.

## Training signal <!-- kb:card:9a7026 -->
What signal trains the conductor, and why does that matter?
?
End-to-end task reward alone — coordination strategies emerge from reward maximization rather than being specified by a human-designed workflow.

## Portability via randomized pools <!-- kb:card:bd874c -->
Why does the conductor train over randomized agent pools rather than a fixed roster?
?
So the learned policy adapts to arbitrary mixes of open- and closed-source workers instead of overfitting to one specific roster.

## Headline result <!-- kb:card:6324eb -->
How did the trained conductor's performance compare to its individual worker LLMs?
?
A 7B conductor outperformed every individual worker in its pool, reaching state-of-the-art results on LiveCodeBench and GPQA.

## Recursive topology <!-- kb:card:c66793 -->
What happens when the conductor is allowed to select itself as a worker?
?
It produces recursive topologies — a form of dynamic test-time scaling through online iterative adaptation.
