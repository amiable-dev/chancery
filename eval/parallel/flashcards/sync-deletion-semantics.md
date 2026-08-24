---
tags: [flashcards, data, distributed-systems, sync, domain/data, maturity/established, source-type/practitioner]
sr-due: 2026-08-24
sr-interval: 1
sr-ease: 250
---

# Deletion semantics in continuous sync — Flashcards

#flashcards/data

## Sync deletion semantics: definition <!-- kb:card:0e2c97 -->
Why is deletion described as the hardest part of mirroring external sources in continuous sync?
?
Items disappear through at least six distinct channels, bounded and unbounded collections need opposite deletion strategies, and every wrong choice fails silently rather than loudly.

## Manifest-diff vs full-rescan deletion <!-- kb:card:d93437 -->
When is manifest-diff deletion correct, and when is full-rescan tombstoning correct?
?
Manifest-diff (remove what the latest listing omits) is correct for bounded collections. Full-rescan tombstoning (mark dead what a complete walk never saw) is correct for unbounded streams. Each is destructive when applied to the other's data shape.

## Misapplying manifest-diff deletion <!-- kb:card:6d08a7 -->
What happens if manifest-diff deletion is applied to a cursored stream instead of a bounded collection?
?
It wipes all history below the watermark.

## Misapplying full-rescan tombstoning <!-- kb:card:2f60c6 -->
What happens if full-rescan tombstoning is applied to a bounded collection instead of an unbounded stream?
?
It wastes enormous work — a full walk to detect deletions that a manifest diff would find directly.

## The failure mode of wrong deletion strategy <!-- kb:card:b141c7 -->
What is the signature failure when a deletion channel is missed or the wrong strategy is used?
?
Silent wrongness, not an error — e.g. a mirror that confidently describes a table dropped months ago.

## Six deletion channels <!-- kb:card:9e6007 -->
Name the six channels through which an item can disappear from a source in continuous sync.
?
Source confirms removal; a parent's manifest stops listing a child; a cursored record expires; a stale probe 404s; a full re-walk completes without seeing an item; a user disconnects a source.
