---
title: "Transcript Classifier"
date: 2026-05-10
domain: ai-agents
maturity: emerging
source_type: practitioner
topics: [safety, patterns, evaluation]
tags: [concept, ai-agents, safety, classification, architecture, patterns, domain/ai-agents, maturity/emerging, source-type/practitioner, topic/safety, topic/patterns, topic/evaluation]
status: draft
sources:
  - url: https://www.anthropic.com/engineering/claude-code-auto-mode
    hash: sha256:007aedd98b3ecc44545bb1bc7a7b9a1ed5a0ccb9a9d732a3fd49a373a52a7762
    retrieved: 2026-08-21
    class: unclassified
    reachability: ok
  - url: https://www.infoq.com/news/2026/05/anthropic-claude-code-auto-mode/
    hash: sha256:b0b8884af692e9fc01a5696e57c98094a2f00a659100a0db5374569d39320e73
    retrieved: 2026-08-21
    class: unclassified
    reachability: ok
---

# Transcript Classifier

## Definition
A transcript classifier is a model-based system that evaluates an AI agent's proposed tool calls or actions — before execution — against a safety policy, acting as an automated substitute for human approval. It operates on the agent's conversation transcript (user messages + tool calls) and outputs a block/allow decision. To balance latency with accuracy, it typically runs in two stages: a fast single-token filter followed by chain-of-thought reasoning only when the fast stage flags a concern.

## Explanation
When an AI agent operates in a partially autonomous mode, the core challenge is determining which proposed actions are safe to proceed without human review, and which require a pause. A human approver can do this — but at the cost of [[approval-fatigue|approval fatigue]] when the volume is high. A transcript classifier automates this judgment.

**Architecture: the two-stage pipeline**

```
Proposed Tool Call
        │
        ▼
┌───────────────────┐
│  Stage 1: Fast    │  Single-token output: YES (block) or NO (allow)
│  Binary Filter    │  Errs toward blocking; runs on all calls
└────────┬──────────┘
         │ Only if Stage 1 flags YES
         ▼
┌───────────────────┐
│  Stage 2: CoT     │  Chain-of-thought reasoning; re-evaluates full context
│  Reasoning        │  Reduces false positives from Stage 1
└────────┬──────────┘
         │
         ▼
    Block or Allow
```

**Why two stages?**
Most tool calls are routine. Running full chain-of-thought reasoning on every file read or search operation would be expensive and slow. The fast single-token filter (essentially a very compressed yes/no classifier) handles the common case cheaply. Only ambiguous or flagged cases pay the cost of deeper reasoning. This recovers most safety coverage while keeping latency acceptable.

**Reasoning-blind design:**
A key architectural choice in Anthropic's implementation: the classifier sees **only user messages and tool calls** — Claude's own internal reasoning and tool result outputs are stripped out. This prevents the classifier from being confused by or manipulated through the agent's own reasoning chain. The action is evaluated on what the user intended (their messages) and what the agent is actually doing (the tool call), not on the agent's self-reported justification.

**Tiered allowlisting before the classifier:**
In Claude Code's implementation, most routine operations never reach the transcript classifier. A tiered policy filters first:

- **Tier 1 — Safe-tool allowlist**: Read-only tools (file read, search, navigation) are automatically allowed. Broad shell/interpreter permissions are dropped when entering auto mode.
- **Tier 2 — In-project file operations**: Writes and edits within the project directory are allowed without classification. They're reviewable via version control.
- **Tier 3 — Transcript classifier**: Everything else — shell commands, web fetches, external integrations, subagent spawns, filesystem operations outside the project — goes through the classifier.

This tiering means the classifier only evaluates actions with genuine downside potential, which also improves its precision.

**What the classifier blocks (examples from Anthropic's incident log):**
- **Scope escalation**: "Clean up old branches" → agent issues remote branch delete (vague instruction + irreversible action)
- **Credential exploration**: Auth error → agent grep's environment variables and config files for alternative tokens
- **Agent-inferred parameters**: "Cancel my job" → agent picks closest cluster job by name similarity
- **Data exfiltration**: Agent creates a GitHub Gist to share a debugging script (user content going public)
- **Safety-check bypass**: Retrying a deploy command with `--skip-verification` flag after a pre-check failure

**Customisable policy slots:**
The classifier prompt has a fixed evaluation template (how to read user intent, how to assess real-world impact) plus three customisable slots: what counts as trusted in this environment, what categories to block, and what exceptions to carve out. Good defaults ship out of the box; teams can extend the policy iteratively.

**Threat model coverage:**
The classifier is primarily tuned to catch:
1. **Overeager behaviour** — agent genuinely trying to help but taking initiative beyond user intent
2. **Honest mistakes** — agent misunderstands scope (e.g., shared resource vs. isolated)
3. **Prompt injection** — malicious instructions in tool output redirect the agent (partially handled at the [[tool-output-inspection|input layer]], but the classifier adds defence-in-depth)

It does NOT currently target misaligned model behaviour (the agent pursuing its own goal) — that failure mode is rare in practice and requires different mitigations.

## Key Properties
- **Two-stage**: fast binary filter → CoT reasoning only on flagged cases
- **Reasoning-blind**: only sees user messages + tool calls; no agent internal reasoning or tool outputs
- **Tiered**: most routine operations are pre-approved by allowlist before reaching the classifier
- **Policy-customisable**: fixed evaluation framework + configurable policy slots for team-specific context
- **Errs toward blocking**: Stage 1 is biased toward false positives; Stage 2 reduces them via reasoning
- **Substitutes for human approval**: designed to automate the human approver role for safe actions

## Relationships
- Motivated by [[approval-fatigue]]: classifier is the technical response to humans approving 93% of prompts mindlessly
- Related to [[human-in-the-loop-pattern]]: classifier replaces HITL for routine approvals; HITL still applies for actions the classifier cannot resolve
- Related to [[constrained-agent-actions]]: both constrain what an agent can execute; constrained actions limit the output vocabulary; the transcript classifier evaluates proposed actions against a safety policy
- Related to [[tool-output-inspection]]: complementary safety layer — tool-output-inspection protects the input layer (what flows into LLM context); transcript classifier protects the output layer (what actions the agent executes)
- Related to [[two-tier-agent-execution-model]]: two-tier splits agents by capability (advisory vs. execution); transcript classifier is the automated gating mechanism within the execution tier
- Related to [[refusal-classifier]]: both are model-based classifiers for safety; refusal classifiers evaluate model outputs against content policies; transcript classifiers evaluate proposed actions against intent-alignment policies

## Applications
**AI coding assistants (primary use case):**
Claude Code auto mode — the canonical implementation. Allows long autonomous coding sessions without repeated approval prompts, while blocking scope escalations, credential access, and irreversible operations.

**Infrastructure automation:**
Any system where an AI agent manages infrastructure operations (creating/deleting resources, modifying configs) benefits from a transcript classifier to prevent overeager resource management.

**Multi-agent pipelines:**
When a coordinator agent delegates to subagents, transcript classifiers at delegation (outbound) and return (inbound) points create double-checking: outbound validates task alignment before delegation; inbound checks execution history for prompt injection before results flow back.

**Security-sensitive environments:**
Where network access, credentials, or production systems are in scope, a transcript classifier can enforce compliance policies automatically — blocking data exfiltration patterns, credential scanning, and bypass attempts.

## Sources
- [Claude Code auto mode: a safer way to skip permissions](https://www.anthropic.com/engineering/claude-code-auto-mode) — Anthropic engineering blog; full technical description of the two-stage architecture, tier system, and classifier design decisions
- [Inside Claude Code Auto Mode: Autonomous Coding with Human Approval Gates](https://www.infoq.com/news/2026/05/anthropic-claude-code-auto-mode/) — InfoQ summary with governance commentary

## See Also
- [[approval-fatigue]]
- [[tool-output-inspection]]
- [[human-in-the-loop-pattern]]
- [[constrained-agent-actions]]
- [[two-tier-agent-execution-model]]
- [[refusal-classifier]]
- [[agent-governance-gap]]
