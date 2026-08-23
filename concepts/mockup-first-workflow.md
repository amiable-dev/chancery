---
title: "Mockup-First Workflow"
date: 2026-07-08
domain: software-engineering
maturity: emerging
source_type: practitioner
topics: [workflow, agentic-coding, patterns]
tags: [concept, llm, workflows, agentic-coding, prototyping, iteration, domain/software-engineering, maturity/emerging, source-type/practitioner, topic/workflow, topic/agentic-coding, topic/patterns]
status: draft
sources:
  - url: https://claude.com/blog/a-field-guide-to-claude-fable-finding-your-unknowns
    hash: sha256:ddab0eb45dd176c5a5d118c577770304f076a84b2d8a65d68ed5670f43f44198
    retrieved: 2026-08-21
    class: unclassified
    reachability: ok
  - url: https://www.theaimarketers.ai/guidetofable5/
    hash: sha256:4407852af47b2bd452276f789b7ad23bb1374093994e758c8bb26c73ce6c31b8
    retrieved: 2026-08-21
    class: unclassified
    reachability: ok
---

# Mockup-First Workflow

## Definition
A **mockup-first workflow** is an agentic development pattern where, before touching production data or real system state, you instruct the AI to generate multiple radically different rough prototypes populated with fake/placeholder data — so that wrong directions can be identified and discarded while changes are still cheap to reverse.

## Explanation
One of the most expensive mistakes in agentic coding is getting deep into an implementation before discovering the approach was wrong. Traditional development deals with this via spec review and design documents; in agentic coding, the equivalent is generating quick throwaway versions to elicit your own reaction.

The key insight is asymmetric cost: generating 3–5 rough mockups with fake data takes minutes and reveals directional preferences immediately. Reversing course after hours of real implementation is expensive. The mockup-first workflow front-loads the cheap learning.

**Why "wildly different" versions matter:** If you ask for one mockup and it's 70% right, you're tempted to patch it rather than reconsider the direction. Multiple divergent versions force comparative evaluation and surface preferences you didn't know you had. Constraints emerge: "I don't like version A's navigation but I love version C's data density."

**The fake data principle:** Using realistic-looking fake data (not blank placeholders) exposes layout, density, and interaction assumptions that blank wireframes hide. A dashboard with `[VALUE]` placeholders looks nothing like one populated with realistic numbers, names, and edge-case strings.

**Example:** A developer building a reporting dashboard asks the AI to generate three radically different layouts — one card-based, one table-heavy, one chart-focused — all populated with fake metrics. After 15 minutes of comparison, they can articulate which layout principle they want, what data they actually care about, and which interactions feel wrong. This replaces a 2-hour design-review cycle with a 15-minute reaction loop.

## Key Properties
- **Pre-implementation phase** — happens before any real data or system state is touched
- **Divergent-by-design** — explicitly requests different approaches, not variations of the same approach
- **Fake data mandatory** — realistic-looking placeholder content, not empty wireframes
- **Disposability primed** — prompts explicitly frame these as throwaway prototypes
- **Reaction-seeking** — the goal is to elicit an opinion, not to build a solution
- **Cheap-to-change window** — temporal constraint: the technique's value degrades once real implementation begins

## Relationships
- Follows [[blind-spot-pass]] in the before-phase of the agentic workflow (blind spot pass surfaces unknowns; mockups test directions)
- Is the agentic equivalent of the knowledge pipeline's staging pattern: draft → react → decide → commit
- Complements [[show-dont-tell-prompting]]: when you can't articulate what you want, a mockup pass + comparison can help you discover it
- Shares the spirit of [[agentic-coding-loop]] but inverts the feedback direction — human reacts to AI output rather than AI iterating on a spec
- Related to [[agent-harness]] in that both emphasise setting up evaluation scaffolding before committing to an approach

## Applications
- **UI/UX decisions:** Generate multiple layouts before building; compare visually before touching real components
- **Data model design:** Ask for several different schema sketches with fake sample data to surface modeling preferences
- **API design:** Generate 2–3 different API shapes (REST vs resource-based vs command-based) before writing handlers
- **Content structure:** For documentation or reports, generate a few outline-and-section-preview mockups before committing to structure
- **Algorithm selection:** Ask for stub implementations of different algorithmic approaches with representative fake inputs/outputs for comparison

## Sources
- [A Field Guide to Claude Fable 5: Finding Your Unknowns](https://claude.com/blog/a-field-guide-to-claude-fable-finding-your-unknowns) — original Anthropic blog post by Thariq Shihipar
- [AI Marketers summary](https://www.theaimarketers.ai/guidetofable5/) — newsletter summary

## See Also
- [[blind-spot-pass]]
- [[show-dont-tell-prompting]]
- [[agentic-coding-loop]]
- [[agentic-drift]]
- [[agent-harness]]
