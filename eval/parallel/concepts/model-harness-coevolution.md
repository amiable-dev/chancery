---
title: Model-harness co-evolution
date: 2026-08-24
domain: ai-agents
maturity: emerging
source_type: vendor-doc
tags: [concept, ai-agents, training, evaluation, domain/ai-agents, maturity/emerging, source-type/vendor-doc]
status: draft
sources:
  - url: https://www.langchain.com/blog/the-anatomy-of-an-agent-harness
    class: external-primary
---

# Model-harness co-evolution

## Definition

**Model-harness co-evolution** is the feedback loop in which agent vendors post-train models with their own harness in the loop — improving the model at the operations that harness emphasizes, then folding primitives discovered in the harness into the next generation's training — with the documented side effect that models overfit to their home harness's tool conventions, so the same model performs differently across harnesses and benchmark scores attach to model-plus-harness pairs rather than to models alone.

## Explanation

The loop runs in both directions: harness designers choose operations the model should be natively good at — filesystem manipulation, bash execution, planning, parallelizing subagents — and post-train against them; primitives that prove useful in production get added to the harness and then trained into the next model generation, compounding capability inside the home harness. The overfit shows up at the edges. OpenAI's Codex prompting guide documents that deviating from the trained apply_patch tool logic degrades file-editing performance — a truly general model would shrug off a patch-format change — and the Terminal Bench 2.0 leaderboard shows a frontier model scoring far lower inside its own vendor's harness than the same model in third-party harnesses, with the essay's authors reporting a Top 30 to Top 5 jump from changing only the harness. Two consequences follow: read agent benchmarks as results for model-plus-harness pairs, not for models; and treat harness optimization as an independent performance lever — the harness a model was trained with is not automatically the best one for a given task. The source is a LangChain essay, a vendor with a competing harness, so the framing is interested — but the apply_patch and leaderboard citations are independently checkable.

## Key Properties

- Post-training runs with the harness in the loop, targeting operations the harness designers selected
- Primitives discovered in the harness feed the next model generation, compounding the coupling
- Overfit symptom: changing trained tool conventions (e.g. a patch format) measurably degrades performance
- Benchmarked capability attaches to model-plus-harness pairs — the same model ranks differently across harnesses
- The home harness is not automatically the best harness for a given task

## Relationships

- [[agent-harness]] — gives that framing its corollary — because the harness is trained into the model, harness choice becomes a first-class performance variable rather than neutral plumbing

## Applications

Reading agent benchmarks as model-plus-harness results rather than model results; budgeting harness optimization as a performance lever alongside model choice; anticipating regressions when swapping or altering tool conventions a model was trained with.

## Sources

- https://www.langchain.com/blog/the-anatomy-of-an-agent-harness

## See Also

- [[agent-harness]]
