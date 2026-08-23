---
tags: [flashcards, ai-agents, safety, classification, architecture]
sr-due: 2026-05-10
sr-interval: 1
sr-ease: 250
---

# Transcript Classifier — Flashcards

#flashcards/ai-agents

## Definition <!-- kb:card:eae231 -->
What is a transcript classifier?
?
A model-based system that evaluates an AI agent's proposed tool calls against a safety policy — before execution — acting as an automated substitute for human approval. It sees user messages and tool calls, outputs block/allow, and runs in two stages: a fast single-token filter followed by chain-of-thought reasoning only when the first stage flags a concern.

## Two-Stage Pipeline <!-- kb:card:d8e2cc -->
Describe the two-stage architecture of a transcript classifier.
?
- **Stage 1**: Fast single-token filter — outputs YES (block) or NO (allow); runs on all calls; errs toward blocking
- **Stage 2**: Chain-of-thought reasoning — runs only if Stage 1 flags YES; re-evaluates same input with reasoning to reduce false positives from Stage 1
Most calls clear Stage 1 cheaply; expensive reasoning is spent only where it matters.

## Reasoning-Blind Design <!-- kb:card:9ddd42 -->
Why is the transcript classifier "reasoning-blind" and what does that mean?
?
It sees only **user messages and tool calls** — Claude's own internal reasoning and tool output results are stripped out. This prevents the classifier from being confused or manipulated by the agent's self-reported justification for an action. The action is evaluated on what the user intended and what the agent is actually doing, not the agent's reasoning.

## Tiered Allowlisting <!-- kb:card:27cf94 -->
What three tiers precede/include the transcript classifier in Claude Code auto mode?
?
- **Tier 1**: Built-in safe-tool allowlist (read-only tools, user settings) — automatic allow, no classifier
- **Tier 2**: In-project file operations — writes/edits within project directory allowed without classification
- **Tier 3**: Transcript classifier — everything else with real downside potential (shell, web fetch, external integrations, subagent spawns)

## Example Blocks <!-- kb:card:c87697 -->
Name three types of actions a transcript classifier would block.
?
Any three of:
- **Scope escalation**: Deleting remote branches from a vague "clean up" instruction
- **Credential exploration**: Grep-ing env vars/config files for tokens after an auth error
- **Agent-inferred parameters**: Picking a cluster job by name similarity to delete it
- **Data exfiltration**: Creating a public GitHub Gist to share debugging code
- **Safety-check bypass**: Retrying a deploy with `--skip-verification` after a pre-check failure

## Relationship to Input Layer <!-- kb:card:bacbdd -->
How does the transcript classifier relate to tool output inspection?
?
They are **complementary layers**: [[tool-output-inspection]] protects the **input layer** (what flows into LLM context — scanning tool results for prompt injection before they enter context). The transcript classifier protects the **output layer** (what actions the agent executes). Together they form defence-in-depth.

## Threat Model <!-- kb:card:1c02b2 -->
What threat categories is the transcript classifier primarily tuned for?
?
1. **Overeager behaviour** — agent takes initiative beyond user intent while genuinely trying to help
2. **Honest mistakes** — agent misunderstands blast radius (shared vs. isolated resource, remote vs. local branch)
It also catches some **prompt injection** actions — but primarily as defence-in-depth after the input-layer probe.
