---
title: Observe-and-confine sandboxing
date: 2026-08-24
domain: security
maturity: emerging
source_type: practitioner
tags: [concept, agents, security, observability, domain/security, maturity/emerging, source-type/practitioner]
status: draft
sources:
  - url: https://papercompute.com/blog/missing-primitive-agent-infrastructure/
    hash: sha256:7c30e106f52bbf2744e05bfd75a552f88c7bb9dc79592054e5aa5b787fd7f3e9
    retrieved: 2026-08-24
    class: external-primary
    reachability: ok
---

# Observe-and-confine sandboxing

## Definition

Observe-and-confine sandboxing is the design position that isolating an agent's execution and fully observing what it did are not actually in tension, provided the observability layer captures durably from a point inside or beneath the sandbox boundary rather than being bolted on from outside it: because the capture happens where the agent cannot evade or outlive it, tightening the sandbox never has to come at the cost of losing visibility, and widening visibility never has to come at the cost of loosening the sandbox. This reframes a tradeoff agent-infrastructure teams commonly treat as forced — secure or observable, pick one — as an artifact of where capture is placed, rather than a property of security and observability themselves.

## Explanation

The classic tension arises because the two goals pull toward opposite designs when pursued independently: heavy isolation tends to obscure the execution details a debugger or auditor needs, while rich telemetry tends to widen what an agent, or an attacker who has compromised it, can reach or exfiltrate through. The synthesis resolves this by relocating capture rather than trading off either goal: if the durable record of every decision, request and response is written from inside the sandboxed runtime itself — the same boundary that contains the agent's blast radius — then containment and auditability are enforced by the same boundary instead of competing for it. A sandbox that also replays deterministically from that internal record turns failures from something reconstructed after the fact into something stepped through and resumed from, without ever having had to loosen the isolation to get that view. This is the same move distributed-systems infrastructure made earlier — durable execution logs and deterministic replay are what let a system be both fault-isolated and debuggable — applied to agent runtimes specifically.

## Key Properties

- Capture happens from inside or beneath the sandbox boundary, not bolted on from outside it
- Tightening isolation does not reduce visibility, because the boundary that contains the agent is the same boundary that records it
- Deterministic replay from the internal record turns debugging from after-the-fact reconstruction into step-through inspection
- Reframes 'secure or observable, pick one' as a placement decision, not an inherent tradeoff

## Relationships

- [[proxy-boundary-session-capture]] — supplies one workable placement for the capture layer this pattern requires — a transparent proxy recording every provider request and response — though the synthesis further requires that placement to sit inside the sandbox boundary, which the proxy concept alone does not address
- [[agent-checkpoint-resume]] — is the capability this pattern's durable, in-boundary capture makes safe to build: resuming from a recorded state only avoids reintroducing risk if that state was captured without punching a hole in the sandbox to get it
- [[siem-agentic-visibility-gap]] — names the security-side version of the same placement problem — visibility that lives outside infrastructure you control is not trustworthy record-keeping, which is why this pattern insists capture sit inside the boundary already enforced
- [[kernel-enforced-agent-sandbox]] — names the concrete kind of boundary this pattern's thesis is about — a kernel-enforced boundary is exactly the sandbox capture must sit inside or beneath for tightening isolation to never cost visibility.

## Applications

Deciding where to place an agent's telemetry and session-capture layer relative to its sandbox boundary, so hardening the isolation later does not require re-adding visibility from scratch; evaluating whether an agent-infrastructure vendor's observability claim is compatible with real isolation, by asking whether their capture point sits inside the sandbox or bypasses it; designing a debugging or audit workflow around deterministic replay from an in-boundary record instead of after-the-fact reconstruction from external logs.

## Sources

- https://papercompute.com/blog/missing-primitive-agent-infrastructure/

## See Also

- [[proxy-boundary-session-capture]]
- [[agent-checkpoint-resume]]
- [[siem-agentic-visibility-gap]]
