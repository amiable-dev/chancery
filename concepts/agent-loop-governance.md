---
title: Governing the automation loop
date: 2026-08-24
domain: security
maturity: emerging
source_type: vendor-doc
tags: [concept, security, governance, ai-native-sdlc, domain/security, maturity/emerging, source-type/vendor-doc]
status: draft
sources:
  - url: https://claude.com/blog/how-anthropic-secures-its-ai-native-software-development-lifecycle
    hash: sha256:74aebfb7eebcacc72db2e90756c8dfbedfd5e19d6b5953495895d850ef2aec64
    retrieved: 2026-08-24
    class: external-primary
    reachability: ok
---

# Governing the automation loop

## Definition

**Governing the automation loop** is the shift in what a security team attends to once agents do the reviewing, triaging and approving: the work stops being inspection of individual bugs and changes and becomes maintenance of the automation itself — confirming that new reviewers earn trust before they are believed, that a share of automated approvals is re-examined by people, that discovered bug classes actually return to the instructions, and that every agent action lands somewhere attributable.

## Explanation

The reason this needs scheduling rather than triggering is that the structure degrades in ways that raise no alert. A skill goes stale and quietly stops matching the codebase it was written for. A bug class is discovered and never written back into the instruction file, so a closed loop silently opens. An approval path drifts and, because nobody samples it, the drift is discovered by an incident instead of by inspection. The named controls map one-to-one onto those decay modes. Tiering the codebase by risk decides where automation is permitted at all and where human approval stays mandatory regardless of confidence. Shadow mode gives every new AI reviewer a probation in which it posts comments for human approval until its findings earn confidence, and the team red-teams it by inserting malicious changes to see whether it catches them. Risk-weighted sampling re-reviews a proportion of automated approvals so a failing path surfaces by inspection. A vitals dashboard rolls metrics up across every process so degradation is visible as a trend rather than as a surprise. And every automated approval, tool call and agent-to-agent message is routed to the SIEM together with the signals it used, making any decision reconstructable after the fact and letting the team treat its agents as a new insider-threat class with alerts when their actions fall out of alignment. The premise underneath is that human accountability does not disappear, only relocates: approvals are logged with their reasoning, and invariant tests such as 'user A can never read user B's data' trigger additional manual review independent of tier. The account is a vendor's first-person description of a practice still in progress, and it offers no measurement of the governance controls themselves.

## Key Properties

- Failure modes are silent: a stale skill, a bug class never written back, an approval path nobody samples
- Shadow mode — new AI reviewers post for human approval and are red-teamed until trust is earned
- Risk-weighted sampling re-examines a share of automated approvals so drift is found by inspection, not by incident
- Every automated approval, tool call and agent-to-agent message reaches the SIEM with the signals behind it
- Agents are treated as a new insider-threat class, alerting when their actions fall out of alignment

## Relationships

- [[siem-agentic-visibility-gap]] — is the obstacle this practice pushes against — routing every agent action together with the signals behind it is an attempt to hand the SIEM the semantic record it structurally lacks
- [[closed-loop-secure-codegen]] — is one of the loops under governance here, and its characteristic failure is exactly the silent kind, since a bug class that never gets written back leaves nothing behind to alert on
- [[loop-engineering]] — builds the loops this governs — the same cycle seen from the construction side rather than from the assurance side
- [[narrow-reviewer-ensemble]] — supplies the reviewers whose probation, sampling and slow degradation this governance is watching for
- [[classifier-mediated-approval]] — classifier-mediated approval is exactly the kind of automated approver agent-loop governance says must earn trust before being believed and have a share of its decisions re-examined by people, rather than being adopted and left unaudited.

## Applications

Standing up an approval process for AI reviewers — shadow mode, red-team probes, a stated sampling rate — before letting any of them gate a merge; instrumenting a security programme so that a degrading automated control shows up on a dashboard rather than in an incident review.

## Sources

- https://claude.com/blog/how-anthropic-secures-its-ai-native-software-development-lifecycle

## See Also

- [[siem-agentic-visibility-gap]]
- [[closed-loop-secure-codegen]]
- [[loop-engineering]]
- [[narrow-reviewer-ensemble]]
