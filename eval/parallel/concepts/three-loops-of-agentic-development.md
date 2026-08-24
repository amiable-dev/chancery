---
title: Three loops of agentic development
date: 2026-08-24
domain: software-engineering
maturity: emerging
source_type: practitioner
tags: [concept, agentic-coding, product-development, feedback-loops, domain/software-engineering, maturity/emerging, source-type/practitioner]
status: draft
sources:
  - url: https://x.com/AndrewYNg/status/2071988145667928442
    class: external-primary
---

# Three loops of agentic development

## Definition

The **three loops of agentic development** is a framework holding that AI-assisted product building runs on three nested feedback loops at distinct cadences: an agentic coding loop in which the agent writes, tests, and fixes code against a spec and optional evals on a minutes timescale; a developer feedback loop in which a human reviews the product and re-steers the agent over tens of minutes to hours; and an external feedback loop in which real users' responses — friends, alpha testers, A/B tests — reshape the product vision over hours to weeks.

## Explanation

The framework is Andrew Ng's, from a letter in The Batch written in response to the loop engineering buzzphrase — a practitioner essay rather than a study, generalizing from products he builds. Each loop closes at its own cadence and feeds the loop inside it: external feedback informs the developer's vision, the vision becomes spec and steering for the agent, and the agent's self-testing loop turns spec into working software without per-step human intervention. Closing the inner loop — agents that test their own work, including driving a browser against what they built — is what moved developers out of the manual-QA role and freed their time for product decisions, and recurring agent failures on the same problem are the signal to invest in evals. Ng's sharpest point is why the middle loop resists automation: he rejects taste as the explanation and argues the human has a context advantage — knowledge about the users and the environment the product operates in that the AI system lacks — so a human-in-the-loop is needed precisely as long as the human knows things the system does not, and shrinking that gap is the path to more automation. A consequence he draws: as agents absorb implementation, engineers increasingly take on product-management work, balancing building against gathering the user feedback that evolves the vision.

## Key Properties

- Agentic coding loop: agent codes, tests, and iterates against spec and evals; closes in minutes
- Developer feedback loop: human reviews the product and re-steers the agent; tens of minutes to hours
- External feedback loop: alpha testers, launches, A/B tests; hours to weeks; feeds the product vision
- The human's place in the loop is justified by a context advantage over the AI, not by ineffable taste
- Repeated agent failures on the same problem are the trigger for writing evals

## Relationships

- [[acceptability-envelope-evals]] — describes how to write the evals the inner loop needs when the product's own outputs are non-deterministic — asserting properties of acceptable outputs rather than exact values
- [[context-layer]] — is infrastructure aimed at the same asymmetry from the other side — it tries to capture into systems the organizational context whose absence from the AI is exactly Ng's human context advantage

## Applications

Structuring AI-native product work: close the inner loop with self-testing and evals, spend the reclaimed human time on product decisions in the middle loop, and start the external loop early because it is the slowest of the three.

## Sources

- https://x.com/AndrewYNg/status/2071988145667928442

## See Also

- [[acceptability-envelope-evals]]
- [[context-layer]]
