---
title: "Deterministic-Picker Pattern"
date: 2026-07-15
domain: ai-agents
maturity: emerging
source_type: practitioner
topics: [patterns, evaluation]
tags: [concept, ai-agents, architecture, patterns, reliability, evaluation, domain/ai-agents, maturity/emerging, source-type/practitioner, topic/patterns, topic/evaluation]
status: draft
sources:
  - url: https://github.com/FareedKhan-dev/all-agentic-architectures
    hash: sha256:07f425aa4ca08f762dd08aefa3fe8286aff870ecee87b832d3e90b232671ea88
    retrieved: 2026-08-21
    class: unclassified
    reachability: ok
---

# Deterministic-Picker Pattern

## Definition
An architectural discipline for any step where an LLM ranks, scores, or selects between options ("LLM-as-Scorer"): instead of asking the LLM to emit a single numeric score directly, the LLM commits only to independent **categorical features** (booleans, bounded integers, `Literal` enums), and a deterministic Python function composes those features into the final deciding signal. The LLM never produces the number that actually drives the decision.

## Explanation
Ask most instruction-tuned LLMs (documented with Llama-3.3-70B, but the failure generalises) to emit a single quality score on a 1–5 or 1–10 scale, and the outputs collapse into a narrow band — e.g. four samples in a row all scoring `4/5`, regardless of real quality differences and regardless of how strict or "calibrated" the rubric instructions are. This is the **LLM-as-Scorer flat-band pathology**: the model has no reliable mechanism for discriminating fine-grained differences when asked to compress judgment into one number.

For any architecture that *depends* on that score to make a decision — beam search over thoughts, MCTS node selection, ranked document retrieval, accept/reject gates — a flat-banded score means the architecture is functionally arbitrary. There is no real signal to search or select on.

**The fix** is to never let the LLM emit the deciding number. Instead:
1. Define a small schema of independent categorical features the LLM *can* judge reliably — `is_on_brief: bool`, `has_concrete_imagery: bool`, `avoids_cliches: bool`, `word_count: int`, `is_engaging: bool`.
2. Have the LLM commit to each feature independently (via structured output, e.g. a Pydantic model).
3. Compose the features into a score in plain Python: `score = 4*is_on_brief + 2*(word_count in range) + 2*has_concrete_imagery + 1*avoids_cliches + 1*is_engaging`.

The resulting score genuinely spans its full range (e.g. 0–10) because it depends on five separate yes/no commitments rather than one holistic guess. An LLM that flat-bands a single "6/10 vs 7/10" judgment cannot flat-band five independent booleans the same way — saying "yes, this avoids clichés" is a categorically different cognitive operation from saying "this is a 6 out of 10."

**Why it works, per the source:**
1. **Granular commitment** — a yes/no judgment on one narrow property is easier for the LLM to answer consistently than a holistic numeric estimate.
2. **Auditability** — because each contributing feature is visible, you can show a user or reviewer *which* features drove the final score, not just the score itself.
3. **The LLM never emits the deciding value** — the number that actually routes the decision is always Python-computed, so its distribution is exactly as wide as the feature space allows, not bounded by the model's scoring habits.

**Documented applications (13 of 35 architectures in the source library; 9 more are architecturally immune because their decisions are categorical to begin with, e.g. Reflexion's pass/fail checker or SWE-Agent's `Literal[list, read, write, run_check, answer]` action space):**
- **Self-Consistency** — LLM commits to a per-sample `answer: str`; Python does `Counter(answers).most_common(1)`.
- **LATS** — LLM commits to `(makes_progress, is_complete, avoids_loops, confidence)`; Python composes `5*complete + 2*progress + 1*no_loops + conf_weight`.
- **Corrective RAG** — LLM commits to a per-document `Literal[relevant, ambiguous, irrelevant]`; Python routes based on label counts.
- **Constitutional AI** — LLM commits to a per-rule `verdict: Literal[pass, fail]`; Python checks `all(v == "pass")`.
- **Dry-Run** — LLM commits to `irreversibility: int (1-5)`; Python decides `approved = irreversibility < threshold`.

## Key Properties
- **Categorical commitment, not numeric estimation** — the LLM's job is narrowed to judgments it can make reliably (bool, bounded int, enum)
- **Composition happens in Python, not in the model** — the deciding signal is always deterministically computed from the LLM's structured outputs
- **Escapes flat-banding** — composite scores span their full theoretical range because they depend on multiple independent judgments
- **Auditable by construction** — every contributing feature is inspectable, unlike an opaque single number
- **Architectural, not a hyperparameter** — it must be designed into the schema and scoring function up front; it is not a prompt tweak, and once built in, the flat-band pathology cannot recur for that architecture's lifetime
- **Not universal** — some architectures need no picker at all because their control flow is already categorical (retrieval action selection, keep/drop decisions), making them immune by design rather than needing the pattern applied

## Relationships
- Directly informs [[llm-as-a-judge]]: LLM-as-a-judge setups that ask for a single holistic score are exactly the flat-band-prone pattern this technique replaces; rubric-decomposed judge prompts (score each property independently, then aggregate) are the deterministic-picker pattern applied to evaluation
- Related to [[genai-eval-envelope]]: property-hierarchy rubrics (technical quality → sub-properties like sharpness, deformations) already decompose judgment the way this pattern requires — the deterministic-picker pattern is the concrete mechanism for scoring each decomposed property without re-introducing a single flat-banded number at composition time
- Echoes our own `council-verify`/`council-gate` rubric-scoring design: multiple models scoring discrete rubric criteria, then a deterministic or chairman-synthesised aggregation, rather than each model emitting one holistic verdict
- Related to [[multi-agent-revalidation]]: revalidation's discrete-finding checks (true positive / false positive, not a severity guess) are a categorical-judgment style consistent with this pattern
- Contrasts with naive [[thinker-worker-verifier-pattern]] verification: a Verifier that emits "8/10, looks fine" reintroduces flat-banding; a Verifier that commits to categorical pass/fail per acceptance criterion, composed in Python, applies this pattern to the Verifier role

## Applications
- **Any agent architecture with a scoring/ranking step** — beam search, MCTS, ensemble voting, retrieval relevance grading, approval gates — should decompose the LLM's contribution into independent categorical features before computing the deciding value.
- **Eval and judge-model rubric design** — when building an LLM-as-judge pipeline, define the rubric as a set of independently-scorable properties (booleans/enums) and compute the aggregate score in code, rather than asking the judge for one number.
- **Safety gates** — irreversibility or risk-level gates (e.g. Dry-Run's `irreversibility: int 1-5` → Python threshold check) keep the actual approve/block decision out of the LLM's hands entirely.
- **CI/CD quality gates** (`council-gate`-style): pass/fail per rubric criterion, composed deterministically, rather than a single "is this good enough?" verdict from a judge model.

## Sources
- [All Agentic Architectures — 35 Production-Grade Patterns Library](https://github.com/FareedKhan-dev/all-agentic-architectures) — primary source; `docs/tutorials/deterministic-picker.md` names and documents the pattern across 13+ architectures with a full architecture-to-composition table.

## See Also
- [[llm-as-a-judge]]
- [[genai-eval-envelope]]
- [[multi-agent-revalidation]]
- [[thinker-worker-verifier-pattern]]
- [[uniform-architecture-contract]]
