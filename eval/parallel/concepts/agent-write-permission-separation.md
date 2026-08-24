---
title: Read and write permission separation for agents
date: 2026-08-24
domain: security
maturity: emerging
source_type: practitioner
tags: [concept, ai-agents, security, guardrails, domain/security, maturity/emerging, source-type/practitioner]
status: draft
sources:
  - url: https://machinelearningmastery.com/building-ai-agents-here-are-some-anti-patterns-to-avoid/
    hash: sha256:98569296763f146a6a01b895405a16ace647694b25d45fc669dcf276959a559b
    retrieved: 2026-08-24
    class: external-secondary
    reachability: ok
---

# Read and write permission separation for agents

## Definition

**Read and write permission separation for agents** is the principle that an agent's read operations and its write operations belong to different risk categories and must be governed differently from the start: reads can be wrong and cost a wasted run, while writes to production systems or communications sent to real users cannot be taken back. Because a language model can reason incorrectly and produce a wrong answer with high confidence, the design places guardrails between the agent's output and any action that changes state — output validation before a write executes, scope constraints limiting what the agent can touch, and explicit human confirmation for high-stakes or irreversible actions.

## Explanation

The mechanism is that confidence and correctness are uncorrelated in a model's output, so nothing in the agent's own reasoning distinguishes a good write from a bad one at the moment of execution. The separation therefore has to be structural: the permission boundary is drawn per tool according to the consequences of that tool being called wrongly, not granted broadly on the assumption that the agent will use it well. That produces a graded design rather than a binary one, where a read-only query needs no gate, a scoped write needs validation of its payload and a constraint on its target, and an irreversible action — a financial transaction, a customer-facing message, a destructive database change — needs a person in the path. Two details make this hold up in practice. Validation must sit between the model's proposal and the effect, not inside the prompt, because instructions the model is asked to follow are not a control over the model. And scope constraints do most of the day-to-day work, since limiting what an agent can reach converts many potential incidents into failed calls. The source is a practitioner listicle drawing on vendor and identity-provider guidance, so this is a design principle rather than a measured control, but it is the same reasoning that governs least-privilege design for any automated actor.

## Key Properties

- Reads and writes are different risk categories and warrant different controls from the first design
- Model confidence carries no information about correctness, so the agent cannot gate its own writes
- Permission boundaries are drawn per tool by consequence of misuse, not granted broadly by default
- Validation belongs between the proposal and the effect, since prompt instructions are not a control over the model
- Irreversible or high-stakes actions take a human confirmation step rather than a stronger prompt

## Relationships

- [[risk-tiered-agent-change-control]] — is the full institutional form of this idea, splitting creation, checking, authorization and deployment across separate identities and selecting approvers by the consequence class of what a change touches
- [[agent-error-compounding]] — is why the separation is urgent rather than merely tidy, since a compounding error that only reads wastes a run while the same error with write access becomes an incident
- [[agent-harness]] — is where the boundary is actually enforced, because permission scoping and pre-write validation are properties of the tools an agent is given rather than of the model calling them
- [[principle-of-least-agency]] — least agency is the general principle the read/write permission split narrows to one axis — the boundary drawn around what an agent can access and do, applied to the one split that cannot be undone once crossed.
- [[classifier-mediated-approval]] — classifier-mediated approval is a concrete mechanism for enforcing the guardrail the read/write permission split calls for — a model judging each proposed action before it executes is where output and write path get separated.

## Applications

Classifying each tool an agent holds by what its misuse would cost and attaching validation, scoping or a human gate accordingly, and reviewing an existing agent for write paths that were granted broadly rather than by consequence.

## Sources

- https://machinelearningmastery.com/building-ai-agents-here-are-some-anti-patterns-to-avoid/

## See Also

- [[risk-tiered-agent-change-control]]
- [[agent-error-compounding]]
- [[agent-harness]]
