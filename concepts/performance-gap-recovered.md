---
title: "Performance Gap Recovered (PGR)"
aliases: ["Performance Gap Recovered (PGR)"]
date: 2026-04-15
domain: ai-safety
maturity: emerging
source_type: research
topics: [evaluation, safety]
tags: [concept, ai-alignment, metrics, evaluation, scalable-oversight, domain/ai-safety, maturity/emerging, source-type/research, topic/evaluation, topic/safety]
status: draft
sources:
  - url: https://www.anthropic.com/research/automated-alignment-researchers
    hash: sha256:1fee92769bfa48c89ee49157a1e646398bb3d599dbc253fe4b9712f5e62c18a5
    retrieved: 2026-08-21
    class: unclassified
    reachability: ok
  - url: https://cdn.openai.com/papers/weak-to-strong-generalization.pdf
    hash: sha256:1f655c3d9a5cfaab535e2c0b1901b56dd9260c15a79ac6b237ef548c03041098
    retrieved: 2026-08-21
    class: unclassified
    reachability: ok
---

# Performance Gap Recovered (PGR)

## Definition
A normalised evaluation metric that measures how much of the theoretical performance gap between a weak teacher model and an ideal strong model was bridged by a given supervision method. Formally:

```
PGR = (strong_model_perf − weak_teacher_perf) / (strong_ceiling_perf − weak_teacher_perf)
```

PGR = 0 means the fine-tuned strong model performs no better than the weak teacher.  
PGR = 1 means the strong model achieves its theoretical best (equivalent to training on ground-truth labels).

## Explanation
PGR is used in [[weak-to-strong-supervision|Weak-to-Strong Supervision]] experiments to answer the question: "How much of the strong model's latent capability did this supervision method successfully unlock?"

**Why normalise?** Raw accuracy varies widely across tasks and model pairs. PGR abstracts away absolute performance differences and focuses on *relative improvement*, making results comparable across different task domains (chat, math, coding) and model size pairings.

**Reference points in practice:**
- OpenAI's original weak-to-strong paper achieved ~20% PGR on some pairings with simple fine-tuning
- Two human researchers (Anthropic, 2026): **PGR 0.23** after 7 days of iteration
- Nine Automated Alignment Researchers (Anthropic, 2026): **PGR 0.97** after 800 cumulative hours
- AAR best method on held-out math: **PGR 0.94** (good transfer)
- AAR best method on held-out coding: **PGR 0.47** (2× human baseline, but not full transfer)

**Gotchas:**
- High PGR on a training domain doesn't guarantee transfer to held-out domains
- Methods can achieve high PGR by gaming the specific experimental setup (see [[reward-hacking]])
- Production-scale results may diverge: the top AAR method showed no statistically significant improvement on Claude Sonnet 4 with production training infrastructure, suggesting overfitting to experimental conditions

## Key Properties
- Normalised: range 0–1, task-agnostic, model-pair-agnostic
- Requires a **strong ceiling** benchmark (performance when trained on ground-truth labels) as an upper bound
- Assumes the ceiling and teacher performance are measured on the same evaluation set
- Not a measure of absolute capability — only of how efficiently weak supervision was leveraged

## Relationships
- Core metric for [[weak-to-strong-supervision|Weak-to-Strong Supervision]]: PGR is the objective that supervision methods are optimised against
- Used to compare [[automated-alignment-researchers|AARs]] vs human researchers
- Susceptible to [[reward-hacking|Reward Hacking]]: if models can manipulate the scoring server or find shortcuts, PGR becomes unreliable

## Applications
- **Benchmarking supervision methods:** Compare fine-tuning strategies, label smoothing, data reweighting, etc. using a single normalised score
- **Research prioritisation:** High PGR on diverse held-out domains signals a genuinely general method vs. one that overfits to the training domain
- **Automated research loops:** AARs optimise directly against PGR, enabling fully automated hypothesis generation and evaluation

## Study

> [!tip] Flashcards
> [[flashcards/performance-gap-recovered|Review flashcards for this concept]]

## Sources
- [Automated Alignment Researchers (Anthropic, 2026)](https://www.anthropic.com/research/automated-alignment-researchers) — Context for PGR in the AAR experiment
- [Weak-to-Strong Generalization (OpenAI)](https://cdn.openai.com/papers/weak-to-strong-generalization.pdf) — Paper that introduced the PGR framing

## See Also
- [[weak-to-strong-supervision]]
- [[automated-alignment-researchers]]
- [[reward-hacking]]
- [[scalable-oversight]]
