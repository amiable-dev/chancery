---
title: Mutation testing
date: 2026-08-24
domain: software-engineering
maturity: established
source_type: practitioner
tags: [concept, testing, quality, verification, domain/software-engineering, maturity/established, source-type/practitioner]
status: draft
sources:
  - url: https://www.thoughtworks.com/radar/techniques
    hash: sha256:52b9aa4d85844d1297a66a66f03904fc0d72fc860de4eb0fb9196fe3e6f1e8c7
    retrieved: 2026-08-24
    class: external-secondary
    reachability: ok
---

# Mutation testing

## Definition

**Mutation testing** measures a test suite by deliberately breaking the code it covers: a tool introduces small semantic changes — flipping a comparison, altering a boundary, removing a call — and reruns the tests, treating a mutant that no test fails on as evidence that the suite executes that line without checking what it does. It answers how much of the code is actually verified, where coverage answers only how much was executed.

## Explanation

The mechanism is a generate-and-kill loop. For each mutable point the tool derives variants of the program, runs the tests against each, and records whether some test failed, which kills the mutant, or none did, which leaves it surviving; the surviving set is the report, and each survivor points at a specific line whose behaviour no assertion constrains. That is a categorically different signal from coverage, which increments as soon as a line runs regardless of whether anything downstream examines the result — the reason a suite can hold high coverage and still pass no matter what the logic does. The distinction has become sharper as tests are increasingly generated rather than written, because the characteristic failure of generated tests is exactly the one coverage cannot see: a test that exercises a path but asserts nothing meaningful, or that mocks so thoroughly that the code under test is no longer in the loop. Such perpetually green tests survive refactors, survive logic inversions, and survive the bug they were nominally written to catch; mutation testing is the check that finds them, because a test with no real assertion cannot kill a mutant. The cost is the obvious one — the suite runs once per mutant, so the technique is applied to core domain logic rather than an entire repository — and the results need judgement, since some mutants are semantically equivalent to the original and can never be killed. The source is Thoughtworks' Technology Radar, an editorial assessment written from consulting engagements rather than a controlled study; its ring placement will age faster than the mechanism, which is decades old and independent of any tool.

## Key Properties

- Generates mutants — small semantic edits — and asks whether any test fails; survivors mark unverified behaviour
- Measures verification, unlike coverage, which only measures execution
- Detects perpetually green tests: missing assertions, or mocks that decouple the test from the code under test
- Cost scales with mutants times suite runtime, so it is aimed at core domain logic rather than whole repositories
- Equivalent mutants — variants that cannot change observable behaviour — make the raw score require interpretation

## Relationships

- [[skill-enforced-development-workflow]] — checks the property that workflow's test-first rule cannot guarantee — deleting code written before its test proves a test existed first, but only a surviving mutant reveals that the test never asserted anything about what the code does
- [[deterministic-agent-verification]] — mutation testing measures the actual rigor of exactly the test-suite check deterministic verification recommends leaning on — a suite that passes despite surviving mutants is a weaker mechanical check than its pass/fail result alone suggests.
- [[agentic-test-layer-scoping]] — mutation testing supplies the rigor check for layered agentic testing's outermost deterministic-shell layer — ordinary unit and integration tests can be mutation-tested the way the other two, non-deterministic layers cannot.

## Applications

Auditing an AI-generated or inherited test suite before trusting it as a regression gate; deciding whether critical domain logic is genuinely covered before a risky refactor; replacing a coverage target that teams have learned to satisfy without writing assertions.

## Sources

- https://www.thoughtworks.com/radar/techniques

## See Also

- [[skill-enforced-development-workflow]]
