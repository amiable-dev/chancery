# Retrieval-Augmented Generation for Knowledge-Intensive NLP Tasks

**Source:** https://arxiv.org/abs/2005.11401
**Added:** 2026-08-24
**Tags:** #unsorted

---

> Large pre-trained language models have been shown to store factual knowledge in their parameters, and achieve state-of-the-art results when fine-tuned on downstream NLP tasks. However, their ability to access and precisely manipulate knowledge is still limited, and hence on knowledge-intensive tasks, their performance lags behind task-specific architectures. Additionally, providing provenance for their decisions and updating their world knowledge remain open research problems. Pre-trained models with a differentiable access mechanism to explicit non-parametric memory can overcome this issue, but have so far been only investigated for extractive downstream tasks. We explore a general-purpose fine-tuning recipe for retrieval-augmented generation (RAG) -- models which combine pre-trained parametric and non-parametric memory for language generation. We introduce RAG models where the parametric memory is a pre-trained seq2seq model and the non-parametric memory is a dense vector index of Wikipedia, accessed with a pre-trained neural retriever. We compare two RAG formulations, one which conditions on the same retrieved passages across the whole generated sequence, the other can use different passages per token. We fine-tune and evaluate our models on a wide range of knowledge-intensive NLP tasks and set the state-of-the-art on three open domain QA tasks, outperforming parametric seq2seq models and task-specific retrieve-and-extract architectures. For language generation tasks, we find that RAG models generate more specific, diverse and factual language than a state-of-the-art parametric-only seq2seq baseline.

---

Authors:[Patrick Lewis](https://arxiv.org/search/cs?searchtype=author&query=Lewis,+P), [Ethan Perez](https://arxiv.org/search/cs?searchtype=author&query=Perez,+E), [Aleksandra Piktus](https://arxiv.org/search/cs?searchtype=author&query=Piktus,+A), [Fabio Petroni](https://arxiv.org/search/cs?searchtype=author&query=Petroni,+F), [Vladimir Karpukhin](https://arxiv.org/search/cs?searchtype=author&query=Karpukhin,+V), [Naman Goyal](https://arxiv.org/search/cs?searchtype=author&query=Goyal,+N), [Heinrich Küttler](https://arxiv.org/search/cs?searchtype=author&query=K%C3%BCttler,+H), [Mike Lewis](https://arxiv.org/search/cs?searchtype=author&query=Lewis,+M), [Wen-tau Yih](https://arxiv.org/search/cs?searchtype=author&query=Yih,+W), [Tim Rocktäschel](https://arxiv.org/search/cs?searchtype=author&query=Rockt%C3%A4schel,+T), [Sebastian Riedel](https://arxiv.org/search/cs?searchtype=author&query=Riedel,+S), [Douwe Kiela](https://arxiv.org/search/cs?searchtype=author&query=Kiela,+D)

[View PDF](https://arxiv.org/pdf/2005.11401) [HTML (experimental)](https://arxiv.org/html/2005.11401v4)

> Abstract:Large pre-trained language models have been shown to store factual knowledge in their parameters, and achieve state-of-the-art results when fine-tuned on downstream NLP tasks. However, their ability to access and precisely manipulate knowledge is still limited, and hence on knowledge-intensive tasks, their performance lags behind task-specific architectures. Additionally, providing provenance for their decisions and updating their world knowledge remain open research problems. Pre-trained models with a differentiable access mechanism to explicit non-parametric memory can overcome this issue, but have so far been only investigated for extractive downstream tasks. We explore a general-purpose fine-tuning recipe for retrieval-augmented generation (RAG) -- models which combine pre-trained parametric and non-parametric memory for language generation. We introduce RAG models where the parametric memory is a pre-trained seq2seq model and the non-parametric memory is a dense vector index of Wikipedia, accessed with a pre-trained neural retriever. We compare two RAG formulations, one which conditions on the same retrieved passages across the whole generated sequence, the other can use different passages per token. We fine-tune and evaluate our models on a wide range of knowledge-intensive NLP tasks and set the state-of-the-art on three open domain QA tasks, outperforming parametric seq2seq models and task-specific retrieve-and-extract architectures. For language generation tasks, we find that RAG models generate more specific, diverse and factual language than a state-of-the-art parametric-only seq2seq baseline.

Comments:

Accepted at NeurIPS 2020

Subjects:

Computation and Language (cs.CL); Machine Learning (cs.LG)

Cite as:

[arXiv:2005.11401](https://arxiv.org/abs/2005.11401) \[cs.CL\]

 

(or [arXiv:2005.11401v4](https://arxiv.org/abs/2005.11401v4) \[cs.CL\] for this version)

 

[https://doi.org/10.48550/arXiv.2005.11401](https://doi.org/10.48550/arXiv.2005.11401)

arXiv-issued DOI via DataCite

## Submission history

From: Patrick Lewis \[[view email](https://arxiv.org/show-email/76d69ce8/2005.11401)\]  
**[\[v1\]](https://arxiv.org/abs/2005.11401v1)** Fri, 22 May 2020 21:34:34 UTC (698 KB)  
**[\[v2\]](https://arxiv.org/abs/2005.11401v2)** Mon, 7 Dec 2020 16:23:06 UTC (767 KB)  
**[\[v3\]](https://arxiv.org/abs/2005.11401v3)** Mon, 29 Mar 2021 10:12:16 UTC (767 KB)  
**\[v4\]** Mon, 12 Apr 2021 15:42:18 UTC (767 KB)
