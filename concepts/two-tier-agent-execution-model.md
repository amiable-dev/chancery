---
title: "Two-Tier Agent Execution Model"
date: 2026-04-29
domain: ai-agents
maturity: emerging
source_type: practitioner
topics: [patterns, safety]
tags: [concept, ai-agents, architecture, patterns, safety, governance, domain/ai-agents, maturity/emerging, source-type/practitioner, topic/patterns, topic/safety]
status: draft
sources:
  - url: https://cybersecuritynews.com/pentest-ai-agents-tool/
    hash: sha256:682aa76268791695e6e07283f83d0a81b6f2f675a0ddddea7512972aad7f9aee
    retrieved: 2026-08-21
    class: unclassified
    reachability: ok
---

# Two-Tier Agent Execution Model

## Definition
An agent safety architecture that divides a fleet of AI agents into two distinct execution tiers: **Tier 1 (advisory)** agents that analyse, explain, and recommend without executing actions, and **Tier 2 (execution)** agents that compose and run commands against real targets — but only with explicit per-action human approval before each step. The distinction enforces a hard boundary between analysis and consequence.

## Explanation
When AI agents interact with real systems — running shell commands, making network requests, modifying databases — the stakes of an error are high and potentially irreversible. A single generalised agent that both analyses and executes creates a dangerous surface: there's no structural guarantee that the model won't conflate recommendation with action.

The Two-Tier model separates these concerns at the architectural level:

**Tier 1 — Advisory Agents**
- Receive human-supplied tool output (e.g., scan results, logs) as passive input
- Produce analysis, prioritisation, methodology guidance, and recommended next commands
- Never call external tools or execute commands themselves
- Cheap to run (can use smaller/cheaper models like Claude Haiku in "lite mode")
- Low risk: worst case is a bad recommendation, not a destructive action

**Tier 2 — Execution Agents**
- Compose and execute commands against a declared, authorised scope
- Display each command to the user before execution — the agent *cannot* proceed without explicit approval
- Write findings to a persistent database automatically on completion
- Higher cost (require larger, more capable models)
- Risk is bounded by the approval gate — no command runs without human sign-off

**The approval gate** is the critical control mechanism. Each Tier 2 agent action is surfaced as a confirmation step (in Claude Code, the LLM's bash/tool call is shown before execution). The human can review, modify, or cancel. This is more than HITL at the workflow level — it's per-action approval at the lowest granularity.

**Automatic routing:** A well-designed two-tier system automatically routes incoming queries to the appropriate tier. Simple analysis questions go to advisory agents; active testing requests route to execution agents — preventing accidental command execution from analysis-intent queries.

**Example from pentest-ai-agents:**
```
Tier 1: Recon Advisor (paste nmap output → get analysis + next steps)
Tier 2: Web Hunter (runs ffuf, sqlmap, dalfox → each command shown for approval)
Tier 2: AD Attacker (runs BloodHound, Impacket, CrackMapExec → per-command gates)
```

## Key Properties
- **Hard execution boundary**: Tier 1 agents are architecturally incapable of running commands — their only output is text
- **Per-action approval gates**: Tier 2 agents gate on every individual command, not just workflow milestones
- **Scope declaration**: Tier 2 agents operate within a declared authorised scope, not ad-hoc targets
- **Cost differentiation**: Tier 1 is cheap (small models); Tier 2 requires capable models — costs reflect risk level
- **Composable with persistence**: Tier 2 agents can write to a shared findings database, enabling cross-session continuity

## Relationships
- Related to [[human-in-the-loop-pattern]]: HITL describes human checkpoints generally; the two-tier model is a specific structural implementation with advisory/execution split at the fleet level
- Related to [[constrained-agent-actions]]: Both constrain what agents can do; two-tier constrains *which* agents can execute at all; constrained actions constrain *what* output is valid
- Related to [[supervisor-agent-pattern]]: A supervisor could route between tiers; the two-tier model adds a safety dimension to the supervisor's routing decision
- Builds on [[multi-agent-systems]]: Two-tier is a multi-agent specialisation strategy where specialisation axis is advisory vs. execution capability

## Applications
**Penetration testing and offensive security:** The prototypical use case. Advisory agents analyse recon data; execution agents run actual attack tools only against in-scope targets, with each action requiring explicit researcher approval.

**Infrastructure automation:** Tier 1 agents diagnose system issues and recommend fixes; Tier 2 agents apply patches — but only after showing the exact commands to the operator.

**Data pipeline management:** Tier 1 detects anomalies and suggests remediation; Tier 2 runs the corrective SQL or API calls with per-query approval.

**Code deployment:** Tier 1 reviews changes and flags risk; Tier 2 executes deployments — but only to declared environments and only after showing exactly what will run.

The pattern is particularly valuable for any domain where a wrong action is expensive, irreversible, or potentially illegal to perform outside an authorised scope.

## Sources
- [pentest-ai-agents — 28 Claude Code Subagents for Penetration Testing](https://cybersecuritynews.com/pentest-ai-agents-tool/) — primary example of the pattern at scale, 28 agents across two tiers

## See Also
- [[human-in-the-loop-pattern]]
- [[constrained-agent-actions]]
- [[supervisor-agent-pattern]]
- [[ai-assisted-penetration-testing]]
