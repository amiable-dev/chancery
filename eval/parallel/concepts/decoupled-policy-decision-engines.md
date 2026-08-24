---
title: Decoupled policy decision engines
aliases:
  - Policy as code
  - Open Policy Agent
  - OPA
date: 2026-08-24
tags:
  - concept
  - security
  - agents
  - authorization
  - policy-as-code
status: draft
sources:
  - url: https://www.openpolicyagent.org/docs
    hash: sha256:86f243f04e33e8d7a372cb86dda0bde94d85c89e00b64b4f66dd2019f9685301
    retrieved: 2026-08-24
    reachability: ok
---

# Decoupled policy decision engines

## Definition

A decoupled policy decision engine is an authorization architecture that separates the decision of whether an action is allowed from the code that enforces it: the enforcing software sends structured, arbitrary data — the specific request plus any external context such as accumulated spend, a rate-limit counter, or a computed risk score — to a general-purpose engine that evaluates a declarative policy against it and returns a structured decision, which can be far richer than yes or no; because the policy is a program evaluated against whatever data is supplied rather than a fixed enumerated list of permitted actions, it can express conditions a static allowlist structurally cannot, such as a budget that tightens as it is consumed, a rate that adapts to recent behaviour, or a risk score computed from session history.

## Explanation

Open Policy Agent (OPA), a CNCF-graduated project used for admission control in Kubernetes, API gateway authorization, and CI/CD gating, is the reference instance of this architecture. The enforcing application queries OPA with structured input — the request being evaluated — and OPA evaluates it against policy written in a declarative language (Rego) plus whatever additional data has been loaded into it, returning structured output rather than a single boolean. That output shape matters as much as the decoupling itself: a policy can return a remaining budget, a reason string, or a required follow-up action alongside the allow or deny, none of which a fixed allow list has any way to carry. The nuance worth being precise about is where the statefulness actually lives — OPA itself evaluates each query fresh against its current data, so the engine is not maintaining session memory on its own; the power comes from the fact that the calling application (or a data-sync sidecar such as OPAL) can feed it whatever mutable state matters — cumulative token or dollar spend for the session, a rate-limit counter, a risk score computed elsewhere — as ordinary data, and the policy language can condition on it exactly as it conditions on the request itself. A static allowlist has no equivalent: it enumerates permitted actions once, so encoding a rate that adapts to recent behaviour or a budget that shrinks as it is consumed means abandoning the list entirely and writing bespoke code around it. A decoupled engine keeps that logic declarative, auditable, and swappable without touching the enforcing application.

## Key Properties

- Policy decision-making is offloaded to a separate engine queried with structured data, rather than embedded as if/else logic in the enforcing application
- The engine's output is arbitrary structured data, not just allow or deny, so a decision can carry a reason, a remaining budget, or a required follow-up action
- Because policies are programs evaluated against supplied data rather than a fixed enumerated list, they can express budgets, adaptive rate limits, and risk scores that a static allowlist has no way to represent
- The engine itself is typically stateless per evaluation — the statefulness comes from external data (session history, accumulated spend, live counters) the caller supplies alongside the request

## Relationships

- [[layered-agent-guardrails]] — gives the permissions layer that guardrail ordering treats as a static allow/deny list a strictly more expressive alternative — the same position in the pipeline, evaluated by a program against supplied state instead of a fixed list
- [[risk-tiered-agent-change-control]] — is a general mechanism for exactly the kind of consequence- and context-sensitive gating that tiered change control calls for, letting the gate condition on computed risk rather than only on a hand-authored tier table

## Applications

Reach for a decoupled policy engine instead of a hard-coded permission list whenever the authorization decision needs to reference something that changes at runtime — a session's cumulative token or dollar spend, a rate limit that should tighten under load, or a risk score computed from recent behaviour — by having the enforcing code query the engine with the current request plus that external state and act on the structured decision it returns rather than a boolean.

## Sources

- https://www.openpolicyagent.org/docs

## See Also

- _None yet._
