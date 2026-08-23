---
title: "ADR-008: CLI + generated skills primary; local propose/submit MCP facade; PR contract for remote writes; supported-LTS Node"
status: accepted
date: 2026-08-22
tags: [adr, interfaces, mcp, skills, runtime]
links: ["001-two-phase-judgment-protocol.md", "002-ci-is-the-contract.md", "005-proposal-queue.md", "../architecture/write-paths.md", "../design/mcp-facade.md", "../design/protocol-envelope.md"]
council_review: "2026-08-22 packet 3 (APPROVE-WITH-CHANGES) — rework incorporated; dispositions in ../reviews/2026-08-22/dispositions.md"
---

## Context

Aug-2026 landscape (citations for every figure here: [`../history/evidence-2026-08.md`](../history/evidence-2026-08.md) — dated observations with review triggers, not permanent truth): coding agents measurably route around MCP for capability access (~4–32× token cost vs CLI per Anthropic's own code-execution guidance), while the Agent Skills standard reached ~46 clients — the adapter matrix is collapsing toward SKILL.md + AGENTS.md. A *local* stdio MCP facade is nearly free under the 2026 stateless revision; a *hosted* one carries the full ops burden. The deep-research workflow is a real non-shell-native consumer we already have. On runtime: Rust precedents (Codex, uv, ruff) are real, but the workload is I/O-bound markdown, and a compiled-JS binary route exists if distribution ever demands one.

## Decision

1. **Primary interface: the CLI + generated skills.** One procedure source — `.kb/procedures/*.md`, compiled by `install-knowledge.mjs` — renders per-harness adapters. **Vendor facts (spec-field lists, char budgets, import shims) live as constants in that generator with a dated review trigger each** (ownership: write-paths §2), never restated in ADRs as permanent truth. Generated adapters are C7: committed so harnesses can read them, regenerate-and-diff enforced (KB014) — and KB014 checks *local artifact freshness only*, never upstream harness conformance, which a hermetic gate cannot observe.
2. **Local stdio MCP facade** — exact tool list, no "may": `kb_search`, `kb_read`, `kb_context` (read-only); `kb_propose` (W1 → C3/C4); `kb_task` / `kb_submit` (W2/W3 for allowlisted task classes, where `kb_submit` runs the *identical* gated apply — same envelope checks, same post-apply subset verify, same rollback). No other tool exists; any addition is an ADR change. The facade serves **colocated processes only; no HTTP-to-stdio bridge may be built** — a hosted surface, however reached, is a T4 event (SCOPE §3), not an integration detail. Its threat model (repo-root confinement, symlink/path traversal, response size caps, queue-flood limits, dirty-worktree behaviour, and the confused-deputy loop of quarantine content instructing an agent to `kb_propose`) is a required section of the [mcp-facade spec](../design/mcp-facade.md) and blocks its build until written.
3. **The PR contract is the universal remote write path**, with contents defined in [write-paths §1](../architecture/write-paths.md): PRs contribute C3 additions, C4 proposals, and C6 task/answer artifacts; C1/C2 diffs are acceptable only with matching C6 apply-records at that base commit (CI-checked). "A human promotes" means mechanically: a maintainer runs the gated apply locally against the PR's artifacts — never merges hand-authored canon.
4. **Direct canonical writes do not exist on any interface** — invariant 8, enforced by the write-paths conformance suite, including the proposer≠supplier disclosure on every C6 record (envelope §4).
5. **Runtime: current-LTS Node** (a supported-LTS policy, not a frozen version floor). The non-shell consumer contract *today* is `kb <verb> --format json` over subprocess — documented, stable, and what the deep-research workflow actually uses; a Python library is explicitly not promised. If distribution triggers fire (T5, defined in SCOPE §3), a compiled single binary requires a **parity contract** — byte-identical `kb verify` output against the Node runtime across a supported-platform matrix — because the binary embeds a second JS engine, and for this tool determinism *is* the product. Rust remains gated on a Node-less target harness or measured latency need.

## Consequences

- Reach through one gate core: the facade **delegates to the same apply/verify code paths**, proven by the conformance suite — it is a second surface, not a second enforcement implementation.
- Parity claims stated at their true strength: *write-outcome* parity is the gate's job; *read-side* parity (ranking, queue/draft visibility) is specified in the mcp-facade spec, since nothing about writes constrains what reads expose.
- The facade's operational scope stays honest: local trust boundary, no auth of its own, colocated only.
