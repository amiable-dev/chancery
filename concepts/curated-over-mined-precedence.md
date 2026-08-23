---
title: "Curated-over-Mined Precedence"
date: 2026-08-01
domain: knowledge-management
maturity: emerging
source_type: practitioner
topics: [rag, provenance]
tags: [concept, ai-agents, knowledge-management, epistemology, data-governance, domain/knowledge-management, maturity/emerging, source-type/practitioner, topic/rag, topic/provenance]
status: draft
sources:
  - url: https://towardsdatascience.com/how-to-build-a-context-layer-and-a-company-brain/
    hash: sha256:b20520de2900c93455d4757c6d6ed3ab57f2a8351623246c60ee9dbfe22da7ef
    retrieved: 2026-08-21
    class: unclassified
    reachability: ok
---

# Curated-over-Mined Precedence

## Definition
**Curated-over-mined precedence** is the ranking discipline that human-curated context items (e.g. "this table double-counts refunds before 2024") must structurally outrank automatically mined metadata when the two conflict, while learnings mined from real usage (query logs, validated conversations) feed back only as ranking *tie-breakers* — they *influence* retrieval, they do not *veto* it. The distinction matters because a veto lets one bad automated inference silently override a correct human correction; influence-only feedback bounds the damage a single wrong signal can do.

## Explanation
A mined context layer plateaus: the most valuable knowledge in an organization was often never written anywhere a connector can reach — it lives in the head of the analyst who knows a specific table double-counts refunds, or the engineer who knows a particular service migrated off a deprecated dependency last quarter. Left as mined metadata alone, the brain never learns these facts; it just confidently serves the stale or misleading version indefinitely.

The fix is to make human notes first-class context items — same identity scheme, same ACL enforcement, same lifecycle machinery as any mined item — and to give them a ranking privilege: on conflict with mined metadata, the curated note wins. This is a *structural* precedence, not a soft preference buried in a prompt; it has to be enforced at the same layer that resolves any other conflict between competing context items.

The second half of the principle addresses a different, subtler risk: as the system observes real usage (which queries succeeded, which joins analysts actually used, which retrieved items got acted on), those observations are valuable — they identify "golden queries" and living vs. abandoned tables. But if mined *behavioral* signal were allowed to veto retrieval the way curated notes do, a single spurious pattern (a bad query that happened to run twice) could silently suppress a correct result. So behavioral learnings are deliberately demoted to *tie-breakers*: they nudge ranking among otherwise-equivalent candidates, but they cannot override a context item on their own. Curation gets veto power because a human explicitly asserted it; mined behavior gets influence only, because nobody explicitly vouched for it.

## Key Properties
- **Two distinct trust tiers**: curated (human-asserted, veto-capable on conflict) vs. mined-behavioral (usage-derived, tie-breaker-only)
- **Curated items share the same machinery as mined items** — identity, ACLs, lifecycle — they are not a separate bolted-on annotation layer
- **Asymmetric failure bound**: a wrong curated note is a human error, auditable and correctable at the source; a wrong behavioral signal is bounded to nudging ties, so it cannot alone hijack retrieval
- **Prevents "forward-reference whack-a-mole"**: treating pipeline-generated or provisional claims as *pending, influence-weighted assertions* rather than binary valid/invalid avoids brittle all-or-nothing veto logic

## Relationships
- Composes [[context-layer-architecture]]: this is the "learn from curation and usage" pillar of a context layer
- Related to [[knowledge-supersession]]: both are mechanisms for resolving conflicting claims without silent overwrite, but supersession is a *temporal* resolution (newer claim replaces older, both preserved) while curated-over-mined precedence is a *source-authority* resolution (human assertion outranks automated inference, regardless of recency)
- Related to [[knowledge-confidence-scoring]]: curated-over-mined precedence is effectively a policy for *how* confidence scores should be initialized and adjusted — curated sources start with structurally higher authority than mined ones
- Related to [[wiki-lint-operation]]: a hygiene process that strips broken `[[links]]` outright is a *veto*-style rule; treating unresolved pipeline-generated links as pending, influence-weighted assertions rather than deleting them is the direct application of this precedence principle to this vault's own link-maintenance process

## Applications
- **Enterprise context layers**: any system mining metadata from live sources needs an explicit precedence rule for when a human correction and an automated inference disagree — silence on this defaults, dangerously, to "most recently synced wins"
- **This vault's weekly audit**: the current audit strips `[[links]]` whose target doesn't exist yet — a veto. Applying curated-over-mined precedence would mean treating a pipeline-generated forward reference as a pending assertion that survives (and is tracked) rather than being deleted, since it may resolve once the target concept note lands
- **Any pipeline mixing automated extraction with human review**: the general pattern — humans get veto power because they explicitly asserted something, automation gets influence only because nobody vouched for it — generalizes past knowledge layers to any human-in-the-loop data pipeline

## Sources
- [How to Build a Context Layer and a Company Brain — Towards Data Science](https://towardsdatascience.com/how-to-build-a-context-layer-and-a-company-brain/) — Tomer Mesika; from the "learning from curation and usage" section, where a mined brain is described as plateauing without first-class human-curated context items

## See Also
- [[context-layer-architecture]]
- [[knowledge-supersession]]
- [[knowledge-confidence-scoring]]
- [[wiki-lint-operation]]
