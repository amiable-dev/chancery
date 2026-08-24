---
title: Self-falsification as a finding filter
aliases:
  - Falsification engine
  - Adversarial disprove pass
date: 2026-08-24
domain: security
maturity: emerging
source_type: vendor-doc
tags: [concept, security, agents, verification, domain/security, maturity/emerging, source-type/vendor-doc]
status: draft
sources:
  - url: https://github.com/capitalone/VulnHunter
    hash: sha256:95e44d08c95b4e9ae22bf5359c159cc862f52840f161457be6dac26c935f9b54
    retrieved: 2026-08-24
    class: external-primary
    reachability: ok
---

# Self-falsification as a finding filter

## Definition

**Self-falsification as a finding filter** is the practice of following each candidate finding with a structured pass whose declared objective is to destroy it — to locate the flawed assumption, the gap in the reasoning, or the control that would block the attack — and to discard any finding that survives only on assumptions it cannot support, so that what reaches a human is what withstood a genuine attempt at refutation.

## Explanation

The mechanism is objective inversion, and it only works as a distinct stage. A search process is rewarded for producing candidates and will accept the weakest chain of reasoning sufficient to reach one; asking that same process whether its finding is real invites it to defend a conclusion it has already committed to. Falsification changes the question from confirmation to refutation: instead of asking whether an exploit path exists, it asks what would have to be true for the path to fail, and enumerates the candidates — an input validator upstream of the sink, a type coercion that neutralises the payload, an authorization check between entry and sink, a deployment assumption that was asserted and never checked. What makes it a filter rather than a commentary is the disposal rule: a finding resting on an unsupported assumption is dropped, not annotated with a caveat. That is a deliberate bias toward silence, and it is correct only when the consumer's scarce resource is attention — a backlog nobody reads because it is nine-tenths noise is worse than a shorter list missing one true positive, whereas in a setting where a miss is catastrophic and reviewers are plentiful the opposite policy wins. The claim comes from a tool README rather than a measured study, so the discipline is what transfers; the note offers no numbers on how many true findings the filter costs.

## Key Properties

- The second pass's stated objective is refutation, not confirmation of the finding
- It enumerates blockers explicitly — upstream validation, authorization, type coercion, unverified deployment assumptions
- Disposal rule is discard-on-unsupported-assumption rather than annotate-and-forward
- It buys precision by accepting misses, so it suits consumers whose scarce resource is attention
- It must be a separate stage; the reasoning that produced a finding will defend it if asked

## Relationships

- [[evidence-recheck-triage]] — answers the same question with the opposite disposal rule — both interpose a second judgement between search and report, but this one discards a finding that rests on unsupported assumptions while that one downgrades it and shows it anyway, so the two encode opposite choices about which error to ship
- [[attacker-first-forward-analysis]] — supplies the candidates this filter consumes, and needs it, because narrowing the search direction reduces the noise floor without removing it
- [[exploitability-vs-reliability-evidence]] — self-falsification sits one stage earlier in the same evidentiary pipeline as the exploitability-versus-reliability distinction — self-falsification decides whether a candidate finding survives scrutiny at all, and the distinction then labels what kind of claim the survivor supports.

## Applications

Adding a disprove-your-own-finding stage to any LLM-driven detection pipeline before results reach a human; writing review checklists as refutation prompts rather than confirmation prompts; deciding explicitly, per pipeline, whether unsupported findings should be discarded or downgraded.

## Sources

- https://github.com/capitalone/VulnHunter

## See Also

- [[evidence-recheck-triage]]
- [[attacker-first-forward-analysis]]
