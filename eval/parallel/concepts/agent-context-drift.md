---
title: Context drift in long-running agent tasks
date: 2026-08-24
domain: ai-agents
maturity: emerging
source_type: practitioner
tags: [concept, ai-agents, context, failure-modes, domain/ai-agents, maturity/emerging, source-type/practitioner]
status: draft
sources:
  - url: https://machinelearningmastery.com/building-ai-agents-here-are-some-anti-patterns-to-avoid/
    hash: sha256:98569296763f146a6a01b895405a16ace647694b25d45fc669dcf276959a559b
    retrieved: 2026-08-24
    class: external-secondary
    reachability: ok
---

# Context drift in long-running agent tasks

## Definition

**Context drift** is the operational failure in which the material an agent has accumulated over a long task quietly stops describing the world it is still acting on: tool outputs captured in early steps are retained verbatim, the underlying data changes underneath them, and the model has no way to tell which of its remembered observations have expired. It is distinct from the model's declining reliability over long inputs — that is a property of the model, whereas drift is a property of the run — and the two compound, because a window filled with stale detail is also a window in which the still-valid facts are harder to attend to.

## Explanation

The mechanism is that an agent's context is append-only by default while the environment is not. Every tool call adds a snapshot, that snapshot is timestamped nowhere the model can use, and nothing in the transcript marks a result as superseded, so an observation from step two continues to argue for decisions at step twenty with exactly the authority it had when it was true. Because the failure is silent, the countermeasures are all preventive and all about bounding what enters and what stays. Clearing stale tool results as token limits approach, while preserving the conversational thread, targets the expired snapshots directly. Extracting only the fields an agent actually needs from a tool response, rather than dumping a full dataset into the window, reduces how much can go stale in the first place. Enforcing a ceiling on the size of any single tool output stops one large result from crowding out everything else — a bound worth setting in advance precisely because the offending response is usually unanticipated. The framing that makes these worth paying for is treating the window as a finite resource with diminishing returns rather than a bucket to keep filling, and recognizing that for an agent designed to run long this is a normal operating condition rather than an edge case, so the bounds belong in the design rather than in the incident review. The source is a practitioner listicle citing vendor context-engineering guidance, so the mitigations are reported practice rather than measured results.

## Key Properties

- Agent context is append-only while the environment is not, so early tool outputs silently become false
- Nothing in a transcript marks a result as superseded, so stale observations keep their original authority
- Distinct from a model's long-input degradation: drift is a property of the run, not of the model
- Mitigations bound the input — clear stale tool results, extract only needed fields, cap any single tool output
- For long-running agents this is a normal operating condition, so the bounds belong in the design

## Relationships

- [[context-rot]] — is the model-side half of the same problem, showing that reliability falls with input length even when nothing in the input has gone stale, so a drifting run degrades along both axes at once
- [[context-engineering]] — is the discipline these mitigations belong to, curating the smallest high-signal token set at each turn rather than accepting whatever the run has accumulated
- [[agent-loop-anatomy]] — supplies the structural place to act, since per-iteration compaction is the hook where expired and low-value content is removed before the next decision
- [[layered-agent-memory]] — is the architectural response, moving what must persist out of the resident transcript into retrievable long-term memory and durable logs so it stops competing for window space
- [[agent-error-compounding]] — agent error compounding names in general terms the failure context drift is one instance of — a stale memory entry steering a later decision is retained-but-expired context doing precisely that compounding damage.
- [[chain-of-thought-prompting]] — chain-of-thought prompting explains the mechanism by which committed reasoning becomes durable context — exactly the durability that, unrevisited over a long task, is what context drift describes going stale.
- [[agentops]] — this discipline's intra-agent anomaly class is the general category the specific failure described here belongs to.

## Applications

Setting explicit tool-output caps and stale-result clearing rules before a long-running agent ships, and diagnosing an agent whose decisions degrade partway through long tasks without any error being raised.

## Sources

- https://machinelearningmastery.com/building-ai-agents-here-are-some-anti-patterns-to-avoid/

## See Also

- [[context-rot]]
- [[context-engineering]]
- [[agent-loop-anatomy]]
- [[layered-agent-memory]]
