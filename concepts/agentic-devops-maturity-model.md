---
title: "Agentic DevOps Maturity Model"
date: 2026-04-23
domain: software-engineering
maturity: emerging
source_type: practitioner
topics: [devops, workflow, enterprise]
tags: [concept, ai-agents, devops, maturity-model, engineering, governance, domain/software-engineering, maturity/emerging, source-type/practitioner, topic/devops, topic/workflow, topic/enterprise]
status: draft
sources:
  - url: https://devblogs.microsoft.com/all-things-azure/agentic-devops-practices-principles-strategic-direction/
    hash: sha256:31b745b269ded03375f3cda8695f34924bfaa550de884bd1fd2ba1c79042f1c7
    retrieved: 2026-08-21
    class: unclassified
    reachability: ok
---

# Agentic DevOps Maturity Model

## Definition
A four-level framework for assessing an engineering organisation's readiness and capability to operate AI agents as regular code contributors in a software delivery system. Levels progress from *Reactive* (no foundation) to *Optimized* (adaptive, continuous, attestation-level governance), with each level evaluated across four dimensions: Foundations, Agent Adoption, Pipeline Maturity, and Governance.

## Explanation
The model provides engineering leaders with a structured way to locate themselves on the journey toward agentic software delivery — and to identify the highest-leverage investments available at their current level.

**Level 1 — Reactive:** Manual deployments, inconsistent testing, no IaC. Agents may be used ad hoc by individual developers but with no shared standards. Pipelines are basic. No agent-specific governance or policies exist.

**Level 2 — Foundation:** Automated CI/CD, IaC, security scanning, and branch protection are in place. IDE-level AI assistance is adopted team-wide with shared instruction files. Standard PR verification with required human review. Basic AI tool usage policies exist but no formal agent governance.

**Level 3 — Structured:** Rich skill profiles and specification-driven development are practised. Custom agents handle specialised tasks and PRs include attribution metadata. Pipeline has agent-specific verification layers (structural, semantic, provenance). Formal governance framework with auditability and tracked delegation chains.

**Level 4 — Optimized:** Living specifications linked to code and tests; continuous compliance monitoring. Agent teams orchestrated across the full lifecycle with collaborative remediation loops. Adaptive verification depth and pipeline-as-specification. Agent-native [[observability|observability]] and organisation-wide attestation standards. *Level 4 is the current industry frontier.*

**Critical insight:** Most organisations today sit between Levels 1 and 2. The most leveraged move at Level 1 is not to adopt more agents — it is to build the DevOps foundations that make agents *safe* to adopt. Agents are accelerators; they scale whatever system they operate within, whether healthy or broken.

## Key Properties
- Four dimensions evaluated per level: Foundations, Agent Adoption, Pipeline Maturity, Governance
- Non-linear value: jumping levels without foundations causes more harm than no adoption
- Each level has a highest-leverage investment focus, not a checklist of features
- Level 4 represents a direction, not a fully realised state at any organisation today

## Relationships
- Requires [[agentic-pipeline-verification]]: levels 3–4 depend on layered pipeline verification
- Requires [[specification-driven-development]]: levels 2→3 transition hinges on moving from prompts to specs
- Requires [[repository-as-agent-interface]]: level 3 demands rich skill profiles and explicit repository conventions
- Related to [[agentic-sdlc]]: the maturity model applies specifically to DevOps infrastructure, while ASDLC covers the full development lifecycle
- Related to [[platform-baked-governance]]: Level 4 governance resembles platform-baked patterns

## Applications
- **Engineering leaders** use it to position their organisation and justify investment in specific areas
- **Platform teams** use it to sequence roadmap initiatives (don't build agent infrastructure before foundations)
- **Self-assessment at Level 1:** Audit the 6-dimension foundation checklist (CI/CD, automated testing, IaC, security scanning, branch protection, observability) before any agent adoption
- **Transition 2→3:** Invest in specification-driven development and repository skill profiles
- **Transition 3→4:** Invest in adaptive pipeline verification and formal attestation standards

## Study
- Flashcards: [[flashcards/agentic-devops-maturity-model|Practice this concept]]

## Sources
- [DevOps Playbook for the Agentic Era — Microsoft Azure DevBlogs](https://devblogs.microsoft.com/all-things-azure/agentic-devops-practices-principles-strategic-direction/) — Primary source; Section 10 defines the maturity model in full

## See Also
- [[agentic-sdlc]]
- [[specification-driven-development]]
- [[agentic-pipeline-verification]]
- [[repository-as-agent-interface]]
- [[human-agent-collaboration-zones]]
- [[platform-baked-governance]]
