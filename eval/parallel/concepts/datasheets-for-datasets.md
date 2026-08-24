---
title: Datasheets for datasets
date: 2026-08-24
tags:
  - concept
  - data-governance
  - documentation
  - ml-datasets
status: draft
sources:
  - url: https://arxiv.org/abs/1803.09010
---

# Datasheets for datasets

## Definition

**Datasheets for datasets** is the documentation practice in which every dataset ships with a structured datasheet answering a fixed set of questions about its motivation, composition, collection process, preprocessing, recommended uses, distribution and maintenance — by analogy with the electronics industry, where every component, however simple, is accompanied by a datasheet stating its operating characteristics, test results and recommended uses.

## Explanation

The mechanism is a forcing function at release time: because the datasheet's question categories are fixed, the dataset's creator must surface decisions that would otherwise remain tribal knowledge — why the data was collected, what is in it and what is systematically missing, how it was gathered and cleaned, and what uses it should and should not serve — and the answers travel with the data to every downstream consumer, who can judge fitness for a purpose without contacting the producer. The proposal (Gebru et al., arXiv 2018, published in CACM in 2021) was motivated by the machine learning community having no standardized process for documenting datasets, an omission with severe consequences in high-stakes domains where unstated collection choices silently become model behavior. The source is a position paper: it argues by analogy and by the stated goals of better creator-consumer communication and community-level transparency and accountability, rather than by measured effect, and it seeded the dataset-documentation regimes that followed it.

## Key Properties

- Fixed question categories: motivation, composition, collection process, preprocessing and labeling, recommended uses, distribution, maintenance
- Modeled on electronics component datasheets, which state operating characteristics, test results and recommended uses
- Works on both ends: creators are forced to reflect on and record choices; consumers get the provenance needed to judge fitness for purpose
- A proposal paper (arXiv 2018, CACM 2021) arguing by analogy, not an empirical study of the practice's effect
- Aimed at transparency and accountability in high-stakes domains where undocumented data choices carry severe consequences

## Relationships

- [[osv-format]] — both impose a standard documentation schema on artifacts previously described ad hoc — OSV for vulnerabilities, datasheets for datasets — so consumers can assess risk from the record alone instead of asking the producer

## Applications

Writing a datasheet for any dataset you release and demanding one for any dataset you procure — especially fine-tuning and evaluation corpora, where unstated collection and consent choices surface later as model behavior. The fixed-question pattern also transfers to model cards and system documentation.

## Sources

- https://arxiv.org/abs/1803.09010

## See Also

- [[osv-format]]
