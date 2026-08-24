---
title: Event-driven knowledge maintenance
date: 2026-08-24
domain: knowledge-management
maturity: emerging
source_type: practitioner
tags: [concept, knowledge-management, ai-agents, automation, domain/knowledge-management, maturity/emerging, source-type/practitioner]
status: draft
sources:
  - url: https://gist.github.com/rohitg00/2067ab416f7bbe447c1977edaaa681e2
    hash: sha256:9cec05f1dcdf4fc0162cfd801b68c448df9b7ee1fa4ee94c17c5c607909ab3ff
    retrieved: 2026-08-24
    class: external-primary
    reachability: ok
---

# Event-driven knowledge maintenance

## Definition

**Event-driven knowledge maintenance** replaces the manual operating loop of an LLM-maintained knowledge base with hooks bound to lifecycle events: a new source triggers ingest, entity extraction and index updates; session start loads relevant context; session end compresses the session into observations; each query checks whether its answer scores well enough to file back; each write checks for contradictions and triggers supersession; and a schedule drives lint, consolidation and retention decay — keeping humans on curation and direction while the bookkeeping runs itself.

## Explanation

The failure mode of manual operation is that maintenance happens only when someone remembers: lint passes lapse, good answers evaporate into chat history, contradictions linger. Hooks bind each maintenance action to the event that makes it necessary, so the work cannot be forgotten. Quality controls make the automation safe to trust: every piece of generated content is scored for structure, citations and consistency — by self-evaluation or a second pass — content below threshold is flagged or rewritten, and answers file back into the wiki only above a threshold. Lint becomes self-healing rather than advisory: orphan pages are linked or flagged, stale claims marked, broken cross-references repaired, so the wiki tends toward health without being asked. Contradictions get a proposed resolution by default — the likelier claim chosen from source recency, source authority and supporting-observation count, with human override. Crystallization closes the loop on exploration: a completed chain of work such as a research thread or debugging session is automatically distilled into a structured digest — question, findings, entities involved, lessons — that becomes a first-class page, its lessons extracted as standalone facts, so explorations are ingested like any other source. The source is a practitioner extension gist distilling the automation its author built into agentmemory; it is prescriptive experience from one team's engine, not a measured study.

## Key Properties

- Hooks bind maintenance to events: source added, session start and end, query answered, memory written, schedule tick
- Generated content is quality-scored; answers file back into the wiki only above a threshold
- Lint is self-healing — orphans linked or flagged, stale claims marked, broken cross-references repaired — rather than advisory
- Contradictions receive a default resolution from recency, authority and support count, with human override
- Crystallization distills completed work threads into digest pages plus extracted standalone lessons

## Relationships

- [[llm-wiki-architecture]] — automates that architecture's operating loop: the ingest, answer-filing and lint its human operator triggers manually become hooks bound to the events that require them
- [[knowledge-lifecycle-management]] — provides the execution layer for that lifecycle — contradiction checks on write drive supersession, and scheduled ticks drive consolidation and retention decay

## Applications

Wiring a knowledge base into an agent harness through hooks on ingest, session start and end, memory writes and a cron schedule; ending research or debugging sessions with an automatic crystallized digest instead of losing the thread to chat history.

## Sources

- https://gist.github.com/rohitg00/2067ab416f7bbe447c1977edaaa681e2

## See Also

- [[llm-wiki-architecture]]
