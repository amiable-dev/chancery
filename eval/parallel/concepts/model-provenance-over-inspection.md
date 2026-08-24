---
title: Model provenance over inspection
aliases:
  - Trusting trust for models
  - Model lineage risk
date: 2026-08-24
domain: security
maturity: emerging
source_type: vendor-doc
tags: [concept, security, supply-chain, ai-governance, domain/security, maturity/emerging, source-type/vendor-doc]
status: draft
sources:
  - url: https://semgrep.dev/blog/2026/ai-supply-chain-problem/
    class: external-primary
---

# Model provenance over inspection

## Definition

**Model provenance over inspection** is the position that trust in a machine-learning model cannot be established by examining the artifact and must instead come from its lineage — the training data, filtering, fine-tuning and hosting steps that produced it, attested by parties independent of the producer — because published weights, unlike a compiled binary, cannot be reverse engineered into a description of what the model will do.

## Explanation

The asymmetry is mechanical. A third-party binary of doubtful origin still yields to disassembly: with enough effort an analyst can arrive at a total description of its behavior, which is why the software supply chain has workable practices for finding malicious code, tracing where it came from, and limiting its blast radius. Open weights offer no equivalent — mechanistic interpretability is a research program, not a tool an engineer runs before deployment — so a released model is opaque in a way even a stripped binary is not. Poisoning research sharpens this into a live risk rather than a philosophical one: a small number of poisoned pretraining samples suffices to install a persistent triggered behavior, and that count does not rise with model or dataset size, so scale is not dilution and the provenance of training data matters more as corpora grow. Ken Thompson's 1984 Turing lecture supplies the frame — a compiler modified to insert a backdoor into every program it compiles, including its own successors, with nothing wrong in the source anyone could read — and the model analogue is behavior inherited from somewhere earlier in the lineage that no inspection of the final weights would surface. Benchmarks do not close the gap, since a model can be fine-tuned to pass them; nor does prompt-and-response logging, which sees the interaction and not the weights. What is left is the arrangement software already uses for claims a vendor cannot self-certify: independent researchers, auditors and certification programs verifying the data, filtering and training stages. The source is an argumentative post on a security vendor's blog, so it prescribes an industry direction rather than a practice a team adopts on Monday; its factual spine — the poisoning papers, the constant-sample-count result, the Turing lecture — is checkable independently of the vendor.

## Key Properties

- Compiled binaries yield to reverse engineering; model weights do not, and mechanistic interpretability is still a research problem
- A backdoor can be installed with a small number of poisoned pretraining samples, and that count does not grow with model size
- A manipulated model need not break to cause harm — it only has to shift decisions in ways nobody attributes to the model
- Thompson's trusting-trust argument transfers: inspecting the artifact cannot clear what built it
- Benchmarks are not evidence of integrity, because models can be fine-tuned to pass them

## Relationships

- [[sleeper-agent-backdoors]] — supplies the empirical case this argument rests on — implanted trigger-conditioned behavior that survives safety training is precisely the defect no inspection of released weights would catch
- [[datasheets-for-datasets]] — is the documentation discipline this position scales up — structured provenance for training data is the first artifact an independent auditor of a model's lineage would demand
- [[extension-registry-trust]] — the extension-registry trust model and model provenance over inspection make the identical argument about neighbouring artifact classes — a registry signature proves only who produced an extension, published weights cannot be reverse engineered into a description of behaviour, so trust in both cases has to come from attested lineage, not inspection.

## Applications

Deciding whether to deploy an open-weight or third-party model on grounds other than benchmark scores; framing procurement questions around training-data provenance, fine-tuning history and reproducibility rather than vendor claims; arguing for independent model audit and certification programs in place of self-certification.

## Sources

- https://semgrep.dev/blog/2026/ai-supply-chain-problem/

## See Also

- [[sleeper-agent-backdoors]]
- [[datasheets-for-datasets]]
