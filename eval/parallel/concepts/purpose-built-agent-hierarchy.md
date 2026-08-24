---
title: Purpose-built agent hierarchies
aliases:
  - Layered narrow agents with pyramid evals
date: 2026-08-24
domain: ai-agents
maturity: emerging
source_type: practitioner
tags: [concept, agents, architecture, evaluation, domain/ai-agents, maturity/emerging, source-type/practitioner]
status: draft
sources:
  - url: https://www.infoq.com/presentations/reliable-ai-platforms/
    hash: sha256:fa755eebcd198b9755000bc27e7269c2f02dba5c2d230183ad305e6338d1dc28
    retrieved: 2026-08-24
    class: external-primary
    reachability: ok
---

# Purpose-built agent hierarchies

## Definition

A **purpose-built agent hierarchy** is a compound AI system assembled from deliberately narrow agents composed in layers — retrieval agents that know one query or one table, analyst agents that know what to ask about one problem, an orchestrator pursuing a goal, action agents that each do one thing — instead of one general agent holding every tool, and it is verified the way a test pyramid verifies software, with many cheap evals at the leaf level and a few expensive end-to-end evals above them.

## Explanation

Accuracy comes from constraint. A retrieval agent that only turns questions into one table's queries, given a few good examples, a deliberately flat and wide schema and read-only access, is reliable in a way a general data agent is not, for the same reason a new analyst is given filters and grouping before joins. Narrowing also caps the paradox of choice: a bloated tool menu makes a model reason longer, cost more and answer worse, so the useful move is usually to remove a tool rather than to add a rule about it. Layering then buys composition, since each agent's window holds only its own job, but it also stacks error — every level multiplies the failure rate of the level beneath it, and that compounding is a first-class design constraint rather than an implementation detail. Verification mirrors the structure. Leaf evals assert that the query counting machines actually counts them, run cheaply and constantly, and use a model as judge only to accept semantically equivalent phrasings of the same answer. Middle evals behave like integration tests over several aggregated agents and cost real inference, so there are fewer. End-to-end supervisor evals are fewest and most expensive and still necessary, because the pilot that reaches eighty percent accuracy has cleared the demo bar and not the production one. The account comes from a five-month internal project whose successor an engineer rebuilt in roughly six hours once off-the-shelf protocols existed — the speaker's own evidence that the layering, not the plumbing, was the part worth keeping.

## Key Properties

- Constraining one agent to one table or one question raises accuracy more than improving a general prompt
- Flat wide schemas and read-only access beat expressive interfaces where reliability matters
- Error stacks upward: each layer multiplies the failure rate of everything beneath it
- Evals follow a test pyramid — many cheap leaf checks, few costly end-to-end runs, model-as-judge for equivalence
- Eighty percent accuracy is a demo threshold, not a production one

## Relationships

- [[context-engineering]] — explains why the narrowing works at all, since each agent's window then holds only the instructions, examples and tools for a single job and nothing competes for its attention budget
- [[deterministic-agent-verification]] — sets what the base of this eval pyramid should prefer — mechanical checks wherever one exists, with the model judge reserved for accepting differently worded but equivalent answers
- [[determinism-discovery-split]] — is the rule that decides which nodes of the hierarchy should not be agents at all, so the two compose into a system that is mostly deterministic with judgment concentrated where it is needed
- [[outcome-based-agent-evals]] — purpose-built agent hierarchies instantiate outcome-based evaluation's outcome-over-process philosophy as a test pyramid — many cheap leaf-level evals plus a few expensive end-to-end ones — fitted to a layered multi-agent architecture rather than a single agent.

## Applications

Decomposing an operational assistant into agents small enough to evaluate individually; deciding where to spend eval budget as a compound system grows layers; diagnosing a multi-agent system whose top-level answers are wrong more often than any single component is.

## Sources

- https://www.infoq.com/presentations/reliable-ai-platforms/

## See Also

- [[context-engineering]]
- [[deterministic-agent-verification]]
- [[determinism-discovery-split]]
