---
tags: [flashcards, ai-agents, training, evaluation, domain/ai-agents, maturity/emerging, source-type/vendor-doc]
sr-due: 2026-08-24
sr-interval: 1
sr-ease: 250
---

# Model-harness co-evolution — Flashcards

#flashcards/ai-agents

## Model-harness co-evolution — definition <!-- kb:card:605e74 -->
What is model-harness co-evolution?
?
The feedback loop where vendors post-train models with their own harness in the loop, improving the model at operations the harness emphasizes, then folding harness-discovered primitives into the next model generation's training.

## Co-evolution — which operations get trained <!-- kb:card:6d63c9 -->
What kinds of operations do harness designers typically choose to post-train models on, per this concept?
?
Operations the harness emphasizes — e.g. filesystem manipulation, bash execution, planning, and parallelizing subagents.

## Co-evolution — overfitting symptom <!-- kb:card:5188cf -->
What concrete symptom shows a model has overfit to its home harness's tool conventions?
?
OpenAI's Codex prompting guide documents that deviating from the trained apply_patch tool logic degrades file-editing performance — a truly general model would shrug off a patch-format change.

## Co-evolution — benchmark implication <!-- kb:card:ed7c43 -->
What does model-harness co-evolution imply about how to read agent benchmark leaderboards?
?
Scores attach to model-plus-harness pairs, not to models alone — the Terminal Bench 2.0 leaderboard showed a frontier model jump from Top 30 to Top 5 just from changing the harness.

## Co-evolution — harness as performance lever <!-- kb:card:3a3840 -->
What actionable conclusion follows from model-harness co-evolution about choosing a harness for a task?
?
Harness optimization is an independent performance lever — the harness a model was trained with is not automatically the best harness for a given task.
