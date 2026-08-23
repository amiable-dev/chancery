---
title: "Weak-to-Strong Supervision"
date: 2026-04-15
domain: ai-safety
maturity: emerging
source_type: research
topics: [safety, evaluation]
tags: [concept, ai-alignment, scalable-oversight, llm, training, domain/ai-safety, maturity/emerging, source-type/research, topic/safety, topic/evaluation]
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
  - url: https://arxiv.org/html/2501.13124v1
    hash: sha256:7b4b443c5825516b27c75a613a757a238bffc0ad95a4f3f47966935babb4f743
    retrieved: 2026-08-21
    class: unclassified
    reachability: ok
  - url: https://github.com/safety-research/automated-w2s-research
    hash: sha256:7686939098851d59eddbd1173785b4362c35006135fb1d617a9e6956c68d27ce
    retrieved: 2026-08-21
    class: unclassified
    reachability: ok
---

# Weak-to-Strong Supervision

## Definition
A training paradigm in which a relatively weak model (the "teacher") provides fine-tuning supervision to a more capable "strong" base model. The hypothesis is that the strong model can extract more signal from weak supervision than the teacher itself could produce — generalising beyond the teacher's own limitations.

## Explanation
The setup works as follows:

1. Start with a **strong base model** — one with latent capability but not yet fine-tuned for a task.
2. Use a **weak teacher model** to generate training labels or demonstrations for that task.
3. Fine-tune the strong base model on those weak labels.
4. Evaluate how well the strong model performs relative to both the teacher ceiling and its theoretical best.

The core insight is that a large pretrained model may already "know" things its weak supervisor doesn't — and given even imperfect feedback, it can bootstrap to a higher level of performance than the supervisor could achieve directly. This is sometimes called **eliciting latent knowledge** (ELK).

**Why it matters for alignment:** Weak-to-strong supervision is used as a proxy for the much harder problem of humans overseeing superhuman AI. In that framing, "humans" are the weak teacher and "superhuman AI" is the strong student. If we can make the strong model behave well even under weak supervision, that suggests paths toward keeping far-smarter systems aligned to human values.

**Empirical results (Anthropic, 2026):** Using nine Claude Opus 4.6 instances as Automated Alignment Researchers, Anthropic's AARs achieved a PGR of 0.97 on weak-to-strong supervision tasks within 800 cumulative research hours — compared to 0.23 by two human researchers over seven days.

## Key Properties
- Weak teacher is a *smaller or less capable* model generating labels for a *stronger* base model
- Performance is measured by [[performance-gap-recovered|Performance Gap Recovered (PGR)]], not raw accuracy
- The technique is most useful when the strong model has latent capability the teacher cannot directly elicit
- Generalisation to held-out domains is not guaranteed — methods tuned to one domain (chat tasks) may not transfer to others (coding)
- Production-scale results may diverge from research-scale results (methods can overfit to experimental setups)

## Relationships
- Measured by [[performance-gap-recovered|Performance Gap Recovered (PGR)]]: the metric that quantifies how much of the gap between weak teacher and ideal strong model performance was closed
- Motivates [[scalable-oversight|Scalable Oversight]]: weak-to-strong supervision is the operationalised, empirically testable form of the scalable oversight problem
- Used in [[automated-alignment-researchers|Automated Alignment Researchers (AARs)]]: Anthropic's AARs were tasked specifically with improving PGR on this setting
- Related to [[human-in-the-loop-pattern|Human-in-the-Loop Pattern]]: HITL is the near-term safety layer while scalable oversight addresses the regime where humans can no longer directly verify model outputs
- Related to [[multi-agent-systems|Multi-Agent Systems]]: the AAR experiment used multi-agent coordination to explore this problem autonomously

## Applications
- **Alignment research acceleration:** Automating the search for better weak-to-strong supervision methods (as AARs do) could compress years of human research into days
- **Data-efficient fine-tuning:** In domains where ground-truth labels are scarce, weak supervision from a smaller model can bootstrap a larger one
- **Scalability testing:** As a proxy problem for superhuman alignment, improvements here give confidence that future oversight techniques may generalise

## Study

> [!tip] Flashcards
> [[flashcards/weak-to-strong-supervision|Review flashcards for this concept]]

## Sources
- [Automated Alignment Researchers (Anthropic, 2026)](https://www.anthropic.com/research/automated-alignment-researchers) — Primary source; AARs achieving PGR 0.97
- [Weak-to-Strong Generalization (OpenAI)](https://cdn.openai.com/papers/weak-to-strong-generalization.pdf) — Foundational paper introducing the PGR framing
- [Debate Helps Weak-to-Strong Generalization](https://arxiv.org/html/2501.13124v1) — Extension using debate as the weak supervision signal
- [Code & Datasets](https://github.com/safety-research/automated-w2s-research) — Anthropic open-source release

## See Also
- [[performance-gap-recovered]]
- [[scalable-oversight]]
- [[automated-alignment-researchers]]
- [[reward-hacking]]
- [[human-in-the-loop-pattern]]
