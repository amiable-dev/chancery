---
title: "Multi-Agent Revalidation"
date: 2026-05-10
domain: ai-agents
maturity: emerging
source_type: practitioner
topics: [multi-agent, patterns, evaluation]
tags: [concept, ai-agents, architecture, patterns, quality-control, false-positives, security, domain/ai-agents, maturity/emerging, source-type/practitioner, topic/multi-agent, topic/patterns, topic/evaluation]
status: draft
sources:
  - url: https://vercel.com/blog/introducing-deepsec-find-and-fix-vulnerabilities-in-your-code-base
    hash: sha256:c399354b792311861802cc040665b089cec906337d86e15faccc460eeb453a35
    retrieved: 2026-08-21
    class: unclassified
    reachability: ok
  - url: https://github.com/vercel-labs/deepsec/
    hash: sha256:13c7e4e41d95145ee3fb285e04f06a795a7ad5b24d326fa6a78568e2a1c48732
    retrieved: 2026-08-21
    class: unclassified
    reachability: ok
---

# Multi-Agent Revalidation

## Definition
Multi-Agent Revalidation is a pipeline pattern in which a second, independent agent re-examines the outputs of a first agent — verifying findings, removing false positives, and reclassifying confidence or severity — before results are passed downstream. The two agents are given the same evidence but run separately, with the second agent acting as a peer reviewer rather than a continuation of the first.

## Explanation
Any agent operating under uncertainty will produce noise alongside signal. In high-stakes pipelines (security scanning, code review, medical triage), accepting all first-pass findings at face value leads to alert fatigue and wasted human effort. Multi-agent revalidation addresses this by structuring quality control as a second agent pass.

The key design decisions:
- **Independence:** The second agent should not see the first agent's reasoning or confidence score — only the raw evidence and the proposed finding. This prevents anchoring bias.
- **Adversarial framing:** The second agent is prompted to assume the finding *might* be wrong and must justify retaining it, not merely rubber-stamp it.
- **Reclassification authority:** The second agent can downgrade severity, change category, or reject the finding entirely — not just approve or reject.
- **Cost trade-off:** Running two full agent passes per candidate roughly doubles inference cost. This is worthwhile only for high-value pipelines where false positives are expensive.

Vercel's `deepsec` implements this in its **Revalidate** stage: after the Investigate stage produces findings, a second agent run re-examines each one and removes false positives or reclassifies severity. Combined with the initial agent pass, this brings the false positive rate to ~10–20% from a theoretical higher baseline.

This pattern is structurally similar to LLM Council's peer-review round, but scoped to a binary verify/reject decision on pre-formed findings rather than open deliberation.

## Key Properties
- **Peer independence:** Second agent sees evidence, not first agent's chain of thought
- **Asymmetric burden:** Second agent must justify keeping a finding, not just accepting it
- **Reclassification scope:** Can adjust severity, category, and confidence — not binary accept/reject only
- **Additive cost:** Roughly 2× inference cost per candidate reviewed
- **Composable:** Can stack (agent 1 → agent 2 → agent 3) but diminishing returns after two passes in practice

## Relationships
- Component of [[agent-powered-sast]]: the Revalidate stage in deepsec's pipeline
- Conceptually related to [[agentic-pipeline-verification]]: both use multi-stage agent pipelines for quality
- Shares structure with LLM Council (see `llm-council` skill): peer review before synthesis, though Council targets open deliberation while revalidation targets finding verification
- Related to [[human-in-the-loop-pattern]]: revalidation can replace or augment human review for scalable quality gates
- Related to [[behavioral-qa-agents]]: both address the nondeterminism problem in agent outputs, from different angles
- Related to [[cross-vendor-agent-review]]: cross-vendor review is a specialised form of revalidation where the reviewer comes from a different LLM vendor than the author — maximising reviewer independence

## Applications
- **Security vulnerability scanning:** Reject false-positive CVE findings before they become tickets
- **Code review pipelines:** Second agent pass filters spurious style/bug suggestions
- **Automated triage:** In an email or ticket triage pipeline, a revalidation agent prunes low-confidence classifications before escalation
- **Medical/legal document review:** High-stakes extraction where false positives cause real harm
- **Any agent pipeline where output quality matters more than raw recall:** Prefer precision over recall, use revalidation to tune the trade-off

## Study
- Flashcards: [[flashcards/multi-agent-revalidation|Practice this concept]]

## Sources
- [Introducing deepsec](https://vercel.com/blog/introducing-deepsec-find-and-fix-vulnerabilities-in-your-code-base) — Primary implementation example; discusses the Revalidate stage and resulting false positive rates
- [deepsec GitHub](https://github.com/vercel-labs/deepsec/) — Open-source reference


## See Also
- [[agent-powered-sast]]
- [[refusal-classifier]]
- [[agentic-pipeline-verification]]
- [[human-in-the-loop-pattern]]
- [[behavioral-qa-agents]]
- [[tool-output-inspection]]
- [[cross-vendor-agent-review]]
