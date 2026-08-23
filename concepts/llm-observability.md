---
title: "LLM Observability"
date: 2026-04-15
domain: observability
maturity: emerging
source_type: practitioner
topics: [evaluation]
tags: [concept, observability, llm, ai-agents, monitoring, evaluation, otel, domain/observability, maturity/emerging, source-type/practitioner, topic/evaluation]
status: draft
sources:
  - url: https://langfuse.com/docs
    hash: sha256:c7846f4fa6ed1a8128e72cb6cc15fd972f557cbe565a20844770dd69d416a9a5
    retrieved: 2026-08-21
    class: unclassified
    reachability: ok
  - url: https://opentelemetry.io/docs/specs/semconv/gen-ai/
    hash: sha256:039211b703ad8450265b401fabe26f460ceff201692d4c6877172724b74c8318
    retrieved: 2026-08-21
    class: unclassified
    reachability: ok
  - url: https://docs.ragas.io/
    hash: sha256:a82b1477a6ab586d0e7bac4a505b11678debef63c65314cb79bc7de34dfcb67c
    retrieved: 2026-08-21
    class: unclassified
    reachability: ok
---

# LLM Observability

## Definition
The application of observability principles to LLM-based systems, extended with AI-specific signals: token usage, prompt/completion pairs, model latency, cost per request, hallucination detection, reasoning step traces, and output quality scoring. LLM observability enables understanding of *why* an LLM-based system produced a particular output — not just whether it succeeded or failed.

## Explanation
Standard [[observability]] (logs, metrics, traces) applies to LLM infrastructure, but LLM systems have failure modes orthogonal to conventional software: they can succeed at the HTTP level while producing wrong, biased, or unsafe outputs. LLM observability adds a quality dimension on top of the reliability dimension.

**Standard observability signals, LLM-extended:**

| Signal | Standard | LLM Extension |
|--------|----------|---------------|
| **Logs** | Request/response events | Prompt text, completion text, model ID, temperature, stop reason |
| **Metrics** | Latency, error rate, throughput | Token count (prompt/completion/total), cost per request, cache hit rate |
| **Traces** | Service call tree | Reasoning step spans, tool call spans, [[retrieval-augmented-generation|RAG]] retrieval spans, agent hop spans |

**LLM-specific concerns:**

**1. Token economics**
Every LLM call has a token cost. Observability must track: prompt tokens, completion tokens, cached tokens, cost per call, cost per user/workflow. Budget attribution matters at scale.

**2. Reasoning traceability**
For agents, each step in the reasoning loop (think → act → observe) should be a span with its own trace. This enables post-hoc audit: "what did the agent consider before calling this tool?"

**3. Hallucination and faithfulness monitoring**
Did the model's response contradict the retrieved context (RAG faithfulness)? Did it fabricate citations? Automated scoring models (e.g., G-Eval, RAGAS) can run as async evaluators on sampled outputs.

**4. Alignment drift detection**
In long-running production systems, model behaviour can shift (model updates, context window effects, prompt drift). Continuous evaluation with held-out test sets detects regression before users do.

**5. Quality scoring**
Human-preference metrics (BLEU, ROUGE) are poor proxies for LLM quality. LLM-as-judge patterns use a second model to score outputs on dimensions like helpfulness, accuracy, and safety.

**6. Prompt versioning**
Prompts are code. LLM observability systems should correlate performance changes with prompt version changes — which prompt version caused the drop in quality?

**Tooling landscape:**
- **LangSmith** (LangChain) — trace, evaluate, and monitor LangChain pipelines
- **Langfuse** (open source) — model-agnostic tracing, prompt management, evaluation
- **Honeycomb** — general observability platform; works well for LLM traces with high cardinality
- **Arize Phoenix** — open-source LLM observability with RAG evaluation
- **OpenTelemetry GenAI SIG** — emerging OTel semantic conventions for LLM signals (Gen AI span attributes)

## Key Properties
- **Quality ≠ reliability** — an HTTP 200 with a hallucinated answer is not a success; LLM observability must capture both dimensions
- **Sampling is essential** — logging every prompt/completion pair at scale is expensive; intelligent sampling (error-biased, outlier-biased) balances cost and coverage
- **Evaluation is async** — quality scoring happens after the fact on sampled traces, not inline (too slow)
- **Context is king** — understanding *why* a response was generated requires the full prompt, context, tool calls, and reasoning trace — not just the final output
- **Privacy tension** — logging prompt/completion pairs may capture PII; data masking or differential logging is needed in regulated contexts
- **Multi-agent complexity** — in [[multi-agent-systems]], a single user request may fan out to N agents; cross-agent trace correlation (via shared trace IDs) is essential

## Relationships
- Extends [[observability]]: LLM observability is observability + quality/alignment signals applied to AI systems
- Required for [[multi-agent-systems]]: tracing agent chains across hops is the primary debugging mechanism for multi-agent failures
- Feeds [[agentic-ai-platform-architecture]] Layer 2 (Analytics & Insight): LLM observability is the specialised form of observability the analytics layer implements
- Related to [[behavioral-qa-agents]]: LLM observability provides the tracing infrastructure that behavioral QA evaluators consume
- Related to [[agentic-sdlc]]: SLO-based rollbacks in agentic SDLC depend on quality metrics from LLM observability pipelines
- Related to [[knowledge-confidence-scoring]]: confidence scores on knowledge outputs are a form of LLM observability signal

## Applications
- **Cost attribution:** Which feature / user / agent workflow is consuming 40% of the LLM budget? Token-level traces with business context attributes answer this.
- **Regression detection:** A prompt change ships to 5% of traffic; LLM-as-judge scores drop → automatic rollback before full traffic exposure
- **Agent debugging:** A multi-agent workflow produced a wrong answer; trace shows which agent's tool call returned bad data, which downstream agents used it
- **Hallucination auditing:** RAG faithfulness scorer flags responses that contradict source documents; flagged responses queue for human review
- **Homelab council:** LLM Council runs on 4 models; observability would track per-model quality, latency, and cost to inform model selection

## Study

> [!tip] Flashcards
> [[flashcards/llm-observability|Review flashcards for this concept]]

## Sources
- [LLM Observability Guide (Langfuse)](https://langfuse.com/docs) — practical implementation patterns
- [OpenTelemetry GenAI SIG](https://opentelemetry.io/docs/specs/semconv/gen-ai/) — semantic conventions for LLM traces
- [RAGAS: Evaluation for RAG Pipelines](https://docs.ragas.io/) — automated RAG faithfulness and relevance scoring

## See Also
- [[observability]]
- [[observability-2-0]]
- [[telemetry-pipeline]]
- [[slo-based-alerting]]
- [[multi-agent-systems]]
- [[agentic-ai-platform-architecture]]
- [[behavioral-qa-agents]]
- [[agentic-sdlc]]
- [[knowledge-confidence-scoring]]
- [[ai-llm-gateway]] — gateway-level logging is a primary source of LLM observability signals without per-app instrumentation
- [[otel-genai-semantic-conventions]] — the standardised `gen_ai.*` schema this note's "OpenTelemetry GenAI SIG" tooling row refers to; as of 2026-08 it's Development-status, relocated to a dedicated repo, and fragmented across framework versions in practice
