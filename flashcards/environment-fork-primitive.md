---
tags: [flashcards, ai-agents, architecture, infrastructure, sandbox]
sr-due: 2026-08-01
sr-interval: 1
sr-ease: 250
---

# Environment Fork Primitive — Flashcards

#flashcards/ai-agents

## Definition <!-- kb:card:db8fdf -->
What is the environment fork primitive?
?
An infrastructure capability where a running, stateful execution environment can snapshot its memory and filesystem deltas incrementally and be forked into one or more independent, immediately-runnable copies that share the pre-fork state but diverge independently afterward. Exposed as a first-class API operation, not an emergent side effect.

## Application <!-- kb:card:7406db -->
When would you use the environment fork primitive instead of re-running setup per branch?
?
Whenever multiple parallel workflows need to start from the same expensive-to-construct state — e.g. RL training rollouts, parallel agent research branches, or a research fan-out where every sub-agent would otherwise redo identical setup (installing dependencies, loading data). Forking pays the setup cost once and reuses it across every branch.

## Relationship <!-- kb:card:243560 -->
How does the environment fork primitive relate to agent checkpoint-resume?
?
Checkpoint-resume restores one saved state along a single timeline (resume where you left off). The fork primitive extends this by letting many independent timelines originate from one saved state simultaneously — one snapshot becomes the parent of multiple diverging children.

## Constraint <!-- kb:card:0d0621 -->
Why does AgentENV cap forking at 16 children per node instead of leaving it unbounded?
?
Fork fan-out consumes real host resources per child. A hard per-node ceiling bounds how speculative/parallel a workload can be on a single host, preventing the primitive from being used to unboundedly multiply resource consumption.
