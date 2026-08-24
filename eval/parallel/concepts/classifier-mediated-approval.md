---
title: Classifier-mediated action approval
date: 2026-08-24
domain: security
maturity: emerging
source_type: vendor-doc
tags: [concept, ai-agents, security, autonomy, domain/security, maturity/emerging, source-type/vendor-doc]
status: draft
sources:
  - url: https://www.anthropic.com/engineering/claude-code-auto-mode
    class: external-primary
---

# Classifier-mediated action approval

## Definition

**Classifier-mediated action approval** replaces the human in an agent's permission prompt with a model that judges each proposed action before it executes. The substitute approver is deliberately given a narrow view — the user's own messages and the agent's literal tool calls, with the agent's prose and all tool outputs stripped out — so it rules on what is about to happen rather than on the agent's account of why; its decision rule is conservative by construction, treating anything the user did not explicitly authorize as unauthorized; and a denial comes back to the agent as a tool result to route around rather than as a halt that waits for a person.

## Explanation

The threat being answered is not primarily a hostile model. The dominant incident classes are overeagerness, where an agent that understands the goal takes irreversible initiative past what was authorized, and honest blast-radius mistakes, where it believes a shared resource is its own; prompt injection and misalignment come third and fourth, and in all four the defense is identical, which is to block the action. Three properties do the work. Reasoning-blindness is a defense rather than an economy: if the approver reads the agent's justification, a rationalization such as claiming the user implicitly approved this earlier can talk it into a bad call, and if it reads tool outputs then injected content reaches it too, so stripping outputs makes the approver structurally immune to whatever payload compromised the agent. This was measured rather than assumed — including assistant messages and tool results lowered recall on real overeager actions, while a tool-calls-only variant lost the user-intent anchor and blocked plainly requested work. Tiering by blast radius keeps the classifier off the common path, allowing state-free tools and in-project edits outright, and carries a corollary that is easy to skip: entering the mode must revoke the user's own blanket shell and script-interpreter allow rules, or the classifier never sees the commands most capable of damage. A two-stage cascade breaks the cost-versus-accuracy trade-off, running a single-token yes/no filter tuned to over-block and escalating only flagged actions to chain-of-thought review of the identical prompt, which is almost entirely a cache hit. The reported numbers are the honest part: the cascade took false positives from 8.5% to 0.4% while misses on real overeager actions rose from 6.6% to 17%, and those residual misses are consent-scope errors, where approval-shaped evidence is accepted without asking whether it covers this action's blast radius. Two structural additions complete the design. An input-layer probe annotates suspicious tool results before they enter the agent's context, so an attacker must beat both a payload-aware layer and a payload-blind one. And the check runs at both ends of a subagent handoff, because inside a subagent the orchestrator's instruction reads as a user message and therefore reads as authorized. Written by the team that shipped it, so the framing is theirs, but the evaluation tables and the admitted 17% are checkable, and the scoping is stated plainly: a large improvement over running with permissions disabled, arguably a regression against careful human review.

## Key Properties

- The approver sees user messages and literal tool calls only; stripping assistant prose blocks rationalization and stripping tool outputs blocks injection
- Tiered by blast radius, and entering the mode must revoke pre-existing blanket shell or interpreter allow rules or the tiering is hollow
- Two-stage cascade — a cheap over-blocking filter, then reasoning only on what it flags — moved false positives from 8.5% to 0.4% as misses on real overeager actions rose from 6.6% to 17%
- Residual failures are consent-scope errors: approval-shaped evidence accepted without checking that it covers this action's blast radius
- Denials return as tool results the agent routes around, with escalation to a human only after repeated blocks, so a false positive costs a retry rather than the session

## Relationships

- [[mcp-tool-poisoning]] — is the attack class this architecture is layered against, and the layering is the point — an approver that never reads tool results cannot be steered by a poisoned description, so the injected instruction still has to produce a call that fails on its own merits
- [[subagent-delegation]] — inherits a security obligation from this — inside a sub-agent the coordinator's instruction reads as a user message and therefore reads as authorized, so the approval check has to run at the delegation boundary rather than only within each agent
- [[agent-harness]] — is where this capability lives, which is why the same model becomes safer to run autonomously with no retraining — the guardrail is scaffolding around the model, not a property of it
- [[siem-agentic-visibility-gap]] — describes the gap this fills from the other side — a platform that can log that a call happened but not judge whether it was authorized is exactly what a model-based approver supplies, at the cost of moving a security decision into a model
- [[emergent-misalignment-from-reward-hacking]] — covers a threat this design explicitly does not lean on, and the two are complementary: action-level blocking catches a model whose reasoning is concealed but whose action trips a rule, where chain-of-thought monitoring catches the reverse
- [[agent-write-permission-separation]] — classifier-mediated approval is a concrete mechanism for enforcing the guardrail the read/write permission split calls for — a model judging each proposed action before it executes is where output and write path get separated.
- [[layered-agent-guardrails]] — classifier-mediated approval is a concrete implementation of layered agent guardrails' pre-tool-hook layer — a model judging each proposed action before it executes is the last point at which an assembled command can still be rejected.
- [[agent-loop-governance]] — classifier-mediated approval is exactly the kind of automated approver agent-loop governance says must earn trust before being believed and have a share of its decisions re-examined by people, rather than being adopted and left unaudited.

## Applications

Running an agent autonomously on a real machine without either hand-approving every action or disabling permissions outright, and more broadly wherever a human approval step has decayed into a rubber stamp through fatigue. The transferable pieces are narrowing what the approver is allowed to see, tiering approvals by blast radius, and making denials recoverable so the common false positive costs one retry.

## Sources

- https://www.anthropic.com/engineering/claude-code-auto-mode

## See Also

- [[mcp-tool-poisoning]]
- [[subagent-delegation]]
- [[agent-harness]]
- [[siem-agentic-visibility-gap]]
