---
title: Unknowns inventory in prompting
date: 2026-08-24
domain: software-engineering
maturity: emerging
source_type: vendor-doc
tags: [concept, prompting, human-ai-interaction, software-engineering, domain/software-engineering, maturity/emerging, source-type/vendor-doc]
status: draft
sources:
  - url: https://claude.com/blog/a-field-guide-to-claude-fable-finding-your-unknowns
    hash: sha256:ddab0eb45dd176c5a5d118c577770304f076a84b2d8a65d68ed5670f43f44198
    retrieved: 2026-08-24
    class: external-primary
    reachability: ok
---

# Unknowns inventory in prompting

## Definition

An **unknowns inventory** is the pre-prompt exercise of sorting what you understand about a task into four quadrants — known knowns, which are what the prompt can state; known unknowns, which are gaps you can at least name; unknown knowns, which are criteria you would recognise instantly but would never think to write down; and unknown unknowns, which are considerations absent from your model of the problem altogether — on the claim that the quality of an agent's output is bounded not by the model but by how much of that inventory the instruction has surfaced.

## Explanation

The framing earns its keep by explaining why the two obvious prompting failures are the same failure. Instruct too specifically and the agent follows the letter of a plan past the point where pivoting was the right move; instruct too vaguely and it fills the gaps with generic industry defaults that may not fit the situation. Both happen because the instruction is silent about what the author does not know, so the agent cannot tell which parts of the plan are load-bearing and which are guesses. The quadrants matter because each needs a different remedy and they are not interchangeable: known unknowns are closed by research or by asking; unknown knowns are tacit and only surface when something concrete is put in front of you to react to; unknown unknowns require an interlocutor who already knows the territory to map it for you. The useful consequence is that skill in agentic work is relocated — it is not prompt phrasing but the discipline of enumerating and then closing unknowns before the expensive step begins, and it improves with practice. The source is a vendor engineering blog timed to a model launch, which colours its optimism about what better models unlock, but the quadrant framing is borrowed from decision-making generally and holds independently of any model version.

## Key Properties

- Four quadrants: known knowns, known unknowns, unknown knowns, unknown unknowns
- Over-specification and under-specification are the same failure — unstated unknowns — expressed in opposite directions
- Each quadrant closes by a different method; research does not surface tacit criteria and artifacts do not surface blind spots
- Relocates the skill of agentic work from prompt phrasing to unknown enumeration
- Declaring your own starting point — experience, prior attempts, confidence — is itself prompt content, because it tells the agent which quadrant it is helping with

## Relationships

- [[agent-led-elicitation]] — is the method that closes the unknown-unknowns quadrant, since by definition you cannot ask about what you have not conceived of
- [[disposable-artifact-specification]] — is the method that closes the unknown-knowns quadrant, because tacit criteria surface only on contact with something concrete to react to
- [[deviation-log]] — handles the unknowns that survive every pre-flight method, by capturing the ones execution discovers rather than pretending planning found them all
- [[rare-context]] — rare context is exactly the material that populates an unknowns inventory's 'unknown unknowns' quadrant for a newly-deployed agent — organisation-specific vocabulary nobody wrote down because insiders never experience it as a gap.

## Applications

Framing a working session before prompting — writing down what you can state, what you know you are missing, and where you are likely blind — and diagnosing a failed long-horizon task by asking which quadrant went unaddressed rather than rewriting the prompt.

## Sources

- https://claude.com/blog/a-field-guide-to-claude-fable-finding-your-unknowns

## See Also

- [[agent-led-elicitation]]
- [[disposable-artifact-specification]]
- [[deviation-log]]
