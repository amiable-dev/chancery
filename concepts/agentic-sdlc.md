---
title: "Agentic SDLC (ASDLC)"
aliases: ["Agentic SDLC (ASDLC)"]
date: 2026-04-14
domain: software-engineering
maturity: emerging
source_type: practitioner
topics: [workflow, agentic-coding, safety]
tags: [concept, ai-agents, sdlc, engineering, production, domain/software-engineering, maturity/emerging, source-type/practitioner, topic/workflow, topic/agentic-coding, topic/safety]
status: draft

sources:
  - url: https://www.infoq.com/articles/prompts-to-production-playbook-for-agentic-development/
    hash: sha256:7380d808df58d13eab6825b0abb44ce95b2e7e379a8882cd80acaee96625d7be
    retrieved: 2026-08-21
    class: unclassified
    reachability: ok
  - url: https://www.iso.org/standard/81118.html
    unreachable: true
    reason: HTTP 403
    checked: 2026-08-21
    class: unclassified
    reachability: blocked-4xx
  - url: https://arxiv.org/abs/2501.09434
    hash: sha256:b1e5825256b132186fda9d09d264025d773c3e19cb52275517404b569a030c73
    retrieved: 2026-08-21
    class: unclassified
    reachability: ok
---

# Agentic SDLC (ASDLC)

## Definition

A modified software development lifecycle specifically designed for autonomous agentic AI systems. Unlike traditional SDLC, ASDLC accounts for nondeterministic behaviour, emergent capabilities, autonomous decision-making, and the need to specify not just what agents *should* do but what they *must never* do. It integrates behavioural orchestration, safety boundaries, and continuous evaluation as first-class lifecycle concerns.

## Explanation

Traditional SDLC operates under a deterministic assumption: given known inputs, expect predictable outputs. This breaks down entirely for agentic systems where:

- The same prompt can produce different tool call sequences on different runs
- Agents make autonomous decisions mid-execution that weren't anticipated at design time
- Emergent behaviour arises from multi-agent interaction that can't be unit-tested in isolation
- The production environment has more variability than any controlled prototype

ASDLC responds by treating these differences structurally. ISO/IEC 5338:2023 ("AI system life cycle processes") formalised this at a standards level, emphasising risk management throughout development and the challenge of verifying autonomous behaviour.

The practical differences from traditional SDLC include:

**Planning phase:**  
Instead of requirements as features, ASDLC produces a *capability matrix* — explicitly marking each workflow step as agentic (LLM reasoning required) or deterministic (fixed rules sufficient). LLM calls introduce latency and cost; using them where deterministic logic suffices is an anti-pattern.

**Design phase:**  
Architecture patterns are selected from a reusable catalogue ([[react-agent-pattern|ReAct Agent Pattern]], [[supervisor-agent-pattern|Supervisor Agent Pattern]], [[human-in-the-loop-pattern|Human-in-the-Loop Pattern]]). Input/output contracts are defined for every agentic component.

**Implementation phase:**  
Prompts, tool manifests, policy configs, and memory schemas are versioned and governed via [[prompts-as-infrastructure|Prompts as Infrastructure]] practices — semantic diffing and formal change approval.

**QA phase:**  
[[behavioral-qa-agents|Behavioral QA for Agents]] replaces traditional input→output assertion testing. Golden trajectory baselines, scenario-based testing, and adversarial boundary conditions are required.

**Deployment phase:**  
Canary rollouts with SLO-based regression gates replace binary ship/no-ship decisions. Agentic tracing (LangSmith, OpenTelemetry) captures every LLM call and tool invocation for audit and debugging.

**Operations phase:**  
Alignment monitoring detects behavioural drift in production. Rollback is agent-scoped: a specific agent version can be rolled back independently of the rest of the system.

## Key Properties

- **Nondeterminism is a first-class concern** — testing, QA, and deployment strategies all account for it
- **Safety boundary specification** — defining what agents must *never* do is as important as defining what they should do
- **Behavioural orchestration over feature delivery** — moving beyond shipping features to governing emergent behaviour
- **Continuous evaluation** — evaluation loops run throughout the lifecycle, not just at release gates
- **Pattern-driven design** — reusable agentic architecture patterns reduce ad-hoc design risk
- **Traceability as a prerequisite** — every LLM call and tool invocation must be traceable for debugging and compliance

## Relationships

- Related to [[agentic-ai-platform-architecture|Agentic AI Platform Architecture]]: the platform architecture is the runtime infrastructure that ASDLC produces and operates
- Builds on [[prompts-as-infrastructure|Prompts as Infrastructure]]: ASDLC mandates IaC treatment of prompts — versioning, diffing, and change approval
- Requires [[behavioral-qa-agents|Behavioral QA for Agents]]: the QA phase of ASDLC is entirely behavioural rather than assertion-based
- Incorporates [[react-agent-pattern|ReAct Agent Pattern]], [[supervisor-agent-pattern|Supervisor Agent Pattern]], [[human-in-the-loop-pattern|Human-in-the-Loop Pattern]]: these are the design-phase building blocks
- Contextualised by ISO/IEC 5338:2023: the first international standard explicitly addressing AI system lifecycle processes

## Applications

**When ASDLC applies:**
- Any project building autonomous agents that take real-world actions (API calls, database writes, emails, purchases)
- [[multi-agent-systems|Multi-agent systems]] where emergent coordination is expected
- Production deployments where auditability, rollback, and behavioural consistency are required

**Anti-pattern to avoid:**
Applying traditional SDLC to agentic systems produces "prototype-to-production gap" — the prototype behaves well in controlled conditions but fails in production because behavioural consistency was never verified at scale.

**Practical first step:**
Build an iterative capability matrix (Table 2 in the InfoQ article) — ask which workflow steps involve nondeterministic decisions before committing to agentic implementation. If a fixed rule can handle it, use a fixed rule.

## Sources

- [From Prompts to Production: a Playbook for Agentic Development](https://www.infoq.com/articles/prompts-to-production-playbook-for-agentic-development/) — InfoQ practitioner playbook; primary source for ASDLC framing
- [ISO/IEC 5338:2023](https://www.iso.org/standard/81118.html) — AI system life cycle processes standard
- [Agile AI SDLC research (Gill, 2025)](https://arxiv.org/abs/2501.09434) — identifies six differentiating attributes of AI vs conventional software

## See Also

- [[agentic-ai-platform-architecture|Agentic AI Platform Architecture]]
- [[prompts-as-infrastructure|Prompts as Infrastructure]]
- [[behavioral-qa-agents|Behavioral QA for Agents]]
- [[react-agent-pattern|ReAct Agent Pattern]]
- [[codebase-knowledge-graphs]] — infrastructure primitive for AI-assisted SDLC; blast-radius scoping reduces token cost during AI code review steps
- [[agentic-agile]] — process methodology that sits within ASDLC; defines *how* work flows through the lifecycle for human+agent teams
- [[contract-driven-execution]] — operationalises ASDLC acceptance criteria at the individual story level
- [[prompt-to-plugin-workflow]] — a domain-specific application of the agentic SDLC pattern in audio DSP
- [[domain-specific-vibe-coding]] — a lightweight consumer variant of ASDLC emerging in specialist niches
