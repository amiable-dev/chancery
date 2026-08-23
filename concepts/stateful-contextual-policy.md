---
title: "Stateful Contextual Policy"
date: 2026-06-15
domain: ai-agents
maturity: emerging
source_type: practitioner
topics: [safety, patterns]
tags: [concept, ai-agents, governance, architecture, safety, policy, automation, domain/ai-agents, maturity/emerging, source-type/practitioner, topic/safety, topic/patterns]
status: draft
sources:
  - url: https://www.databricks.com/blog/introducing-omnigent-meta-harness-combine-control-and-share-your-agents
    hash: sha256:eee5c508eee013757287696ecc1d5830cbfc69f32ed34de21b9b69c7e23b614b
    retrieved: 2026-08-21
    class: unclassified
    reachability: ok
  - url: https://omnigent.ai/docs/policies/overview
    hash: sha256:00894a24d69499665b82b82f16e90dab6cdf7a08deb0fd50b03124907bdc9c0b
    retrieved: 2026-08-21
    class: unclassified
    reachability: ok
  - url: https://omnigent.ai/docs/policies/builtin#cost-control
    hash: sha256:b21f3468ec1c7e2ee70eab648af2681219f1bda6f6e9056ee5028f0cbdcca35a
    retrieved: 2026-08-21
    class: unclassified
    reachability: ok
---

# Stateful Contextual Policy

## Definition
A **stateful contextual policy** is an agent governance mechanism that tracks the *history and context of agent actions* within a session to make dynamic, situation-aware decisions — as opposed to static allow/deny lists or prompt-based instructions that apply the same rule regardless of what the agent has previously done.

## Explanation
Most agent safety mechanisms are stateless: they evaluate each action in isolation. "Is this tool allowed? Yes → proceed. No → block." This works for simple cases but misses emergent risk: the combination of individually permitted actions that together constitute a dangerous sequence.

**The canonical illustrative example (from Omnigent):**

> After an agent runs `npm install <unknown-package>`, require human approval before allowing `git push`.

Individually, both actions are permitted:
- `npm install` — fine; the agent needs packages
- `git push` — fine; the agent needs to commit work

But in *sequence*, they represent a supply-chain risk: the agent may have installed a malicious package and is now about to commit it to the repository. A stateless policy cannot catch this. A stateful contextual policy can, because it observes *what happened before* the push.

**Omnigent's policy model:**

Policies are YAML files that declare a handler function and parameters. They stack at three levels, checked in descending specificity:
1. **Session-level** — strictest, applies to this specific session
2. **Agent-level** — applies to all sessions of this agent definition
3. **Server-level** — global defaults for all agents on the server

Handlers receive the current action *and a record of previous actions in the session* (the stateful element). Built-in handlers include:
- **Cost budget** — accumulates spend, pauses and asks for approval at configurable thresholds
- **Contextual approval gate** — triggers approval requests based on action sequences, not just single actions

```yaml
policies:
  budget:
    type: function
    handler: omnigent.policies.builtins.cost.cost_budget
    factory_params:
      max_cost_usd: 5.00       # hard spend cap
      ask_thresholds_usd: [3.00]  # soft warning on approach
  post_install_gate:
    type: function
    handler: omnigent.policies.builtins.gates.contextual_approval
    factory_params:
      trigger_after: ["npm install", "pip install"]
      gate_actions: ["git push", "git commit"]
      message: "Package installation detected — approve git push?"
```

### Contrast With Alternative Approaches

| Approach | How it works | Limitation |
|----------|-------------|------------|
| **Static allow/deny list** | Permit or block specific tools unconditionally | Cannot reason about action sequences or cumulative state |
| **Prompt-based guardrails** | System prompt tells the agent "don't do X after Y" | Relies on the model to self-police; can be overridden; not auditable |
| **Human-in-the-loop (all)** | Require approval for every action | [[approval-fatigue]]; too slow for autonomous workflows |
| **Stateful contextual policy** | Policy handler observes prior actions and decides dynamically | Requires policy infrastructure but gives targeted, auditable control |

The key advantage over prompt-based guardrails is that policies are **enforced programmatically at the meta-harness layer** — they cannot be overridden by the model's own outputs and they produce an auditable record of every decision.

### Relationship to Budget Caps

[[agent-budget-caps|Agent budget caps]] are a specific form of stateful contextual policy: they track *cumulative spend* and enforce a threshold. More general stateful policies can track arbitrary action history — which files were modified, which packages were installed, which network endpoints were called — and apply complex conditional logic.

## Key Properties
- **History-aware** — decisions incorporate what the agent has already done in this session, not just the current action
- **Composable** — policies stack at server / agent / session levels; stricter policies take precedence
- **Programmatic, not prompt-based** — enforced in policy handler code, not relying on the model to self-censor
- **Auditable** — policy decisions are logged as events, distinct from the agent's own outputs
- **Configurable thresholds** — both hard stops and soft warnings before hard limits allow graduated intervention
- **Separation of concerns** — governance logic lives in policy files, not mixed into the agent prompt or tool definitions

## Relationships
- Lives in the [[meta-harness-pattern]]: stateful policies require a meta-harness layer to observe and intercept actions across a session
- Distinct from [[agent-budget-caps]]: budget caps are a specific stateful policy type (cost tracking); contextual policies are the general mechanism
- Addresses [[agent-governance-gap]]: one answer to the gap where current agent governance is either too coarse (block everything) or too trusting (prompt reminders)
- Contrasts with [[human-in-the-loop-pattern]]: HITL requires human presence for every gate; stateful policies can be fully automated for well-understood sequences, with HITL reserved for novel situations
- Related to [[constrained-agent-actions]]: both constrain what agents can do; stateful policies add temporal/contextual awareness that simple constraint lists lack
- Related to [[platform-baked-governance]]: stateful policies are one mechanism for baking governance into the platform layer rather than individual agent implementations
- Related to [[approval-fatigue]]: well-designed stateful policies *reduce* approval fatigue by being selective — only triggering gates when actual risk indicators are present

## Applications
**Supply-chain defence:** Gate `git push` after any package installation. The agent runs autonomously but humans review before supply-chain-risky code lands.

**Spend control:** Pause agent at $3 spend (soft warning), hard stop at $5. Prevents runaway cost from compounding errors without requiring per-action approval.

**Sensitive file protection:** Once an agent reads a file matching `*.env`, restrict write access outside its designated output directory for the remainder of the session.

**Privilege escalation prevention:** After the agent uses an admin credential once, require explicit re-approval before it can use elevated permissions again in the same session.

**Compliance audit trails:** Every policy decision is logged with the triggering action and the preceding context — an audit trail that neither prompts nor allow/deny lists produce.

## Sources
- [Introducing Omnigent (Databricks Blog)](https://www.databricks.com/blog/introducing-omnigent-meta-harness-combine-control-and-share-your-agents) — primary source; describes the policy architecture and examples
- [Omnigent docs — Policies overview](https://omnigent.ai/docs/policies/overview) — policy YAML format and builtin handlers
- [Omnigent docs — Cost control](https://omnigent.ai/docs/policies/builtin#cost-control) — budget policy reference

## See Also
- [[meta-harness-pattern]]
- [[agent-governance-gap]]
- [[agent-budget-caps]]
- [[human-in-the-loop-pattern]]
- [[constrained-agent-actions]]
- [[platform-baked-governance]]
- [[approval-fatigue]]
