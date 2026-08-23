---
title: "Commit Gates"
date: 2026-06-23
domain: ai-agents
maturity: emerging
source_type: practitioner
topics: [patterns, safety, devops]
tags: [concept, ai-agents, guardrails, ci-cd, safety, code-quality, devops, domain/ai-agents, maturity/emerging, source-type/practitioner, topic/patterns, topic/safety, topic/devops]
status: draft
sources:
  - url: https://newsletter.systemdesign.one/p/agentic-engineering
    hash: sha256:4348e1666b2fd47113aea3b3b5bceb8dfcaf370266ef152e866b36e38742d0d4
    retrieved: 2026-08-21
    class: unclassified
    reachability: ok
  - url: https://medium.com/lets-code-further/30-core-agentic-engineering-concepts-every-developer-should-know-5066b3117f69
    hash: sha256:f041e2f6202d4dad79856cbe698f460cc51ae46eb6d8b13a8a4353d5a638e51e
    retrieved: 2026-08-21
    class: unclassified
    reachability: ok
  - url: https://github.com/obra/superpowers
    hash: sha256:a70b7bc4235926af13c32fdc37ac3b3e880afa0fa407ef91f3c2f82e12223600
    retrieved: 2026-08-21
    class: unclassified
    reachability: ok
---

# Commit Gates

## Definition

A **commit gate** is a guardrail checkpoint positioned at the boundary between an agent's working context and persistent, shared state — typically between the completion of agent work and its materialisation as a git commit, database write, or other durable side-effect. Commit gates catch issues that slipped past in-process checks before they become permanent.

## Explanation

Agent loops produce outputs continuously — file writes, test runs, code changes. Most guardrails operate *during* the loop (permission checks, sandboxing, tool filtering). Commit gates are the last line of defence *after* the loop, catching problems at the moment the agent's work transitions from ephemeral to durable.

**Why a dedicated gate at commit time:**
- Agents can produce internally consistent work that violates project-wide invariants not visible within a single session
- Commits are shared: once pushed, they affect every downstream consumer, CI pipeline, and teammate
- Agent-generated code may pass unit tests but fail style, type, or security checks
- The agent may have edited files outside its intended scope, or left debugging artifacts

**What commit gates check:**

| Check type | Examples |
|-----------|----------|
| **Code quality** | Linters (ruff, eslint), formatters (black, prettier) |
| **Type safety** | mypy, TypeScript compiler, pyright |
| **Security** | Secret scanning (truffleHog, gitleaks), SAST tools, dependency audit |
| **Tests** | Full test suite pass, coverage thresholds |
| **Diff scope** | Files changed outside the intended scope |
| **Agent artifacts** | Temporary debug files, commented-out test disablers, TODO markers left by agent |
| **Compliance** | License compatibility, SBOM generation, policy checks |

**Commit gate vs. CI:**  
CI runs *after* the commit is pushed. Commit gates run *before* the commit is written, when fixes are cheapest. The agent that produced the code is still active and can remediate automatically — no human intervention needed for recoverable failures.

**Implementation patterns:**
1. **Pre-commit hooks:** Standard git hooks (`pre-commit` framework) run checks before every `git commit`. The agent's commit step triggers the hook; if it fails, the agent receives the error output and can fix before retrying the commit.
2. **Harness-level gates:** The agent harness wraps the commit tool; before delegating to git, it runs checks and returns failure output as a tool observation. The agent loop handles it like any other error.
3. **Explicit agent step:** A "commit review" step in the agent's workflow — agent explicitly calls a verification tool before committing, and commits only if the verification passes.
4. **HARD-GATE directives:** Some frameworks (e.g., Superpowers) embed explicit `HARD-GATE` annotations in workflows that the agent cannot proceed past without explicit check success.

**Connection to broader guardrails:**
Commit gates are one layer in the guardrails stack:
- **Sandboxing** — constrains what the agent can access during execution
- **Permissions** — constrains which tools/actions the agent can invoke
- **Hooks** — intercept agent actions before they execute (pre-execution)
- **Commit gates** — check agent outputs before they become persistent (post-execution, pre-persistence)

**Failure handling:**
- **Recoverable failures** (linting, formatting): agent receives error output, fixes automatically, retries commit
- **Non-recoverable failures** (security violations, out-of-scope changes): escalate to human; don't let the agent attempt infinite retry loops
- **Ambiguous failures** (test failures that might be pre-existing): agent checks git blame / baseline; escalate if uncertain

## Key Properties

- **Boundary-positioned** — gates sit at the transition from ephemeral to durable; not during the loop, but at the moment of commitment
- **Last-line-of-defence** — catches what in-loop checks miss, especially cross-file or project-wide invariant violations
- **Agent-remediable** — unlike CI, commit gates run while the agent is still active and can fix failures before they're committed
- **Fail-fast** — catching issues before commits avoids propagation to CI, code review, and downstream consumers
- **Composable** — multiple gate types (lint, security, test, scope) stack and all must pass

## Relationships

- Part of the guardrails layer alongside [[constrained-agent-actions]], [[sandbox-per-session-isolation]], and [[agent-governance-gap]]
- Enables [[agentic-pipeline-verification]]: automated verification of agent outputs before they enter the shared codebase
- Related to [[agent-attestation-standards]]: commit gates produce evidence of checks performed; this evidence can feed attestation pipelines
- Addresses [[ai-code-slop]]: systematically catches and rejects the hallmarks of AI-generated code quality issues before they land
- Complements [[behavioral-qa-agents]]: BQA tests agent behaviour patterns; commit gates enforce output quality constraints
- Related to [[approval-fatigue]]: well-designed commit gates reduce the need for human review of routine agent commits, targeting human attention to the cases that matter

## Applications

- **Autonomous coding agents:** Configure pre-commit hooks with ruff, mypy, and gitleaks. Agent commits trigger all three; on failure, the error is returned to the agent as a tool observation. Agent fixes and retries automatically. Humans only see commits that passed all gates.
- **Secret prevention:** Git hooks with truffleHog scan every staged diff for credentials. Agent that accidentally writes an API key to a file is caught before the commit is ever created.
- **Scope enforcement:** A commit gate script diffs the staged files against the task brief's declared scope. Files outside scope trigger a confirmation gate — agent must justify the out-of-scope change or revert.
- **Test enforcement:** Commit gate runs the test suite on staged changes. Failing tests are returned as observations; agent must fix tests or revert the change before committing.

## Sources

- [Agentic Engineering (System Design Newsletter)](https://newsletter.systemdesign.one/p/agentic-engineering) — "Guardrails" section; commit gates as the boundary between agent work and persistent state
- [30 Core Agentic Engineering Concepts Every Developer Should Know](https://medium.com/lets-code-further/30-core-agentic-engineering-concepts-every-developer-should-know-5066b3117f69) — guardrails layer taxonomy
- [Superpowers framework (GitHub)](https://github.com/obra/superpowers) — HARD-GATE directives as commit gate enforcement mechanism

## See Also

- [[constrained-agent-actions]]
- [[sandbox-per-session-isolation]]
- [[agentic-pipeline-verification]]
- [[agent-attestation-standards]]
- [[ai-code-slop]]
- [[approval-fatigue]]
- [[behavioral-qa-agents]]
