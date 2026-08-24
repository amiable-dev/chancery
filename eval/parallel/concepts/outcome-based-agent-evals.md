---
title: Outcome-based agent evaluation
date: 2026-08-24
domain: ai-agents
maturity: emerging
source_type: vendor-doc
tags: [concept, evaluation, ai-agents, llm-as-judge, domain/ai-agents, maturity/emerging, source-type/vendor-doc]
status: draft
sources:
  - url: https://www.anthropic.com/engineering/multi-agent-research-system
    hash: sha256:af479a5cbb0b52add5efe63a066a1f713ef4c068d7ff6ad6c9c4bc09b496f026
    retrieved: 2026-08-24
    class: external-primary
    reachability: ok
---

# Outcome-based agent evaluation

## Definition

**Outcome-based agent evaluation** is the methodology that follows from agents having no fixed execution path: because two runs from the same input can take different but equally valid trajectories, an eval asserts that the agent reached a correct final outcome by a reasonable process, rather than that it followed prescribed steps. In practice it combines a small hand-built query set drawn from real usage, a single rubric-scored model judge per output, deliberate human testing for the failure classes automation cannot name, and, for agents that mutate state, judgement of the end state at discrete checkpoints instead of turn by turn.

## Explanation

Four findings give the method its shape and each corrects a natural intuition. Start small, because in early development effect sizes are enormous — a prompt change can move success rates by tens of points — so about twenty queries representing real usage are enough to see a change, and waiting for a hundreds-case suite costs more in delayed iteration than it buys in precision. Use one judge rather than several: for free-form outputs with no single correct answer, a single model call scoring against a rubric covering factual accuracy, citation accuracy, completeness, source quality and tool efficiency, and emitting one score plus a pass or fail, proved more consistent and better aligned with human graders than decomposing the rubric across specialised judges. Keep humans in the loop for the classes no rubric enumerates: manual testers caught a systematic source-quality bias in which agents preferred search-engine-optimized content farms over authoritative but lower-ranked sources, a question no evaluator written in advance would have thought to ask. And for state-mutating agents, judge the end state, because each action changes the environment for the next, so validating every intermediate step is both brittle and beside the point; the workable form is a set of checkpoints at which specific state changes should have occurred. The source is an engineering team's account of building an evaluation practice under production pressure, which is the origin of both its credibility and its bias — these are the methods that survived contact with one system, not a controlled comparison between methodologies.

## Key Properties

- Judge the outcome and the reasonableness of the process, since identical inputs legitimately yield different valid trajectories
- Start at roughly twenty real-usage queries; early effect sizes are large enough for small samples to resolve them
- One model judge call over a rubric, emitting a 0-to-1 score plus pass/fail, beat several specialised judges on consistency and human agreement
- Human testing surfaces failure classes no rubric anticipates, such as a systematic preference for search-optimized sources over authoritative ones
- State-mutating agents are evaluated on end state at discrete checkpoints rather than turn by turn

## Relationships

- [[acceptability-envelope-evals]] — states the same premise more generally, and this methodology is what asserting properties rather than values actually looks like once the thing under test is a multi-step agent with its own choice of path
- [[agent-checkpoint-resume]] — is the architecture that makes checkpoint-based end-state evaluation possible, because only explicit persisted state can be inspected at a checkpoint rather than reconstructed from a transcript
- [[multi-agent-token-economics]] — sets the budget this methodology operates under — at roughly fifteen times chat token cost every eval run is a real bill, which is a further reason a small well-chosen query set beats an exhaustive one early
- [[fitness-driven-agent-tuning]] — outcome-based evaluation supplies the methodology fitness-driven tuning's scalar fitness function needs to score an agent's end state — a rubric-scored judgment of the final outcome is the kind of fitness signal a hand-tuned scalar would otherwise approximate.
- [[rubric-as-training-signal]] — the same rubric outcome-based evaluation scores agent outcomes with is exactly the artifact rubric-as-training-signal proposes reusing as training supervision — the grader that already exists for evaluation becomes the labeller for improvement.
- [[purpose-built-agent-hierarchy]] — purpose-built agent hierarchies instantiate outcome-based evaluation's outcome-over-process philosophy as a test pyramid — many cheap leaf-level evals plus a few expensive end-to-end ones — fitted to a layered multi-agent architecture rather than a single agent.

## Applications

Standing up evaluation for any agent whose outputs are free-form or whose path is not prescribed: begin with about twenty real queries, score them with one rubric-based judge call, and reserve human review for discovering the biases the rubric does not yet cover. For agents that write to real systems, define the checkpoints whose state you will assert instead of scripting the steps.

## Sources

- https://www.anthropic.com/engineering/multi-agent-research-system

## See Also

- [[acceptability-envelope-evals]]
- [[agent-checkpoint-resume]]
- [[multi-agent-token-economics]]
