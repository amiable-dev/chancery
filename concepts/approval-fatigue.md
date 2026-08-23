---
title: "Approval Fatigue"
date: 2026-05-10
domain: human-factors
maturity: emerging
source_type: practitioner
topics: [safety]
tags: [concept, ai-agents, safety, ux, human-factors, governance, domain/human-factors, maturity/emerging, source-type/practitioner, topic/safety]
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

# Approval Fatigue

## Definition
Approval fatigue is the cognitive degradation that occurs when an AI agent requests human confirmation so frequently that users stop critically reviewing what they are approving — either rubber-stamping all requests without reading them, or bypassing the approval mechanism entirely to eliminate friction. The result is the exact safety failure the approval mechanism was designed to prevent.

## Explanation
Human-in-the-loop approval gates are a core safety primitive for agentic systems: before an agent takes a consequential action, it pauses and asks the human "is this OK?" In principle, this gives humans meaningful oversight over AI behaviour. In practice, approval fatigue undermines this guarantee.

**The mechanism of fatigue:**
When nearly every agent action requires a click through an approval prompt, users enter a low-attention mode. Anthropic's data showed users accepted **93% of all permission prompts** in Claude Code's default mode. When you approve nearly everything, approvals stop being a meaningful decision point and become a ritual — muscle memory rather than judgment.

This manifests in two failure modes:
1. **Rubber-stamping**: Users approve without reading. The approval gate still exists but provides no real oversight. A dangerous action (e.g., deleting remote branches, exposing credentials) would be approved alongside the mundane ones.
2. **Permission bypass**: Users reach for escape valves — in Claude Code's case, the `--dangerously-skip-permissions` flag — which disables all approval prompts and lets the agent act freely with zero guardrails. The cure is worse than the disease.

**Why frequency drives fatigue:**
Approval prompts interrupt workflow. Each one breaks concentration, requires context-switching, and demands re-reading what the agent is about to do. For a long coding session with dozens of file operations, this overhead accumulates rapidly. Humans are rational: they optimise for flow state, and the approval mechanism becomes an obstacle rather than a safety net.

**The solution space:**
The problem isn't that approvals exist — it's that they're applied uniformly to both safe and dangerous actions. The correct response is to:
- Automatically approve actions that are demonstrably safe (read-only operations, in-project file edits)
- Reserve human approval for actions with real downside potential
- Use a [[transcript-classifier|classifier-based system]] to make that determination accurately

This is the design philosophy behind Claude Code's auto mode: the approval burden moves from humans to an AI classifier, which can operate consistently without fatigue.

**The asymmetric risk:**
Approval fatigue creates a perverse dynamic: safety mechanisms that are too frequent become ineffective, while simultaneously conditioning users to accept autonomous AI action as normal. When the exceptional eventually occurs, users are least prepared to catch it.

## Key Properties
- Occurs when approval frequency is too high relative to user attention capacity
- Produces two failure modes: rubber-stamping and permission bypass
- Is a UX/human-factors problem with safety consequences, not a technical bug
- Worsens in proportion to session length and approval volume
- Creates a feedback loop: fatigue → bypass → more unsafe defaults become acceptable

## Relationships
- Related to [[human-in-the-loop-pattern]]: HITL is the design pattern that generates approvals; approval fatigue is what happens when HITL is miscalibrated (too many checkpoints)
- Motivates [[transcript-classifier]]: classifier-based approval automation is the primary technical response to approval fatigue
- Related to [[two-tier-agent-execution-model]]: per-action approval gates in Tier 2 agents are designed to prevent approval fatigue through scope limitation — only execution-tier agents generate approvals
- Related to [[agent-governance-gap]]: when approval fatigue leads to AI-side automation of approvals, governance frameworks that assumed human approvers become outdated

## Applications
**Diagnosing approval fatigue in your system:**
- Track approval acceptance rates: if >85–90% of approval prompts are accepted, fatigue may already be present
- Monitor for users configuring `--dangerously-skip-permissions` or equivalent bypass flags
- Review session lengths vs. approval counts — long sessions with high prompt volumes are highest risk

**Designing around approval fatigue:**
- Apply tiered classification: only route actions with genuine downside potential to human approval
- Provide context in approval prompts — not just "allow shell command?" but the specific command and why it's being run
- Default-allow clearly safe operations (file reads, search, navigation) without any prompt
- Give users meaningful summary-level review (e.g., "Claude made 34 file edits in your project folder — review before continuing?") rather than per-action micro-approvals

**Organisational parallel:**
The same dynamic appears in security certificate approval workflows, change management processes, and code review: when reviewers face high volumes of low-risk items, the cognitive overhead means high-risk items receive the same shallow attention.

## Sources
- [Claude Code auto mode: a safer way to skip permissions](https://www.anthropic.com/engineering/claude-code-auto-mode) — Anthropic engineering blog; quantifies the 93% acceptance rate and describes the approval fatigue problem as the design motivation for auto mode
- [Inside Claude Code Auto Mode: Autonomous Coding with Human Approval Gates](https://www.infoq.com/news/2026/05/anthropic-claude-code-auto-mode/) — InfoQ summary; frames the governance implications

## See Also
- [[human-in-the-loop-pattern]]
- [[transcript-classifier]]
- [[two-tier-agent-execution-model]]
- [[agent-governance-gap]]
- [[constrained-agent-actions]]
- [[diff-classifier-pattern]] — the general two-stage fix: split detection from a materiality classification so only genuinely risky changes reach a human, rather than every flagged event
