# Design spec: the log — what was learned

**Status:** implemented 2026-08-22 · **ADR:** [003](../adrs/003-files-are-canon.md) · **Council review:** 2026-08-22 packet 4 (REJECT) — rewritten; dispositions in [`../reviews/2026-08-22/dispositions.md`](../reviews/2026-08-22/dispositions.md)

Git records what changed; the log records what was **learned** — a diff cannot say "rejected as duplicate". C5-shaped: append-only observation history, written by the **engine** (not "the CLI" — the apply core appends, so MCP-surface writes log identically; SCOPE §4.8 holds for provenance too).


*Deviations at implementation: enforcement lives in `kb log check` — a git-aware sibling run by CI in the pr-contract job — never inside hermetic `kb verify` (ADR-002 forbids the gate reading history). Direct pushes by the sole admin are not range-checked (the named invariant-8 exception); the check degrades to a warning where no merge-base resolves.*

## Shape

Monthly shards, `log/2026-08.md`, with a line grammar (NFC, LF, no trailing space):

```markdown
## 2026-08-22
- assess `agents-md` → discard; duplicate of `agent-config-files` — all dimensions strong, knockout decided it
- migrate `sources-class` → applied; 244 notes                       # bulk verbs: one aggregate line with counts
- gap `context-compression` → recorded; surfaced by whitepaper work  # via `kb log gap "…"`
```

`- <verb> <target> → <disposition>[; <rationale>]` — parseable event types with required fields, so mechanical repairs never masquerade as learning. Scope: **canon-mutating verbs only** (C1/C2 writes); derived rebuilds (`index`, `export`) never log. Research provenance is not hand-appended: a gated **`kb log <type> "<text>"`** verb (`gap` | `miss` | `note`, ≤200 chars) writes it — query-miss recording is explicit opt-in, because this file is public at Gear 2 and must not capture private research questions verbatim.

## Constraints — the enforcement that survives commit

- **Append-only is checked against the merge-base**, not HEAD: every line present at `merge-base(HEAD, origin/<default>)` must exist unchanged in HEAD (mutation, deletion, suffix-truncation, and line-merging all fail; new lines anywhere after surviving base lines are legitimate, which is also how a branch-merge interleaving resolves). The old `git show HEAD:log.md` check compared the worktree to itself and is retired. Where no merge-base exists (first commit, shallow clone), the check degrades to a declared warning; CI fetches full history for this check.
- **Coupling is the checkable rule**: a diff touching C1/C2 paths must add ≥1 log line in the same commit range (checked where a merge-base exists). Omission was the invisible failure; now it's the caught one.
- The line is written **inside the apply transaction** — staged with the temp set, removed by rollback — so the log never asserts a change that didn't land.
- Dates are **UTC day headers — a declared, argued exception** to invariant 6: ordering is checked *intra-file only*, never against "now"; the trustworthy timestamp remains the commit.
- Excluded from context bundles and from export (publication filter). Monthly rotation survives the append check (a new shard is a new file).
- Scheduled CI (`revalidate` etc.) writes via a bot **PR**, never direct push — the credential scopes to PR creation, and the merge-base check still governs the result.

## Acceptance

- Polarity: mutated base line ⇒ fail; deleted ⇒ fail; merge-interleaved with base lines intact ⇒ pass; shallow clone ⇒ warning not error.
- Coupling: C1-touching fixture commit with no log line ⇒ fail; with ⇒ pass.
- Rollback removes the staged line; every canon-mutating verb has a line-written test; `kb log` length cap enforced.
