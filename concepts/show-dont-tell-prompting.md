---
title: "Show-Don't-Tell Prompting"
aliases: ["Show-Don't-Tell Prompting"]
date: 2026-07-08
domain: llm
maturity: emerging
source_type: practitioner
topics: [context-engineering, agentic-coding]
tags: [concept, llm, prompt-engineering, workflows, requirements, agentic-coding, domain/llm, maturity/emerging, source-type/practitioner, topic/context-engineering, topic/agentic-coding]
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

# Show-Don't-Tell Prompting

## Definition
**Show-don't-tell prompting** is a requirements-elicitation technique where, instead of attempting to describe what you want in words, you point the AI at a concrete reference example (a design, a page, an existing artefact) and ask it to infer and apply the *underlying structural logic* of that example to your specific context — bypassing the vocabulary gap between your intent and your ability to articulate it.

## Explanation
A persistent failure mode in AI-assisted work is the vocabulary gap: you know what you want when you see it, but you lack the domain-specific language to describe it precisely enough for the model to reproduce it. Attempting to describe it anyway produces paraphrases of what you want, not the thing itself.

Show-don't-tell prompting sidesteps this entirely. Instead of describing the output, you provide the reference and ask the model to read the structure *beneath* the surface — the compositional logic, the visual hierarchy, the interaction pattern — then apply that logic to your version.

This works because modern large language models can analyse artefacts (pages, designs, codebases, documents) and extract abstract structural patterns that transcend the specific content. The model isn't copying the example; it's inferring the principles the example embodies.

**Example from Thariq Shihipar's guide:** Instead of trying to describe a visual style for a landing page, a developer points Claude Fable at a page they admire. The prompt is not "make it look like this" (which would produce a clone) but "read how this is structurally built — what compositional choices make it feel this way — then give my version those same underlying properties." The model decomposes the reference into transferable structural logic and applies it freshly to the new context.

**The vocabulary gap problem in practice:**
- You want a "clean but information-dense" layout — but "clean" means different things in different domains
- You want code that "feels idiomatic Rust" — but articulating Rust idioms to someone who hasn't written it is hard
- You want a tone that's "professional but warm" — but every model interprets that differently

In each case, a reference example (a layout you like, a Rust codebase you admire, a document with the right tone) lets the model read the pattern directly rather than triangulating from your imprecise description.

## Key Properties
- **Reference-anchored** — requires a concrete example artefact to point at
- **Structure-seeking** — explicitly asks the model to extract underlying patterns, not surface features
- **Domain-agnostic** — applies to design, code, writing, data, UX, anything with an analysable structure
- **Asymmetric information** — the model often knows the domain vocabulary for what you're pointing at, even when you don't
- **Non-copying** — the goal is structural principle transfer, not feature-for-feature imitation

## Relationships
- Addresses the same vocabulary gap that makes [[blind-spot-pass]] valuable — both acknowledge the limit of explicit articulation
- Often used alongside [[mockup-first-workflow]]: show a reference to establish structural direction, then use mockups to validate it
- Complements [[prompt-altitude]]: show-don't-tell is one way to avoid both over-specification (brittle hardcoding) and under-specification (vague guidance)
- Related to [[prompts-as-infrastructure]]: when show-don't-tell patterns are codified as reusable prompt templates, they become infrastructure
- Informs [[agentic-sdlc]]: reference-anchored requirements gathering is a missing formal step in most agentic SDLC descriptions

## Applications
- **UI/visual design:** "Here's a page/app I admire — read the compositional logic and apply it to my UI"
- **Code style:** "Here's a module in this codebase that exemplifies the style I want — make my new module feel like this"
- **Writing tone:** "Here's a piece that has the right register — analyse what makes it feel that way and write mine in the same vein"
- **Data structure:** "Here's an existing schema that handles similar problems well — apply its organisational logic to my domain"
- **System design:** "Here's an architecture I respect — what principles does it embody and how do they apply to my constraints?"

## Sources
- [A Field Guide to Claude Fable 5: Finding Your Unknowns](https://claude.com/blog/a-field-guide-to-claude-fable-finding-your-unknowns) — original Anthropic blog post by Thariq Shihipar
- [AI Marketers summary](https://www.theaimarketers.ai/guidetofable5/) — newsletter summary

## See Also
- [[blind-spot-pass]]
- [[mockup-first-workflow]]
- [[prompt-altitude]]
- [[prompts-as-infrastructure]]
- [[agentic-sdlc]]
