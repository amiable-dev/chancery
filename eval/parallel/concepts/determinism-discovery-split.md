---
title: Tools for certainty, agents for discovery
aliases:
  - Determinism and discovery split
date: 2026-08-24
domain: ai-agents
maturity: emerging
source_type: practitioner
tags: [concept, agents, architecture, reliability, domain/ai-agents, maturity/emerging, source-type/practitioner]
status: draft
sources:
  - url: https://www.infoq.com/presentations/reliable-ai-platforms/
    class: external-primary
---

# Tools for certainty, agents for discovery

## Definition

The **determinism and discovery split** is the rule that a compound AI system should route each responsibility by what the work demands of it: anything whose value is exactness and whose mistakes are expensive to unwind belongs in a deterministic tool that does only what it was told, anything whose value is finding something nobody specified belongs in an agent that is permitted to be wrong, and any agent behaviour that recurs identically should be demoted into a rule so the model's tokens are spent on judgment rather than on arithmetic.

## Explanation

The framing exists to break a false dichotomy the speaker sees in practice, where saying a system must be deterministic has become a socially acceptable way of saying no AI. Determinism is not the opposite of agency here but the ground it stands on. When a model repeatedly fumbles the same join, miscounts the same fleet or fails the same lookup, the correction is not a better prompt: it is a parametrised query, a runbook or a rule of thumb the agent invokes, which keeps the discovery capacity intact while making the mechanical part exact. The canonical instance is arithmetic delegated to code rather than expected from tokenisation. The case for tolerating wrongness on the other side of the line is stated just as plainly: an intern allowed to be wrong eight times occasionally produces the answer nobody would have specified, and an agent constrained to only pre-programmed branches forecloses that entirely. What sorts a task between the two is consequence and reversibility. A refund, a funds transfer, a reallocation of scarce compute worth millions gets a deterministic tool plus a human approval, because there a confident wrong answer is a loss rather than a lead. The corollary the talk stresses is that too little tool access is its own hazard, since a model with nothing exact to call will reason its way to a plausible number instead. This is a conference talk by an engineering leader recounting one production project, so it is a practitioner's account rather than a controlled comparison, and its organisational analogies are rhetoric — but the routing rule itself is testable in any system that has both surfaces.

## Key Properties

- Sorts work by consequence and reversibility, not by whether AI is fashionable in that part of the stack
- Recurring agent behaviour is demoted to a rule or parametrised query, preserving discovery and buying back tokens
- Reframes determinism as the grounding for agency rather than as a refusal of it
- Tolerated wrongness is the price of discovery, affordable only where a wrong answer is cheap
- Insufficient tool access is a hazard in itself, because the model will reason where it should have called something exact

## Relationships

- [[deterministic-agent-verification]] — applies the same preference for mechanical ground truth at a later point in the cycle — verification checks the agent's work after the fact, while this rule decides beforehand which work the agent should never have been handed
- [[agent-loop-patterns]] — supplies the loop shape this rule implies for consequential work, since the human-in-the-loop pattern is what a deterministic tool plus an approval step looks like once it is drawn as a cycle
- [[agent-archetypes]] — includes the archetype that keeps this split current — the consultant agent watches the running system for behaviour repetitive enough to be demoted into a deterministic rule

## Applications

Deciding which steps of an operational workflow get a tool and which get an agent; converting a recurring agent mistake into a canned query rather than a longer prompt; arguing for AI in a domain where stakeholders have already ruled it out on determinism grounds.

## Sources

- https://www.infoq.com/presentations/reliable-ai-platforms/

## See Also

- [[deterministic-agent-verification]]
- [[agent-archetypes]]
- [[agent-loop-patterns]]
