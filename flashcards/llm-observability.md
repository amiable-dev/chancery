---
tags: [flashcards, observability, llm, ai-agents, monitoring]
sr-due: 2026-04-15
sr-interval: 1
sr-ease: 250
---

# LLM Observability — Flashcards

#flashcards/ai-agents

## Definition <!-- kb:card:ec1a3d -->
What is LLM observability?
?
Observability applied to LLM-based systems, extended with AI-specific signals: token usage, prompt/completion pairs, cost per request, reasoning step traces, hallucination detection, and output quality scoring. It covers both *reliability* (did the request succeed?) and *quality* (was the response correct?).

## LLM-Specific Signals <!-- kb:card:4368cc -->
What signals does LLM observability add beyond standard observability?
?
- **Token economics** — prompt tokens, completion tokens, cost per request, budget attribution
- **Reasoning traceability** — each think/act/observe step captured as a trace span
- **Faithfulness monitoring** — does the response contradict retrieved context?
- **Alignment drift** — behavioural change over time detected via continuous evaluation
- **Quality scoring** — LLM-as-judge scores outputs on helpfulness, accuracy, safety
- **Prompt versioning** — correlate quality changes with prompt version changes

## Quality vs Reliability <!-- kb:card:a4e7d1 -->
Why is "HTTP 200" insufficient for LLM success?
?
An LLM can return HTTP 200 (request succeeded) while producing a hallucinated, biased, or unsafe response. LLM observability adds a quality dimension — response content must also be evaluated, not just the transport-level success.

## Application <!-- kb:card:e9cad8 -->
How would you use LLM observability to detect a regression from a prompt change?
?
1. Version your prompts (each version has an ID)
2. Correlate quality scores (LLM-as-judge) with prompt version in your trace store
3. Roll prompt change to 5% traffic via canary
4. Compare quality score distribution between control and canary
5. If quality drops, automated rollback; if quality holds, expand rollout

## Relationship <!-- kb:card:d36ac8 -->
How does LLM observability relate to multi-agent debugging?
?
In multi-agent systems, a single user request fans out to N agents. LLM observability provides cross-agent trace correlation via shared trace IDs — you can follow a request through agent A → tool call → agent B → final response and see exactly where quality degraded or an error was introduced.
