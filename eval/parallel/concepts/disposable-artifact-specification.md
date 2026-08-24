---
title: Disposable artifacts as specification
date: 2026-08-24
domain: software-engineering
maturity: emerging
source_type: vendor-doc
tags: [concept, prototyping, requirements, human-ai-interaction, domain/software-engineering, maturity/emerging, source-type/vendor-doc]
status: draft
sources:
  - url: https://claude.com/blog/a-field-guide-to-claude-fable-finding-your-unknowns
    class: external-primary
---

# Disposable artifacts as specification

## Definition

**Disposable artifacts as specification** is the practice of having a model produce cheap, throwaway concretions — several deliberately divergent mockups filled with fake data, a single-file prototype, a plan ordered by what is most likely to change — whose purpose is to be reacted to and discarded rather than kept, because judgment a person cannot state in advance reliably appears the moment they see a candidate in front of them.

## Explanation

The technique exploits a gap between generative and recognitive ability: many criteria — visual taste, the right scope, whether a flow feels wrong — are unavailable to introspection but immediate on contact. The cheapest way to extract them is to manufacture something to have an opinion about, and to manufacture several that differ widely, since divergent options elicit preference where a single option elicits only acquiescence. The economics is the whole argument. A small change to a spec can imply a drastically different implementation, and an agent that has already built the wrong thing is poor at reverting it cleanly, so a criterion discovered against a mock costs minutes and the same criterion discovered mid-implementation costs the implementation. The same logic applies in reverse when the exhibit already exists: pointing the model at source code that implements the behaviour you want is a higher-fidelity reference than a screenshot or a description, even across languages, because code carries structure and semantics rather than appearance. A review plan is the last variant — deliberately front-loading the decisions most likely to be tweaked, such as data models, type interfaces and user-facing flows, and burying the mechanical work, so review attention lands where changing your mind is still cheap.

## Key Properties

- Artifacts exist to be reacted to and thrown away, not to be built on
- Several deliberately divergent options elicit preference; one option only elicits assent
- Fake data and single-file mocks keep the artifact cheap enough that discarding it costs nothing
- Existing source code is the strongest reference, carrying structure that images and prose cannot
- Plans are ordered by likelihood of change, not by execution order, so review attention lands on reversible decisions

## Relationships

- [[unknowns-inventory-prompting]] — is the framing this technique serves, converting tacit recognisable criteria into stated ones before implementation locks them in
- [[agent-led-elicitation]] — is the complementary move — questions reach what you never considered, exhibits reach what you could recognise but never describe

## Applications

Starting a design or feature session with several throwaway mockups rather than a spec; handing a model an existing implementation as the reference for behaviour you want reproduced; reviewing an implementation plan ordered by what you are most likely to change.

## Sources

- https://claude.com/blog/a-field-guide-to-claude-fable-finding-your-unknowns

## See Also

- [[unknowns-inventory-prompting]]
- [[agent-led-elicitation]]
