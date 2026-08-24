---
title: Agent archetypes
aliases:
  - Agent taxonomy by workload shape
date: 2026-08-24
domain: ai-agents
maturity: emerging
source_type: practitioner
tags: [concept, agents, taxonomy, architecture, domain/ai-agents, maturity/emerging, source-type/practitioner]
status: draft
sources:
  - url: https://www.infoq.com/presentations/reliable-ai-platforms/
    hash: sha256:fa755eebcd198b9755000bc27e7269c2f02dba5c2d230183ad305e6338d1dc28
    retrieved: 2026-08-24
    class: external-primary
    reachability: ok
---

# Agent archetypes

## Definition

**Agent archetypes** is a taxonomy of the recurring workload shapes a compound AI system decomposes into, sorted by what each is for rather than how it is built: the worker that applies a little judgment to an enormous number of near-identical items, the ruminative agent that reasons at length over exceptions from several deliberately opposed viewpoints, the middle manager that narrows others' findings into a few goal-directed recommendations, the consultant that watches the system itself for behaviour worth demoting to determinism, the tool selector that maps a request onto the right call, and the director that closes an observe-orient-decide-act loop over a constrained domain.

## Explanation

The organising axis is the shape of the work, and each shape implies a different cost profile, tool set and eval. The worker archetype is what the speaker calls painting all the rocks on the beach: inspect a hundred thousand clusters for anomalous power draw, check every server against what the infrastructure code claims it should be — laborious, individually easy, each item slightly different, and historically automatable only where the difference could be written as an if-then. Stochastic systems remove that constraint, which is why this archetype covers so many previously manual jobs. The ruminative agent inverts the economics: few inputs, long reasoning, often several agents each holding a different objective such as security, cost or latency, argued out as a structured debate rather than answered once, and it does not need to sit behind a chat interface. The middle manager converges rather than explores, taking a goal and a small tool set and returning a handful of recommended actions. The consultant is the meta-observer, looking across runs for behaviour repetitive enough to be turned into a rule, which is how a system keeps applying the determinism split continuously instead of once at design time. The tool selector has largely been absorbed into agent scaffolding and protocol clients. The director is the honest edge of the taxonomy: the speaker states that nobody is running one unattended and expects it first over narrow domains as evals mature. Treat this as design vocabulary from one practitioner rather than a validated classification.

## Key Properties

- Sorted by workload shape: breadth at low judgment, depth at high judgment, convergence, meta-observation, routing, closed loop
- The worker archetype is low intellectual effort applied at scale, previously blocked on writing the rule
- Ruminative agents spend many tokens on few inputs and often run as opposed perspectives in debate
- The consultant archetype is the mechanism by which recurring behaviour gets identified for demotion to code
- The director archetype is explicitly aspirational — the speaker notes nobody runs one unsupervised

## Relationships

- [[purpose-built-agent-hierarchy]] — supplies the vocabulary for the nodes that hierarchy composes, so a layer can be chosen by the shape of its work rather than by where it happens to sit in the diagram
- [[agent-loop-patterns]] — classifies the same systems along a perpendicular axis — those patterns describe the shape of the cycle, these describe the shape of the job the cycle is doing
- [[determinism-discovery-split]] — is enforced continuously by one of these archetypes, since the consultant agent's job is to spot the repetitive behaviour that should stop being an agent at all

## Applications

Naming what kind of agent a proposed use case actually needs before choosing a framework; spotting that a job described as a chatbot is really a worker or ruminative workload that never needs a conversation.

## Sources

- https://www.infoq.com/presentations/reliable-ai-platforms/

## See Also

- [[purpose-built-agent-hierarchy]]
- [[agent-loop-patterns]]
- [[determinism-discovery-split]]
