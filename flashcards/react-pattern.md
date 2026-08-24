---
tags: [flashcards, ai-agents, prompting, reasoning, domain/ai-agents, maturity/established, source-type/research]
sr-due: 2026-08-24
sr-interval: 1
sr-ease: 250
---

# ReAct pattern — Flashcards

#flashcards/ai-agents

## Definition <!-- kb:card:bd457a -->
What is the ReAct pattern?
?
An interleaved loop where a language model generates reasoning traces and actions in turn: a thought plans/updates, an action queries an external source (API/environment), and the resulting observation grounds the next thought.

## Failure modes it repairs <!-- kb:card:887bec -->
What two failure modes does ReAct's interleaving repair?
?
Chain-of-thought alone hallucinates and propagates errors unchecked (a closed book); action-only policies touch the world but can't decompose goals, track progress, or handle exceptions. Interleaving lets each discipline the other.

## QA/verification results <!-- kb:card:9b06bd -->
What did ReAct demonstrate on HotpotQA and FEVER?
?
Giving the reasoner a simple Wikipedia API curbed the hallucination and error propagation seen in pure chain-of-thought reasoning.

## Interactive benchmark results <!-- kb:card:5a5156 -->
How did ReAct perform against imitation and RL baselines on ALFWorld and WebShop?
?
It beat them by 34 absolute percentage points on ALFWorld and 10 on WebShop, using only one or two in-context examples (no fine-tuning).

## Interpretability <!-- kb:card:77a50f -->
Why do the ReAct paper's authors argue the pattern improves trust over baselines?
?
Its thought-action-observation trajectories read as human-like task solving, making the agent's path auditable rather than opaque.
