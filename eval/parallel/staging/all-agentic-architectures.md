# GitHub - FareedKhan-dev/all-agentic-architectures: 35 production-grade agentic AI architectures (Reflexion, LATS, GraphRAG, MemGPT, Voyager, BrowserAgent, ...) — a Python library and runnable textbook with multi-provider LLM support and a 17-task benchmark leaderboard.

**Source:** https://github.com/FareedKhan-dev/all-agentic-architectures
**Added:** 2026-08-24
**Tags:** #unsorted

---

> 35 production-grade agentic AI architectures (Reflexion, LATS, GraphRAG, MemGPT, Voyager, BrowserAgent, ...) — a Python library and runnable textbook with multi-provider LLM support and a 17-task b...

---

### Thirty-five production-grade agentic AI patterns. End to end.

[](#thirty-five-production-grade-agentic-ai-patterns-end-to-end)

A library _and_ a living textbook — real LLM outputs, provider-agnostic, deterministic-picker discipline throughout, and a comparative benchmark leaderboard that ranks every architecture against every relevant task.

[![CI](https://camo.githubusercontent.com/100ededd415f89da717232433dc077285056cd41683f177073e02208eed4231d/68747470733a2f2f696d672e736869656c64732e696f2f6769746875622f616374696f6e732f776f726b666c6f772f7374617475732f4661726565644b68616e2d6465762f616c6c2d6167656e7469632d617263686974656374757265732f63692e796d6c3f6272616e63683d6d61696e266c6162656c3d4349266c6f676f3d676974687562616374696f6e73266c6f676f436f6c6f723d7768697465267374796c653d666f722d7468652d626164676526636f6c6f723d306130613061)](https://github.com/FareedKhan-dev/all-agentic-architectures/actions/workflows/ci.yml) [![Docs](https://camo.githubusercontent.com/5036f926a5819238b5a5e79e25414caf4fbf9b7fe0382de3e3c6a2ebd1e3a42b/68747470733a2f2f696d672e736869656c64732e696f2f6769746875622f616374696f6e732f776f726b666c6f772f7374617475732f4661726565644b68616e2d6465762f616c6c2d6167656e7469632d617263686974656374757265732f646f63732e796d6c3f6272616e63683d6d61696e266c6162656c3d444f4353266c6f676f3d6d6174657269616c666f726d6b646f6373266c6f676f436f6c6f723d7768697465267374796c653d666f722d7468652d626164676526636f6c6f723d363336366631)](https://fareedkhan-dev.github.io/all-agentic-architectures/) [![PyPI](https://camo.githubusercontent.com/6b75f60bee800e40ead64b062e2be0855d38e8e566444fa435a0d92e53e1bb52/68747470733a2f2f696d672e736869656c64732e696f2f707970692f762f6167656e7469632d617263686974656374757265733f7374796c653d666f722d7468652d6261646765266c6f676f3d70797069266c6f676f436f6c6f723d7768697465266c6162656c3d5079504926636f6c6f723d613835356637)](https://pypi.org/project/agentic-architectures/) [![License](https://camo.githubusercontent.com/45c8aa20ebaf363e5c5c81fbc4ff9574477fbc50a70b49efaed210204b832508/68747470733a2f2f696d672e736869656c64732e696f2f62616467652f6c6963656e73652d4d49542d6563343839393f7374796c653d666f722d7468652d6261646765266c6f676f3d6f70656e736f75726365696e6974696174697665266c6f676f436f6c6f723d7768697465)](https://github.com/FareedKhan-dev/all-agentic-architectures/blob/main/LICENSE)

 [![Quickstart](https://camo.githubusercontent.com/b9af498c2f0c2ee3d393292731dc3dd90cb3c45c4596774ac33a3c785a4a737d/68747470733a2f2f696d672e736869656c64732e696f2f62616467652f517569636b73746172742de286922d3061306130613f7374796c653d666f722d7468652d6261646765266c6162656c436f6c6f723d306130613061)](https://github.com/FareedKhan-dev/all-agentic-architectures/blob/main/docs/getting-started/quickstart.md)[![Documentation](https://camo.githubusercontent.com/605ddb86ca8b2e90dbd192e8ff1ed51c437a7904cd746a95bd0ce526d328cea9/68747470733a2f2f696d672e736869656c64732e696f2f62616467652f446f63756d656e746174696f6e2de286922d3236323632363f7374796c653d666f722d7468652d6261646765266c6162656c436f6c6f723d323632363236) ](https://github.com/FareedKhan-dev/all-agentic-architectures/blob/main/docs/index.md)[![Architectures](https://camo.githubusercontent.com/45d0fa043a322ddd6299b4417dd154df3a2ecda1e0232ac2082003d81e6dbd81/68747470733a2f2f696d672e736869656c64732e696f2f62616467652f417263686974656374757265732de286922d3430343034303f7374796c653d666f722d7468652d6261646765266c6162656c436f6c6f723d343034303430) ](https://github.com/FareedKhan-dev/all-agentic-architectures/blob/main/docs/architectures/index.md)[![Benchmarks](https://camo.githubusercontent.com/5ee0bb4c559a29135ef50c12ba32b65d59280a41f8362e803713ac444510baf2/68747470733a2f2f696d672e736869656c64732e696f2f62616467652f42656e63686d61726b732de286922d3532353235323f7374796c653d666f722d7468652d6261646765266c6162656c436f6c6f723d353235323532) ](https://github.com/FareedKhan-dev/all-agentic-architectures/blob/main/docs/benchmarks.md)[![Open in Codespaces](https://camo.githubusercontent.com/f88a76874409fc54af4a49f7611e539edcf251b5e630751f4fca24b8b33f7a9b/68747470733a2f2f696d672e736869656c64732e696f2f62616467652f4f70656e5f696e5f436f64657370616365732de286922d3733373337333f7374796c653d666f722d7468652d6261646765266c6162656c436f6c6f723d373337333733)](https://codespaces.new/FareedKhan-dev/all-agentic-architectures)

  ##   35  

[](#-35-)

ARCHITECTURES

##   283  

[](#-283-)

PASSING TESTS

##   17  

[](#-17-)

BENCHMARK TASKS

##   9  

[](#-9-)

LLM PROVIDERS

##   0  

[](#-0-)

MOCKED RUNS  

* * *

## Overview

[](#overview)

A single Python library that packages every major agentic AI pattern from the literature as a runnable `Architecture` class with a uniform contract. Each pattern ships with a fully executed Jupyter notebook whose theory is written _against_ the captured run — not synthetic examples. The library is multi-provider (Nebius, OpenAI, Anthropic, Groq, Ollama, Together, Fireworks, Mistral, Google) and built on top of LangGraph state machines.

The central technical discipline of the repository is the **deterministic-picker pattern** — every LLM-as-Scorer surface has the LLM commit to categorical features (booleans, enums) and lets Python compose the deciding signal. This is the universal escape from the LLM-as-Scorer flat-band pathology, applied in 13 of 35 architectures; 9 more are architecturally immune by design.

* * *

## Quickstart

[](#quickstart)

pip install "agentic-architectures\[nebius,faiss,tavily\]"

from agentic\_architectures import get\_llm
from agentic\_architectures.architectures import Reflection

arch \= Reflection(llm\=get\_llm(), max\_iterations\=2, target\_score\=8)
result \= arch.run("Write a haiku about a glacier.")

print(result.output)
print("score:", result.metadata\["final\_score"\], "/ 10")

Same `.run(task)` interface across all 35 architectures. Same `ArchitectureResult` return shape. Swap the class, swap the pattern — your downstream code does not change.

**Set up a virtualenv from a fresh clone**  

git clone https://github.com/FareedKhan-dev/all-agentic-architectures
cd all-agentic-architectures

python -m venv .venv
.venv\\Scripts\\activate              # Windows
source .venv/bin/activate           # macOS / Linux

pip install -e ".\[dev,test,docs,nebius,faiss,tavily,networkx\]"
cp .env.example .env                # then fill in NEBIUS\_API\_KEY etc.

pytest -q                           # 283 tests pass in ~30s

* * *

## Architecture families

[](#architecture-families)

* * *

## The 35 architectures

[](#the-35-architectures)

**Reasoning & Reflection**

Architecture

Pattern

Reference

**Reflection**

Generate → critique → refine

Madaan 2023

**Reflexion**

Verbal reflections in episodic memory

Shinn 2023

**Chain-of-Verification (CoVe)**

Verify each baseline claim independently

Dhuliawala 2023

**Self-Discover**

SELECT → ADAPT → IMPLEMENT → SOLVE

Zhou 2024

**Constitutional AI**

Per-rule pass/fail → revise

Bai 2022

**Sampling & Search**

Architecture

Pattern

Reference

**Self-Consistency**

Sample N paths, majority-vote

Wang 2022

**Tree of Thoughts**

Beam search over thoughts

Yao 2023

**LATS**

MCTS tree with reward backup

Zhou 2024

**Mental Loop**

Simulate → score (deterministic-picker)

this repo

**Ensemble**

N voters, weighted aggregation

this repo

**Retrieval (RAG)**

Architecture

Pattern

Reference

**Agentic RAG**

Agent decides when & what to retrieve

LangGraph reference

**Corrective RAG (CRAG)**

Grade docs, fall back to web

Yan 2024

**Self-RAG**

Per-doc reflection tokens

Asai 2024

**Adaptive RAG**

Pre-route by query complexity

Jeong 2024

**GraphRAG**

KG + community summaries

Microsoft 2024

**Memory**

Architecture

Stored unit

Reference

**Episodic + Semantic**

Conversation turns + triples

Park 2023

**Graph Memory**

(subject, predicate, object) triples

this repo

**MemGPT**

OS-style context + archival tiers

Packer 2023

**Voyager**

Reusable Python skills (real subprocess)

Wang 2023

**Agent Workflow Memory**

High-level workflow recipes

Wang 2024

**Tools & Actions**

Architecture

Pattern

Reference

**Tool Use**

Agent with one tool

LangChain reference

**ReAct**

Thought → Action → Observation

Yao 2022

**Planning**

Decompose → execute → replan

Wei 2022

**Plan-Execute-Verify (PEV)**

Post-execution verification per step

this repo

**SWE-Agent**

Sandboxed file-system agent

Yang 2024

**BrowserAgent**

**Real Playwright** + safety gate

Anthropic Computer-Use 2024

**Multi-Agent**

Architecture

Pattern

Reference

**Multi-Agent**

Supervisor + specialists

LangGraph reference

**Blackboard**

Shared workspace + agents

classical AI

**Debate**

N agents × K rounds

Du 2023

**STORM**

Multi-perspective research → article

Shao 2024

**Meta-Controller**

Router over architectures

this repo

**Safety, Routing & Specialty**

Architecture

Pattern

Reference

**Dry-Run**

Propose → simulate → approval gate

this repo

**Reflexive Metacognitive**

Self-aware capability routing

this repo

**RLHF Self-Improvement**

Multi-dim deterministic scoring + archive

this repo

**Cellular Automata**

LLM rules over a grid

this repo

* * *

## Provider compatibility

[](#provider-compatibility)

Provider

Install extra

Notes

**Nebius**  _(default)_

`[nebius]`

Llama-3.3-70B + Qwen3-Thinking; cheapest for the included demos

OpenAI

`[openai]`

All architectures work; highest quality for reasoning patterns

Anthropic

`[anthropic]`

Strong on long context; required for production Computer-Use

Groq

`[groq]`

Fast inference; great for high-volume Self-Consistency

Ollama  _(local)_

`[ollama]`

No API key; tool calling depends on the model

Together

`[together]`

Wide model catalogue

Fireworks

`[fireworks]`

Function-calling first-class

Mistral

`[mistral]`

EU-hosted option

Google

`[google]`

Gemini 2.x via Generative AI API

Switch via `LLM_PROVIDER` + the corresponding key in `.env`. No code changes.

* * *

## Benchmarks

[](#benchmarks)

A 17-task suite runs every architecture and scores results. Most recent run, real Nebius Llama-3.3-70B, ~25 min, ~$1.50 in tokens:

Outcome

Architectures

**Strong**  2/2 or 3/3

`Reflection`  `SelfConsistency`  `SelfDiscover`  `BrowserAgent`

**Perfect on attempted**  1/1

21 more — see leaderboard

**Pattern-fit failures**

LATS on arithmetic (wrong shape) · Debate + Ensemble on Sally trick (group-think) · Reflexion + AWM on raw-fact recall (wrong memory shape)

**Overall**

**33 / 42 correct**  78%

**Full leaderboard** with per-task answer excerpts: [docs/benchmarks.md](https://github.com/FareedKhan-dev/all-agentic-architectures/blob/main/docs/benchmarks.md)

* * *

## Learning paths

[](#learning-paths)

Four curated reading orders, depending on what you're trying to do.

Path

For

Order

**Beginner**

Mental model

Reflection → Tool Use → ReAct → Planning → Self-Consistency

**RAG-focused**

Production retrieval

Agentic RAG → CRAG → Self-RAG → Adaptive RAG → GraphRAG

**Multi-agent**

Coordination

Multi-Agent → Blackboard → Debate → STORM → Meta-Controller

**Safety**

Guardrails

Dry-Run → Constitutional AI → Reflexive Metacognitive → BrowserAgent (safety gate)

* * *

## Star history

[](#star-history)

  [![Star History Chart](https://camo.githubusercontent.com/ae80c430e06147575def24542380756a4a5a51e81ce75eee1dee2f4e4fe34453/68747470733a2f2f6170692e737461722d686973746f72792e636f6d2f7376673f7265706f733d4661726565644b68616e2d6465762f616c6c2d6167656e7469632d6172636869746563747572657326747970653d44617465)](https://www.star-history.com/#FareedKhan-dev/all-agentic-architectures&Date)

* * *

## Tested

[](#tested)

```
pytest -q
283 passed, 37 skipped (env-gated integration), 1 warning in ~30s
```

Suite

Coverage

**Registry sweep**

All 35 architectures (metadata + instantiate + build)

**Pure-Python helpers**

Haiku checker, composite scorers, subprocess executor, safety gate, sandbox path

**Notebook integrity**

All 35 notebooks executed, no error outputs, §9 commentary tailored from real captured runs

**Integration**  _(env-gated)_

One real-LLM happy-path per architecture, gated via `RUN_INTEGRATION=1`

* * *

## Documentation

[](#documentation)

[**Full docs site**](https://fareedkhan-dev.github.io/all-agentic-architectures/)

Dark-mode site with embedded notebooks  _(live after first deploy)_

[Quickstart](https://github.com/FareedKhan-dev/all-agentic-architectures/blob/main/docs/getting-started/quickstart.md)

One-command install, 8-line example

[Switching providers](https://github.com/FareedKhan-dev/all-agentic-architectures/blob/main/docs/getting-started/providers.md)

Capability matrix; one env var to swap

[Add your own architecture](https://github.com/FareedKhan-dev/all-agentic-architectures/blob/main/docs/tutorials/adding-your-own.md)

5-step contributor recipe

[Deterministic-picker pattern](https://github.com/FareedKhan-dev/all-agentic-architectures/blob/main/docs/tutorials/deterministic-picker.md)

The central technical pattern, explained once

[Memory variants](https://github.com/FareedKhan-dev/all-agentic-architectures/blob/main/docs/tutorials/memory.md)

Comparison of all 7 memory shapes

[API reference](https://fareedkhan-dev.github.io/all-agentic-architectures/reference/)

mkdocstrings auto-gen from docstrings  _(live after first deploy)_

[Benchmarks](https://github.com/FareedKhan-dev/all-agentic-architectures/blob/main/docs/benchmarks.md)

Full per-task leaderboard with answer excerpts

* * *

## Contributing

[](#contributing)

Contributions welcome. Two paths:

1.  **Add a new architecture** — follow the [5-step recipe](https://github.com/FareedKhan-dev/all-agentic-architectures/blob/main/docs/tutorials/adding-your-own.md). The PR template includes a deterministic-picker checklist.
2.  **Improve an existing one** — bug fix, prompt tuning, performance, scoring rubric. Open an issue first to discuss scope.

See [**CONTRIBUTING.md**](https://github.com/FareedKhan-dev/all-agentic-architectures/blob/main/CONTRIBUTING.md) for the dev setup, code style, and commit-message convention (Conventional Commits — `release-please` auto-generates the CHANGELOG).

* * *

## Citation

[](#citation)

@misc{khan2026agentic,
  title         = {Agentic Architectures: A Library of 35 Production-Grade Agentic AI Patterns},
  author        = {Khan, Fareed},
  year          = {2026},
  howpublished  = {\\url{https://github.com/FareedKhan-dev/all-agentic-architectures}},
  note          = {MIT licensed Python library and runnable textbook}
}

* * *

## License

[](#license)

[MIT](https://github.com/FareedKhan-dev/all-agentic-architectures/blob/main/LICENSE) — © 2026 Fareed Khan.
