---
title: "Knowledge Confidence Scoring"
date: 2026-04-14
domain: knowledge-management
maturity: emerging
source_type: practitioner
topics: [pkm, provenance]
tags: [concept, knowledge-management, ai-agents, pkm, epistemology, domain/knowledge-management, maturity/emerging, source-type/practitioner, topic/pkm, topic/provenance]
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

# Knowledge Confidence Scoring

## Definition
A metadata mechanism for assigning and maintaining a numerical confidence score to each fact or claim stored in an LLM knowledge base. The score reflects the evidential weight behind a claim: how many sources support it, how recently it was confirmed, and whether contradicting evidence exists.

## Explanation
In a naive LLM wiki, all stored facts are treated as equally valid regardless of their provenance or age. Knowledge Confidence Scoring breaks this by attaching a living score (e.g., 0.0–1.0) to every claim.

**How a score is computed:**
- **Source count:** More independent sources citing the same claim → higher score.
- **Recency:** A fact confirmed last week outweighs one confirmed six months ago.
- **Contradictions:** Any contradicting evidence decreases the score.
- **Reinforcement:** Each new confirmation (re-access, corroborating source) resets/strengthens the score.

**Example:**  
The claim *"Project X uses Redis for caching"* might carry: `{sources: 2, last_confirmed: 2026-03-28, contradictions: 0, confidence: 0.85}`. The LLM can then surface that fact with appropriate hedging: *"fairly confident, confirmed last month from two sources."*

This turns the wiki from a flat ledger into a living probabilistic model — the LLM can reason about its own certainty and flag claims that need re-verification.

## Key Properties
- Scores are dynamic: they decay over time (see [[retention-decay-knowledge]]) and strengthen on reinforcement.
- Each claim carries its provenance metadata inline, not just in a changelog.
- Contradictions automatically reduce score; explicit [[knowledge-supersession]] resolves them.
- Enables tiered LLM responses: "I'm confident about X, less certain about Y."

## Relationships
- Coupled with [[retention-decay-knowledge]]: confidence decays on the Ebbinghaus curve absent reinforcement.
- Triggers [[knowledge-supersession]] when a newer, higher-confidence claim conflicts with an older one.
- Feeds into [[knowledge-consolidation-tiers]]: only claims above a confidence threshold get promoted to semantic/procedural memory.
- Complement to [[agent-knowledge-schema]]: the schema defines how scores are computed and what thresholds mean.

## Applications
- **Reliable fact retrieval:** LLMs can hedge responses appropriately ("I'm fairly sure but this is 4 months old").
- **Audit surfacing:** Periodic review can identify claims with confidence < 0.5 for human verification.
- **Source credibility weighting:** Claims from authoritative sources (e.g., official docs) start with higher base scores.
- **Contradiction resolution:** When two sources conflict, the higher-confidence claim wins by default.
- **PoC path:** Add `[confidence: 0.x, last-confirmed: YYYY-MM-DD]` inline annotations to facts in MEMORY.md and observe whether it changes how aggressively stale facts are relied upon.

## Sources
- [LLM Wiki v2 — Rohit Ghumare](https://gist.github.com/rohitg00/2067ab416f7bbe447c1977edaaa681e2) — primary source; covers confidence scoring, decay, reinforcement mechanics
- [Andrej Karpathy's LLM Wiki](https://gist.github.com/karpathy/442a6bf555914893e9891c11519de94f) — original pattern this extends

## See Also
- [[retention-decay-knowledge]]
- [[knowledge-supersession]]
- [[knowledge-consolidation-tiers]]
- [[agent-knowledge-schema]]
