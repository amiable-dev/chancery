---
title: "Claim-Check Pattern"
date: 2026-08-01
domain: data
maturity: established
source_type: practitioner
topics: [patterns, orchestration]
tags: [concept, ai-agents, security, data-governance, infrastructure, privacy, domain/data, maturity/established, source-type/practitioner, topic/patterns, topic/orchestration]
status: draft
sources:
  - url: https://towardsdatascience.com/how-to-build-a-context-layer-and-a-company-brain/
    hash: sha256:b20520de2900c93455d4757c6d6ed3ab57f2a8351623246c60ee9dbfe22da7ef
    retrieved: 2026-08-21
    class: unclassified
    reachability: ok
---

# Claim-Check Pattern

## Definition
The **claim-check pattern** offloads any payload above a small size threshold to your own encrypted store and persists only a reference (a "claim check") to it in a durable workflow orchestrator, agent checkpoint, or persistent queue — instead of letting the orchestrator's own event history capture the full payload. It exists because durable infrastructure persists every activity's inputs and outputs by design, so without this pattern, customer data ends up sitting in your orchestration vendor's storage whether or not that was ever a conscious decision.

## Explanation
Durable workflow orchestrators (and similarly, agent checkpointing systems and persistent queues) get their reliability guarantees by recording every step's inputs and outputs in an event history, so a crashed or resumed workflow can replay from where it left off. This is exactly the mechanism a [[context-layer-architecture|context layer]]'s continuous ingestion loop depends on to survive crashes and retries.

The problem is that this durability mechanism is indiscriminate: it persists *whatever* was passed as input or output, with no awareness of whether that payload contains customer PII, a restricted document's full text, or a sensitive query result. If a workflow step fetches a customer's record and passes it to the next step, that full record now lives in the orchestrator's event history — typically hosted by a third-party vendor — for as long as that history is retained. This is not a bug in the orchestrator; it is working exactly as designed. The privacy leak is a property of the *architecture choice* (durable orchestration) applied naively to sensitive data, not a flaw in any single component.

The claim-check pattern is the standard fix, borrowed from enterprise integration patterns: rather than passing the payload itself between workflow steps, a step that produces a large or sensitive payload writes it to your own encrypted store and passes forward only a small reference (a claim check — the ticket you'd hand a coat-check attendant). The next step in the workflow retrieves the actual payload from your store using that reference. The orchestrator's event history now contains only references, never the sensitive content itself, so the orchestration vendor's storage never becomes an unintended copy of customer data.

The same exposure exists anywhere durable state captures inputs/outputs indiscriminately — agent checkpoints (used for [[agent-checkpoint-resume|resuming long-running agents]]) and persistent message queues carry the identical risk, and the identical fix applies.

## Key Properties
- **Threshold-triggered, not blanket** — only payloads above a defined size (or sensitivity classification) get offloaded; small, non-sensitive payloads can pass through the orchestrator directly
- **Your store, your encryption** — the offloaded payload lives in infrastructure you control and encrypt, not the orchestration vendor's
- **Reference-only durability** — the orchestrator's event history, which is what actually gets replicated and retained by the vendor, contains only a pointer
- **Applies beyond workflow orchestrators** — the same fix is needed for agent checkpoints and persistent queues, anywhere durable state indiscriminately captures payloads
- **A property of the architecture, not a single component's bug** — the "leak" is durability doing exactly what it's designed to do, applied without a data-sensitivity filter

## Relationships
- Composes [[context-layer-architecture]]: the ingestion reconciliation loop needs a durable orchestrator to survive crashes, and that same durability is precisely what creates the exposure this pattern closes
- Related to [[agent-checkpoint-resume]]: agent checkpoints are named explicitly as carrying the identical exposure — anything durable enough to resume from also durably retains whatever was checkpointed
- Related to [[separation-of-duties-agentic-sdlc]] and [[read-write-risk-separation]]: all three are instances of the same underlying discipline — don't let infrastructure built for one purpose (durability, execution, review) silently acquire privileges or data access it wasn't scoped for
- Contrasts with naive pass-by-value workflow design, where every step simply forwards whatever it received to the next, with no distinction between a small status flag and a full customer record

## Applications
- **Any durable workflow orchestrator handling customer or regulated data** (Temporal, AWS Step Functions, similar): audit what payload sizes and types actually flow through workflow steps before assuming "it's all local" or "it's all encrypted at rest" is sufficient
- **Long-running agent architectures with checkpointing**: before enabling checkpoint-based resume for an agent that handles sensitive context, confirm whether the checkpoint store is the same claim-check-safe store as the rest of the system, or a separate vendor-managed store that now holds a shadow copy of that data
- **Cron/subagent infrastructure retaining full inputs/outputs**: any pipeline (including this one) that persists observation summaries or session transcripts inherits this exposure the moment it starts handling data that isn't purely local and non-sensitive — worth auditing before anything moves off-box

## Sources
- [How to Build a Context Layer and a Company Brain — Towards Data Science](https://towardsdatascience.com/how-to-build-a-context-layer-and-a-company-brain/) — Tomer Mesika; raised in the context of durable workflow orchestrators used for context-layer ingestion, in the article's closing discussion of privacy leaking through durable infrastructure state

## See Also
- [[context-layer-architecture]]
- [[agent-checkpoint-resume]]
- [[separation-of-duties-agentic-sdlc]]
- [[read-write-risk-separation]]
