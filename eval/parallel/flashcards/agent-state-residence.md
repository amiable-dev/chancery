---
tags: [flashcards, ai-agents, architecture, scaling, domain/ai-agents, maturity/emerging, source-type/practitioner]
sr-due: 2026-08-24
sr-interval: 1
sr-ease: 250
---

# Agent state residence — Flashcards

#flashcards/ai-agents

## Definition of agent state residence <!-- kb:card:b3631b -->
What is agent state residence?
?
The choice of where an agent's conversation state physically lives — resent by the caller every turn (client-held), or held by the agent behind a session id in a store it owns (server-held) — which decides whether the service scales with interchangeable instances or needs a persistence tier on every request.

## Client-held state's trade-off <!-- kb:card:7cce1b -->
What do you gain and give up with client-held conversation state?
?
Any instance can answer any request, so ordinary round-robin routing suffices; but the caller must resend the whole transcript every turn, so request payload and prompt tokens grow steadily through the session.

## How the server-held handler works <!-- kb:card:54d1ee -->
What does a server-held handler do on each turn?
?
The caller sends only a session id and the new message; the handler loads that session's history from a store, appends the message, calls the model, appends the reply, and writes back.

## What server-held state uniquely enables <!-- kb:card:dc7172 -->
What two capabilities does server-held state enable that client-held state cannot?
?
Server-side trimming or summarization of the transcript in place, and suspending a run mid-flight — waiting on a tool, external system, or human approval — to resume later.

## Server-held state's infrastructure cost <!-- kb:card:0b42bc -->
What does server-held state cost in deployment topology, and what happens if it's kept process-local?
?
A store is now on the critical path of every turn; if the history lives in the process that served earlier turns rather than shared storage, horizontal scaling strands sessions on the wrong node — an amnesia visible only to the unlucky rerouted user.

## The decision rule <!-- kb:card:07b5ad -->
What rule decides whether to choose client-held or server-held state?
?
Client-held for single-turn task pipelines like extraction, summarization, or classification; server-held for long-running assistants and multi-turn conversations where resending everything is the greater cost.
