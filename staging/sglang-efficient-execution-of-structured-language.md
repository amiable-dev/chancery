# SGLang: Efficient Execution of Structured Language Model Programs

**Source:** https://arxiv.org/abs/2312.07104
**Added:** 2026-08-24
**Tags:** #unsorted

---

> Large language models (LLMs) are increasingly used for complex tasks that require multiple generation calls, advanced prompting techniques, control flow, and structured inputs/outputs. However, efficient systems are lacking for programming and executing these applications. We introduce SGLang, a system for efficient execution of complex language model programs. SGLang consists of a frontend language and a runtime. The frontend simplifies programming with primitives for generation and parallelism control. The runtime accelerates execution with novel optimizations like RadixAttention for KV cache reuse and compressed finite state machines for faster structured output decoding. Experiments show that SGLang achieves up to 6.4x higher throughput compared to state-of-the-art inference systems on various large language and multi-modal models on tasks including agent control, logical reasoning, few-shot learning benchmarks, JSON decoding, retrieval-augmented generation pipelines, and multi-turn chat. The code is publicly available at https://github.com/sgl-project/sglang

---

Authors:[Lianmin Zheng](https://arxiv.org/search/cs?searchtype=author&query=Zheng,+L), [Liangsheng Yin](https://arxiv.org/search/cs?searchtype=author&query=Yin,+L), [Zhiqiang Xie](https://arxiv.org/search/cs?searchtype=author&query=Xie,+Z), [Chuyue Sun](https://arxiv.org/search/cs?searchtype=author&query=Sun,+C), [Jeff Huang](https://arxiv.org/search/cs?searchtype=author&query=Huang,+J), [Cody Hao Yu](https://arxiv.org/search/cs?searchtype=author&query=Yu,+C+H), [Shiyi Cao](https://arxiv.org/search/cs?searchtype=author&query=Cao,+S), [Christos Kozyrakis](https://arxiv.org/search/cs?searchtype=author&query=Kozyrakis,+C), [Ion Stoica](https://arxiv.org/search/cs?searchtype=author&query=Stoica,+I), [Joseph E. Gonzalez](https://arxiv.org/search/cs?searchtype=author&query=Gonzalez,+J+E), [Clark Barrett](https://arxiv.org/search/cs?searchtype=author&query=Barrett,+C), [Ying Sheng](https://arxiv.org/search/cs?searchtype=author&query=Sheng,+Y)

[View PDF](https://arxiv.org/pdf/2312.07104) [HTML (experimental)](https://arxiv.org/html/2312.07104v2)

> Abstract:Large language models (LLMs) are increasingly used for complex tasks that require multiple generation calls, advanced prompting techniques, control flow, and structured inputs/outputs. However, efficient systems are lacking for programming and executing these applications. We introduce SGLang, a system for efficient execution of complex language model programs. SGLang consists of a frontend language and a runtime. The frontend simplifies programming with primitives for generation and parallelism control. The runtime accelerates execution with novel optimizations like RadixAttention for KV cache reuse and compressed finite state machines for faster structured output decoding. Experiments show that SGLang achieves up to 6.4x higher throughput compared to state-of-the-art inference systems on various large language and multi-modal models on tasks including agent control, logical reasoning, few-shot learning benchmarks, JSON decoding, retrieval-augmented generation pipelines, and multi-turn chat. The code is publicly available at [this https URL](https://github.com/sgl-project/sglang)

Subjects:

Artificial Intelligence (cs.AI); Programming Languages (cs.PL)

Cite as:

[arXiv:2312.07104](https://arxiv.org/abs/2312.07104) \[cs.AI\]

 

(or [arXiv:2312.07104v2](https://arxiv.org/abs/2312.07104v2) \[cs.AI\] for this version)

 

[https://doi.org/10.48550/arXiv.2312.07104](https://doi.org/10.48550/arXiv.2312.07104)

arXiv-issued DOI via DataCite

## Submission history

From: Ying Sheng \[[view email](https://arxiv.org/show-email/7f6bba5a/2312.07104)\]  
**[\[v1\]](https://arxiv.org/abs/2312.07104v1)** Tue, 12 Dec 2023 09:34:27 UTC (380 KB)  
**\[v2\]** Thu, 6 Jun 2024 00:10:06 UTC (804 KB)
