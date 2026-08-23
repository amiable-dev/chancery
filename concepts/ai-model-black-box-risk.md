---
title: "AI Model Black-Box Risk"
date: 2026-07-17
domain: security
maturity: emerging
source_type: practitioner
topics: [supply-chain, provenance]
tags: [concept, security, ai-agents, supply-chain, provenance, llm, domain/security, maturity/emerging, source-type/practitioner, topic/supply-chain, topic/provenance]
status: draft
sources:
  - url: https://semgrep.dev/blog/2026/ai-supply-chain-problem/
    hash: sha256:b130f856114455884ee99d5a470063f08cf3ac888b4db423b37ef72dd34343ee
    retrieved: 2026-08-21
    class: unclassified
    reachability: ok
  - url: https://arxiv.org/abs/2401.05566
    hash: sha256:b22a094c703fc7cc972f977e6d3a939d7a1561dda4df5ebf757ededd6223a872
    retrieved: 2026-08-21
    class: unclassified
    reachability: ok
---

# AI Model Black-Box Risk

## Definition
AI Model Black-Box Risk is the class of unmitigated supply-chain risk that arises from deploying an AI model — including "open weight" models — without the ability to reverse-engineer its behaviour, reliably detect deliberately implanted backdoors, or verify the provenance of its training data and fine-tuning history. It is qualitatively worse than traditional third-party software risk because none of the standard fallback verification techniques (disassembly, static analysis, code review) transfer to model weights.

## Explanation
Traditional third-party software risk has a floor: even a binary of unknown or questionable origin can, in the worst case, be reverse-engineered to a complete behavioural description. Static analysis, disassemblers, and dynamic tracing give a security team *some* path to ground truth, however laborious.

AI models remove that floor. A set of matrix weights has no equivalent decompilation path — mechanistic interpretability (the research discipline that tries to map internal model computations back to human-understandable concepts) remains an unsolved problem at the scale of frontier models. This means "open weight" (the weights file is downloadable) is not the same thing as "explainable" or "auditable." You can inspect the artefact; you still cannot predict or fully explain its behaviour.

**The risk has three compounding layers:**

1. **No reverse-engineering fallback.** Unlike a binary, there is no way to arrive at a complete behavioural description of a model from its weights alone.
2. **Undetectable backdoors, independent of scale.** Research (including Anthropic's work on small-sample data poisoning, related to the "Sleeper Agents" line of research) shows that a *small, size-independent* number of poisoned pretraining samples can implant a persistent, triggerable behaviour. This overturns the intuitive assumption that large, diverse training sets are inherently harder to manipulate — dataset size does not buy safety margin against this class of attack. You can audit a prompt/response pair via logs, but you cannot audit the weights themselves once they have been altered via pretraining or fine-tuning.
3. **Opaque lineage.** Any given model typically inherits from earlier checkpoints, distillation sources, or fine-tunes whose own training history is rarely fully disclosed. Behaviour can be inherited from that lineage in ways nobody currently knows how to detect (see [[trusting-trust-problem]]).

**Poisoning vs. alignment is a framing choice, not a technical distinction.** Model providers already deliberately shape model behaviour at scale — refusing malicious cybersecurity requests, discouraging unhealthy parasocial attachment, and so on. The mechanism used to do this (targeted training interventions that reliably change output behaviour for specific triggers) is technically the same mechanism an attacker would use to implant a backdoor. Whether a given intervention is called "alignment" or "poisoning" is a matter of who authorised it and why, not a difference in method. This is sometimes summarised as: *one country's model poisoning is another country's alignment problem.*

**Why benchmarks don't solve this.** Benchmark scores are an output-level proxy for capability and safety, and outputs can be selectively optimised (fine-tuned) to pass known benchmarks without addressing underlying black-box risk. A model can score well on safety benchmarks and still carry an undetected backdoor triggered by inputs the benchmark never tests.

**The proposed fix is institutional, not technical (yet).** Software supply-chain security solved an analogous trust problem not by making every consumer inspect every artefact, but by building an ecosystem of trusted third parties: CVE programmes, independent security researchers, code auditors, and penetration testers who verify vendor claims rather than trusting them. The argument here is that AI needs the equivalent — independent evaluation, real provenance disclosure (training data, filtering, and training-stage details), and reproducibility — rather than continued reliance on vendor marketing and benchmark scores.

## Key Properties
- **No decompilation floor** — unlike binaries, model weights offer no fallback path to a complete behavioural description
- **Backdoor cost is scale-independent** — a small number of poisoned samples can implant persistent behaviour regardless of overall dataset size
- **"Open weight" ≠ "auditable"** — public weights do not confer explainability or provenance
- **Alignment and poisoning share a mechanism** — the technical line between deliberate shaping and malicious manipulation is a question of authorisation, not method
- **Benchmarks are gameable** — output-level evaluation can be optimised for without resolving underlying opacity
- **Lineage compounds the risk** — models inherit undisclosed behaviour from earlier checkpoints and fine-tunes (see [[trusting-trust-problem]])
- **Currently no tooling closes this gap** — there is no equivalent of a dependency scanner or SBOM for model weights today

## Relationships
- Instance of [[trusting-trust-problem]]: model lineage inheriting undetectable behaviour from earlier stages is a direct restatement of Ken Thompson's compiler-backdoor argument, applied to AI training pipelines instead of compilers
- Extends [[supply-chain-endpoint-gap]] and [[cyclonedx-sbom]]: those concepts describe blind spots in *package and endpoint* supply-chain visibility; this concept describes the equivalent blind spot one layer up, at the *model weights* themselves — no SBOM or endpoint scan can currently answer "is this model backdoored?"
- Related to [[agent-attestation-standards]]: attestation standards for agent-authored code bind commits to a human authoriser and model version, but do not (yet) attest to the model's own training provenance — this concept identifies the gap attestation would need to close upstream
- Related to [[domain-as-identity-trust]]: domain-as-identity solves publisher-identity trust for capability catalogs; it does not solve model weight trust, which requires a different, currently-nonexistent verification mechanism
- Related to [[zero-trust-architecture]]: "never trust, always verify" is aspirational but currently unenforceable at the model-weights layer, since there is no verification method to apply
- Related to [[reward-hacking]] and [[scalable-oversight]]: interpretability research (cited as a blocker here) is the same research frontier that scalable oversight and reward-hacking detection depend on

## Applications
- **Model procurement / vendor evaluation:** When selecting a model (open-weight or hosted API) for a production pipeline, treat benchmark scores as necessary but not sufficient; weight provenance, reproducibility claims, and independent evaluation availability as separate risk dimensions
- **Local/open-model adoption decisions:** Before adopting an open-weight model for cost, privacy, or ZDR reasons, explicitly note that "open weight" buys none of the audit guarantees that "open source" buys for traditional software — treat this as a distinct, currently unmitigated risk line
- **Threat modelling for AI-heavy pipelines:** When threat-modelling a system that depends on third-party or open models, add "model weight compromise" as a named risk category alongside dependency and endpoint supply-chain risk, even though no current tool can test for it directly
- **Multi-model gateway strategy:** For systems that route across many models/providers (e.g. an OpenRouter-style gateway), model provenance is a real, currently unmeasured risk axis distinct from latency, cost, or quality — worth tracking qualitatively even without a scoring tool
- **Advocacy / procurement leverage:** Prefer vendors who publish training data provenance, filtering methodology, and allow independent evaluation, even at the cost of marginally worse benchmark numbers, as this is currently the only lever available

## Study
- Flashcards: [[flashcards/ai-model-black-box-risk|Practice this concept]]

## Sources
- [The AI Supply Chain Has a Supply Chain Problem (semgrep.dev, 2026)](https://semgrep.dev/blog/2026/ai-supply-chain-problem/) — primary source; frames the black-box risk argument and the trusted-third-party proposal
- [Anthropic — Sleeper Agents / small-sample data poisoning research (arxiv.org/abs/2401.05566, arxiv.org/abs/2310.02949)](https://arxiv.org/abs/2401.05566) — the research basis for the scale-independence claim about backdoor poisoning
- Ken Thompson, *Reflections on Trusting Trust*, 1984 Turing Award Lecture — see [[trusting-trust-problem]] for full treatment

## See Also
- [[trusting-trust-problem]]
- [[supply-chain-endpoint-gap]]
- [[cyclonedx-sbom]]
- [[agent-attestation-standards]]
- [[domain-as-identity-trust]]
- [[zero-trust-architecture]]
- [[reward-hacking]]
- [[scalable-oversight]]
