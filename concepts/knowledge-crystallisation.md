---
title: "Knowledge Crystallisation"
date: 2026-04-14
domain: knowledge-management
maturity: emerging
source_type: practitioner
topics: [pkm, memory]
tags: [concept, knowledge-management, ai-agents, pkm, automation, memory, domain/knowledge-management, maturity/emerging, source-type/practitioner, topic/pkm, topic/memory]
status: draft

sources:
  - url: https://gist.github.com/rohitg00/2067ab416f7bbe447c1977edaaa681e2
    hash: sha256:9cec05f1dcdf4fc0162cfd801b68c448df9b7ee1fa4ee94c17c5c607909ab3ff
    retrieved: 2026-08-21
    class: unclassified
    reachability: ok
  - url: https://github.com/rohitg00/agentmemory
    hash: sha256:68a15ff9d16ad1dc8aadffa8f18fe6ce1f1ae3285d5cf97cbb0d193ae4c4edac
    retrieved: 2026-08-21
    class: unclassified
    reachability: ok
---

# Knowledge Crystallisation

## Definition
The automated process of taking a completed chain of intellectual work — a research thread, debugging session, or analysis arc — and distilling it into a structured wiki digest: the question asked, findings reached, entities involved, and lessons extracted. The resulting digest becomes a first-class knowledge base page, and the lessons feed back into the fact store as standalone claims.

## Explanation
Most knowledge management systems treat *sources* (articles, docs) and *explorations* (your own work sessions) differently — sources get ingested, explorations get logged. Knowledge Crystallisation collapses this distinction: a completed work chain is itself a source.

**Crystallisation pipeline:**
1. **Trigger:** Work chain completes (research thread concluded, bug fixed, analysis done).
2. **Summarise:** LLM compresses the session into a structured digest.
3. **Extract:** Entities involved (files, services, people, concepts), decisions made, lessons learned.
4. **File:** Digest becomes a new wiki page with first-class status.
5. **Strengthen:** Extracted lessons update the fact store — confirming or challenging existing claims, updating [[knowledge-confidence-scoring|confidence scores]].
6. **Graph update:** New entity-relationship edges added to the [[typed-knowledge-graph]].

**Structured digest format:**
```
Question: What was the triggering problem or goal?
Findings: What was discovered?
Entities: Which projects/services/people/files were involved?
Decisions: What was decided and why?
Lessons: What generalises beyond this specific case?
```

**Why it matters:**  
Manual session summaries (like daily notes) require human effort and get inconsistently filed. Automated crystallisation means every completed exploration becomes institutional memory without the bookkeeping burden. Debugging sessions that reveal architectural insights don't stay trapped in a git commit message.

## Key Properties
- Treats *explorations* as first-class sources, not just logs.
- Structured digest format enables downstream extraction (entity graph, fact strengthening).
- Automated trigger — fires on work chain completion, not on human memory.
- Lessons extracted as standalone facts feed [[knowledge-consolidation-tiers|semantic memory]] directly.
- Complements (not replaces) human-written summaries.

## Relationships
- Outputs feed [[knowledge-consolidation-tiers]]: crystallised digests are the episodic→semantic promotion mechanism for completed work.
- Extracted entities update the [[typed-knowledge-graph]].
- Confirmed facts boost [[knowledge-confidence-scoring|confidence scores]] for existing claims.
- The [[agent-knowledge-schema]] defines the digest format and extraction rules.
- Enables [[knowledge-supersession]] when a crystallised finding contradicts existing claims.

## Applications
- **Debugging capture:** Bug fix sessions auto-produce a digest: root cause, entities involved, fix applied, lessons. Never lose "how we fixed that weird Redis timeout" again.
- **Research threads:** A multi-session research arc on (e.g., OTel adoption) auto-crystallises into a structured summary that feeds the vault.
- **Onboarding acceleration:** New team members can query crystallised session digests to understand *how* past decisions were reached, not just what was decided.
- **PoC path:** On session end (or via heartbeat), auto-compress the session into a structured digest: question → findings → entities → lessons. File as an episodic memory entry in `memory/YYYY-MM-DD.md`. We already do daily notes manually — automating this tests the working→episodic tier promotion with real overhead data.

## Sources
- [LLM Wiki v2 — Rohit Ghumare](https://gist.github.com/rohitg00/2067ab416f7bbe447c1977edaaa681e2) — crystallisation concept, digest format, exploration-as-source
- [agentmemory (GitHub)](https://github.com/rohitg00/agentmemory) — reference implementation of session compression

## See Also
- [[knowledge-consolidation-tiers]]
- [[typed-knowledge-graph]]
- [[knowledge-confidence-scoring]]
- [[agent-knowledge-schema]]
