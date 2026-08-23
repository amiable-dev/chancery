---
title: "Risk-Tiered Code Review"
date: 2026-07-26
domain: software-engineering
maturity: emerging
source_type: practitioner
topics: [agentic-coding, workflow]
tags: [concept, ai-agents, security, sdlc, code-review, governance, domain/software-engineering, maturity/emerging, source-type/practitioner, topic/agentic-coding, topic/workflow]
status: draft
sources:
  - url: https://claude.com/blog/how-anthropic-secures-its-ai-native-software-development-lifecycle
    hash: sha256:74aebfb7eebcacc72db2e90756c8dfbedfd5e19d6b5953495895d850ef2aec64
    retrieved: 2026-08-21
    class: unclassified
    reachability: ok
  - url: https://www.nxcode.io/resources/news/ai-native-sdlc-security-controls-playbook-2026
    hash: sha256:a14e7d7476dc9d542a1e822c0a3adc77ca6d3aca013c1d786c83397bd233525b
    retrieved: 2026-08-21
    class: unclassified
    reachability: ok
---

# Risk-Tiered Code Review

## Definition
**Risk-tiered code review** is a code-review architecture that assigns the *type* and *number* of required checks to a change based on the assessed risk of what it touches — rather than applying a uniform review process to every change regardless of impact — and, specifically for AI-authored code, layers three distinct kinds of checks that each catch a different class of failure: **deterministic checks** (for facts a machine can prove), **narrow AI reviewers** (for contextual reasoning within a bounded scope), and **human approval** (reserved for high-impact, risk-tiered decisions).

## Explanation
When every pull request receives the same review treatment — one senior engineer reads the diff, a generic linter runs, a general-purpose AI reviewer comments — two failure modes appear as agent-generated code volume grows. First, reviewer attention is spread evenly across changes of wildly different consequence, so a one-line authorization bug in a billing path gets the same scrutiny as a documentation typo. Second, "green checks" (tests pass, lint passes, a review comment was left) start to substitute for actual risk assessment — a change can satisfy every uniform gate and still be dangerous, because the gates were never asking the specific question that mattered for *that* change.

Risk-tiered review inverts this. It first classifies a change by risk — what it touches (auth, payments, infrastructure, tenant isolation, regulated data vs. documentation or test fixtures) — and only then decides which checks are required and how much human attention it deserves. Size is explicitly *not* a proxy for risk: a one-line authorization error can be more dangerous than a 2,000-line generated test suite.

**The three layers, and why each is necessary:**

| Layer | Catches | Cannot catch |
|---|---|---|
| **Deterministic checks** (compilers, unit tests, secret scanners, SAST, dependency/license policy, branch protection) | Facts that are exactly and repeatably provable: does it compile, does the test pass, is there a hardcoded credential, is this dependency on the approved list | Contextual or intent-level issues — a cache key missing a tenant identifier is syntactically fine and passes every deterministic check |
| **Narrow AI reviewers** | Contextual reasoning scoped to a specific question — e.g., an authorization reviewer whose only job is to prove or disprove "can a principal read a resource outside their active tenant" | Facts that require exact reproducibility (nondeterministic judgment is the wrong tool for a yes/no compile check) and cannot substitute for accountable human sign-off on high-impact decisions |
| **Human approval** | High-impact, ambiguous, or novel decisions where accountability and judgment matter, and where the cost of a wrong automated call is unacceptable | Doesn't scale to review every line of a high-volume pipeline — reserved deliberately for the risk tier that needs it |

A critical design detail from Anthropic's account: requiring automated reviewers to *prove* their findings — attach a file-and-line claim, a concrete failure path, a reproduction — rather than emit a vague flag, raised the share of pull requests receiving *substantive* review comments from 16% to 54%. The lesson is that automated review becomes valuable specifically when a finding carries a reproducible reason a human (or another agent) can verify, not when it merely produces more flags.

**Narrow AI reviewers, specifically:** rather than one large, general-purpose review prompt asked to comment on "anything wrong with this diff," risk-tiered review scopes each AI reviewer to a single question — an authorization reviewer, a dependency reviewer, a data-handling reviewer — each with only the context needed to answer its one question. This narrowing is what makes the review both more accurate (less context dilution, see [[attention-budget]]) and more auditable (each finding maps to a specific, falsifiable claim).

## Key Properties
- **Risk tiers are content-based, not size-based** — determined by what code touches (auth, billing, infra, tenant isolation, regulated data) rather than lines changed.
- **Each layer catches a distinct failure class** — deterministic checks miss contextual bugs; narrow AI reviewers miss the accountability requirement of high-impact decisions; human approval doesn't scale to every line. The layers are not redundant, they are complementary.
- **Findings must be provable, not just flagged** — a reviewer (human or AI) should be able to reconstruct *why* a finding is valid from a file-and-line claim, a failure path, or a reproduction, not accept a bare assertion.
- **Reviewer scoping is deliberate** — narrow, single-question reviewers outperform one large general-purpose reviewer prompt for both accuracy and auditability.
- **Green checks satisfy requirements; they do not decide the requirements** — passing every automated gate is necessary but not sufficient; the risk tier determines what "passing" even needs to include.

## Relationships
- Implements the "checking" job of [[separation-of-duties-agentic-sdlc]]: this is *how* the checking job is actually carried out, once the identity boundary for who performs it is established.
- A specialization of [[human-in-the-loop-pattern]]: human approval here is risk-calibrated rather than applied uniformly, which is exactly HITL's stated calibration principle.
- Related to [[multi-agent-revalidation]]: narrow AI reviewers examining independent, scoped evidence is a close cousin of revalidation's independence requirement, though revalidation specifically re-checks a prior agent's findings rather than reviewing a diff from scratch.
- Related to [[commit-gates]]: deterministic checks in risk-tiered review are frequently implemented as commit gates, running before a change becomes durable.
- Produces components of the [[evidence-receipt]]: each layer's findings (deterministic pass/fail, AI reviewer claims, human approval record) are the structured inputs a receipt assembles.
- Connects to [[attention-budget]]: narrow-scoped reviewers work better partly because a tightly bounded context question avoids diluting the model's attention across an entire diff's worth of unrelated concerns.
- Related to [[read-write-risk-separation]]: both principles size the intensity of a control (validation, scope constraint, human checkpoint) to the actual risk of the action, rather than applying one policy uniformly.
- Contrasts with a uniform, single-pass review model (e.g., one generalist reviewer or one green CI check) that risk-tiered review explicitly replaces.

## Applications
- **Defining tiers for a pipeline:** Classify repositories or code paths into tiers (e.g., docs/tests → deterministic-only; application logic → deterministic + code-owner review; auth/billing/infra → deterministic + narrow specialist review + human security-owner approval), and encode this as policy rather than leaving it to reviewer judgment per PR.
- **Building a narrow reviewer:** Give an AI reviewer one falsifiable question and only the context needed to answer it (e.g., "prove or disprove: this change allows cross-tenant data access") rather than a broad "review this PR" prompt.
- **Requiring evidence, not flags:** When designing automated review tooling, require every finding to include a specific location, a concrete failure scenario, and ideally a reproduction — reject tooling that only emits generic warnings.
- **Auditing an existing review process:** Ask whether review intensity is currently a function of code content/risk or of diff size/habit — if a one-line change to an auth check gets the same review as a one-line change to a README, the tiering is missing.

## Study
- Flashcards: [[flashcards/risk-tiered-code-review|Practice this concept]]

## Sources
- [How Anthropic secures its AI-native software development lifecycle](https://claude.com/blog/how-anthropic-secures-its-ai-native-software-development-lifecycle) — primary source; the three-layer review model and the 16%→54% substantive-review-comment statistic.
- [AI-Native SDLC Security: A Practical Control Plan for Agent-Written Code](https://www.nxcode.io/resources/news/ai-native-sdlc-security-controls-playbook-2026) — elaborates the risk-tier concept with a concrete YAML policy artifact (tier1/tier2/tier3, required checks, human-approval requirements per tier) and the tenant-isolation authorization-reviewer scenario used above.

## See Also
- [[separation-of-duties-agentic-sdlc]]
- [[human-in-the-loop-pattern]]
- [[multi-agent-revalidation]]
- [[commit-gates]]
- [[evidence-receipt]]
- [[attention-budget]]
- [[read-write-risk-separation]]
- [[agentic-sdlc|Agentic SDLC (ASDLC)]]
