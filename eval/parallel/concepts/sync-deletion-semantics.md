---
title: Deletion semantics in continuous sync
date: 2026-08-24
tags:
  - concept
  - data
  - distributed-systems
  - sync
status: draft
sources:
  - url: https://towardsdatascience.com/how-to-build-a-context-layer-and-a-company-brain/
---

# Deletion semantics in continuous sync

## Definition

**Deletion semantics in continuous sync** is the observation that removal is the hardest part of mirroring external sources: items disappear through at least six distinct channels, and bounded collections versus unbounded streams need *opposite* deletion strategies — while every wrong choice fails silently rather than loudly.

## Explanation

The six channels: the source confirms removal; a parent's manifest stops listing a child; a cursored record expires; a stale probe 404s; a full re-walk completes without seeing an item; a user disconnects a source. Each needs handling, and missing one produces the signature failure — a mirror that confidently describes a table dropped months ago. The structural trap is that the two natural strategies are each correct for one shape of data and destructive for the other: manifest-diff deletion (remove what the latest listing omits) is right for bounded collections like a table's columns, but applied to a cursored stream it wipes all history below the watermark; full-rescan tombstoning (mark dead what a complete walk never saw) is right for unbounded streams, but on bounded collections it wastes enormous work. Neither misuse throws an error — the data is just quietly wrong. The transferable rule: classify every synced collection as bounded or unbounded, choose the deletion strategy per classification, and enumerate the removal channels explicitly per source, because none of them will announce themselves.

## Key Properties

- Six disappearance channels, each needing explicit handling
- Manifest-diff deletion: correct for bounded collections, wipes history on cursored streams
- Full-rescan tombstoning: correct for unbounded streams, wasteful on bounded collections
- Failure mode is silent wrongness, not errors

## Relationships

- [[context-layer]] — is that architecture's hardest correctness obligation — its map stays trustworthy only if every removal channel is covered

## Applications

Designing any mirror of external systems — search indexes, caches, data catalogs, knowledge bases fed by connectors; auditing an existing sync for channels it silently misses.

## Sources

- https://towardsdatascience.com/how-to-build-a-context-layer-and-a-company-brain/

## See Also

- [[context-layer]]
