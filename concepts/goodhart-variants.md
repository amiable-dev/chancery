---
title: Goodhart's law variants
date: 2026-08-24
domain: governance
maturity: established
source_type: research
tags: [concept, evaluation, governance, metrics, domain/governance, maturity/established, source-type/research]
status: draft
sources:
  - url: https://arxiv.org/abs/1803.04585
    hash: sha256:7a0d21abcfbf8c5c5daa61350561eba47b8035bdcd6c6a7df09c9fa3f0cb6eb3
    retrieved: 2026-08-24
    class: external-primary
    reachability: ok
    crux:
      hash: sha256:0d7fb4252422f247a3d9fc971594b21de868866d77e1893a7051b88e5761ec17
      source_hash: sha256:7a0d21abcfbf8c5c5daa61350561eba47b8035bdcd6c6a7df09c9fa3f0cb6eb3
      captured_at: 2026-08-25
      locator: abstract, sentence 2
---

# Goodhart's law variants

## Definition

**Goodhart's law variants** (Manheim & Garrabrant, 2018, building on Garrabrant's earlier taxonomy) is the formalization of at least four distinct mechanisms by which optimizing a proxy metric diverges from the true goal — distinct failure modes that ambiguous appeals to "Goodhart's law" collapse together, each occurring and being mitigated differently.

## Explanation

The paper's thesis is that metric overoptimization is not one failure but a family: the umbrella term hides mechanically different ways a metric-goal relationship breaks under optimization pressure, and discussion that ignores the distinctions cannot diagnose or prevent the failures. The taxonomy matters where optimization power is greatest — the paper singles out machine learning and AI alignment, since the pressure a system can direct at a proxy scales with its capability. For evaluation design the transferable rule is that every metric must be examined per-mechanism: a measure can survive one variant and be destroyed by another, so "is this Goodhartable?" is not a yes/no question but four separate ones. The staged source is the paper's abstract; the mechanism-by-mechanism treatment is in the full text it links.

## Key Properties

- At least four distinct mechanisms, not one law
- Failure severity scales with optimization power directed at the proxy
- Explicitly aimed at economics, policy, ML, and alignment
- Diagnosis requires naming the variant, not citing the umbrella

## Relationships

- [[agent-outcome-vs-proxy-metrics]] — supplies the general taxonomy underneath that concept's agent-eval instance of proxy gaming
- [[golden-dataset-retrieval-evals]] — names the failure family that eval harness's anti-gaming controls (sealed holdouts, label-edit tracking) exist to resist

## Applications

Auditing any metric that gates behaviour — eval scores, CI thresholds, leaderboards — one variant at a time; the vocabulary for recording why a measurement was or wasn't trusted.

## Sources

- https://arxiv.org/abs/1803.04585

## See Also

- [[agent-outcome-vs-proxy-metrics]]
- [[golden-dataset-retrieval-evals]]
