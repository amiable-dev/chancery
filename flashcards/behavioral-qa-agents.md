---
sr-due: 2026-04-14
sr-ease: 250
sr-interval: 1
tags:
- flashcards
- ai-agents
- testing
- qa
---


# Behavioral QA for Agents — Flashcards

#flashcards/ai-agents


## Definition <!-- kb:card:c03b06 -->
What is Behavioral QA for agents?
?
A QA methodology for nondeterministic agentic systems that replaces fixed input→output assertion testing with scenario-based, trace-aware evaluation of behavioural consistency. It assesses whether agents behaved *correctly* across plausible execution paths, not whether they produced one specific expected output.

## Why Traditional Testing Fails <!-- kb:card:758964 -->
Why does traditional assertion-based testing fail for agentic systems?
?
Agents are nondeterministic — the same goal may produce different tool call sequences, different wordings, or different intermediate steps on different runs, all equally correct. Asserting a specific output would produce false failures. You need to test behavioural patterns, not specific outputs.

## Golden Trajectories <!-- kb:card:8a371d -->
What is a "golden trajectory" in agentic testing?
?
A recorded correct execution — the sequence of reasoning steps, tool calls, and observations that represents proper behaviour for a scenario. New runs are compared to the golden trajectory: did the agent gather the same information? Reach the same conclusion? Exact order may vary; the logical path is what's assessed.

## Test Categories <!-- kb:card:47456c -->
What four types of scenarios must Behavioral QA cover?
?
1. **Happy path** — correct behaviour on well-formed inputs
2. **Edge cases** — unusual or incomplete inputs; agent should ask for clarification not hallucinate
3. **Adversarial** — can the agent be prompted to violate safety boundaries? It must refuse.
4. **HITL escalation** — does the agent correctly identify when to escalate vs. proceed autonomously?

## Tooling <!-- kb:card:9af314 -->
What are the key tools for implementing Behavioral QA?
?
- **LangSmith** — traces LLM + tool calls; enables golden trajectory comparison
- **OpenTelemetry** — standard observability for agentic spans
- **LLM-as-judge** — a separate LLM evaluates outputs against a rubric at scale, avoiding manual review of every test case
- Eval frameworks: LangChain Evals, Promptfoo, RAGAS (for RAG agents)
