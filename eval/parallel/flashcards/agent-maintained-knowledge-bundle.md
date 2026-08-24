---
tags: [flashcards, knowledge-management, provenance, standards, domain/standards, maturity/emerging, source-type/vendor-doc]
sr-due: 2026-08-24
sr-interval: 1
sr-ease: 250
---

# Agent-maintained knowledge bundle — Flashcards

#flashcards/knowledge-management

## Definition of an agent-maintained knowledge bundle <!-- kb:card:1f4c5b -->
What is an agent-maintained knowledge bundle?
?
A corpus of markdown files with YAML frontmatter whose frontmatter records what each document derives from, who or what confirmed it, when it goes stale, and whether it's current — with no schema registry, central authority, or required runtime.

## The four frontmatter families <!-- kb:card:2854e7 -->
What four optional frontmatter families does the convention layer onto plain markdown?
?
Provenance, trust, lifecycle, and per-claim attribution — each answering one question a machine-written corpus raises that a hand-written one does not.

## Credibility as signals, not a score <!-- kb:card:e1ba03 -->
Why does provenance store per-source credibility signals instead of a single credibility score?
?
A score is subjective, doesn't port between consumers, and goes stale — storing signals (author, usage count, last-modified) instead lets credibility be inferred at read time rather than frozen at write time.

## How trust tiers are derived <!-- kb:card:efc4a3 -->
How are a document's trust tiers (unverified, machine-confirmed, human-reviewed) determined?
?
Generation and verification are kept as separate keys, and the tier is derived from whether any verifier's actor string carries the human prefix — it's inferred, not stored as a judgement.

## Why per-claim attribution uses stable ids <!-- kb:card:6b86c2 -->
Why does per-claim attribution key footnotes to a stable source id instead of a positional index?
?
Agents constantly rewrite these documents, and a positional reference silently misattributes the moment a list gets reordered.
