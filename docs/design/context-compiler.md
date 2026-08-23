# Design spec: context compiler — `kb context`

**Status:** implemented 2026-08-22 · **ADR:** [001](../adrs/001-two-phase-judgment-protocol.md), [007](../adrs/007-retrieval-posture.md) · **Council review:** 2026-08-22 packet 4 (APPROVE-WITH-CHANGES) — rework incorporated; dispositions in [`../reviews/2026-08-22/dispositions.md`](../reviews/2026-08-22/dispositions.md)

Deterministic assembly of exactly the context a task needs, so every harness works from identical input.


*Deviations at implementation: none.*

## Command — per-task arity is explicit

```
kb context --for cards-refresh <slug>            kb context --for audit-pair <slugA> <slugB>
kb context --for promote-review <slug>           kb context --for research-brief --query "<text>"
kb context --for query-answer  --query "<text>"
[--budget <chars>] [--format json]     # json is the default and the contract
```

Returns a **versioned bundle** (`schema_version`, fixed section list): target note(s) · the policy excerpts bound to the task via the committed mapping `.kb/context-anchors.yml` (task → file+heading anchors; a dangling anchor is KB020) · related concepts via graph edges (1 hop; total order = score desc, then codepoint slug — selection *and* serialisation both pinned) · existing derived artifacts (cards for cards-refresh; **prior verdicts read from the C5 evidence store** — the machine-readable verdict artifact validation-r1a defines; audit-pair assembly is owned here, `kb audit` emits candidates only) · the response schema.

## Rules

1. **Deterministic**: same corpus state + same arguments ⇒ byte-identical output. **The bundle contains no clock reading** — every date in it is corpus-derived; content hashes are integrity fields, not volatile ones. Derived inputs are part of "corpus state": the bundle embeds the index hash and compilation **fails on a stale index** (regenerate first) rather than silently varying.
2. **Stable prefix by construction**: fixed section order; the single tail section holds all run-variant material — trim report, diagnostics — so the prefix is byte-stable across budgets. (That is the structural property; no cache-economics claims.)
3. **Budgeted in characters** — a deterministic, tokenizer-free unit (≈4 chars/token as guidance), counting content sections only, not the JSON wrapper. Trim by priority class (target > policy > edges > artifacts), never mid-section, reported in the tail. **Over-budget floor**: if target note(s) + response schema alone exceed the budget, fail with a code and the minimum viable size — never emit silently truncated.
4. **Token tax honoured** (ADR-003): superseded content referenced, not included, unless the task is audit.
5. The bundle is data, not prose; skills say "run `kb context`, use the bundle". Bundles and any cache of them are **derived, rebuildable, never committed**. Session behaviour ("compile between sessions, append within") is consumer guidance — the CLI's contribution is the `bundle_id` (content digest) a harness can retain to notice drift.

## Acceptance

- Determinism (two runs byte-equal) and stale-index refusal; budget-trim priority + tail report; over-budget floor failure; **one fixture per task mode** (all five), each exercising its anchor mapping and artifact rule; a skills update consuming the bundle for `kb-cards` refresh.
- Non-goals: conversation-state tracking, cross-session dedup of already-seen content (harness's job), any model call, any tokenizer dependency.
