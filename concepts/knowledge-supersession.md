---
title: "Knowledge Supersession"
date: 2026-04-14
domain: knowledge-management
maturity: emerging
source_type: practitioner
topics: [pkm, provenance]
tags: [concept, knowledge-management, ai-agents, pkm, versioning, epistemology, domain/knowledge-management, maturity/emerging, source-type/practitioner, topic/pkm, topic/provenance]
status: draft

sources:
  - url: https://gist.github.com/rohitg00/2067ab416f7bbe447c1977edaaa681e2
    hash: sha256:9cec05f1dcdf4fc0162cfd801b68c448df9b7ee1fa4ee94c17c5c607909ab3ff
    retrieved: 2026-08-21
    class: unclassified
    reachability: ok
  - url: https://gist.github.com/karpathy/442a6bf555914893e9891c11519de94f
    hash: sha256:38e4f6b3bc571142fda8122633d849887afb108c2ab5b84251a024bab995c2dc
    retrieved: 2026-08-21
    class: unclassified
    reachability: ok
---

# Knowledge Supersession

## Definition
A structured mechanism for replacing outdated or contradicted knowledge claims in a wiki, where the new claim explicitly supersedes the old one: both versions are preserved, linked, and timestamped, with the old marked stale rather than deleted.

## Explanation
In a naive knowledge base, conflicting information accumulates silently. Someone updates a fact inline, the old version disappears, and provenance is lost. Or worse, both versions coexist with no indication which is authoritative.

Knowledge Supersession applies version-control semantics to *claims*, not files:

1. **Trigger:** A new source provides information that contradicts or updates an existing claim.
2. **Preserve old:** The existing claim is marked `status: superseded`, timestamped, and linked to its successor.
3. **Link forward:** The new claim includes a `supersedes: old-claim` reference.
4. **Confidence update:** The old claim's [[knowledge-confidence-scoring|confidence score]] drops to near zero; the new claim starts with a score derived from its source.
5. **Human override:** The default resolution can be overridden when the LLM's source-authority weighting is wrong.

**Example:**  
*Claim A (2025-06-01):* "Service X uses PostgreSQL 14."  
*Claim B (2026-03-15):* "Service X migrated to PostgreSQL 17."  
→ Claim A is marked `superseded by Claim B, stale as of 2026-03-15`. Claim B references A. Both exist. The LLM uses B but can audit why A existed.

This is fundamentally different from just adding an annotation — supersession is a structural operation that changes how the knowledge base navigates the claims.

## Key Properties
- Old claims are preserved, not deleted — full provenance trail.
- Supersession is timestamped and linked bidirectionally.
- Linked to [[knowledge-confidence-scoring]]: supersession resets scores on both old and new claims.
- Automated contradiction detection (on write) triggers supersession candidates; humans review.
- Reversible: if the new claim turns out to be wrong, the old one can be reinstated.

## Relationships
- Builds on [[knowledge-confidence-scoring]]: supersession is triggered when a new claim has higher confidence than an existing one it contradicts.
- Complementary to [[retention-decay-knowledge]]: superseded claims decay faster; they fade but leave a trail.
- The [[agent-knowledge-schema]] defines contradiction resolution rules and source authority weights.
- Part of the broader [[knowledge-consolidation-tiers]] pipeline — supersession happens most actively in semantic memory.

## Applications
- **Evolving codebases:** Architectural decisions change; supersession tracks what was decided, when, and why it changed.
- **Library version tracking:** "Project X upgraded from Redis 6 to Redis 7" — old claim preserved for debugging legacy contexts.
- **Contradiction resolution:** When two sources conflict, supersession provides a resolution trail rather than silent overwrite.
- **Audit and forensics:** When a bug appears, the supersession trail may reveal a false update that weakened a correct earlier claim.
- **PoC path:** Add a `[superseded by: <note>, date: YYYY-MM-DD]` annotation convention to MEMORY.md. Manually apply it for the next 2 months and measure whether stale-fact bugs decrease.

## Sources
- [LLM Wiki v2 — Rohit Ghumare](https://gist.github.com/rohitg00/2067ab416f7bbe447c1977edaaa681e2) — supersession semantics, contradiction resolution
- [Andrej Karpathy's LLM Wiki](https://gist.github.com/karpathy/442a6bf555914893e9891c11519de94f) — original pattern (lacks supersession)

## See Also
- [[knowledge-confidence-scoring]]
- [[retention-decay-knowledge]]
- [[agent-knowledge-schema]]
- [[curated-over-mined-precedence]]: a related but distinct conflict-resolution rule — supersession resolves conflicts by recency (newer claim replaces older), while curated-over-mined precedence resolves them by source authority (human assertion outranks automated inference regardless of recency)
