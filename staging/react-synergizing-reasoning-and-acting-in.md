# ReAct: Synergizing Reasoning and Acting in Language Models

**Source:** https://arxiv.org/abs/2210.03629
**Added:** 2026-08-24
**Tags:** #unsorted

---

> While large language models (LLMs) have demonstrated impressive capabilities across tasks in language understanding and interactive decision making, their abilities for reasoning (e.g. chain-of-thought prompting) and acting (e.g. action plan generation) have primarily been studied as separate topics. In this paper, we explore the use of LLMs to generate both reasoning traces and task-specific actions in an interleaved manner, allowing for greater synergy between the two: reasoning traces help the model induce, track, and update action plans as well as handle exceptions, while actions allow it to interface with external sources, such as knowledge bases or environments, to gather additional information. We apply our approach, named ReAct, to a diverse set of language and decision making tasks and demonstrate its effectiveness over state-of-the-art baselines, as well as improved human interpretability and trustworthiness over methods without reasoning or acting components. Concretely, on question answering (HotpotQA) and fact verification (Fever), ReAct overcomes issues of hallucination and error propagation prevalent in chain-of-thought reasoning by interacting with a simple Wikipedia API, and generates human-like task-solving trajectories that are more interpretable than baselines without reasoning traces. On two interactive decision making benchmarks (ALFWorld and WebShop), ReAct outperforms imitation and reinforcement learning methods by an absolute success rate of 34% and 10% respectively, while being prompted with only one or two in-context examples. Project site with code: https://react-lm.github.io

---

[View PDF](https://arxiv.org/pdf/2210.03629) [HTML (experimental)](https://arxiv.org/html/2210.03629v3)

> Abstract:While large language models (LLMs) have demonstrated impressive capabilities across tasks in language understanding and interactive decision making, their abilities for reasoning (e.g. chain-of-thought prompting) and acting (e.g. action plan generation) have primarily been studied as separate topics. In this paper, we explore the use of LLMs to generate both reasoning traces and task-specific actions in an interleaved manner, allowing for greater synergy between the two: reasoning traces help the model induce, track, and update action plans as well as handle exceptions, while actions allow it to interface with external sources, such as knowledge bases or environments, to gather additional information. We apply our approach, named ReAct, to a diverse set of language and decision making tasks and demonstrate its effectiveness over state-of-the-art baselines, as well as improved human interpretability and trustworthiness over methods without reasoning or acting components. Concretely, on question answering (HotpotQA) and fact verification (Fever), ReAct overcomes issues of hallucination and error propagation prevalent in chain-of-thought reasoning by interacting with a simple Wikipedia API, and generates human-like task-solving trajectories that are more interpretable than baselines without reasoning traces. On two interactive decision making benchmarks (ALFWorld and WebShop), ReAct outperforms imitation and reinforcement learning methods by an absolute success rate of 34% and 10% respectively, while being prompted with only one or two in-context examples. Project site with code: [this https URL](https://react-lm.github.io/)

Comments:

v3 is the ICLR camera ready version with some typos fixed. Project site with code: [this https URL](https://react-lm.github.io/)

Subjects:

Computation and Language (cs.CL); Artificial Intelligence (cs.AI); Machine Learning (cs.LG)

Cite as:

[arXiv:2210.03629](https://arxiv.org/abs/2210.03629) \[cs.CL\]

 

(or [arXiv:2210.03629v3](https://arxiv.org/abs/2210.03629v3) \[cs.CL\] for this version)

 

[https://doi.org/10.48550/arXiv.2210.03629](https://doi.org/10.48550/arXiv.2210.03629)

arXiv-issued DOI via DataCite

## Submission history

From: Shunyu Yao \[[view email](https://arxiv.org/show-email/a500107c/2210.03629)\]  
**[\[v1\]](https://arxiv.org/abs/2210.03629v1)** Thu, 6 Oct 2022 01:00:32 UTC (538 KB)  
**[\[v2\]](https://arxiv.org/abs/2210.03629v2)** Sun, 27 Nov 2022 22:55:54 UTC (538 KB)  
**\[v3\]** Fri, 10 Mar 2023 01:00:17 UTC (1,256 KB)
