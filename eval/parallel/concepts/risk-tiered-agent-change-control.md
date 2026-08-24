---
title: Risk-tiered control of agent-authored change
aliases:
  - AI-native SDLC controls
  - Evidence receipts for agent-written code
date: 2026-08-24
domain: security
maturity: emerging
source_type: vendor-doc
tags: [concept, security, agents, software-process, domain/security, maturity/emerging, source-type/vendor-doc]
status: draft
sources:
  - url: https://www.nxcode.io/resources/news/ai-native-sdlc-security-controls-playbook-2026
    class: external-secondary
---

# Risk-tiered control of agent-authored change

## Definition

**Risk-tiered agent change control** is a security design for pipelines in which agents propose more plausible changes than humans can read: instead of requiring a person to inspect every line, it splits the four jobs of creating a change, checking it, authorizing it and deploying it across four distinct identities, selects the required checks and named human approvers by the consequence class of what the change touches rather than by its size, and makes each accepted change carry a structured evidence receipt from which someone else can reconstruct why it was accepted.

## Explanation

The design starts from a timing assumption that agents break. A conventional secure lifecycle assumes producing a meaningful change takes long enough for review, testing and release coordination to keep pace; once one engineer can launch several workers in parallel, the queue changes from work waiting to be written into work waiting to be understood. Three pressures follow: diffs get larger and more frequent so reviewer attention drops, one insecure pattern can be replicated across many repositories before anyone notices, and the worker identity typically holds file, shell, package, network and repository permissions at once, so a single compromised instruction becomes a credential or supply-chain event. The central negative claim is that a prompt is not a control — no instruction can enforce branch protection, revoke a credential, prove which binary ran, or stop a deployment identity — so the boundaries have to be structural: absent credentials, protected environments, branch rules, and a release identity independent of the coding one. Checking is then layered by failure class rather than piled up uniformly: deterministic checks under pinned versions for facts a machine can prove, narrow review agents for reasoning that requires reading intent across files, and named humans for decisions whose consequences are expensive. Each reviewer is given one question and an evidence contract — name the principal, resource, tenant boundary and a counterexample; name the new dependency graph path, its install scripts and provenance — because a finding phrased as a vague warning cannot be verified, and a reviewer that can silently amend the diff or resolve its own finding has destroyed the evidence. Tiering by consequence rather than by size is what makes the human budget spendable: a one-line authorization error outranks a 2,000-line generated test suite. The distinctively agentic failure the plan names is capability composition — two individually limited agents joined by a shared message channel form a privileged path, as when a read-only incident agent asks a coding agent to ship its patch — so inter-agent requests are signed and policy asks whether the sender may request the action, not only whether the recipient may perform it. Finally, receipts and metrics keep the controls from becoming theatre: the receipt is structured and redacted rather than a raw transcript, and the measures are verified finding precision, escaped defects by tier, incident-fixture recall re-run after every model or harness change, and unauthorized side effects with a target of zero. The source is a vendor engineering playbook that reworks Anthropic's own published case study into a provider-neutral plan, and it is unusually candid about the limits of that study — the headline figures for AI-authored merged code and for the rise in substantively reviewed pull requests are one company's internal numbers with no published denominators, false-positive rates or severity distributions. Its durable content is the control structure, which is anchored to checkable public standards rather than to the case study's numbers.

## Key Properties

- Four jobs — create, check, authorize, deploy — are held by four identities, and no agent identity owns all of them
- The gate is chosen by consequence class, not diff size: a one-line authorization change outranks a 2,000-line generated test file
- Checking is layered by failure class — deterministic checks for provable facts, narrow reviewers for contextual reasoning, named humans for expensive decisions
- Each reviewer answers one question under an evidence contract and cannot amend the diff or resolve its own finding
- Capability composition is the agent-specific risk: two limited agents on a shared channel form a privileged path unless requests are signed and sender authority is checked
- The acceptance artifact is a structured, redacted receipt — task, versions, policy hash, checks, findings, approvals, provenance, rollback status — not a transcript

## Relationships

- [[harness-determined-injection-resistance]] — shares the same reframing from the enforcement side: because a model's compliance is decided by the surrounding system rather than by its weights, the controls that matter are missing credentials, protected environments and branch rules rather than any wording in the agent's prompt
- [[exposure-first-supply-chain-defense]] — applies that removal-of-conditions logic to the coding identity itself — dedicated worktree, registry proxy, egress allowlist and short-lived credentials strip out exactly the install-time hooks and long-lived tokens that argument identifies as the real product of a supply-chain attack
- [[siem-agentic-visibility-gap]] — is what closes that gap in practice: the lifecycle events this plan streams to the audit system — task creation, instructions loaded, tool calls, permission changes, network requests, findings, overrides, build identity, deployment and rollback — are the causal chain that conventional security telemetry cannot reconstruct
- [[contract-driven-agent-development]] — is the security counterpart of that delivery discipline: both refuse to let an agent's own satisfaction end a task, replacing it with a written exit condition — acceptance criteria there, verifiable evidence and a named approver here

## Applications

Designing the permission model for a coding-agent rollout so the worker cannot deploy and the reviewer cannot approve itself; writing a policy that maps sensitive paths to required checks and named approvers; building an acceptance receipt from tools a team already runs, so a reviewer inspects one structured page instead of five dashboards; auditing an existing agent pipeline by asking which of create, check, authorize and deploy a single identity currently spans.

## Sources

- https://www.nxcode.io/resources/news/ai-native-sdlc-security-controls-playbook-2026

## See Also

- [[harness-determined-injection-resistance]]
- [[exposure-first-supply-chain-defense]]
- [[siem-agentic-visibility-gap]]
- [[contract-driven-agent-development]]
