# Write paths, build order, and ownership

**Status:** accepted 2026-08-22 · **Origin:** council packets 3 & 4 (the write state machine and the sequencing-and-ownership note, merged — every packet-3 blocker traces to one of the three questions this document answers)

## 1. The write state machine — how anything reaches canon

Every surface funnels into the same four transitions. **No other transition exists**; the conformance suite (§3) asserts it.

```
            (W1 stage)              (W2 judge)                (W3 apply)
 any surface ──────► C3/C4 ──► envelope task ──► answer ──► gated apply ──► C1/C2
                  quarantine/queue      (C6 artifacts, supplier recorded)      │
                                                                    (W4 verify subset + atomic
                                                                     commit, rollback on fail)
```

| surface | may perform | may NOT perform |
|---|---|---|
| **CLI** (local) | W1–W4, all verbs | writes outside a verb; `verify` writes nothing (read-only guarantee, ADR-002) |
| **Generated skills** | instruct an agent to drive the CLI | nothing directly — skills are prose |
| **MCP facade** (stdio, colocated only) | W1 (`kb_propose`), W2 (`kb_task`/`kb_submit` for allowlisted task classes), W3 **only** via `kb_submit` running the identical gated apply — same envelope checks, same post-apply verify, same rollback | any write not expressible as W1–W3; serving a non-colocated client (no HTTP bridge — building one is a T4 event, not an integration detail) |
| **PR contract** (remote) | contribute **C3 additions, C4 proposals, and C6 task/answer artifacts**. Diffs to C1/C2 files are only acceptable when accompanied by matching C6 apply-records referencing those files at that base commit — a checkable rule, enforced by a verify check in CI | hand-authored canonical markdown without apply-records: structurally valid, procedurally refused |

Invariant 8 restated precisely (packet 3's correction): the rule is not "no canonical writes off-box" — it is **no path around the gate**. A validated, envelope-bound, post-verified apply legitimately writes canon from any surface that can run it.

## 2. Ownership registry (who owns what — one owner each)

| shared artifact | owner | consumers |
|---|---|---|
| Task/answer envelope, task classes, supplier attestation | [`design/protocol-envelope.md`](../design/protocol-envelope.md) | every judgment verb, MCP facade, audit, support |
| KB verify codes: allocation, deprecation, semantics freeze | [`overview.md §4`](overview.md) registry table | ADR-002, all specs (no spec allocates its own numbers) |
| Data classes C1–C7 and path assignments | [`data-classification.md`](data-classification.md) | ADR-003, all specs |
| The stable machine-readable JSON contract | `kb query` phase-1 shape (served identically by `kb_search`) | MCP facade, context compiler; `kb export json` is a *separate, presentation-free* contract owned by export-integration |
| Vendor/harness adapter facts (spec-field lists, char budgets, import shims) | `install-knowledge.mjs` constants, with a dated review trigger recorded beside each fact | ADR-008 cites, never restates as permanent truth |
| Decision-provenance vocabulary (`human` / `model` / `mechanical`) — distinct from *source* provenance classes | protocol-envelope | ADR-009/010 (resolves the `model-inference` double meaning) |

## 3. Conformance suite

One suite, run in CI, asserting across all four surfaces: (a) no W-transition reaches C1/C2 without an envelope-bound apply; (b) `verify` performs zero writes; (c) an answer implying writes outside `allowed_writes` is refused identically via CLI and MCP; (d) a PR fixture containing bare canonical edits fails the apply-record check; (e) the proposer≠supplier disclosure field is present on every C6 record. This suite *is* invariant 8; until it exists, the invariant is a sentence (packet 3's phrasing, adopted verbatim).

## 4. Build order (supersedes scattered sequencing notes)

1. **Envelope + write-paths conformance** — built 2026-08-22 (`.kb/lib/envelope.mjs`, conformance suite).
2. **validation-r1a** — built 2026-08-22 (`.kb/lib/evidence.mjs`, `kb support`, `kb supersede`, KB015–018).
3. **context-compiler**, **mcp-facade** — built 2026-08-22 (`kb context`, `.kb/bin/kb-mcp.mjs`, KB020).
4. **log**, **audit** — built 2026-08-22 (`log/` shards, `kb log check` in CI, `kb audit`, KB019).
5. **export-integration** — built 2026-08-22 (publication filter + KB021, three renderers, manifest).
6. Gated, unchanged: R1b, FTS5 rung, remote MCP, binaries — per SCOPE triggers.
