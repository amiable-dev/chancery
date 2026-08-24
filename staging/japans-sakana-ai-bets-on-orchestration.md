# Japan's Sakana AI Bets on Orchestration, Not a Bigger Model — and Fugu Routes Around the Fable 5 Wall

**Source:** https://theplanettools.ai/blog/sakana-ai-fugu-multi-llm-orchestration-routes-around-export-controls-2026
**Added:** 2026-08-24
**Tags:** #unsorted

---

> Sakana AI's Fugu bets on multi-LLM orchestration, not a bigger model — routing a swappable pool of LLMs to hedge against controls that locked away Fable 5.

---

Multi-LLM orchestration is an approach where a small coordinator model routes each task across a pool of other large language models, delegating, verifying and combining their outputs instead of relying on one bigger model. On June 22, 2026, Tokyo-based Sakana AI shipped this idea as a product: **Sakana Fugu** and **Fugu Ultra**, exposed through a single OpenAI-compatible API. The timing matters. Days after Anthropic's Fable 5 and Mythos became export-restricted and effectively unreachable for many users, Sakana is betting that the smartest move is not to build a bigger model behind the wall, but to route around the wall entirely.

## What Happened

Sakana AI announced Fugu on June 22, 2026, under the banner "One Model to Command Them All." The pitch is deliberately counterintuitive for an industry obsessed with parameter counts: Fugu is not a larger frontier model. It is, in Sakana's words, "a multi-agent system that behaves like a single model" — and critically, Fugu itself "is a language model trained to call various LLMs in an agent pool, including instances of itself recursively."

In practice that means a caller sends one request to one endpoint, and a small coordinator model decides what to do next. Sometimes it answers directly. Sometimes it assembles a team of expert models, hands them focused sub-tasks, checks their work, and synthesizes a single response. The orchestration is learned rather than hand-wired with if-else routing rules, which is the part Sakana treats as the genuine research contribution.

There are two tiers at launch. **Fugu** "balances strong performance with low latency," positioned as the everyday default for coding, code review and interactive chatbots. **Fugu Ultra** is "tuned for maximum answer quality on hard, multi-step problems, coordinating a deeper pool of expert agents," aimed at AI research, paper reproduction, cybersecurity analysis and patent or literature investigation. The current Ultra identifier is fugu-ultra-20260615, and the everyday tier is selected simply as "fugu".

### The Research Behind It: TRINITY and the Conductor

Fugu is grounded in two papers Sakana presented at ICLR 2026. **TRINITY** ("An Evolved LLM Coordinator," Xu et al.) describes a lightweight, evolved coordinator that assigns Thinker, Worker and Verifier roles across a multi-model pool and adaptively delegates across coding, math and reasoning tasks. **The Conductor** ("Learning to Orchestrate Agents in Natural Language," Nielsen et al.) is trained with reinforcement learning to discover natural-language coordination strategies — effectively learning how a diverse set of models should talk to each other so the group outperforms any single worker.

The two papers point at the same thesis from different angles: a system can _learn_ to assemble, route and coordinate expert agents per task, rather than relying on a human to hand-design the workflow. That is the difference between an orchestration framework you configure and an orchestration model you call.

![Diagram contrasting a single monolithic model with Fugu's coordinator routing to a swappable pool of expert models](https://jnzbohshyskcshyjftrn.supabase.co/storage/v1/object/public/content-images/articles/sakana-ai-fugu-multi-llm-orchestration-routes-around-export-controls-2026/diagram-orchestration-vs-bigger-model-1782218022382.webp)

Orchestration vs scale: intelligence moves into the routing layer, and the underlying models become swappable parts.

## Why It Matters: Orchestration as a Hedge, Not a Feature

The most interesting thing about Fugu is not the architecture — coordinator-and-pool patterns have existed in agent frameworks for over a year. It is the framing. Sakana is explicitly selling orchestration as **risk management** rather than as a performance trick.

The argument, in Sakana's own words: "relying on a single company's APIs for critical infrastructure, finance, or governance is a material vulnerability," because "access can shift or disappear overnight due to changing regulatory boundaries, export controls, and foreign policies." Sakana cites the recent restrictions on Anthropic's Fable and Mythos models directly as motivation. Their conclusion is that "collective intelligence serves as the practical hedge against this concentration of power."

This lands with unusual force in June 2026 because the wound is fresh. Just over a week earlier, the US government forced Anthropic to [cut off access to Claude Fable 5 for foreign nationals worldwide, only three days after launch](https://theplanettools.ai/blog/us-government-suspends-claude-fable-5-foreign-nationals-june-2026). Fable 5 had been positioned as [Anthropic's most powerful model to date](https://theplanettools.ai/blog/claude-fable-5-launch), the new tier above Opus. For organizations outside the approved perimeter, the most capable model on the market simply vanished from their stack. Sakana's pitch is that the agents inside Fugu's pool are "entirely swappable," so "if a single provider restricts access, Fugu dynamically routes around the disruption."

That reframes a single-vendor outage from a strategic emergency into a configuration change. If one provider goes dark, the coordinator leans harder on the models that remain, and "over time, newer models can be folded into the pool." For a CTO who just watched a frontier model disappear from under a production workload, that resilience story is the actual product — the benchmarks are secondary.

## How It Compares: The Benchmark Claim, Read Carefully

Here is where editorial discipline matters. Sakana reports that "Fugu Ultra stands shoulder-to-shoulder with leading models like Fable 5 and Mythos Preview across the industry's most rigorous engineering, scientific, and reasoning benchmarks while delivering frontier capability without the risk of export controls." It is a strong claim, and it deserves a clear label: this is **Sakana's claim, not an independently verified result.**

The reason to be careful is structural, not skeptical for its own sake. By Sakana's own admission, Fable 5 and Mythos Preview are _not_ in Fugu's pool "since they are not publicly accessible." So the comparison cannot be a like-for-like, head-to-head run where Fugu Ultra orchestrates and beats those exact models. The benchmark table Sakana published instead measures Fugu Ultra against publicly available frontier models — Opus 4.8 (max), Gemini 3.1 Pro and GPT-5.5 (xhigh) — and the "shoulder-to-shoulder with Fable 5" line is an extrapolation on top of those results. Nobody outside the approved perimeter can currently reproduce a Fable 5 comparison, which is precisely the access problem Fugu is built to route around.

The reported numbers, attributed to Sakana, are nonetheless concrete. According to Sakana's published figures, Fugu Ultra scores 73.7 on SWE-Bench Pro, 82.1 on TerminalBench 2.1, 93.2 on LiveCodeBench, 90.8 on LiveCodeBench Pro, 50.0 on Humanity's Last Exam and 86.6 on CharXiv Reasoning. The SWE-Bench runs use mini-swe-agent scaffolding. These are the kind of scores a serious frontier model posts, and they are also the kind of scores that mean little until a third party rebuilds the harness and confirms them.

![Sakana-reported Fugu Ultra benchmark scores across SWE-Bench Pro, TerminalBench, LiveCodeBench and reasoning tests](https://jnzbohshyskcshyjftrn.supabase.co/storage/v1/object/public/content-images/articles/sakana-ai-fugu-multi-llm-orchestration-routes-around-export-controls-2026/chart-fugu-ultra-benchmarks-1782217963586.webp)

Sakana-reported Fugu Ultra scores. Figures are vendor-published and measured against publicly accessible models, not the export-restricted Fable 5 and Mythos Preview.

### Reported Fugu Ultra Scores (Sakana figures)

Benchmark

Fugu Ultra (Sakana-reported)

What it measures

SWE-Bench Pro

73.7

Real-world software engineering tasks

TerminalBench 2.1

82.1

Agentic command-line problem solving

LiveCodeBench

93.2

Contamination-resistant coding

LiveCodeBench Pro

90.8

Harder competitive-programming coding

Humanity's Last Exam

50.0

Expert-level cross-domain reasoning

CharXiv Reasoning

86.6

Scientific chart and figure reasoning

Compared against publicly available models such as Opus 4.8, Gemini 3.1 Pro and GPT-5.5. Source: Sakana AI launch materials, June 22, 2026.

### The Architectural Trade-off Nobody Should Ignore

Orchestration is not free. Routing a task through a coordinator, fanning it out to multiple expert models, verifying and synthesizing adds latency and token cost relative to a single direct call. Sakana clearly knows this, which is exactly why the everyday Fugu tier is explicitly tuned for low latency while Fugu Ultra accepts the overhead in exchange for quality on hard problems. The honest way to read the two-tier split is as a cost-and-latency dial, not two unrelated products.

There is also a dependency question hiding in the resilience story. Fugu routes around any _one_ provider, but it still depends on the pool as a whole, and on Sakana's coordinator being well-trained and well-maintained. Swapping single-vendor lock-in for orchestrator lock-in is a real consideration, even if the orchestrator sits on top of a diverse pool. The opt-out controls — letting teams remove specific agents for privacy or compliance — are a meaningful answer to part of that concern, and notably Fugu Ultra does not offer that opt-out, which enterprises in regulated sectors will want to scrutinize.

## The Bigger Picture: A Different Bet on the Frontier

Step back and Fugu reads as a thesis about where AI value is migrating. For three years the assumed path to the frontier was scale: more parameters, more compute, more data, one model to rule them all. Sakana — a lab that has consistently argued for collective intelligence and nature-inspired methods, and that earlier this year shipped its [KAME tandem architecture for speech-to-speech](https://theplanettools.ai/blog/sakana-ai-kame-tandem-speech-to-speech-mt-bench-may-2026) — is making the opposite bet. It argues that the coordinator is becoming the new foundation model, and that the raw models underneath are increasingly interchangeable commodities to be conducted.

That bet looks a lot smarter in a world where the most powerful models can be switched off by policy. Export controls and AI sovereignty pressures are turning model access into a geopolitical variable, and a system designed to be indifferent to which specific model it calls is, almost by definition, more robust to that volatility. It also fits the broader 2026 shift toward an [agentic web rebuilt around machine-to-machine coordination](https://theplanettools.ai/blog/agentic-web-2026-internet-rebuilt-for-machines-mcp-webmcp-a2a), where standardized interfaces between models and tools matter more than any single endpoint.

None of this means orchestration "wins." A genuinely dominant single model, available everywhere, would undercut much of the argument. But that is exactly the scenario June 2026 made less likely. When the best model on the planet can become unreachable in 72 hours, designing your stack so that no single model is load-bearing stops looking like a hedge and starts looking like basic architecture.

## What's Next

The decisive question is reproducibility. Sakana's benchmark numbers are concrete and its API is live with an OpenAI-compatible surface, a CLI and a documented model identifier, which lowers the barrier for independent testing. Expect the coding and agentic-research communities to rebuild the SWE-Bench Pro and TerminalBench harnesses and report whether Fugu Ultra holds up against Opus 4.8, Gemini 3.1 Pro and GPT-5.5 in their own runs. The "shoulder-to-shoulder with Fable 5" line will likely stay unverifiable for as long as Fable 5 itself stays behind export controls.

The second thing to watch is whether other labs follow Sakana into selling orchestration as a primary product rather than as a framework feature. If the resilience argument resonates with enterprises burned by sudden access changes, "the orchestrator is the product" could become a category rather than a single launch. For now, Fugu is the clearest statement yet that in 2026, controlling how models are combined may matter as much as owning the biggest one.

## Frequently Asked Questions

### What is Sakana Fugu?

Sakana Fugu is a multi-LLM orchestration system from Tokyo-based Sakana AI, launched on June 22, 2026. Instead of being a single bigger model, Fugu is itself a language model trained to call other frontier LLMs in a swappable agent pool, plan the work, delegate sub-tasks, verify results and synthesize a final answer. It is exposed through one OpenAI-compatible API, with two tiers: Fugu and Fugu Ultra.

### How is orchestration different from just shipping a bigger model?

A bigger model packs more capability into one set of weights you must access directly. Orchestration keeps the intelligence in the routing layer: Sakana Fugu is a small coordinator model that decides when to answer alone and when to assemble a team of expert models, including recursive calls to itself. Sakana grounds this in two ICLR 2026 papers, TRINITY (an evolved coordinator assigning Thinker, Worker and Verifier roles) and the Conductor (reinforcement learning that discovers natural-language coordination strategies). The key practical consequence is that the underlying models are swappable.

### What is the difference between Fugu and Fugu Ultra?

Fugu balances strong performance with low latency and is positioned as the everyday default for coding, code review and interactive chat, with the option to opt specific agents out of the pool for privacy or compliance. Fugu Ultra is tuned for maximum answer quality on hard, multi-step problems, coordinating a deeper pool of expert agents for work such as AI research, paper reproduction, cybersecurity analysis and patent investigation. The current Ultra model identifier is fugu-ultra-20260615.

### Is Fugu Ultra really on the level of Claude Fable 5?

That is Sakana's claim, not an independently verified fact. Sakana reports that Fugu Ultra "stands shoulder-to-shoulder with leading models like Fable 5 and Mythos Preview" on rigorous engineering, scientific and reasoning benchmarks. The important caveat is that Fable 5 and Mythos Preview are not in Fugu's pool because they are not publicly accessible after the June 2026 export controls, so Sakana's own benchmark table compares Fugu Ultra against publicly available models such as Opus 4.8, Gemini 3.1 Pro and GPT-5.5. Treat the Fable 5 parity line as a vendor claim until third parties reproduce it.

### What benchmark scores did Sakana report for Fugu Ultra?

Sakana reports Fugu Ultra results including SWE-Bench Pro at 73.7, TerminalBench 2.1 at 82.1, LiveCodeBench at 93.2, LiveCodeBench Pro at 90.8, Humanity's Last Exam at 50.0 and CharXiv Reasoning at 86.6. These are Sakana's published figures, measured against publicly accessible frontier models rather than the export-restricted Fable 5 and Mythos Preview.

### How do you access Fugu, and how is it priced?

Fugu ships with an OpenAI-compatible API that supports Chat Completions and Responses endpoints, so no SDK migration is required; callers simply select the model "fugu" or "fugu-ultra-20260615". There is also a CLI launched with codex-fugu and a one-line installer for Ubuntu and macOS. Sakana describes subscription tiers for everyday use plus a pay-as-you-go plan for heavier and enterprise workloads; exact prices were not disclosed at launch, and the beta involved close to 500 early users.
