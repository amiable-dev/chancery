# Overview - Langfuse

**Source:** https://langfuse.com/docs
**Added:** 2026-08-24
**Tags:** #unsorted

---

> Langfuse is an open-source AI engineering platform (GitHub) that helps teams collaboratively debug, analyze, and iterate on their LLM applications. All platform features are natively integrated to accelerate the development workflow.

---

Langfuse is an open-source AI engineering platform ([GitHub](https://github.com/langfuse/langfuse)) that helps teams collaboratively debug, analyze, and iterate on their LLM applications. All platform features are natively integrated to accelerate the development workflow. Langfuse is open, self-hostable, and extensible ([_why langfuse?_](https://langfuse.com/why)).

### Observability

-   Log traces
    
-   Lowest level transparency
    
-   Understand cost and latency
    

### Prompts

-   Version control and deploy
    
-   Collaborate on prompts
    
-   Test prompts and models
    

### Evaluation

-   Measure output quality
    
-   Monitor production health
    
-   Test changes in development
    

### Platform

-   API-first architecture
    
-   Data exports to blob storage
    
-   Enterprise security and administration
    

[Observability](https://langfuse.com/docs/observability/overview) is essential for understanding and debugging LLM applications. Unlike traditional software, LLM applications involve complex, non-deterministic interactions that can be challenging to monitor and debug. Langfuse provides comprehensive tracing capabilities that help you understand exactly what's happening in your application.

-   Traces include all LLM and non-LLM calls, including retrieval, embedding, API calls, and more
-   Support for tracking multi-turn conversations as sessions and user tracking
-   Agents can be represented as graphs
-   Capture traces via our native SDKs for Python/JS, 100+ library/framework integrations, OpenTelemetry, or via an LLM Gateway such as LiteLLM
-   Based on OpenTelemetry to increase compatibility and reduce vendor lock-in

🚀

Want to see it in action?

[Prompt Management](https://langfuse.com/docs/prompt-management/overview) is critical in building effective LLM applications. Langfuse provides tools to help you manage, version, and optimize your prompts throughout the development lifecycle.

-   [Get started](https://langfuse.com/docs/prompt-management/get-started) with prompt management
-   Manage, version, and optimize your prompts throughout the development lifecycle
-   Test prompts interactively in the [LLM Playground](https://langfuse.com/docs/prompt-management/features/playground)
-   Run [Experiments](https://langfuse.com/docs/evaluation/features/prompt-experiments) against datasets to test new prompt versions directly within Langfuse

🚀

[Evaluation](https://langfuse.com/docs/evaluation/overview) is crucial for ensuring the quality and reliability of your LLM applications. Langfuse provides flexible evaluation tools that adapt to your specific needs, whether you're testing in development or monitoring production performance.

-   Get started with different [evaluation methods](https://langfuse.com/docs/evaluation/overview): LLM-as-a-judge, code evaluators, user feedback, manual labeling, or custom pipelines
-   Identify issues early by running evaluations on production traces
-   Create and manage [Datasets](https://langfuse.com/docs/evaluation/features/datasets) for systematic testing in development that ensure your application performs reliably across different scenarios
-   Run [Experiments](https://langfuse.com/docs/evaluation/core-concepts#experiments) to systematically test your LLM application

🚀

Setting up the full process of online tracing, prompt management, production evaluations to identify issues, and offline evaluations on datasets requires some time. This guide is meant to help you figure out what is most important for your use case.

_Simplified lifecycle from PoC to production:_

Get up and running with Langfuse in minutes. Choose the path that best fits your current needs:

-   **Open source:** Fully open source with public API for custom integrations
-   **Production optimized:** Designed with minimal performance overhead
-   **Best-in-class SDKs:** Native SDKs for Python and JavaScript
-   **Framework support:** Integrated with popular frameworks like OpenAI SDK, LangChain, and LlamaIndex
-   **Multi-modal:** Support for tracing text, images and other modalities
-   **Full platform:** Suite of tools for the complete LLM application development lifecycle

We actively develop Langfuse in [open source](https://langfuse.com/open-source) together with our community:

-   Contribute and vote on the Langfuse [roadmap](https://langfuse.com/docs/roadmap).
-   Ask questions on [GitHub Discussions](https://langfuse.com/gh-support) or private [support channels](https://langfuse.com/support).
-   Report bugs via [GitHub Issues](https://langfuse.com/issue).
-   Chat with the community on [Discord](https://langfuse.com/discord).
-   Join a [community hour](https://langfuse.com/events) to talk to the team and ask questions live.
-   [Why people choose Langfuse?](https://langfuse.com/why)

Langfuse evolves quickly, check out the [changelog](https://langfuse.com/changelog) for the latest updates. Subscribe to the **mailing list** to get notified about new major features:

* * *

Was this page helpful?

* * *

Last edited
