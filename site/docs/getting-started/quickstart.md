# Quick Start

The whole system is one loop: **untrusted material in, judged canon out**, with your agent supplying the judgment and the CLI supplying everything that can be a rule.

!!! tip "Prerequisites"
    An initialised repository (`kb init`) and an agent — Claude Code, Copilot, Windsurf, Devin, or you with a text editor. The generated skills in `.claude/`, `.github/instructions/`, `.windsurf/` and `AGENTS.md` already teach the agent this page.

## 1. Ingest a source

```console
$ kb ingest https://example.com/some-article
  wrote staging/some-article.md
```

The page is fetched, extracted, and staged as a reviewable note with its source URL recorded. Staging is **quarantine**: nothing there is knowledge yet, and `kb query` never retrieves from it.

## 2. Assess it — phase 1

```console
$ kb assess staging/some-article.md
```

This emits a self-contained JSON **task**: the note, the promotion rubric (knockout disqualifiers first, then ordinal dimensions anchored to real exemplar notes), the nearest existing concepts, and an **envelope** — a task id bound to the exact inputs, and the writes an answer is allowed to imply.

## 3. Your agent answers

Any schema-conforming supplier answers the task — your coding agent, a model panel, a human. The answer copies `envelope.task_id` verbatim and rates every dimension with a one-sentence rationale.

| you write | the CLI checks |
| --- | --- |
| `task_id` | binds the answer to the task; stale inputs and replays are **refused** |
| `disqualifiers` | any triggered knockout ends scoring — strong prose cannot outvote a fatal flaw |
| `dimensions` | ordinal ratings only (`fail` / `weak` / `strong`) — never scores to game |

## 4. Apply — phase 2

```console
$ kb assess staging/some-article.md --verdict answer.json
  PROMOTE — staging/some-article.md
```

Routing is a lookup table, not arithmetic: `promote` and `split` proceed, `queue` waits for a human, `discard` is a *recommendation* — the CLI never deletes anything.

## 5. Promote

```console
$ kb promote some-article               # emits the drafting task
$ kb promote some-article --draft d.json --apply
  wrote concepts/some-article.md
```

The concept is rendered **by construction** — required sections in the required order, sources carried over and de-duplicated. The apply verifies the written files and rolls back byte-identically if anything fails.

!!! warning "Dry-run by default"
    Every writing verb previews without `--apply`. Bulk writers additionally require a clean git tree, so every change stays reviewable as a diff.

## 6. Verify — the contract

```console
$ kb verify
```

Schema, sections, links, index freshness, card identity, evidence consistency — deterministically, in about a second, with no network. Run it before committing; CI runs it on every push.

**Next:** [Gated promotion](../guides/gated-promotion.md) for the rubric in depth · [Falsifiable citations](../guides/falsifiable-citations.md) for the evidence loop.
