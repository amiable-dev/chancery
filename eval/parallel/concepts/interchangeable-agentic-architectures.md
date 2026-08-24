---
title: Interchangeable agentic architectures
aliases:
  - Agentic pattern catalog
  - Pattern-fit failure
date: 2026-08-24
domain: ai-agents
maturity: emerging
source_type: practitioner
tags: [concept, agents, architecture, patterns, domain/ai-agents, maturity/emerging, source-type/practitioner]
status: draft
sources:
  - url: https://github.com/FareedKhan-dev/all-agentic-architectures
    class: external-primary
---

# Interchangeable agentic architectures

## Definition

**Interchangeable agentic architectures** is the treatment of the named agent patterns in the literature — reflection loops, tree and Monte-Carlo search over thoughts, corrective and self-grading retrieval, tiered memory, supervisor-and-specialist teams, sandboxed tool agents — as alternative implementations of a single uniform contract: each accepts a task and returns a result of the same shape, so the pattern becomes a swappable parameter rather than an architectural commitment, and every pattern can be run against the same task suite and compared directly.

## Explanation

The contract is what does the work. One entry point that takes a task, one result object carrying the output plus metadata, and the choice of pattern stops propagating into calling code — swapping a reflection loop for a search-based planner becomes a constructor change rather than a rewrite. Two consequences follow. The first is comparability: running every pattern over one shared suite yields a per-task result grid rather than a stack of per-paper claims, and the informative output is not the aggregate score but the pattern-fit failures it exposes — a tree-search pattern collapsing on arithmetic because the task has no branching structure worth searching, debate and ensemble patterns converging confidently on a wrong answer to a trick question through group-think, memory patterns failing raw-fact recall because the unit they store is a conversation turn or a workflow recipe rather than a fact. Those are mismatches between a pattern's inductive bias and a task's shape, not defects in the implementations, and they are the part that transfers: choosing an agent architecture is a fit question with predictable failure modes, not a search for the strongest pattern. The second consequence is that each entry stays traceable to its originating paper, so the collection doubles as a navigable map of the literature and its family structure. The source is a single-author open-source repository presenting itself as both a library and a runnable textbook, and its quantitative claims — test counts, provider coverage, an aggregate accuracy on a seventeen-task suite from one run on one model for roughly a dollar and a half of tokens — are a snapshot of a small benchmark, not a ranking anyone should cite. The uniform contract and the pattern-fit framing are what survive that caveat.

## Key Properties

- A single entry point and result shape turn a pattern into a swappable strategy rather than an architectural commitment
- Every catalogued pattern is traceable to its originating paper, making the collection a map of the literature's families
- A shared task suite makes patterns comparable, and the pattern-fit failures are the informative output rather than the aggregate score
- Documented mismatches: search patterns on non-branching arithmetic, debate and ensembles group-thinking on trick questions, episodic memory on raw-fact recall
- Its benchmark numbers are one small run on one provider — architecture evidence, not a ranking of the patterns

## Relationships

- [[react-pattern]] — is one entry in this catalog, and the uniform contract is precisely what lets it be exchanged for a reflection, planning or search pattern without any change to the code that calls it
- [[debate-augmented-weak-supervision]] — supplies another catalogued pattern, and the benchmark's group-think failure — debate and ensemble agreeing on a wrong answer to a trick question — marks one edge of where multi-agent argument stops adding signal
- [[deterministic-picker-scoring]] — is the house scoring discipline applied throughout this catalog, so patterns that must rank or accept candidates do so through composed categorical features rather than each inventing its own numeric self-rating
- [[orchestration-as-provider-hedge]] — the provider-hedge argument applies the identical swappable-behind-a-uniform-contract logic interchangeable architectures states for agent patterns, one layer down, to the choice of which model executes a role, so a provider becomes a pool member rather than a hard dependency.

## Applications

Choosing an agent architecture by task shape rather than by reputation, and predicting how a candidate pattern will fail before building it; prototyping several patterns behind one interface so the choice can be measured instead of argued; using the pattern-to-paper mapping as a reading order into the agentic literature.

## Sources

- https://github.com/FareedKhan-dev/all-agentic-architectures

## See Also

- [[react-pattern]]
- [[debate-augmented-weak-supervision]]
- [[deterministic-picker-scoring]]
