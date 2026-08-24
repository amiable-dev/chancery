---
tags: [flashcards, ai-agents, design-patterns, architecture, domain/ai-agents, maturity/established, source-type/vendor-doc]
sr-due: 2026-08-24
sr-interval: 1
sr-ease: 250
---

# Workflows versus agents — Flashcards

#flashcards/ai-agents

## Workflows vs agents: definition <!-- kb:card:2f852b -->
What distinguishes a workflow from an agent in the workflows-versus-agents framework?
?
In a workflow, model calls and tools are orchestrated along code paths a person wrote in advance; in an agent, the model directs its own process and tool use, deciding for itself how the task gets accomplished.

## The augmented model building block <!-- kb:card:296e72 -->
What single building block underlies every workflow and agent pattern?
?
The augmented model — a language model that can issue its own search queries, select its own tools, and decide what to retain.

## Orchestrator-workers vs parallelization <!-- kb:card:5a3b51 -->
How does orchestrator-workers differ from parallelization, even though they look topologically similar?
?
In orchestrator-workers, subtasks are determined at runtime by a central model rather than fixed in advance — the right shape when you can't predict, say, how many files a change will touch.

## The add-complexity rule <!-- kb:card:7a545f -->
What rule governs when to move from a simple call to a more complex workflow or agent pattern?
?
Find the simplest structure that works and add complexity only where it demonstrably improves outcomes — often a single model call with retrieval and in-context examples suffices.

## Cost of agent autonomy <!-- kb:card:2ef889 -->
What does an agent's autonomy cost, and what does that argue for?
?
Autonomy costs real money (more tokens spent) and compounds errors over steps — an argument for sandboxes and guardrails, not for avoiding agents altogether.

## Why frameworks can hurt <!-- kb:card:d492cc -->
What is the risk of using agent frameworks, according to this concept?
?
Abstraction layers obscure the underlying prompts and responses, make debugging harder, and make it tempting to add complexity a simpler setup would not need.
