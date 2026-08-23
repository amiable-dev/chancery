# Contributing

This repository is an engine (`.kb/`) plus a reference corpus (`concepts/`, `flashcards/`). It is governed by an explicit write model — please read this short section before opening a PR, because structurally valid PRs can still be procedurally refused.

## The PR contract

From [docs/architecture/write-paths.md](docs/architecture/write-paths.md): a PR may contribute

- **staged sources** (`staging/`) — new material for assessment,
- **queue proposals** (`.kb/queue/`) — vocabulary, links, contested findings,
- **task/answer artifacts** (`.kb/assessments/`) — two-phase judgment records,
- **engine changes** (`.kb/lib/`, `.kb/test/`) — code with both-polarity fixtures in the same PR.

Direct edits to concept/flashcard content or `.kb` configuration are only accepted alongside the matching apply-records — hand-authored canonical markdown without them will be declined regardless of quality. That is the design, not a formality: every canonical write goes through the gated apply.

## Before pushing

```bash
npm ci && npm test && node .kb/bin/kb.mjs verify
```

CI runs exactly this; green locally is green in CI (the gate is hermetic by design — see [ADR-002](docs/adrs/002-ci-is-the-contract.md)).

## Dependencies and pins

- A new **runtime** dependency needs a stated reason referencing [ADR-011](docs/adrs/011-toolchain-and-productionisation.md); anything that executes in a workflow gets the same rule.
- Dependabot PRs: **grouped updates are never auto-merged**, and an action-pin bump is reviewed by reading the upstream diff — a SHA change is not reviewable by looking at the SHA.
- Commits follow Conventional Commits (`feat:`, `fix:`, `chore(deps):`).

## Non-negotiables

`.kb/POLICY.md` is short and absolute: never delete files, never rewrite wikilinks, never touch content inside code spans. PRs that do any of these get closed with a pointer here.

## Governance

Single-maintainer project (@amiable-dev). Decisions are recorded as ADRs in [docs/adrs/](docs/adrs/); disagreements with a decision are welcome as issues referencing the ADR. A GOVERNANCE.md arrives if a second maintainer does (ADR-011).

## Security

See [SECURITY.md](SECURITY.md). Never report vulnerabilities in public issues.
