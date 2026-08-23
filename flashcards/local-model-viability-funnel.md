---
tags: [flashcards, local-models]
sr-due: 2026-07-13
sr-interval: 1
sr-ease: 250
---

# Local Model Viability Funnel — Flashcards

#flashcards/local-models

## Definition <!-- kb:card:1f0f2a -->
What is the Local Model Viability Funnel?
?
A staged evaluation framework for local coding models that orders viability checks from cheapest/most basic (fits in RAM, runs at reasonable speed) to most demanding (handles complex tasks, produces acceptable code quality), so unviable models/configurations can be eliminated early before deeper evaluation is invested.

## Application <!-- kb:card:bfaaea -->
When would you use the Local Model Viability Funnel?
?
Before adopting a local/self-hosted model for an agentic coding workflow — run it through the funnel's gates in order (RAM fit → speed → tool calling → functional correctness → context/conversation length → complex task handling → code quality) to fail fast on hardware or capability mismatches rather than jumping straight to subjective quality judgments.

## Relationship <!-- kb:card:cd98cc -->
How does the Local Model Viability Funnel relate to the GenAI Eval Envelope?
?
They evaluate different things: the eval envelope assesses whether an output's *properties* fall within an acceptable range for a given audience/context; the viability funnel assesses whether a model configuration clears a sequence of *capability thresholds* (RAM, speed, tool calling, etc.) before output quality is even assessed. The funnel is a pre-filter; the envelope is the quality judgment that comes after.

## Gotcha <!-- kb:card:dd1af6 -->
Why can two different machines produce different funnel results for the same model?
?
Because passing the RAM and speed gates (and sometimes later gates too) is hardware-dependent, not just model-dependent — see Hardware-Dependent Inference Variance. The funnel result is specific to the machine it was tested on unless re-validated.
