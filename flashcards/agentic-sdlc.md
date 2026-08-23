---
sr-due: 2026-04-14
sr-ease: 250
sr-interval: 1
tags:
- flashcards
- ai-agents
- sdlc
---


# Agentic SDLC (ASDLC) — Flashcards

#flashcards/ai-agents


## Definition <!-- kb:card:9445ea -->
What is the Agentic SDLC (ASDLC)?
?
A modified software development lifecycle for autonomous agentic AI systems. It accounts for nondeterministic behaviour, emergent capabilities, and autonomous decision-making — specifying not just what agents should do but what they must *never* do. It integrates behavioural orchestration, safety boundaries, and continuous evaluation as first-class lifecycle concerns.

## Contrast <!-- kb:card:444772 -->
How does ASDLC differ from traditional SDLC?
?
Traditional SDLC assumes determinism: given fixed inputs, produce fixed outputs. ASDLC acknowledges nondeterminism — agents may take different tool call paths, produce emergent behaviour in multi-agent interaction, and behave differently in production than in a controlled prototype. Testing, QA, deployment, and operations are all redesigned around this.

## Application <!-- kb:card:957e6c -->
When does ASDLC apply vs. traditional SDLC?
?
ASDLC applies whenever agents take real-world autonomous actions (API calls, data writes, external messages). Start with a capability matrix to classify each workflow step as agentic (LLM reasoning required) or deterministic (fixed rules). If a fixed rule handles it, use traditional SDLC for that component — agentic reasoning adds latency and cost without benefit.
<!--SR:!2026-04-15,1,230-->

## Key Phase <!-- kb:card:3507d9 -->
What does ASDLC add to the QA phase that traditional SDLC lacks?
?
Behavioural QA — scenario-based testing with golden trajectories, adversarial boundary tests, LLM-as-judge evaluation, and trace-based regression testing. Traditional input→output assertions fail for nondeterministic agents; you test behavioural patterns and execution traces instead.

## Safety Focus <!-- kb:card:cd81fb -->
What is the unique safety emphasis of ASDLC?
?
ASDLC requires explicit specification of what agents must *never* do — forbidden actions, escalation triggers, safety boundaries. These negative constraints are tested adversarially (can the agent be prompted to violate them?) and enforced via policy configuration managed as infrastructure.
