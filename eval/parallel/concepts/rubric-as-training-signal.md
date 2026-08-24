---
title: Evaluation rubric as training signal
date: 2026-08-24
domain: llm
maturity: emerging
source_type: vendor-doc
tags: [concept, evaluation, post-training, fine-tuning, domain/llm, maturity/emerging, source-type/vendor-doc]
status: draft
sources:
  - url: https://fireworks.ai/blog/open-source-agents-frontier-advisors
    hash: sha256:148a5559a58c809a52b24f443ab8cb1191ad6feba057c76fd81d7f075da93269
    retrieved: 2026-08-24
    class: external-primary
    reachability: ok
---

# Evaluation rubric as training signal

## Definition

**Evaluation rubric as training signal** is the practice of reusing a benchmark's own grading rubric as the supervision for improving a model against it, in two escalating forms: rejection-sampling supervised fine-tuning, where the base model is run over the benchmark and only the completions passing every rubric criterion are kept as training data, and reinforcement fine-tuning, where the rubric's evaluators are called during training so each criterion contributes its own reward. In neither form is a separate reward model trained or a human relabelling pass run, because the grader that already exists is the labeller.

## Explanation

The supervised form is the cheap half and is almost embarrassingly simple: generate trajectories with the base model, filter by the rubric, fine-tune on the survivors. It works because a rubric-graded benchmark is already a verifier, so the model's own passing outputs are in-distribution demonstrations of exactly the behaviour the rubric rewards, with no reward model and no architecture change. Its ceiling follows from the same fact — nothing can be learned about criteria the base model never satisfies, because there are no passing samples to imitate. Reinforcement fine-tuning is the follow-on for precisely that ceiling: scoring against the evaluators directly with per-criterion rewards can teach the criteria rejection sampling has no examples of, at the price of more compute and a noisier curve. The reported run illustrates the gain and a measurement subtlety worth carrying away: supervised fine-tuning moved the mean rubric-criterion pass rate only from 0.863 to 0.876 but moved the strict all-criteria-pass count from 11 of 100 to 15 of 100 at essentially unchanged inference cost, and a small mean lift with a large strict-metric jump is the signature of a model that learned to close tasks out cleanly rather than one that got broadly smarter — which is why the two metrics have to be read together. Reinforcement fine-tuning then reached 0.886 over 46 rollout steps. The source is a vendor post reporting its own runs, so treat the magnitudes as illustrative and the recipe as the transferable part. The hazard is structural rather than incidental: optimizing directly against the grader optimizes what the rubric measures, and the rubric is a proxy for what you actually want.

## Key Properties

- Supervised form: generate with the base model, keep only rubric-passing completions, fine-tune on them — no reward model, no human relabelling
- Reinforcement form: call the rubric's evaluators during training with per-criterion rewards, as the follow-on when rejection sampling plateaus
- Rejection sampling cannot teach criteria the base model never satisfies, since it has no passing examples of them
- Reported effect concentrated in the strict all-criteria-pass metric (11 to 15 of 100) rather than the mean (0.863 to 0.876), at unchanged inference cost
- Training against the grader optimizes the proxy rather than the goal the proxy stands for

## Relationships

- [[frontier-advisor-harness]] — is the training-time counterpart to that inference-time pattern — one changes the weights so the open model needs less help, the other changes the call structure so it gets help only where it matters
- [[emergent-misalignment-from-reward-hacking]] — names the hazard this recipe walks toward — training directly against the evaluators that score you is exactly the setup in which optimizing the measured proxy, rather than the behaviour it stands for, is what gets rewarded
- [[outcome-based-agent-evals]] — the same rubric outcome-based evaluation scores agent outcomes with is exactly the artifact rubric-as-training-signal proposes reusing as training supervision — the grader that already exists for evaluation becomes the labeller for improvement.

## Applications

Turning an existing rubric-graded benchmark into a fine-tuning pipeline with no labelling budget: filter your own rollouts by rubric pass and fine-tune on the survivors, escalating to per-criterion reward training only once that filter stops paying. It is also a reason to hold back a rubric slice the training loop never sees, so the grader retains some independence from the thing it grades.

## Sources

- https://fireworks.ai/blog/open-source-agents-frontier-advisors

## See Also

- [[frontier-advisor-harness]]
- [[emergent-misalignment-from-reward-hacking]]
