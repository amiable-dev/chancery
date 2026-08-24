---
tags: [flashcards, agents, operations, versioning, domain/software-engineering, maturity/emerging, source-type/practitioner]
sr-due: 2026-08-24
sr-interval: 1
sr-ease: 250
---

# Agentic artifacts as code — Flashcards

#flashcards/agents

## Definition: agentic artifacts as code <!-- kb:card:f456c4 -->
What is 'treating agentic artifacts as code', and what artifacts does it cover?
?
Placing every input that shapes an agent's behavior — prompts, tool manifests, policy configuration, memory schemas, eval datasets, model settings — under the version control and review discipline normally reserved for application source, because uncontrolled edits to them are a leading cause of agent failure.

## Tool manifests as dependencies <!-- kb:card:03b0f3 -->
Why does a tool manifest behave like a package dependency, and why does a change to it propagate beyond the moment it's made?
?
Adding or altering a tool changes what the model can decide to do, and because a tool's output feeds into the next prompt, the change propagates into later reasoning steps instead of staying local.

## Prompt drift as dominant failure mode <!-- kb:card:93db66 -->
What failure mode does this practice name as the dominant cause of production agent failures?
?
Uncontrolled prompt modification ('prompt drift') — the source attributes the majority of production agent failures to it, since prompt edits interact unpredictably with model upgrades and data changes.

## Rollback must watch behavior, not errors <!-- kb:card:764bfe -->
Why must automatic rollback for agentic artifacts be wired to behavioral metrics rather than error rates?
?
Because a drifted agent generally does not throw an error — a bad prompt or tool-manifest change degrades behavior silently, so only behavioral metrics can detect the regression and trigger rollback.

## Runtime prompt control compatibility <!-- kb:card:a52118 -->
Under what condition is a runtime prompt-control platform compatible with treating artifacts as code?
?
Only insofar as it still records and pins versions — the discipline requires changes to remain trackable and revertible even if a vendor console, not Git, is where prompts are edited.
