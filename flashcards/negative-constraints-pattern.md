---
tags: [flashcards, negative-constraints-pattern, ai-agents, engineering, process, patterns]
sr-due: 2026-05-21
sr-interval: 1
sr-ease: 250
---

# Negative Constraints Pattern — Flashcards

#flashcards/ai-agents

## Definition <!-- kb:card:df1d27 -->
What is the Negative Constraints Pattern?
?
A specification pattern that explicitly lists what a task does NOT do, does NOT modify, and does NOT implement — using negation to define scope boundaries as precisely as positive acceptance criteria define outcomes. Prevents AI agent scope creep and communicates intent to human reviewers.

## Why Negation Matters <!-- kb:card:4b7703 -->
Why isn't it enough to just list what the story does — why also list what it doesn't do?
?
Capable agents fill gaps with reasonable-looking decisions. Without explicit exclusions, an agent improving a function might also refactor adjacent code, update a shared module, or clean up imports throughout the file. Each decision seems defensible; collectively they create unintended side effects and harder-to-review PRs.

## Two Audiences <!-- kb:card:f572e5 -->
Who are the two audiences for negative constraints, and what does each gain?
?
1. **The agent** — explicit exclusions override its instinct to "helpfully" improve adjacent code. If the spec says "Does NOT modify X," the agent won't touch X.
2. **The reviewer** — provides a checklist of things that should NOT have changed, making scope violations immediately visible without full diff analysis.

## Invariants vs. Negative Constraints <!-- kb:card:7b8d92 -->
What is the difference between "Invariants to Preserve" and "Negative Constraints"?
?
*Invariants to preserve* define existing behaviour that must remain unchanged: "the `GET /users` response format must remain the same." *Negative constraints* define files/modules/capabilities explicitly out of scope: "this story does NOT touch `GET /users` at all." Both are needed; they operate at different levels.

## Common Categories <!-- kb:card:c21c71 -->
Name four common categories of negative constraints.
?
1. **File exclusions** — "Does NOT modify `auth/middleware.py`"
2. **Schema preservation** — "Does NOT change the `User` model schema"
3. **Deferred scope** — "Does NOT implement pagination (deferred to #47)"
4. **Blast radius control** — "Does NOT update callers of the refactored function"

## Application <!-- kb:card:7340c6 -->
When should a Negative Constraints section be left empty, and is empty better than absent?
?
An explicitly empty section is better than an absent one — it signals the author considered exclusions and determined none apply, rather than forgetting the section entirely. Leave it empty when the story's scope is self-evidently bounded and no plausible adjacent changes exist.
