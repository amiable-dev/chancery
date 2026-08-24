# Sleeper Agents: Training Deceptive LLMs that Persist Through Safety Training

**Source:** https://arxiv.org/abs/2401.05566
**Added:** 2026-08-24
**Tags:** #unsorted

---

> Humans are capable of strategically deceptive behavior: behaving helpfully in most situations, but then behaving very differently in order to pursue alternative objectives when given the opportunity. If an AI system learned such a deceptive strategy, could we detect it and remove it using current state-of-the-art safety training techniques? To study this question, we construct proof-of-concept examples of deceptive behavior in large language models (LLMs). For example, we train models that write secure code when the prompt states that the year is 2023, but insert exploitable code when the stated year is 2024. We find that such backdoor behavior can be made persistent, so that it is not removed by standard safety training techniques, including supervised fine-tuning, reinforcement learning, and adversarial training (eliciting unsafe behavior and then training to remove it). The backdoor behavior is most persistent in the largest models and in models trained to produce chain-of-thought reasoning about deceiving the training process, with the persistence remaining even when the chain-of-thought is distilled away. Furthermore, rather than removing backdoors, we find that adversarial training can teach models to better recognize their backdoor triggers, effectively hiding the unsafe behavior. Our results suggest that, once a model exhibits deceptive behavior, standard techniques could fail to remove such deception and create a false impression of safety.

---

Authors:[Evan Hubinger](https://arxiv.org/search/cs?searchtype=author&query=Hubinger,+E), [Carson Denison](https://arxiv.org/search/cs?searchtype=author&query=Denison,+C), [Jesse Mu](https://arxiv.org/search/cs?searchtype=author&query=Mu,+J), [Mike Lambert](https://arxiv.org/search/cs?searchtype=author&query=Lambert,+M), [Meg Tong](https://arxiv.org/search/cs?searchtype=author&query=Tong,+M), [Monte MacDiarmid](https://arxiv.org/search/cs?searchtype=author&query=MacDiarmid,+M), [Tamera Lanham](https://arxiv.org/search/cs?searchtype=author&query=Lanham,+T), [Daniel M. Ziegler](https://arxiv.org/search/cs?searchtype=author&query=Ziegler,+D+M), [Tim Maxwell](https://arxiv.org/search/cs?searchtype=author&query=Maxwell,+T), [Newton Cheng](https://arxiv.org/search/cs?searchtype=author&query=Cheng,+N), [Adam Jermyn](https://arxiv.org/search/cs?searchtype=author&query=Jermyn,+A), [Amanda Askell](https://arxiv.org/search/cs?searchtype=author&query=Askell,+A), [Ansh Radhakrishnan](https://arxiv.org/search/cs?searchtype=author&query=Radhakrishnan,+A), [Cem Anil](https://arxiv.org/search/cs?searchtype=author&query=Anil,+C), [David Duvenaud](https://arxiv.org/search/cs?searchtype=author&query=Duvenaud,+D), [Deep Ganguli](https://arxiv.org/search/cs?searchtype=author&query=Ganguli,+D), [Fazl Barez](https://arxiv.org/search/cs?searchtype=author&query=Barez,+F), [Jack Clark](https://arxiv.org/search/cs?searchtype=author&query=Clark,+J), [Kamal Ndousse](https://arxiv.org/search/cs?searchtype=author&query=Ndousse,+K), [Kshitij Sachan](https://arxiv.org/search/cs?searchtype=author&query=Sachan,+K), [Michael Sellitto](https://arxiv.org/search/cs?searchtype=author&query=Sellitto,+M), [Mrinank Sharma](https://arxiv.org/search/cs?searchtype=author&query=Sharma,+M), [Nova DasSarma](https://arxiv.org/search/cs?searchtype=author&query=DasSarma,+N), [Roger Grosse](https://arxiv.org/search/cs?searchtype=author&query=Grosse,+R), [Shauna Kravec](https://arxiv.org/search/cs?searchtype=author&query=Kravec,+S), [Yuntao Bai](https://arxiv.org/search/cs?searchtype=author&query=Bai,+Y), [Zachary Witten](https://arxiv.org/search/cs?searchtype=author&query=Witten,+Z), [Marina Favaro](https://arxiv.org/search/cs?searchtype=author&query=Favaro,+M), [Jan Brauner](https://arxiv.org/search/cs?searchtype=author&query=Brauner,+J), [Holden Karnofsky](https://arxiv.org/search/cs?searchtype=author&query=Karnofsky,+H), [Paul Christiano](https://arxiv.org/search/cs?searchtype=author&query=Christiano,+P), [Samuel R. Bowman](https://arxiv.org/search/cs?searchtype=author&query=Bowman,+S+R), [Logan Graham](https://arxiv.org/search/cs?searchtype=author&query=Graham,+L), [Jared Kaplan](https://arxiv.org/search/cs?searchtype=author&query=Kaplan,+J), [Sören Mindermann](https://arxiv.org/search/cs?searchtype=author&query=Mindermann,+S), [Ryan Greenblatt](https://arxiv.org/search/cs?searchtype=author&query=Greenblatt,+R), [Buck Shlegeris](https://arxiv.org/search/cs?searchtype=author&query=Shlegeris,+B), [Nicholas Schiefer](https://arxiv.org/search/cs?searchtype=author&query=Schiefer,+N), [Ethan Perez](https://arxiv.org/search/cs?searchtype=author&query=Perez,+E)

[View PDF](https://arxiv.org/pdf/2401.05566) [HTML (experimental)](https://arxiv.org/html/2401.05566v3)

> Abstract:Humans are capable of strategically deceptive behavior: behaving helpfully in most situations, but then behaving very differently in order to pursue alternative objectives when given the opportunity. If an AI system learned such a deceptive strategy, could we detect it and remove it using current state-of-the-art safety training techniques? To study this question, we construct proof-of-concept examples of deceptive behavior in large language models (LLMs). For example, we train models that write secure code when the prompt states that the year is 2023, but insert exploitable code when the stated year is 2024. We find that such backdoor behavior can be made persistent, so that it is not removed by standard safety training techniques, including supervised fine-tuning, reinforcement learning, and adversarial training (eliciting unsafe behavior and then training to remove it). The backdoor behavior is most persistent in the largest models and in models trained to produce chain-of-thought reasoning about deceiving the training process, with the persistence remaining even when the chain-of-thought is distilled away. Furthermore, rather than removing backdoors, we find that adversarial training can teach models to better recognize their backdoor triggers, effectively hiding the unsafe behavior. Our results suggest that, once a model exhibits deceptive behavior, standard techniques could fail to remove such deception and create a false impression of safety.

Comments:

updated to add missing acknowledgements

Subjects:

Cryptography and Security (cs.CR); Artificial Intelligence (cs.AI); Computation and Language (cs.CL); Machine Learning (cs.LG); Software Engineering (cs.SE)

Cite as:

[arXiv:2401.05566](https://arxiv.org/abs/2401.05566) \[cs.CR\]

 

(or [arXiv:2401.05566v3](https://arxiv.org/abs/2401.05566v3) \[cs.CR\] for this version)

 

[https://doi.org/10.48550/arXiv.2401.05566](https://doi.org/10.48550/arXiv.2401.05566)

arXiv-issued DOI via DataCite

## Submission history

From: Evan Hubinger \[[view email](https://arxiv.org/show-email/6ff15954/2401.05566)\]  
**[\[v1\]](https://arxiv.org/abs/2401.05566v1)** Wed, 10 Jan 2024 22:14:35 UTC (7,362 KB)  
**[\[v2\]](https://arxiv.org/abs/2401.05566v2)** Fri, 12 Jan 2024 02:34:39 UTC (7,440 KB)  
**\[v3\]** Wed, 17 Jan 2024 20:26:01 UTC (7,452 KB)
