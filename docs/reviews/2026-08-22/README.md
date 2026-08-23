# Council review — 2026-08-22

Adversarial documentation review before the next build phase. llm-council **0.45.1**, refreshed roster (gpt-5.6-sol[-pro], claude-opus-5, gemini-3.1-pro-preview, z-ai/glm-5.3 at reasoning; deepseek-v4-pro at high).

| packet | scope | tier | panel | artifact |
|---|---|---|---|---|
| 1 | architecture/overview + ADR-001..003 | reasoning | 4/4 + chairman | `packet-1-constitution-synthesis.md` |
| 2 | ADR-004..007 | high | 2/4 usable (opus-5 timeout; deepseek output degenerate) | `packet-2-adrs-*.md` (member reviews) |
| 3 | ADR-008..010 | high → **rerun at reasoning** (3/4 member timeouts at high) | 4/4 + chairman on rerun | `packet-3-interfaces-synthesis.md` |
| 4 | six design specs | reasoning | 4/4 + chairman | `packet-4-specs-synthesis.md` |
| 5 | productionisation baseline (ADR-011, operations.md, workflows, dependabot) | reasoning | 3/4 + chairman (glm-5.3 timeout) | `packet-5-productionisation-synthesis.md` |
| 6 | ADR-012 doc-site tooling (2026-08-23) | reasoning | 4/4 + chairman | `packet-6-doc-site-synthesis.md` |

Dispositions (adopted / bounded / rejected, with reasons) live in `dispositions.md`. Per the standing rule (ADR-010): council output is judgment, not corroboration — findings were verified against the code and invariants before adoption.

Operational notes for llm-council: the high tier's 90s per-model budget is too tight for multi-document review packets (use reasoning); one member (deepseek-v4-pro-0813) returned fully degenerate repeated-token output that was neither detected nor excluded before ranking/fallback-synthesis — candidate upstream issue.
