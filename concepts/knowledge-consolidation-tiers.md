---
title: "Knowledge Consolidation Tiers"
date: 2026-04-14
domain: knowledge-management
maturity: emerging
source_type: practitioner
topics: [memory, pkm]
tags: [concept, knowledge-management, ai-agents, pkm, memory, architecture, domain/knowledge-management, maturity/emerging, source-type/practitioner, topic/memory, topic/pkm]
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

# Knowledge Consolidation Tiers

## Definition
A four-layer memory architecture for AI knowledge bases that progressively compresses, validates, and promotes information from raw observations to stable, reusable knowledge. Each tier is more compressed, more confident, and longer-lived than the one below it.

## Explanation
Not all knowledge is the same. A raw note from a single debugging session is qualitatively different from a pattern confirmed across dozens of sessions. Knowledge Consolidation Tiers formalise this by creating distinct storage layers with explicit promotion rules:

| Tier | Name | Content | Lifetime | Compression |
|------|------|---------|----------|-------------|
| 1 | **Working memory** | Recent observations, unprocessed raw notes | Hours to days | None |
| 2 | **Episodic memory** | Session summaries compressed from raw observations | Days to weeks | Moderate |
| 3 | **Semantic memory** | Cross-session facts consolidated from episodes | Months to years | High |
| 4 | **Procedural memory** | Workflows and patterns extracted from repeated semantics | Persistent | Very high |

**Promotion mechanics:**  
Information moves *up* the tiers as evidence accumulates. A single observation lives in working memory. When the same pattern appears across multiple sessions, it gets consolidated into episodic. When episodic entries converge on the same fact, it becomes semantic. When a semantic fact is accessed repeatedly in the same operational context, it crystallises into a procedure.

**Analogy:** This mirrors human memory consolidation — the hippocampus (working/episodic) processing recent experience and gradually transferring it to neocortical long-term storage (semantic/procedural).

**Real-world mapping for existing PKM:**  
- Working = daily scratchpad notes  
- Episodic = `memory/YYYY-MM-DD.md` daily files  
- Semantic = curated `MEMORY.md`  
- Procedural = `AGENTS.md` / `TOOLS.md` workflows

## Key Properties
- Each tier has distinct compression ratio and retention policy.
- Promotion is evidence-driven, not time-driven.
- Tiers are not just storage — they carry different confidence levels (see [[knowledge-confidence-scoring]]).
- Forgetting (via [[retention-decay-knowledge]]) operates at each tier independently — working memory decays fast, procedural almost never.
- [[knowledge-crystallisation]] is the mechanism for promoting a completed work chain from episodic to semantic.

## Relationships
- Requires [[knowledge-confidence-scoring]] to determine when a fact is ready for promotion.
- Works alongside [[retention-decay-knowledge]] — lower tiers decay faster.
- [[knowledge-crystallisation]] automates the episodic→semantic transition for completed work chains.
- The [[agent-knowledge-schema]] defines the thresholds and rules for tier promotion.
- [[fsrs-scheduling]] — decides what earns a place in long-term memory; FSRS then decides the review interval that keeps it there

## Applications
- **Memory architecture design:** Structuring an AI agent's memory system with explicit tier separation prevents both noise accumulation and premature forgetting.
- **Reducing LLM context bloat:** Only promote to semantic/procedural when warranted — keeps the high-retention tiers clean and low-noise.
- **Automated maintenance:** Each tier can have its own lint/decay schedule (hourly for working, weekly for episodic, quarterly for semantic).
- **PoC path:** Instrument `memory/YYYY-MM-DD.md` → `MEMORY.md` promotion with explicit tier labels and promotion criteria; measure whether semantic memory quality improves over 30 days.

## Sources
- [LLM Wiki v2 — Rohit Ghumare](https://gist.github.com/rohitg00/2067ab416f7bbe447c1977edaaa681e2) — four-tier model with promotion mechanics
- [Andrej Karpathy's LLM Wiki](https://gist.github.com/karpathy/442a6bf555914893e9891c11519de94f) — original flat wiki this extends

## See Also
- [[knowledge-confidence-scoring]]
- [[retention-decay-knowledge]]
- [[knowledge-crystallisation]]
- [[agent-knowledge-schema]]
- [[memory-as-harness]] — the tiered memory model maps onto harness memory types; the harness determines what moves between tiers
- [[agent-memory-lock-in]] — accumulated value across tiers is exactly what gets locked in to a closed platform
