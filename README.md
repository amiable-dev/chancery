<h1 align="center">Chancery</h1>

<p align="center">
  <em>A governed, git-native knowledge base for AI agents — deterministic gates, falsifiable citations, portable skills. Ships a CLI called <code>kb</code>.</em>
</p>

<p align="center">
  <a href="https://github.com/amiable-dev/chancery/actions/workflows/kb-verify.yml"><img src="https://github.com/amiable-dev/chancery/actions/workflows/kb-verify.yml/badge.svg" alt="kb verify"></a>
  <a href="LICENSE"><img src="https://img.shields.io/badge/License-MIT-yellow.svg" alt="License: MIT"></a>
  <img src="https://img.shields.io/badge/status-early%20(v0.x)-orange" alt="Status: early">
  <img src="https://img.shields.io/badge/node-%E2%89%A522-blue" alt="Node >= 22">
  <a href="https://scorecard.dev/viewer/?uri=github.com/amiable-dev/chancery"><img src="https://api.scorecard.dev/projects/github.com/amiable-dev/chancery/badge" alt="OpenSSF Scorecard"></a>
</p>

---

Your agents read your notes and write new ones. Ungoverned, that corpus rots: unverified claims, duplicated concepts, dead citations, silent contradictions — and every agent that reads it inherits the rot. Deep-research tooling makes it worse, not better: 2026 audits found the leading products' citations actually *support* their claims only 39–77% of the time.

**Chancery treats knowledge like code.** Markdown files are the source of truth. Every change passes a CI gate. Judgment belongs to the model; bookkeeping is deterministic — and never the other way round.

## Why "Chancery"?

A medieval chancery was the office that authenticated documents under seal and kept the rolls — nothing became part of the record without passing through it, and the record could prove it had. Same job here: judgment arrives from outside (your agent, a panel, you); the office makes it canon only through examination, a sealed envelope, and an enrolment it can verify. The CLI stays `kb` — the project is Chancery, the command is what it operates on ([the longer story](docs/why-chancery.md)).

## The core idea: two-phase commands

`kb` **never calls a model**. Commands that need judgment run in two phases:

```
kb assess staging/new-source.md          # 1. emits a self-contained task (JSON)
                                         #    → YOUR agent answers it
kb assess staging/new-source.md \
   --verdict answer.json                 # 2. validates the answer, applies it by rule
```

Your agent supplies the judgment. The CLI supplies the structure, the schema validation, and every decision that can be made deterministically — rubric routing is a lookup table, not a vibe. `kb verify` in CI is the contract: no API keys in the gate, no network in the gate, no trust in any single agent's diligence.

## What you get

- **Gated promotion** — sources land in `staging/`, get judged against a rubric (knockout disqualifiers first: a fatal flaw can't be averaged away), and only then become concepts. A `discard` is a recommendation; nothing is auto-deleted.
- **Falsifiable citations** — every source URL is content-hashed at ingest, and every fetch lands in an append-only evidence store. `kb revalidate` tells you *which claims' evidence drifted*, not just which links died; `kb support` gets claim-by-claim verdicts on whether a source actually backs what the note says — each verdict bound to the exact snapshot that was judged.
- **A typed concept graph** — notes carry explicit relationship clauses ("X supersedes Y because…"), faceted classification (domain/maturity/source-type), and a generated index. Hand-curated links: the hallucination-free graph that auto-extraction can't produce.
- **Grounded query + compiled context** — `kb query "how should agent memory persist?"` returns ranked concepts *with their graph edges*; an answer citing a concept that wasn't retrieved is rejected. `kb context` compiles the exact bundle a task needs (targets, binding policy, neighbours, prior artifacts) — deterministic, budgeted, byte-stable.
- **A tamper-evident loop** — every judgment travels in a task envelope (stale, replayed, or out-of-bounds answers are refused; applies verify themselves and roll back); every canon change writes a line in `log/` saying what was *learned*; `kb audit` sweeps for contradictions, stale claims, gaps and graph rot with pinned, reproducible candidates.
- **Your agent already knows how to use it** — one procedure source generates skills and rules for **Claude Code, GitHub Copilot, Windsurf, and Devin** (regenerated and CI-diffed so they can't go stale), plus a local **MCP facade** (`kb-mcp`) whose six tools are byte-identical to the CLI.
- **Spaced-repetition cards** for the humans on the team — an optional extension, generated from concepts, with review history that survives rewording.

## Quickstart

```bash
git clone https://github.com/amiable-dev/chancery && cd chancery
npm install
npm run verify          # the gate: 480+ files, schema/links/index/cards, ~1s
```

Then the loop — best driven *from* your agent harness (the generated skills teach it):

```bash
kb ingest https://example.com/article    # → staging/<slug>.md
kb assess staging/<slug>.md              # → judgment task for your agent
kb promote <slug> --draft d.json --apply # → concepts/<slug>.md, sections by construction
kb query "what do we know about X?"      # → grounded retrieval with citations checked
kb verify                                # → the contract, before every commit
```

Everything mutating is dry-run by default; `--apply` requires a clean tree so every change stays reviewable as a diff.

## What's in this repo

This repository is both the **engine** (`.kb/`) and its first **reference instance**: a 244-concept, 1,240-card corpus on AI engineering — agent architecture, retrieval, validation, MCP, security — that we maintain daily with the pipeline itself. The dogfood is the demo.

```
concepts/     244 atomic concept notes (typed links, facets, hashed sources)
flashcards/   1,240 spaced-repetition cards with stable IDs
staging/      untrusted inflow, awaiting assessment
.kb/          the engine: schemas, rubrics, policy, CLI, tests
.claude/ .github/ .windsurf/ .agents/ AGENTS.md   ← generated harness adapters
```

## Status

The launch writeup — what this is, how it was reviewed, what is knowingly red on day one — is at [docs/launch.md](docs/launch.md).

**Early, honest v0.x.** The engine is tested (13 suites, both-polarity gate tests, CI-enforced) and in daily use by us; the schema may still change with versioned migrations. This is an open-source project, not a product — scope, non-goals, and the conditions under which that would change are written down in [`docs/SCOPE.md`](docs/SCOPE.md). Design decisions live in [`docs/adrs/`](docs/adrs/), the architecture in [`docs/architecture/overview.md`](docs/architecture/overview.md).

If you point `kb` at a corpus of your own and something breaks or chafes — please open an issue. Knowing whether anyone else wants governed knowledge is, quite literally, this project's next milestone.

## Related

- [**llm-council**](https://github.com/amiable-dev/llm-council) — multi-model deliberation (library + MCP + HTTP). A sibling project heading the same route; `kb` can use it as one judgment supplier among several, and it is never a hard dependency.
- Karpathy's [LLM Wiki gist](https://gist.github.com/karpathy/442a6bf555914893e9891c11519de94f) — the pattern's most-cited articulation. `kb`'s architecture [predates it independently](docs/history/corpus-provenance.md) (Feb 2026); the convergence is evidence for the shape. Where the pattern says *the LLM should do the bookkeeping*, `kb` says: **the bookkeeping is exactly the part that must be deterministic.**

## License

[MIT](LICENSE) © 2026 Chris Joseph (amiable-dev)
