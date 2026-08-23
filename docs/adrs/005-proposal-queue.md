---
title: "ADR-005: The proposal queue — the third state between pass and block"
status: accepted
date: 2026-08-22
tags: [adr, governance, queue]
links: ["004-rubric-shape.md", "006-two-tier-facets.md"]
council_review: "2026-08-22 packet 2 (APPROVE-WITH-CHANGES) — rework incorporated; dispositions in ../reviews/2026-08-22/dispositions.md"
---

## Context

For vocabulary and link decisions, both binary outcomes are wrong. **Hard-block** an unrecognised value and the agent picks a wrong-but-permitted one to get past the gate — conformance gained, meaning lost. **Auto-fix** and the agent's contextual judgment is silently destroyed — the 2026-07-26 incident class. Separately, both adversarial panels ranked "the queue ate the curator" as a top failure mode: any review queue must be prevented from becoming a landfill that silently defeats the system.

## Decision

A third state: the model **proposes**, the CLI **records**, a human **governs**.

- A novel value (facet, topic, link target, contested finding) never fails the write *operation* — but the novel value itself is **dropped from the written file and recorded as a proposal** in `.kb/queue/*.jsonl`. The note lands valid-under-current-vocabulary; the proposal carries the candidate value and its context. (The earlier prose said "the write proceeds provisionally", implying the novel value entered canon pending review — the shipped code never did that, and the reviewed wording now matches the code: canon never contains un-adjudicated vocabulary.)
- Accepting a proposal is the **only** path by which vocabulary (`facets.yml`) changes — evolution is governed, never a runtime side effect.
- **Ageing has teeth**: `kb verify` fails on proposals left unreviewed past the threshold (KB011), computed against the declared `--as-of` date (ADR-002's single clock input — verify stays deterministic given (tree, as-of)). Drift becomes a backlog signal, not a wall agents route around.
- **Terminal states are `accepted` / `rejected` / `accepted-tension`** — the third terminal exists so a legitimately unresolved tension (two notes in recorded disagreement, a contested tier) can be *governed as open* without KB011 reddening the corpus forever. `accepted-tension` requires a rationale and is revisited only by explicit re-open, not by ageing.
- **The curator budget outranks the queue** (SCOPE §5): if adjudication demand exceeds the owner's stated weekly budget, the gates get simpler — tracked as trigger T6, and a precondition audit before any gate-expanding feature (R1b) is built.

## Consequences

- Proposals are dedupe-keyed and survive resolution as an audit trail (never deleted).
- Every future judgment-bearing feature (audit findings, contested tiers) routes through the same queue rather than inventing its own review surface.
