# Design spec: `kb audit` — the semantic half of lint

**Status:** implemented 2026-08-22 · **ADR:** [002](../adrs/002-ci-is-the-contract.md), [005](../adrs/005-proposal-queue.md), [007](../adrs/007-retrieval-posture.md), [010](../adrs/010-judgment-suppliers.md) · **Council review:** 2026-08-22 packet 4 (REJECT) — rewritten; dispositions in [`../reviews/2026-08-22/dispositions.md`](../reviews/2026-08-22/dispositions.md)

Structural lint checks schema; this checks **meaning**, in the two-phase shape. Builds after validation-r1a (graph-rot depends on its supersession checks — ordering per [write-paths §4](../architecture/write-paths.md)).


*Deviations at implementation: the check filter is `--only` (the spec's `--check` name collides with the boolean `kb index --check` flag); concept-gap candidates are unresolved-link targets referenced by >=3 notes (alias-protected) — the title-n-gram source is deferred until the corpus shows a need.*

## Checks — candidate generation fully pinned, parameters hashed into every task

| finding | candidates | pinned parameters |
|---|---|---|
| **contradictions** | top-k lexical neighbours per concept within a shared `domain` | k=6; similarity = the shipped IDF-weighted token-overlap ranking (versioned); tie-break codepoint slug |
| **stale claims** | stored `kb revalidate` drift records (C5 — audit **reads observations, never fetches**, and is not in the gate path; fixtures stub the store) + decay-language matches | pattern set enumerated and versioned in `.kb/audit-patterns.yml`; **no note-date comparison** — dates were the unverifiable signal, drift records are the deterministic one |
| **concept gaps** | terms in ≥3 notes with no slug **and no alias** | tokenisation: lowercase, hyphen-split, no stemming; multiword terms = existing title n-grams |
| **graph rot** | superseded targets still linked without mention (ordering derived from **committed supersession records**, never commit timestamps); omission candidates = strong lexical pairs sharing a domain with no edge either way | same similarity + version as contradictions |

("Missing provenance" left this table: it is deterministic and class-aware, and lives in validation-r1a as the KB017 all-internal rule — one concept, one mechanism.)

## Shape

`kb audit [--check …] [--limit N]` emits **envelope-bound** tasks (`structuring` class; candidate ids + corpus commit bound, stale answers refused). `kb audit --findings f.json` validates against **discriminated per-check schemas** — a contradiction finding names a pair; stale-claim, one note + the drift signal; concept-gap, the term + ≥3 referencing notes; graph-rot, the edge or absent edge. Common fields: enum verdict + bounded rationale (≤ 500 chars, never treated as corroboration — invariant 7), and **every quoted claim must be a verbatim substring of the named note at its stated content hash** — the cheapest defence against fabricated quotes, checked mechanically on submit.

Findings queue with **stable content-derived identity** (check + sorted participants + claim digests), so a rerun re-recognises rather than re-queues. Terminal dispositions `accepted` / `rejected` / **`accepted-tension`** (rationale required) exit the KB011 ageing clock — a corpus with a documented, deliberately-retained tension stays green (ADR-005). The report `maintenance/<as-of>-audit.md` is a **derived rendering** of the run's queue entries and C6 artifacts (rebuildable; same-day reruns append a run suffix; verify ignores it).

## Rules

Never edits concept prose, never resolves, never deletes; queue writes are atomic. `verify` does not fail on findings; only queue ageing has teeth, and terminal states stop the clock.

## Acceptance

- Candidate determinism (parameter hash present, two runs identical); seeded-contradiction fixture surfaced; alias-protection case; **verbatim-quote refusal** (mutated quote ⇒ finding rejected); stable-identity dedup on rerun; `accepted-tension` exits ageing.
