# Relevance rubric v1

Judged blind (no system, rank, score, or required-membership shown), against
the question alone. Revising this file invalidates agreement statistics and
forces re-sampling (packet 8, B2).

- **relevant** — a reader with this question is materially served by this
  concept: it answers the question or is a necessary part of the answer.
  *Example: "how does a session survive a harness crash?" → `proxy-boundary-session-capture`.*
- **marginal** — touches the topic but does not serve the question: background,
  sibling mechanism, or the right domain with the wrong subject.
  *Example: same question → `agent-checkpoint-resume` (adjacent mechanism, different layer).*
- **irrelevant** — a reader with this question learns nothing toward it here.
  *Example: same question → `okapi-bm25`.*

Primary treatment is strict (marginal ≠ relevant); the lenient variant is
always co-reported. A comparison that does not survive both is not robust.
