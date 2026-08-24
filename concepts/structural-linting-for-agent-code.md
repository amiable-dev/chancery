---
title: Structural linting for agent-written code
aliases:
  - AST-level rules for LLM code
date: 2026-08-24
domain: software-engineering
maturity: emerging
source_type: practitioner
tags: [concept, agents, code-quality, static-analysis, domain/software-engineering, maturity/emerging, source-type/practitioner]
status: draft
sources:
  - url: https://newsletter.systemdesign.one/p/agentic-engineering
    hash: sha256:4348e1666b2fd47113aea3b3b5bceb8dfcaf370266ef152e866b36e38742d0d4
    retrieved: 2026-08-24
    class: external-secondary
    reachability: ok
---

# Structural linting for agent-written code

## Definition

**Structural linting** applies rules to a program's syntax tree rather than to its text, matching on the shape of a construct — a function definition whose default parameter is a mutable literal, an exception handler with no exception type — instead of on characters, tokens or formatting. Its particular value for agent-written code is that language models do not make the mistakes surface linters were designed to catch: they produce syntactically perfect, correctly formatted, type-checking code whose underlying patterns are wrong.

## Explanation

A text-level linter reasons about formatting, import order and naming; a structural rule engine parses first and then matches nodes — this is a function definition, these are its parameters, this default value is a list. The distinction matters because human error and model error have different shapes. Human error is typographic and inattentive, which is what the existing tooling was built around. Model error is distributional: the model rarely misspells an identifier, because predicting likely text is exactly what it is good at, but it will faithfully reproduce a pattern that appeared in its training corpus thousands of times without the caveat that makes it dangerous — a mutable default argument created once at definition and shared silently across every call, a bare handler that swallows a keyboard interrupt alongside real errors, an exception caught and discarded. All of that passes linting, passes type checking, and frequently passes the tests, because the defect is a shape rather than a spelling and nothing in the surface tooling is looking at shapes. The operational move that makes this compound is to treat a recurring anti-pattern as a rule rather than as a conversation: when the agent produces the same construct twice, encode it as a structural rule with its own tests and wire it into the commit gate and continuous integration, so the correction becomes permanent, applies to every future agent and human alike, and stops consuming attention. The source is a survey newsletter presenting the practice around a named tool; the claim about the distributional shape of model error is an argument rather than a measurement, though the specific defects it names are independently well documented.

## Key Properties

- Rules match syntax-tree shapes, catching defects that are valid as text and wrong as structure
- Model error is distributional rather than typographic — fluent, frequently-seen patterns reproduced without their caveats
- Canonical catches such as mutable default arguments and over-broad exception handlers pass linting, type checking and often the tests
- Encoding a recurring anti-pattern as a tested rule converts a repeated correction into a permanent gate
- Applicable wherever the language has a parser to target, and runs in the same commit and CI gates as ordinary linting

## Relationships

- [[layered-agent-guardrails]] — makes the commit-gate layer of that stack specific: it is the check that fires exactly when the agent's output is syntactically clean, which is the case where every earlier layer has nothing to object to
- [[risk-tiered-agent-change-control]] — supplies the kind of deterministic check that plan reserves for facts a machine can prove, keeping contextual judgement with the narrow reviewers and the named human approvers
- [[deterministic-agent-verification]] — structural linting is the specific linter mechanism deterministic verification's list names generically, elaborated with the reason it matters more for agent-written code — an LLM's failures are the shape-of-construct kind an AST-aware rule catches, not the surface kind conventional linters were built for.
- [[build-time-generation-governance]] — structural linting is a concrete technique for exactly the deterministic static-rule enforcement build-time generation governance requires — matching on construct shape is what lets a declared structural invariant be checked mechanically at merge.

## Applications

Turning a defect an agent keeps reintroducing into a tested structural rule instead of re-explaining it each session; adding an AST-level layer to a pre-commit and CI stack alongside formatting, linting and security scanning; auditing a repository of agent-written code for patterns that are locally correct and structurally unsafe.

## Sources

- https://newsletter.systemdesign.one/p/agentic-engineering

## See Also

- [[layered-agent-guardrails]]
- [[risk-tiered-agent-change-control]]
