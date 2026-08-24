---
title: The AI coding maintainability gap
date: 2026-08-24
domain: software-engineering
maturity: emerging
source_type: research
topics: [agentic-coding]
tags: [concept, ai-coding, code-quality, technical-debt, software-engineering, domain/software-engineering, maturity/emerging, source-type/research, topic/agentic-coding]
status: draft
sources:
  - url: https://www.gitclear.com/the_ai_code_quality_maintainability_gap
    hash: sha256:e758eb66ee66697b71210de61185008ccfe2084b4f4219eb46859317089b1d32
    retrieved: 2026-08-24
    class: external-primary
    reachability: ok
  - url: https://www.gitclear.com/ai_assistant_code_quality_2025_research
    hash: sha256:e09f93b846114d6ec1a362d3f995cd862f39206b1758fd870491b47b91e90cbb
    retrieved: 2026-08-24
    class: external-primary
    reachability: ok
---

# The AI coding maintainability gap

## Definition

The AI coding maintainability gap is the structural pattern in which AI-assisted development's default workflow rewards shipping atomic, test-passing units of work while implicitly taxing the maintenance work that keeps a codebase cheap to own over time — deduplication, refactoring, cross-file reuse, and the periodic revisiting of legacy code — so that as AI-authored commits grow as a share of all changes, duplication and copy/paste rise while refactoring, cross-file connectivity, and legacy-code upkeep fall in lockstep, widening a gap between how fast code ships and how maintainable it remains.

## Explanation

GitClear's multi-year analysis of open-source commit history — tracking seven independent code-quality signals across 2023 to 2026 — found this pattern holds across every signal measured rather than in one metric alone: duplicated code blocks per million changed lines rose 81% from 2023 to a 2026 high, the share of changed lines that were moved or refactored fell from roughly a fifth to under four percent while copy/paste climbed past it, cross-file function connectivity of new code fell 35%, and the share of changes touching code untouched for over a year fell 74%. The mechanism is an incentive structure, not a claim about model competence: default AI-assisted workflows are optimized to close a ticket with a passing test on the happy path, and the tasks that pay off only over a codebase's multi-year life — consolidating duplicate logic, weaving new code into what already exists, revisiting neglected modules — are exactly the ones that incentive does not reward, so they get skipped at a rate that compounds as AI authorship's share of commits grows.

## Key Properties

- Holds across four independent structural signals — duplication, refactoring rate, cross-file connectivity, legacy-code touch — not one proxy metric
- The mechanism is an incentive gap (atomic-task completion rewarded, invisible upkeep unrewarded), not a claim that AI-written code is individually worse
- The trend widens year over year across the 2023 to 2026 window measured, rather than being a one-time step change
- Counterable with explicit process changes: budget dedicated refactor and legacy time, add automated duplicate-block tripwires, review specifically for error-masking, and measure structural signals rather than volume or velocity alone

## Relationships

- [[short-term-availability-tradeoff]] — names the general trade-off pattern this concept instantiates specifically for AI-assisted coding — atomic-task velocity traded for the invisible maintenance work that keeps a codebase cheap to own
- [[agent-outcome-vs-proxy-metrics]] — the report's own closing recommendation to measure structure rather than volume is this distinction applied to code health — commit volume and velocity are the proxy, structural signals like duplication and connectivity are the outcome that actually predicts long-term cost
- [[shared-mental-model-erosion]] — falling cross-file connectivity and forgotten legacy code are exactly the conditions under which a team's shared mental model of the system erodes fastest
- [[first-pass-acceptance-rate]] — is proposed as a corrective metric precisely because throughput counts reward the same ship-fast-over-maintain behaviour this note identifies as the cause.

## Applications

Deciding how to structure AI-assisted development processes: setting CI tripwires on duplicate-block growth, budgeting explicit refactor and legacy-maintenance time per sprint rather than leaving it implicit, adding error-masking review as a distinct review criterion, and tracking structural code-health signals such as duplication and connectivity alongside velocity metrics so the trade-off stays visible to a team rather than accumulating silently.

## Sources

- https://www.gitclear.com/the_ai_code_quality_maintainability_gap
- https://www.gitclear.com/ai_assistant_code_quality_2025_research

## See Also

- [[short-term-availability-tradeoff]]
- [[agent-outcome-vs-proxy-metrics]]
