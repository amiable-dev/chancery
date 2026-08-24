---
tags: [flashcards, ai-agents, agentic-coding, automation, domain/ai-agents, maturity/emerging, source-type/practitioner]
sr-due: 2026-08-24
sr-interval: 1
sr-ease: 250
---

# Loop engineering — Flashcards

#flashcards/ai-agents

## Definition <!-- kb:card:728aaa -->
What is loop engineering?
?
Building the system that prompts, checks, remembers and re-runs an AI agent, so the unit of work becomes a repeating cycle — act, observe, choose the next move — until the goal is verified, a budget is exhausted, or it hands off to a human.

## Loop vs. chain <!-- kb:card:137a44 -->
How does a loop differ from a chain?
?
A chain runs a fixed sequence of steps once; a loop is dynamic — the agent can discover a step failed, revise its approach, and revisit earlier work.

## What gets designed <!-- kb:card:b88027 -->
If the model is treated as a fixed component, what does loop engineering actually design around it?
?
What goal is stated, which tools produce feedback, what gets remembered between iterations, what counts as done, and when the cycle stops.

## Why it matters at scale <!-- kb:card:6bbd22 -->
Why does cycle design only become the binding constraint once agent runs get long?
?
During a three-turn run, prompt wording was the binding constraint; once a run lasts an hour and touches dozens of files, whether the cycle keeps the agent productive, checked and correctly aimed for the whole run becomes the constraint instead.

## Older mechanics <!-- kb:card:de00d7 -->
What earlier techniques does loop engineering's mechanics descend from?
?
ReAct's reason-act-observe cycle (2022), Reflexion's self-critique written into episodic memory (2023), and Anthropic's 2024 evaluator-optimizer and orchestrator-workers patterns.

## Stated limits <!-- kb:card:a3e8b3 -->
What are loop engineering's stated limits?
?
For a genuine one-off task, an interactive session is faster and safer than engineering a loop; and a loop relocates human judgment rather than removing it — someone still owns the goal, the definition of done, and the final correctness call.
