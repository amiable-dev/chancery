---
title: Access control at the retrieval layer
date: 2026-08-24
domain: security
maturity: emerging
source_type: practitioner
tags: [concept, security, retrieval, rag, domain/security, maturity/emerging, source-type/practitioner]
status: draft
sources:
  - url: https://www.thoughtworks.com/radar/techniques
    hash: sha256:52b9aa4d85844d1297a66a66f03904fc0d72fc860de4eb0fb9196fe3e6f1e8c7
    retrieved: 2026-08-24
    class: external-secondary
    reachability: ok
---

# Access control at the retrieval layer

## Definition

**Access control at the retrieval layer** moves authorization out of the application and into the search itself: every indexed chunk carries the roles or entitlements permitted to see it, and at query time the retriever restricts the candidate set to chunks matching the caller's authenticated identity, so unauthorized content is never retrieved, never enters the prompt, and therefore cannot be summarised, paraphrased or leaked by the model.

## Explanation

The mechanism is permission metadata attached at indexing time plus filtered search at query time, which is a different placement from the obvious one. Filtering after generation is unsound because a model that has seen a document can reveal it in forms no output filter reliably recognises — a paraphrase, an aggregate, an inference — so the only durable boundary is one the content never crosses. Putting the boundary at retrieval also puts it in the one place that sees every request: an agent, a chat surface and a batch job all reach the corpus through the same query path, so one filter covers interfaces that would each need their own check at the application layer. The design constraints follow from that: entitlements must be captured when documents are indexed and re-synchronised when they change upstream, since a stale tag is a silent leak; identity must arrive with the query rather than being inferred; and the vector store must support high-performance metadata filtering, which is what made this practical at scale, as filtering after a similarity search either returns too few results or forces oversized candidate sets. The result is a zero-trust-shaped foundation for internal knowledge bases, where the retrieval index otherwise becomes the one system that has read everything and enforces nothing. The source is Thoughtworks' Technology Radar, which places the technique in its assess ring on the strength of consulting experience and now-common database capabilities rather than a study.

## Key Properties

- Chunks are tagged with role or entitlement metadata at indexing time
- The retriever filters candidates by the caller's authenticated identity before similarity ranking returns anything
- Unauthorized content never enters the context window, so it cannot be paraphrased or inferred out of the model
- One enforcement point covers every consuming interface — chat, agent, batch — instead of one check per application
- Depends on entitlements being re-synchronised as source permissions change; a stale tag leaks silently

## Relationships

- [[context-engineering]] — constrains the same assembly step from the security side — if the context window is curated at every turn from retrieved material, then the retriever is where authorization has to be enforced, because anything it returns has already become context
- [[instruction-data-boundary-collapse]] — retrieval-layer access control supplies the retrieval-side mitigation for exactly the problem instruction-data boundary collapse describes — since no privilege level survives once retrieved text reaches the context window, the only defensible control point is upstream, filtering unauthorized chunks out first.
- [[context-layer]] — a context layer is a production system whose 'permissions' constraint is exactly what retrieval-layer access control specifies the mechanism for — role and entitlement metadata carried per indexed item, checked against caller identity before anything enters the query-time token budget.

## Applications

Building an internal knowledge assistant over documents with mixed sensitivity; retrofitting entitlements onto a corpus already indexed for search; giving an agent a single corpus while keeping HR, finance and customer material separated by role.

## Sources

- https://www.thoughtworks.com/radar/techniques

## See Also

- [[context-engineering]]
