---
title: Grounding agents in current state
aliases:
  - Procedural knowledge versus current state
date: 2026-08-24
domain: ai-agents
maturity: emerging
source_type: practitioner
tags: [concept, agents, retrieval, tooling, domain/ai-agents, maturity/emerging, source-type/practitioner]
status: draft
sources:
  - url: https://newsletter.systemdesign.one/p/agentic-engineering
    class: external-secondary
---

# Grounding agents in current state

## Definition

**Current-state grounding** is the practice of dividing what an agent needs to know into what its weights already encode — how to write code, how a protocol generally behaves — and what only a live source can supply, such as the signature a library exposes this week or what a particular repository actually does, then closing the second gap with a source the agent queries during the run rather than with more instruction. The failure it addresses is silent: a model that does not know an interface does not say so, it emits a plausible call, and the error appears only at runtime.

## Explanation

A model's parameters are a lossy summary of a corpus with a cutoff date. Procedural competence generalises well past that date — the idioms of a language, the shape of a protocol, how to structure a test — but facts about fast-moving external state go stale immediately, and the model has no calibrated way to signal which of the two it is drawing on. The generated call is indistinguishable in form from a correct one, which is what makes the failure expensive: it survives review, and the first thing that notices is the runtime. Prompting cannot fix this, because the missing information is not latent in the model waiting to be elicited; the fix is architectural, attaching a source the agent can query at the moment of need. Three shapes recur and are the same pattern at increasing distance from the code: current documentation for a named library, pulled into context on demand so calls are written against what exists rather than what existed; documentation generated over a specific repository, so a question about an unfamiliar codebase is answered from that code instead of from generic priors; and search designed for agent consumption, returning extracted content, highlights and summaries rather than human-facing pages the agent must chew through advertising and navigation to read. A fourth case follows the same logic — meeting notes, design documents and specifications that never passed through the agent's sessions at all, exposed as a query surface rather than pasted in. What unifies them is the economics: a queried source costs tokens only when the question is asked, so the standing context stays small while the reachable material does not. The source is a survey newsletter naming specific products; the products will churn, the division between procedural knowledge and current state will not.

## Key Properties

- Weights carry procedure well past the training cutoff; facts about external state go stale immediately
- The model gives no signal distinguishing a recalled fact from a plausible reconstruction, so the failure surfaces at runtime
- The remedy is a queryable source at run time rather than a better prompt — the information is not latent in the model
- Same pattern at three distances: live library documentation, generated documentation over a specific repository, and agent-oriented search returning extracted content
- Query surfaces keep standing context small because the token cost is paid per question rather than per turn

## Relationships

- [[context-engineering]] — shares that practice's budget logic from the retrieval side: a source queried on demand is charged only when the question is asked, which is what lets an agent reach far more material than could ever stay resident
- [[agent-instruction-layering]] — covers the other half of the same split — standing instruction files carry what is stable about a project, while these sources carry what changes faster than any file could be kept correct
- [[rare-context]] — rare context names the category of knowledge that fills current-state grounding's second bucket — what only a live source can supply — since organisation-specific vocabulary is precisely what no amount of pretraining could have covered.

## Applications

Diagnosing a class of agent bugs where calls to a dependency are confidently wrong, and fixing it by attaching live documentation instead of adding instructions; onboarding an agent to an unfamiliar codebase through generated repository documentation rather than a hand-written summary; exposing an organisation's existing written material to an agent as a searchable surface rather than copying it into context.

## Sources

- https://newsletter.systemdesign.one/p/agentic-engineering

## See Also

- [[context-engineering]]
- [[agent-instruction-layering]]
