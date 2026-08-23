---
tags: [flashcards, ai-agents, human-ai-collaboration, product-development, epistemics]
sr-due: 2026-07-04
sr-interval: 1
sr-ease: 250
---

# Context Advantage — Flashcards

#flashcards/ai-agents

## Definition <!-- kb:card:30392a -->
What is "context advantage" as defined by Andrew Ng?
?
An information-asymmetry framing of human contribution to AI-assisted development. A human's context advantage is the aggregate knowledge they hold that the AI system does not: knowledge of specific users, operating context, team conventions, historical decisions, domain expertise, and unspoken requirements. Ng's preferred alternative to describing human contribution as "taste."

## Reframe <!-- kb:card:8b1b89 -->
Why does Andrew Ng prefer "context advantage" over "taste" to describe the human role in AI-assisted development?
?
"Taste" is ineffable — you either have it or you don't, and there's no clear path to improving an AI's taste. "Context advantage" is an *information gap* — and information gaps are closable. The reframe gives a concrete improvement path: give the AI more contextual information and its judgment improves. It also makes explicit why human-in-the-loop is required: as long as the gap exists, automating away the human also deletes the information.

## Closing the Gap <!-- kb:card:7601fa -->
How can developers close the context advantage gap between themselves and an AI agent?
?
By systematically making contextual knowledge available to the agent: pipe usage analytics to the context window, store past steering decisions as agent memory, summarise recurring user feedback as agent-readable documents, give the agent direct access to the external feedback loop signal (session recordings, feedback summaries). Each of these converts tacit human knowledge into explicit agent context.

## When HITL is Required <!-- kb:card:bfee2d -->
According to the context advantage framing, when is human-in-the-loop genuinely required vs. bureaucratic overhead?
?
Genuinely required: when the human holds information the AI needs to make the decision correctly — user preferences, domain constraints, team conventions, external feedback not available to the agent. Bureaucratic overhead: when the human rubber-stamps without making any actual judgment — providing the form of oversight without injecting any information the AI lacked. The test is: "am I adding information the agent doesn't have?"

## Decay <!-- kb:card:b258e4 -->
Why does context advantage decay, and how is it maintained?
?
Context advantage decays because user needs, team conventions, and product context evolve over time. A developer who stops talking to users loses their advantage on user knowledge. Maintenance comes from actively engaging the external feedback loop (real users, alpha tests, A/B data) and updating agent-accessible knowledge stores with fresh contextual information.
