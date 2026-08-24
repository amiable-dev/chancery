---
title: Layered testing of agentic systems
date: 2026-08-24
domain: software-engineering
maturity: emerging
source_type: practitioner
tags: [concept, agents, testing, architecture, domain/software-engineering, maturity/emerging, source-type/practitioner]
status: draft
sources:
  - url: https://www.infoq.com/articles/prompts-to-production-playbook-for-agentic-development/
    hash: sha256:7380d808df58d13eab6825b0abb44ce95b2e7e379a8882cd80acaee96625d7be
    retrieved: 2026-08-24
    class: external-primary
    reachability: ok
---

# Layered testing of agentic systems

## Definition

**Layered testing of agentic systems** scopes each test to one of three architectural layers instead of to the system as a whole: a deterministic system shell of APIs, integrations and tool implementations that ordinary unit and integration tests cover; an orchestration layer that assembles the runtime prompt from a template, application state and user input, and which is deterministic given those inputs; and a black-box inference core reachable only through prompt and state, where assertions must become property-based, metamorphic or behavioural.

## Explanation

The layering answers 'how do you test a nondeterministic system' by observing that most of an agentic application is not nondeterministic — splitting the stack localises the nondeterminism to one layer and lets conventional testing keep working everywhere else. At the shell, tools are ordinary functions, so invocation correctness, response-format validation and argument handling are unit-testable, with property-based generation covering the input space more broadly than hand-written cases. At the orchestration layer, prompt construction is a pure function of template, state and user input, so a wrong prompt — an unresolved placeholder, stale state injected, a truncated history — is caught deterministically and never misattributed to the model. Only at the inference core does ground truth become subjective, and there tests assert relations instead of values: metamorphic tests check that a defined change to the input produces the expected change in the output, property tests assert invariants across generated inputs, behavioural harnesses supply mock APIs and injected failures to observe task-completion order and tool-selection consistency, and adversarial suites probe prompt-injection resistance and tool-failure handling as resilience rather than correctness. The layer decomposition is drawn from a research paper on testing LLM applications; the tooling inventory built around it in the source is one practitioner's selection.

## Key Properties

- Three layers: deterministic shell, prompt-assembly orchestration, black-box inference core
- Most of an agentic application is deterministic and stays testable by ordinary means
- Prompt assembly is a pure function of template, state and input, so its bugs are deterministic rather than model faults
- Only the inference core needs property-based, metamorphic or behavioural assertions
- Adversarial checks — injection resistance, tool-failure handling — are scoped as resilience testing, not correctness testing

## Relationships

- [[acceptability-envelope-evals]] — supplies the assertion style this scoping needs at its innermost layer, where no single expected output exists to compare against
- [[deterministic-agentic-capability-matrix]] — draws at design time the same deterministic/nondeterministic boundary this scoping exploits at test time
- [[golden-trajectory-regression]] — covers the end-to-end scenario layer this scoping leaves hardest, by pinning the process rather than the output
- [[mutation-testing]] — mutation testing supplies the rigor check for layered agentic testing's outermost deterministic-shell layer — ordinary unit and integration tests can be mutation-tested the way the other two, non-deterministic layers cannot.
- [[temporal-fakes]] — temporal fakes supply a test-double technique fitted to layered agentic testing's outermost deterministic-shell layer — a temporal fake lets a shell-layer test exercise a realistic evolving sequence against an external dependency, rather than the single fixed response a conventional mock returns.

## Applications

Structuring a test suite for an agent so that tool bugs and prompt-assembly bugs are caught deterministically and never blamed on the model; deciding which of a failing agent's layers to instrument first when behaviour regresses.

## Sources

- https://www.infoq.com/articles/prompts-to-production-playbook-for-agentic-development/

## See Also

- [[acceptability-envelope-evals]]
- [[deterministic-agentic-capability-matrix]]
- [[golden-trajectory-regression]]
