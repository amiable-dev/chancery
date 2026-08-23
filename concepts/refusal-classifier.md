---
title: "Refusal Classifier"
date: 2026-05-10
domain: ai-agents
maturity: emerging
source_type: practitioner
topics: [patterns, evaluation]
tags: [concept, ai-agents, architecture, patterns, safety, robustness, security, domain/ai-agents, maturity/emerging, source-type/practitioner, topic/patterns, topic/evaluation]
status: draft
sources:
  - url: https://vercel.com/blog/introducing-deepsec-find-and-fix-vulnerabilities-in-your-code-base
    hash: sha256:c399354b792311861802cc040665b089cec906337d86e15faccc460eeb453a35
    retrieved: 2026-08-21
    class: unclassified
    reachability: ok
  - url: https://github.com/vercel-labs/deepsec/
    hash: sha256:13c7e4e41d95145ee3fb285e04f06a795a7ad5b24d326fa6a78568e2a1c48732
    retrieved: 2026-08-21
    class: unclassified
    reachability: ok
---

# Refusal Classifier

## Definition
A Refusal Classifier is a lightweight model or heuristic component in an agent pipeline that detects when the primary LLM has declined (refused) to complete a requested task — as opposed to completing it with an answer, even a wrong or partial one. It enables the pipeline to distinguish a refusal from a genuine (if incorrect) response, and to take corrective action: retry with a rephrased prompt, switch models, escalate to a human, or flag the step.

## Explanation
Frontier LLMs have built-in safety filters that cause them to refuse certain requests, particularly those involving security-sensitive, offensive, or dual-use topics. In a security scanning pipeline, this creates a subtle failure mode: the agent doesn't crash or throw an error — it politely declines and produces output that looks like a finding but is actually a refusal message ("I'm unable to assist with…").

A naive pipeline treats this output as a completed analysis result, propagating the refusal downstream as a non-finding. This silently degrades recall without the operator knowing.

The Refusal Classifier sits after each agent step and checks the raw output against a trained or heuristic detector. If a refusal is detected, the pipeline can:
1. **Retry with rephrasing** — reframe the prompt to avoid the safety trigger
2. **Switch to a cyber-tuned model** — use a model fine-tuned to accept security tasks the base model refuses
3. **Mark the candidate as unreviewed** — preserve the evidence for human review without silently dropping it
4. **Log and alert** — surface refusal rates as a pipeline health metric

Vercel's `deepsec` ships with a built-in refusal classifier that checks each research step. Per the blog post: *"In our experience, for the prompt that deepsec is using, refusals are a non-issue for both Opus 4.7 and GPT 5.5."* — meaning the classifier validates that refusals don't occur, rather than having to handle them at runtime. But the component exists precisely so that the pipeline *knows* if they do.

The pattern generalises beyond security scanning to any domain where LLM outputs may contain polite non-answers that masquerade as real responses: content moderation, legal document review, medical information extraction.

## Key Properties
- **Detects implicit failures:** Distinguishes a completed (even incorrect) response from a refusal — a failure mode invisible to crash-based error handling
- **Lightweight:** Typically a small classifier or regex/keyword heuristic — not another full LLM pass
- **Corrective options:** Retry, model-swap, escalate, or log — the classifier enables policy, not just detection
- **Health metric:** Refusal rate per pipeline stage is a useful diagnostic for prompt drift or model changes
- **Complements cyber-tuned models:** Cyber models reduce refusal likelihood; the classifier provides observability either way

## Relationships
- Component of [[agent-powered-sast]]: deepsec uses a refusal classifier after each investigation step
- Related to [[multi-agent-revalidation]]: both address agent output quality, but refusal classification targets *missing* output while revalidation targets *noisy* output
- Related to [[behavioral-qa-agents]]: both handle failure modes in agent pipelines; behavioral QA is broader
- Related to [[constrained-agent-actions]]: refusal classification is one mechanism for detecting when agents operate outside their designed envelope
- Informs [[agentic-pipeline-verification]]: pipeline verification needs to detect refusals to accurately measure pipeline health

## Applications
- **Security scanning pipelines:** Detect when the LLM silently refused to analyse a sensitive file path or function
- **Content moderation systems:** Distinguish "content is clean" from "model refused to evaluate"
- **Legal/medical extraction:** Detect when a model refuses to quote specific case law or drug interactions
- **Prompt regression testing:** Monitor refusal rate across model versions to detect safety filter changes that affect your pipeline
- **Multi-model routing:** Use refusal detection to automatically re-route to an alternative model without manual intervention

## Study
- Flashcards: [[flashcards/refusal-classifier|Practice this concept]]

## Sources
- [Introducing deepsec](https://vercel.com/blog/introducing-deepsec-find-and-fix-vulnerabilities-in-your-code-base) — Mentions the built-in refusal classifier as a pipeline robustness component
- [deepsec GitHub](https://github.com/vercel-labs/deepsec/) — Open-source implementation

## See Also
- [[agent-powered-sast]]
- [[multi-agent-revalidation]]
- [[behavioral-qa-agents]]
- [[constrained-agent-actions]]
- [[transcript-classifier]]
