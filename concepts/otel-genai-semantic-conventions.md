---
title: "OpenTelemetry GenAI Semantic Conventions"
aliases: ["OpenTelemetry GenAI Semantic Conventions"]
date: 2026-08-01
domain: standards
maturity: emerging
source_type: vendor-doc
topics: [protocols, evaluation]
tags: [concept, observability, otel, llm, ai-agents, standards, domain/standards, maturity/emerging, source-type/vendor-doc, topic/protocols, topic/evaluation]
status: draft
sources:
  - url: https://john-hodge.com/blog/opentelemetry-genai-semantic-conventions/
    hash: sha256:de8025a00ba07ded4c51623ebf319c71da8a5ffbe8d82cc751056506ce00a2d2
    retrieved: 2026-08-21
    class: unclassified
    reachability: ok
  - url: https://opentelemetry.io/blog/2026/genai-observability/
    hash: sha256:24403018a646ca68f6359220120500ea5f3370accd6484a12aa8f259cd0171b4
    retrieved: 2026-08-21
    class: unclassified
    reachability: ok
  - url: https://github.com/open-telemetry/semantic-conventions-genai
    hash: sha256:58af95be551559e5e20b92695598b4bdf8859726d40c83b71d6a5a1c1e5a58bb
    retrieved: 2026-08-21
    class: unclassified
    reachability: ok
  - url: https://github.com/open-telemetry/semantic-conventions/releases/tag/v1.42.0
    hash: sha256:9efb39f096897ff397ce10ff2bc847ada663d015668289683f8ac9ef05e73dcc
    retrieved: 2026-08-21
    class: unclassified
    reachability: ok
---

# OpenTelemetry GenAI Semantic Conventions

## Definition
A set of vendor-neutral naming and structure rules — `gen_ai.*` attributes, spans, events, and metrics — that standardise how LLM calls, agent steps, and tool invocations are recorded in OpenTelemetry traces, so telemetry from different frameworks and providers is portable into any OTel-compatible backend. As of July 2026 the conventions live in a dedicated repository, separate from core OpenTelemetry, and remain in **Development** status — no GenAI-specific surface is marked Stable.

## Explanation
Standard [[observability]] gives you logs, metrics, and traces for services; the GenAI conventions extend that schema so an LLM call or agent turn looks the same in a trace regardless of which framework produced it — the model called, token counts in and out, and (opt-in) the actual prompt/completion content.

**Where they live, and why that matters:** the conventions started inside OpenTelemetry's main `semantic-conventions` repository, but as of `v1.42.0` (12 June 2026) all `gen_ai.*` content was deprecated there and moved to a dedicated repository, `open-telemetry/semantic-conventions-genai`. `v1.43.0` (3 July 2026) of the main repo ships none of it. The catch: the dedicated repo has **no releases or tags yet**, and its schema-URL section is still a TODO — there is no versioned GenAI-conventions release with a finalized schema URL to pin against. The last versioned cut is the old main-repo `v1.42.0`. Old doc pages at `opentelemetry.io` are now "Moved" stubs pointing to the new home.

**Nothing is Stable.** As of 17 July 2026, no GenAI-specific span, event, metric, or attribute is marked Stable — the whole surface is Development. (Shared *core* attributes referenced in the same tables, like `error.type` and `server.address`, are Stable; the `gen_ai.*` surface specifically is not.)

**The schema has already churned significantly**, which matters for anyone reading dashboards or building instrumentation:

| Release | Change |
|---|---|
| v1.27.0 (Aug 2024) | `gen_ai.usage.prompt_tokens` / `completion_tokens` → `input_tokens` / `output_tokens` |
| v1.37.0 (Aug 2025) | `gen_ai.system` → `gen_ai.provider.name`; per-message events replaced by `gen_ai.input.messages` / `output.messages` / `system_instructions` |
| v1.38.0 (Oct 2025) | Added `gen_ai.evaluation.result` event — correlates evals with the operation they score |
| v1.40.0 (Feb 2026) | Retrieval spans, cache token attributes, `gen_ai.agent.version` |
| v1.41.0 (Apr 2026) | `invoke_agent` split into client/internal spans; reasoning-token fields; stricter `execute_tool` naming |
| v1.42.0 (Jun 2026) | All GenAI material deprecated in core, moved to the dedicated repo |

**What actually lands in a trace is a third thing again — not the spec, not one version.** Frameworks emit different generations simultaneously by design (a compatibility mix, not a bug): Strands Agents defaults to frozen v1.36-era behaviour with the latest conventions opt-in; Pydantic AI emits the current structured format plus the legacy `gen_ai.system` field for compatibility; Vercel AI SDK 7 moved to a dedicated `@ai-sdk/otel` package on current fields while keeping a legacy `ai.*` namespace; OpenAI Agents SDK doesn't emit OTel GenAI natively at all (own tracing architecture; OTel export needs contributed instrumentation). Practical fix: query/coalesce both attribute generations (e.g. `COALESCE(gen_ai.provider.name, gen_ai.system)`) rather than summing them — frameworks that duplicate for compatibility emit the *same* value under both names. Opt-in to newer behaviour where supported via `OTEL_SEMCONV_STABILITY_OPT_IN=gen_ai_latest_experimental`, and confirm by inspecting a real exported span rather than trusting the docs.

**Content capture is opt-in by design.** Prompts, completions, tool calls, and tool results are high-cardinality and frequently contain PII or secrets, so capturing full content (vs. just metadata like token counts and model ID) is a separate, explicit decision — the single biggest operational choice when enabling GenAI tracing.

**Agent-level attributes exist** alongside operation/model/token attributes — e.g. `gen_ai.agent.description`, `gen_ai.agent.version` — and agent/framework spans nest tool calls beneath reasoning steps, producing a span tree per agent turn.

**MCP has its own semantic conventions too**, held in the same dedicated repository, and they are also Development status — see [[mcp-otel-trace-context-interlock]] for how MCP's protocol-level changes connect to this.

## Key Properties
- **Development status, no 1.0** — every `gen_ai.*` span/event/metric/attribute is unstable; breaking changes are expected, not hypothetical (six churn-causing releases in under two years)
- **Relocated, unversioned** — the authoritative source moved to a dedicated repo that has no tagged release yet, so there is no schema URL to pin against
- **Multi-generation reality in production** — frameworks emit whatever version they were built against; a single trace can carry both old and new attribute names for the same value
- **Opt-in content capture** — token counts and model metadata are the default; prompt/completion text requires an explicit opt-in because of PII/secret exposure risk
- **Coalesce, don't sum, dual-generation fields** — compatibility duplication means old and new attribute names can hold identical values

## Relationships
- Extends [[observability]] and specifically [[llm-observability]]: the `gen_ai.*` surface is the standardised vocabulary for the LLM-specific signals those concepts describe informally (token usage, reasoning spans, agent hops)
- Feeds [[telemetry-pipeline]]: GenAI spans/metrics are exactly the kind of high-cardinality, potentially-PII-bearing data a telemetry pipeline's filtering/sampling/routing layer needs to govern before storage
- Connects to [[production-trace-to-dataset-loop]]: the `gen_ai.evaluation.result` event (added v1.38.0) is a standardised hook for the same trace→eval correlation that pattern implements at the application layer
- Related to [[model-context-protocol]] via [[mcp-otel-trace-context-interlock]]: MCP's 2026-07-28 revision deprecates its own Logging feature in favour of this convention, and propagates W3C Trace Context so MCP tool calls land in the same span tree

## Applications
- **Cost/usage dashboards:** token-count attributes (`gen_ai.usage.input_tokens` / `output_tokens`) are the primitive for per-feature, per-user, or per-workflow cost attribution — directly relevant now that flat-rate subscriptions (see MEMORY.md provider migration) shift the interesting metric from cost to usage-window consumption, but the same attributes serve both
- **Cross-framework trace portability:** adopting `gen_ai.*` instead of a homegrown span shape avoids backend lock-in, at the cost of budgeting for schema churn
- **PII-safe default instrumentation:** default to metadata-only capture (no prompt/completion content) for any agent handling personal data — content capture is a deliberate opt-in, not a default to accept passively
- **Multi-framework analytics:** when ingesting traces from more than one agent framework, normalise at query time (`COALESCE` old/new field names) rather than assuming one attribute generation

## Sources
- [The state of the OpenTelemetry GenAI semantic conventions (July 2026)](https://john-hodge.com/blog/opentelemetry-genai-semantic-conventions/) — john-hodge.com, 2026-07-17. Primary source for this note: repository move, rename timeline, per-framework emission behaviour, practical guidance.
- [OpenTelemetry blog — GenAI observability](https://opentelemetry.io/blog/2026/genai-observability/) — 2026-05-14. What the conventions standardise; opt-in content capture rationale.
- [semantic-conventions-genai (GitHub)](https://github.com/open-telemetry/semantic-conventions-genai) — the dedicated repository the conventions now live in.
- [semantic-conventions v1.42.0 release notes](https://github.com/open-telemetry/semantic-conventions/releases/tag/v1.42.0) — the release that moved all `gen_ai.*` content out of the core repo.

## See Also
- [[observability]]
- [[llm-observability]]
- [[telemetry-pipeline]]
- [[production-trace-to-dataset-loop]]
- [[model-context-protocol]]
- [[mcp-otel-trace-context-interlock]]
- [[genai-eval-envelope]]
