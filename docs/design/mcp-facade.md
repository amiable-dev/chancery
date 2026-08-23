# Design spec: local MCP facade

**Status:** implemented 2026-08-22 · **ADR:** [008](../adrs/008-interfaces-and-runtime.md) · **Council review:** 2026-08-22 packet 4 (REJECT) — rewritten; dispositions in [`../reviews/2026-08-22/dispositions.md`](../reviews/2026-08-22/dispositions.md)

A thin stdio MCP server for colocated non-shell consumers (the deep-research workflow, Python tooling, notebooks). It is a second *surface*, never a second implementation: every tool call enters the same engine code paths as the CLI, and the write state machine ([write-paths §1](../architecture/write-paths.md)) holds identically.


*Deviations at implementation: the facade delegates every call to the CLI subprocess (byte-parity by construction); the dirty-worktree refusal lives in the facade for writes, and the `.kb/lock` is taken by the engine's apply core, which the facade inherits through the subprocess.*

## Tools — exact list (any addition is an ADR-008 change), write target declared per tool

| tool | maps to | writes |
|---|---|---|
| `kb_search(query, domain?, maturity?, limit?)` | `kb query` phase 1 | none — result is **byte-identical** to the CLI's phase-1 JSON (that *is* the parity test; no extra fields promised) |
| `kb_read(slug)` | engine note read | none — slug resolved via the index only, never path-joined; superseded notes flagged; response capped 256KB |
| `kb_context(task-args…)` | `kb context` | none — same bundle, same `bundle_id` (closes the gap where the compiler's stated consumers couldn't reach it) |
| `kb_propose(kind, payload)` | typed per kind: `url` → `kb ingest` · `staging-draft` · `queue-proposal` | **W1 only** → C3/C4; each kind has its own payload schema; ingest fetch failures surface as structured errors and land C5 records |
| `kb_task(verb, args)` | phase-1 emission for the **versioned verb registry** (typed argument objects — `(verb, target)` cannot express audit's `--check` or pair targets) | none — returns the envelope-wrapped task |
| `kb_submit(task_id, answer)` | phase-2 of the same verbs | **W3 — a real gated apply**: identical envelope checks, task-class supplier restrictions, post-apply subset verify, rollback. "The only write is propose" was false and is retracted; the invariant is *no path around the gate*, and `kb_submit` goes through it |

## Rules

1. **Envelope-bound**: `kb_task`/`kb_submit` carry the full [protocol envelope](protocol-envelope.md) — task_id, corpus_commit, input_hashes, schema_version, allowed_writes, supplier attestation. Stale, replayed, out-of-set, and class-restricted answers are refused with the same codes as the CLI. ("Stateless" server, stateful *envelope*.)
2. **Concurrency and worktree**: the server binds to one repo root at startup (never an arbitrary path per call); writes take the same lock the CLI takes (`.kb/lock`) and are **refused on a dirty worktree, detached HEAD, or mid-rebase state** — same rule as CLI `--apply`.
3. **Local only — no network listener is implemented in this build.** Colocated stdio, no auth of its own; an HTTP bridge is prohibited (ADR-008); hosted MCP is trigger T4 ([SCOPE §3](../SCOPE.md)). Pins a minimum MCP protocol revision (the 2026-06-18 stateless-capable line or later); a client negotiating older is refused at initialise.
4. **Threat model** (required by ADR-008, summarised; the implementation section carries the full version): repo-root confinement with symlink resolution; slug-index-only resolution; response size caps; proposal rate and size limits with the originating tool call recorded on every proposal; and the confused-deputy loop named — `kb_read` can return quarantine-adjacent or attacker-authored text that *instructs* an agent to `kb_propose`; content is data, the human review of C3/C4 is the backstop, and propose-only W1 bounds the blast radius without eliminating poisoned proposals.
5. **Error parity is structural**: stable codes and fields, not remedy prose, mirror the CLI's JSON.

## Acceptance

- Parity: `kb_search` ≡ CLI phase-1 bytes; `kb_context` ≡ CLI bundle.
- Round-trip inside the gate: `kb_propose(staging-draft)` → `kb_task(assess)` → `kb_submit` (answer routes promote) ⇒ C1 file exists, C6 artifacts recorded, post-apply verify ran — asserted via the CLI in the test.
- **Integration proof split**: CI runs recorded-fixture parity (a captured llm-council answer file replayed through `kb_submit`); the *live* Python loop is an out-of-gate smoke script, never a CI dependency.
- Refusals: dirty-worktree write, stale task, panel-attested `evidence-verdict` — all refused with the CLI's codes.
- Non-goals: resources/prompts surfaces (scope decision), subscriptions, HTTP transport, multi-repo serving.
