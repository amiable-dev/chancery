# The state of the OpenTelemetry GenAI semantic conventions (July 2026)

**Source:** https://john-hodge.com/blog/opentelemetry-genai-semantic-conventions/
**Added:** 2026-08-24
**Tags:** #unsorted

---

> The OTel GenAI conventions moved to a dedicated repository with no versioned release yet, nothing GenAI-specific is stable, and frameworks emit several generations at once. The current map.

---

[← Blog](https://john-hodge.com/blog/)

2026-07-17

If you instrument an LLM or agent framework today, “using the OpenTelemetry GenAI semantic conventions” does not identify one telemetry schema. The conventions moved to a dedicated repository in 2026, every GenAI-specific surface remains in Development status, and the popular frameworks emit several different generations of the attributes at once. I ran into all three facts directly while tracing [BrewTrace](https://john-hodge.com/blog/strands-ollama-opentelemetry-local-agent-tracing/) and [APAB](https://john-hodge.com/blog/apab-0-3-0/), and the ranking search results mostly miss them. This is the current map, as of July 17, 2026.

## The conventions moved

The GenAI conventions now live in their own repository, [open-telemetry/semantic-conventions-genai](https://github.com/open-telemetry/semantic-conventions-genai), which extends the core semantic conventions and holds the GenAI spans, events, metrics, provider pages, and MCP material. The main semantic-conventions repository’s [v1.42.0 release](https://github.com/open-telemetry/semantic-conventions/releases/tag/v1.42.0) (June 12, 2026) deprecated and moved all `gen_ai.*` content; v1.43.0 (July 3) ships none. The old documentation page at opentelemetry.io is now a pointer to the new home.

The practical catch: the dedicated repository has [no releases or tags yet](https://github.com/open-telemetry/semantic-conventions-genai/releases), and its README’s schema-URL section is still a TODO. You can follow a commit, a framework release, or a dated snapshot, but there is not yet a versioned GenAI-conventions release with a finalized schema URL to pin against. The last versioned cut of the GenAI conventions is main-repo v1.42.0, published as it moved out.

Stability is the same story stated precisely: as of July 17, 2026, no GenAI-specific span, event, metric, or attribute in the dedicated repository is marked Stable; the GenAI conventions remain Development. (Shared core attributes referenced in the same tables, such as `error.type` and `server.address`, are Stable; the `gen_ai.*` surface is not.)

## The rename timeline

Six releases account for most of the churn a practitioner will meet in the wild:

Release

Change

Consequence

[v1.27.0](https://github.com/open-telemetry/semantic-conventions/releases/tag/v1.27.0) (Aug 2024)

`gen_ai.usage.prompt_tokens` and `completion_tokens` became `input_tokens` and `output_tokens`

Token dashboards need dual-field queries or migration logic

[v1.37.0](https://github.com/open-telemetry/semantic-conventions/releases/tag/v1.37.0) (Aug 2025)

`gen_ai.system` became `gen_ai.provider.name`; per-message events replaced by `gen_ai.input.messages`, `output.messages`, `system_instructions` attributes

The most visible split between older framework telemetry and the current convention

[v1.38.0](https://github.com/open-telemetry/semantic-conventions/releases/tag/v1.38.0) (Oct 2025)

Added the `gen_ai.evaluation.result` event (`evaluation.name`, `score.value`, `score.label`, `explanation`, response correlation)

Evals can be correlated with the operation they score

[v1.40.0](https://github.com/open-telemetry/semantic-conventions/releases/tag/v1.40.0) (Feb 2026)

Retrieval spans, cache token attributes, `gen_ai.agent.version`

Richer agent and RAG telemetry, wider compatibility matrix

[v1.41.0](https://github.com/open-telemetry/semantic-conventions/releases/tag/v1.41.0) (Apr 2026)

`invoke_agent` split into client and internal spans; reasoning-token fields; streaming latency metrics; stricter `execute_tool` naming

In-process agent frameworks get their own span shape

[v1.42.0](https://github.com/open-telemetry/semantic-conventions/releases/tag/v1.42.0) (Jun 2026)

All GenAI material deprecated in core and moved to the dedicated repository

The authoritative source changed, without a versioned release at the new home

The v1.38 evaluation event deserves a note because it connects tracing to [eval harnesses](https://john-hodge.com/blog/llm-agent-eval-harness/): `gen_ai.evaluation.result` carries a required `gen_ai.evaluation.name`, a numeric `score.value` or categorical `score.label`, a recommended `explanation`, and a recommended `gen_ai.response.id` for correlation when direct span parenting is unavailable.

## What frameworks actually emit

The specification is one thing; the telemetry that lands in your backend is another. The most useful measurement I have is my own: tracing a Strands Agents application into Jaeger, the spans carried legacy `gen_ai.system=strands-agents` (no `gen_ai.provider.name`), token usage under both attribute generations with identical values, and current-style span names (`invoke_agent`, `chat`, `execute_tool`). That mix is normal, and it is what the transition machinery produces by design. The state of the frameworks I have checked or traced:

**Strands Agents** defaults to the frozen v1.36-era compatibility behavior described above; the latest conventions are opt-in ([issue #877](https://github.com/strands-agents/harness-sdk/issues/877)). Query both provider fields and both token generations, and record the tested version. The [BrewTrace walkthrough](https://john-hodge.com/blog/strands-ollama-opentelemetry-local-agent-tracing/) shows the full trace.

**Pydantic AI** uses the current structured format by default ([instrumented models](https://ai.pydantic.dev/api/models/instrumented/)) and also emits `gen_ai.system` alongside `gen_ai.provider.name` for compatibility. Prefer the current fields while tolerating the duplicates.

**Vercel AI SDK 7** is a new-generation implementation; OpenTelemetry support moved to the dedicated `@ai-sdk/otel` package ([telemetry docs](https://ai-sdk.dev/docs/ai-sdk-core/telemetry)), emitting `gen_ai.provider.name` and `gen_ai.usage.input_tokens`, with the old `ai.*` namespace kept as a legacy path.

**LangSmith** documentation and examples remain mixed across generations, and its [OpenTelemetry ingestion](https://docs.langchain.com/langsmith/trace-with-opentelemetry) accepts both. Inspect the stored trace rather than inferring the schema from one example.

**OpenAI Agents SDK** ships built-in tracing on its own architecture ([tracing docs](https://openai.github.io/openai-agents-python/tracing/)); it does not emit the OTel GenAI conventions natively. OTel export goes through contributed instrumentation or a custom processor.

**OpenLLMetry** migration status varies by instrumentation package and configuration: some paths emit current structured attributes, others retain older behavior. Test the exact package and version rather than assigning one status to the whole project.

## How to build on a moving spec

**Pin your versions.** The framework, the instrumentation, the OTel SDK, and the exporter each carry convention assumptions. A minor framework upgrade can change your attribute names.

**Publish a dated tested-with table.** In anything you write or ship, record exactly what you observed and when:

Component

Tested version

Observed on

Framework

exact package version

2026-07-17

OTel SDK / exporter

exact versions

2026-07-17

Backend

Jaeger or Grafana version

2026-07-17

`OTEL_SEMCONV_STABILITY_OPT_IN`

unset or exact value

2026-07-17

**Query both generations.** During the transition your analytics should recognize `gen_ai.system` and `gen_ai.provider.name`, and `gen_ai.usage.prompt_tokens` / `input_tokens` and `completion_tokens` / `output_tokens`. Coalesce with precedence; never sum the pairs, because frameworks that duplicate for compatibility emit the same value under both names:

```
COALESCE(
  attributes['gen_ai.provider.name'],
  attributes['gen_ai.system']
) AS gen_ai_provider
```

**Own your internal representation.** Keep a versioned internal model of providers, models, messages, token usage, tool calls, and evaluations; map framework telemetry into it, and map outward to the current convention at export time. A Development-status external schema should never be your database contract. This is the same own-the-spec argument from the [eval harness post](https://john-hodge.com/blog/llm-agent-eval-harness/), applied to telemetry.

**Keep custom attributes out of `gen_ai.*`.** A future revision can claim any name in a reserved namespace. BrewTrace stamps its domain attributes as `brew.*`, `taste.*`, and `eval.*` for exactly this reason.

The opt-in mechanism, for when you want the new behavior: instrumentations participating in the transition preserve the earlier v1.36-era output by default, and where the instrumentation supports it, setting `OTEL_SEMCONV_STABILITY_OPT_IN=gen_ai_latest_experimental` selects the latest experimental conventions. Confirm with a real exported span; not every framework honors the variable identically.

## The takeaway

OpenTelemetry remains the right interchange layer for LLM and agent telemetry, and the conventions are converging on a good shape: structured messages, first-class agent spans, an evaluation event. But “OpenTelemetry-compatible” is not yet a sufficient schema contract for GenAI telemetry. Pin what you run, inspect what actually lands, normalize across generations, and date what you tested.

_This is independent analysis based on public OpenTelemetry specifications, release notes, framework documentation, and locally observed telemetry. The projects and trademarks mentioned belong to their respective owners; no affiliation or endorsement is implied. The views are my own and do not represent any current or former employer._

## Frequently asked questions

### Where do the OpenTelemetry GenAI semantic conventions live now?

In the dedicated open-telemetry/semantic-conventions-genai repository on GitHub. The main semantic-conventions repository deprecated and moved all gen\_ai content in v1.42.0 (June 2026), and the former documentation page now points readers to the new project.

### Are any of the GenAI conventions stable?

As of July 17, 2026, no GenAI-specific span, event, metric, or attribute in the dedicated repository is marked Stable; the GenAI conventions remain Development. Some shared core attributes referenced in the same tables, such as error.type and server.address, are Stable.

### What replaced gen\_ai.system?

gen\_ai.provider.name, renamed in semantic-conventions v1.37.0 (August 2025). Frameworks may emit both attributes during compatibility transitions, so analytics should coalesce the two rather than assume one.

### How do I opt into the latest GenAI conventions?

Where the instrumentation supports the transition, set OTEL\_SEMCONV\_STABILITY\_OPT\_IN=gen\_ai\_latest\_experimental. Instrumentations default to the frozen v1.36-era behavior. Not every framework honors the variable identically, so confirm by inspecting a real exported span.

## More in [AI agents](https://john-hodge.com/blog/category/ai-agents/)

-   [A SysML v2 model that runs its own verification](https://john-hodge.com/blog/sysml-v2-verification-closure/) · 2026-08-21
-   [Data provenance for agentic AI workflows](https://john-hodge.com/blog/data-provenance-agentic-ai/) · 2026-08-17
-   [An agent designed a maritime search radar and beat my reference on cost](https://john-hodge.com/blog/agent-designs-a-search-radar/) · 2026-08-13
