---
tags: [flashcards, ai-agents, guardrails, ci-cd, safety, devops]
sr-due: 2026-06-23
sr-interval: 1
sr-ease: 250
---

# Commit Gates — Flashcards

#flashcards/ai-agents

## Definition <!-- kb:card:99ec73 -->
What is a commit gate?
?
A guardrail checkpoint positioned at the **boundary between agent work and persistent state** — typically before a git commit, database write, or other durable side-effect. Commit gates catch issues after the agent loop completes but before the work becomes permanent and shared.

## Why at commit time? <!-- kb:card:aa638b -->
Why position a gate specifically at commit time rather than during the agent loop?
?
- Agents can produce internally consistent work that violates project-wide invariants only visible across files
- Commits are shared — once pushed, they affect all downstream consumers, CI, and teammates
- The agent is still active and can remediate failures automatically (unlike CI, which runs after the commit is already pushed)
- Catching issues before the commit avoids propagation and keeps fixes cheap

## Gate types <!-- kb:card:40fad6 -->
Name four categories of checks that commit gates can enforce.
?
1. **Code quality** — linters, formatters (ruff, eslint, black, prettier)
2. **Type safety** — mypy, TypeScript compiler, pyright
3. **Security** — secret scanning (truffleHog, gitleaks), SAST, dependency audit
4. **Scope** — files changed outside the intended task scope
(Also: test suite pass, coverage thresholds, license compliance, AI artifact detection)

## Gate vs CI <!-- kb:card:2dba7f -->
What is the key difference between a commit gate and CI?
?
**CI runs after the commit is pushed.** Commit gates run **before** the commit is created, while the agent that produced the code is still active. Agent can receive gate failures as tool observations and fix them automatically — no human needed for recoverable failures. CI catches what slips past commit gates.

## Guardrails stack <!-- kb:card:75ef8d -->
Where do commit gates fit in the agent guardrails stack?
?
The guardrails stack (in order of execution):
1. **Sandboxing** — constrains what the agent can access during execution
2. **Permissions** — constrains which tools/actions the agent can invoke
3. **Hooks** — intercept actions before they execute (pre-execution)
4. **Commit gates** — check outputs before they become persistent (post-execution, pre-persistence)
