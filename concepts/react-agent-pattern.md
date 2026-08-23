---
title: "ReAct Agent Pattern"
date: 2026-04-14
domain: ai-agents
maturity: established
source_type: research
topics: [patterns, orchestration]
tags: [concept, ai-agents, architecture, patterns, reasoning, domain/ai-agents, maturity/established, source-type/research, topic/patterns, topic/orchestration]
status: draft

sources:
  - url: https://arxiv.org/abs/2210.03629
    hash: sha256:6647efd97d0edb6a43e061367516bf5ba51ba8e96dc22c23fe8b570e768e47e2
    retrieved: 2026-08-21
    class: unclassified
    reachability: ok
  - url: https://www.infoq.com/articles/prompts-to-production-playbook-for-agentic-development/
    hash: sha256:7380d808df58d13eab6825b0abb44ce95b2e7e379a8882cd80acaee96625d7be
    retrieved: 2026-08-21
    class: unclassified
    reachability: ok
---

# ReAct Agent Pattern

## Definition

An agentic architecture pattern based on an iterative **Reason → Act → Observe** loop, where an LLM reasons about the next action to take, executes a tool call, observes the result, and repeats until a terminal condition is reached or the goal is achieved. Introduced in the 2022 paper "ReAct: Synergizing Reasoning and Acting in Language Models" (Yao et al., arXiv:2210.03629).

## Explanation

Traditional LLM usage is single-pass: prompt in, text out. ReAct adds a loop that enables iterative problem-solving — each iteration produces either a tool call (Act) or a final answer. The loop continues until a breaking condition is met.

**The three phases per iteration:**

1. **Reason** — The LLM receives the conversation history (including all prior tool results) and decides what to do next. It either calls a tool or produces a final answer.
2. **Act** — If a tool call is chosen, the agent executes it with the LLM-provided arguments. The tool result is appended to conversation history.
3. **Observe** — The system checks whether the goal has been achieved (explicit completion signal, confidence threshold met, or error requiring escalation). If not, loop continues.

**Why it works:**  
The iterative loop lets agents correct their own errors. A database debugging agent might run a query, see it's slow, inspect indexes, identify a missing index, suggest a fix, and verify the fix — all within one ReAct loop. Zero-shot GPT-4 achieves ~67% accuracy on coding benchmarks; the same model with agentic ReAct iteration achieves dramatically higher accuracy because it can self-correct.

**Breaking conditions** must be explicitly designed:
- LLM signals task completion
- A maximum iteration count is reached (safety valve against infinite loops)
- An error state requiring human escalation is detected

**Implementation note:**  
The pseudocode pattern maintains a `conversation_history` list that grows with each iteration — the LLM has full context of what it tried and observed. Tool results are returned as `role: "tool"` messages. This is the standard function-calling pattern supported by OpenAI, Anthropic, and most LLM APIs.

## Key Properties

- **Iterative** — runs in a loop; number of iterations is variable and not known in advance
- **Self-correcting** — prior tool results inform subsequent reasoning, enabling error recovery
- **Tool-grounded** — reasoning is anchored to concrete tool outputs rather than pure inference
- **Bounded** — must have explicit termination conditions to prevent runaway execution
- **Context-accumulating** — conversation history grows across iterations, providing the LLM with full execution trace

## Relationships

- Related to [[agentic-sdlc|Agentic SDLC (ASDLC)]]: ReAct is one of the core design-phase patterns in ASDLC's architecture catalogue
- Related to [[supervisor-agent-pattern|Supervisor Agent Pattern]]: supervisors often use ReAct internally; they can also orchestrate multiple ReAct sub-agents
- Related to [[human-in-the-loop-pattern|Human-in-the-Loop Pattern]]: HITL can be inserted as a breaking condition in a ReAct loop — escalate to human when tool result signals error or uncertainty
- Related to [[behavioral-qa-agents|Behavioral QA for Agents]]: testing ReAct agents requires trace-based comparison since output paths vary; golden trajectories capture expected iteration sequences
- Foundational paper: ReAct (Yao et al., 2022) — coined the Reason+Act framing

## Applications

**Best suited for:**
- **Investigative workflows** — debugging, research, diagnosis where the agent must iteratively gather information before concluding
- **Multi-step problem solving** — tasks where the next action depends on the result of the previous one
- **Tool-heavy agents** — scenarios with a rich tool ecosystem (database queries, API calls, file I/O) that the agent selects from dynamically

**Example — database debugging agent:**
1. Execute slow query → observe execution plan
2. Identify missing index → check existing indexes
3. Create index → re-run query
4. Confirm improvement → return root cause and fix

**Example — research agent (Anthropic's Multi-Agent Research System):**
A central planning agent spawns multiple ReAct sub-agents in parallel, each iteratively searching, reading, and synthesising on a sub-topic.

**Anti-pattern:**  
Using ReAct where a single-pass LLM call would suffice. Each iteration adds LLM latency (visible in LangSmith traces). If the decision can be made deterministically or in one shot, ReAct is overhead without benefit.

## Sources

- [ReAct: Synergizing Reasoning and Acting in Language Models](https://arxiv.org/abs/2210.03629) — foundational paper by Yao et al. (2022)
- [From Prompts to Production: a Playbook for Agentic Development](https://www.infoq.com/articles/prompts-to-production-playbook-for-agentic-development/) — InfoQ practitioner playbook; pseudocode and production context

## See Also

- [[supervisor-agent-pattern|Supervisor Agent Pattern]]
- [[human-in-the-loop-pattern|Human-in-the-Loop Pattern]]
- [[agentic-sdlc|Agentic SDLC (ASDLC)]]
- [[behavioral-qa-agents|Behavioral QA for Agents]]
- [[agent-state]]: each Observe phase appends tool results to the context window, growing in-context state with every iteration
- [[subagents]]: fresh context windows per child agent — the primary tool for managing state accumulation across long agent tasks
