---
title: "ADR-002: kb verify in CI is the contract — hermetic, read-only, enumerated inputs"
status: accepted
date: 2026-08-22
tags: [adr, architecture, core, ci]
links: ["001-two-phase-judgment-protocol.md", "003-files-are-canon.md", "008-interfaces-and-runtime.md", "../architecture/write-paths.md"]
council_review: "2026-08-22 packet 1 (APPROVE-WITH-CHANGES) — rework incorporated; dispositions in ../reviews/2026-08-22/dispositions.md"
---

## Context

A deterministic CLI does not make the pipeline deterministic if an agent can decline to run it, invent arguments, or summarise its output instead of applying it. Instruction files cannot enforce; surface support is non-uniform. An agent shown a stack trace invents fixes; in a prose repo that damages notes. And — the review's sharpest addition — a gate whose checks and fixtures live in the same repo as the code it constrains is **editable by the party it constrains**, so the contract needs a repo-governance half the CLI cannot provide alone.

## Decision

1. **`kb verify` running in CI is the contract.** Parity is enforced at the gate; generated adapters make first drafts right and are not an enforcement mechanism. Precisely: adapter *content* is unenforceable at authoring time; adapter *freshness* is gate-enforced (KB014 — regenerate-and-diff of local artifacts; upstream harness behaviour is explicitly not what KB014 checks). Remedy is local regeneration and commit; **CI never regenerates** (files are canon).
2. **The gate is hermetic, with enumerated inputs.** Permitted inputs: the repository tree, committed configuration, committed evidence records, and the `--as-of` date. Forbidden: network, environment variables beyond documented flags, randomness, locale/timezone dependence, filesystem-order dependence, git history beyond the checked-out tree (shallow-clone safe), and subprocess calls out of the repo. **The clock rule**: KB011 ageing is computed against an explicit `--as-of <date>` (default: today, echoed in output) — verify is deterministic *given (tree, as-of)*, and re-running an old commit with its original as-of reproduces its verdict. This is the single, declared time input; nothing else may read a clock.
3. **The gate is read-only.** `verify` writes nothing — no temp files in the tree, no regeneration, no repair.
4. **Evidence policy, not re-observation**: verify checks that C5 records exist where required and are internally consistent; *which* absence is an error vs a warning is defined per record type by the owning spec (validation-r1a). Freshness enforcement is a scheduled job's concern, never verify's.
5. **Output contract**: stable KB codes from the registry (overview §4 — allocation, deprecation, and semantics-freeze rules live there); findings carry file, field *where applicable* (repo-level findings carry a null field and may carry multiple locations), and a **suggested** remedy. `--format json` is the explicit machine interface; adapters and CI always pass it (TTY sniffing is a convenience). Errors reaching the top-level handler emit JSON; pre-handler failures exit non-zero without it, by documented exception. **The third state has a defined verdict**: open unaged proposals → exit 0, listed; aged past threshold → KB011 error.
6. **The gate tests run before the gate is trusted** (both-polarity fixtures), and the repo-governance half is stated as an obligation even where the CLI cannot enforce it: branch protection with the verify check required, review on `.kb/lib/**`, `.kb/test/**` and workflow files, and the standing review heuristic that *a PR touching fixtures and checks together is the attack shape* — an agent buying green by weakening the gate.

## Consequences

- Enforcement centralised; authoring UX free to diverge. Hermeticity forces the canon/derived/evidence split (ADR-003, data-classification) before any live-web feature exists.
- Verify codes are a compatibility surface governed by the registry; every new code lands with fixtures in the same PR.
- What the gate cannot do is stated: it verifies repository acceptance, not harness behavioural parity, and it cannot defend itself against repo-owner-level change — that is governance, named here so it is nobody's surprise.
