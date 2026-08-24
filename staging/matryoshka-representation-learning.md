# Matryoshka Representation Learning

**Source:** https://arxiv.org/abs/2205.13147
**Added:** 2026-08-24
**Tags:** #unsorted

---

> Learned representations are a central component in modern ML systems, serving a multitude of downstream tasks. When training such representations, it is often the case that computational and statistical constraints for each downstream task are unknown. In this context rigid, fixed capacity representations can be either over or under-accommodating to the task at hand. This leads us to ask: can we design a flexible representation that can adapt to multiple downstream tasks with varying computational resources? Our main contribution is Matryoshka Representation Learning (MRL) which encodes information at different granularities and allows a single embedding to adapt to the computational constraints of downstream tasks. MRL minimally modifies existing representation learning pipelines and imposes no additional cost during inference and deployment. MRL learns coarse-to-fine representations that are at least as accurate and rich as independently trained low-dimensional representations. The flexibility within the learned Matryoshka Representations offer: (a) up to 14x smaller embedding size for ImageNet-1K classification at the same level of accuracy; (b) up to 14x real-world speed-ups for large-scale retrieval on ImageNet-1K and 4K; and (c) up to 2% accuracy improvements for long-tail few-shot classification, all while being as robust as the original representations. Finally, we show that MRL extends seamlessly to web-scale datasets (ImageNet, JFT) across various modalities -- vision (ViT, ResNet), vision + language (ALIGN) and language (BERT). MRL code and pretrained models are open-sourced at https://github.com/RAIVNLab/MRL.

---

Authors:[Aditya Kusupati](https://arxiv.org/search/cs?searchtype=author&query=Kusupati,+A), [Gantavya Bhatt](https://arxiv.org/search/cs?searchtype=author&query=Bhatt,+G), [Aniket Rege](https://arxiv.org/search/cs?searchtype=author&query=Rege,+A), [Matthew Wallingford](https://arxiv.org/search/cs?searchtype=author&query=Wallingford,+M), [Aditya Sinha](https://arxiv.org/search/cs?searchtype=author&query=Sinha,+A), [Vivek Ramanujan](https://arxiv.org/search/cs?searchtype=author&query=Ramanujan,+V), [William Howard-Snyder](https://arxiv.org/search/cs?searchtype=author&query=Howard-Snyder,+W), [Kaifeng Chen](https://arxiv.org/search/cs?searchtype=author&query=Chen,+K), [Sham Kakade](https://arxiv.org/search/cs?searchtype=author&query=Kakade,+S), [Prateek Jain](https://arxiv.org/search/cs?searchtype=author&query=Jain,+P), [Ali Farhadi](https://arxiv.org/search/cs?searchtype=author&query=Farhadi,+A)

[View PDF](https://arxiv.org/pdf/2205.13147) [HTML (experimental)](https://arxiv.org/html/2205.13147v4)

> Abstract:Learned representations are a central component in modern ML systems, serving a multitude of downstream tasks. When training such representations, it is often the case that computational and statistical constraints for each downstream task are unknown. In this context rigid, fixed capacity representations can be either over or under-accommodating to the task at hand. This leads us to ask: can we design a flexible representation that can adapt to multiple downstream tasks with varying computational resources? Our main contribution is Matryoshka Representation Learning (MRL) which encodes information at different granularities and allows a single embedding to adapt to the computational constraints of downstream tasks. MRL minimally modifies existing representation learning pipelines and imposes no additional cost during inference and deployment. MRL learns coarse-to-fine representations that are at least as accurate and rich as independently trained low-dimensional representations. The flexibility within the learned Matryoshka Representations offer: (a) up to 14x smaller embedding size for ImageNet-1K classification at the same level of accuracy; (b) up to 14x real-world speed-ups for large-scale retrieval on ImageNet-1K and 4K; and (c) up to 2% accuracy improvements for long-tail few-shot classification, all while being as robust as the original representations. Finally, we show that MRL extends seamlessly to web-scale datasets (ImageNet, JFT) across various modalities -- vision (ViT, ResNet), vision + language (ALIGN) and language (BERT). MRL code and pretrained models are open-sourced at [this https URL](https://github.com/RAIVNLab/MRL).

Comments:

Edited related work to include intrinsic dimensionality works

Subjects:

Machine Learning (cs.LG); Computer Vision and Pattern Recognition (cs.CV)

Cite as:

[arXiv:2205.13147](https://arxiv.org/abs/2205.13147) \[cs.LG\]

 

(or [arXiv:2205.13147v4](https://arxiv.org/abs/2205.13147v4) \[cs.LG\] for this version)

 

[https://doi.org/10.48550/arXiv.2205.13147](https://doi.org/10.48550/arXiv.2205.13147)

arXiv-issued DOI via DataCite

## Submission history

From: Aditya Kusupati \[[view email](https://arxiv.org/show-email/7ddd865c/2205.13147)\]  
**[\[v1\]](https://arxiv.org/abs/2205.13147v1)** Thu, 26 May 2022 04:33:56 UTC (9,795 KB)  
**[\[v2\]](https://arxiv.org/abs/2205.13147v2)** Wed, 1 Jun 2022 00:03:14 UTC (9,794 KB)  
**[\[v3\]](https://arxiv.org/abs/2205.13147v3)** Sat, 1 Oct 2022 00:40:52 UTC (7,558 KB)  
**\[v4\]** Thu, 8 Feb 2024 03:21:26 UTC (7,558 KB)
