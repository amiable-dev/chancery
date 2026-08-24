---
title: Agent loop telemetry
aliases:
  - Superintendent layer
  - Observe-only agent supervision
date: 2026-08-24
domain: observability
maturity: emerging
source_type: practitioner
tags: [concept, agents, observability, telemetry, domain/observability, maturity/emerging, source-type/practitioner]
status: draft
sources:
  - url: https://briandouglas.me/posts/2026/01/18/for-every-ralph-there-needs-to-be-a-super-nintendo/
    class: external-primary
---

# Agent loop telemetry

## Definition

**Agent loop telemetry** is the practice of putting a passive observation layer around an autonomous agent loop — one that records each iteration as a span carrying duration, outcome, token cost by model, tool calls and files touched, while never gating, pausing or steering the loop — so that a long unattended run leaves behind an inspectable account of how its result was produced rather than only the result.

## Explanation

The gap comes from the loop's own design. A context-resetting coding loop re-runs the same prompt with a fresh window each pass and keeps state only in the filesystem and in commits; the deliberate amnesia is what makes the pattern robust, since no bad turn poisons the next one, but it also means each iteration's reasoning is destroyed the moment the iteration ends. What survives to morning is a diff. The operator therefore cannot say which passes failed and why, where the token budget actually went, whether one iteration was the breakthrough and the twenty before it were spinning on a dead end, or whether an early bad commit taught every later pass the wrong pattern — and cannot reproduce any of it, because re-running a non-deterministic prompt does not replay the run. The proposed remedy is deliberately an observer and not a controller: it sits between the loop and the model so no agent code changes, it emits spans under OpenTelemetry's GenAI semantic conventions so ordinary backends can answer cost-per-completed-feature and where-agents-get-stuck, and it stores the full conversation record so a session can be replayed as it happened rather than re-attempted. The author's own evidence is a single run against a codebase with over a thousand lint errors, the same checklist given to two models: the stronger model finished in 111 sessions for about sixteen dollars, the cheaper one needed 160 sessions and twelve percent more input tokens yet cost about six — a forty-four percent iteration penalty that was still a sixty-three percent saving, and a trade-off invisible without instrumentation. This is a practitioner essay by someone building agent-telemetry infrastructure at a vendor, so the conclusion is one he sells, and the model names and prices will date quickly; the structural claim beneath them does not depend on either, because it follows from the loop resetting its own context.

## Key Properties

- Context-resetting loops persist state in files and commits, so per-iteration reasoning is discarded and only the diff survives
- Observer, not controller: it records without gating, approving or interrupting the loop
- Interposed between loop and model, so the agent code is unmodified
- Attribution is per iteration — count, duration, success, cost by model, tool mix, files touched
- A cheaper model can need materially more iterations and still cost far less overall, a trade only measurement reveals

## Relationships

- [[wide-events-single-source-of-truth]] — supplies the record shape this layer wants — one wide event per iteration carrying model, cost, tool mix and outcome leaves the post-mortem questions open at read time, which matters because nobody knows in advance which iteration will need explaining
- [[agent-checkpoint-resume]] — answers the opposite half of the same amnesia: checkpointing makes the agent's position durable so work can resume, while this layer makes the discarded reasoning durable so the run can be explained
- [[three-loops-of-agentic-development]] — instruments that framework's innermost loop, turning iteration count, cost and success rate into signals the human feedback loop above it can actually steer on
- [[siem-agentic-visibility-gap]] — is the operational counterpart of that security blind spot — both observe that agent activity leaves evidence of which calls were made but none of what was reasoned or why
- [[agent-outcome-vs-proxy-metrics]] — agent loop telemetry records exactly the proxy signals the outcome-versus-proxy distinction warns are insufficient — duration, token cost, tool-call counts — captured faithfully but never substituting for evidence the task was accomplished.

## Applications

Justifying or capping the budget of an overnight autonomous coding run; comparing models on cost per completed task rather than price per token; debugging a loop that failed after hours when the only artifact left is a repository.

## Sources

- https://briandouglas.me/posts/2026/01/18/for-every-ralph-there-needs-to-be-a-super-nintendo/

## See Also

- [[wide-events-single-source-of-truth]]
- [[agent-checkpoint-resume]]
- [[three-loops-of-agentic-development]]
