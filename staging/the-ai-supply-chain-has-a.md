# The AI Supply Chain Has a Supply Chain Problem

**Source:** https://semgrep.dev/blog/2026/ai-supply-chain-problem/
**Added:** 2026-08-24
**Tags:** #unsorted

---

> Backdoors in AI models are nearly undetectable today. Learn why provenance and independent auditing need to become industry standards, not afterthoughts.

---

Are OSS models more or less trustworthy than frontier models? How would we know?

Deploying AI models – even "open weight" models – currently means accepting significant black box risk. Organizations are building corporate strategy on model foundations that are far more inscrutable than traditional 3rd-party software.

Let's start with some ground truths about the abysmal state of our understanding of models:

### **We have almost no ability to reverse engineer models today**

Even when model weights are public ("open weight"), we have almost no ability to predict its behavior. This is a major change: a typical computer program, in binary form, can still be analyzed with reverse engineering tools to arrive at a total description of its behavior. With models, we have nowhere close to this capability. 

**Why this matters:** Consuming binaries from a 3rd party of questionable origin still has the fallback that you can always reverse engineer those binaries to understand what they're doing. Using a model of unknown origin has no such explainability; the topic of "mechanistic interpretability" is still very much a research problem.

### **Models can be backdoored in ways we don't know how to reliably detect**

Several [research](https://arxiv.org/abs/2401.05566) [papers](https://arxiv.org/abs/2310.02949), including Anthropic's own _Small Samples_ research, demonstrate that limited poisoning during pretraining can produce persistent behaviors. Importantly, their research shows the number of samples required to add a backdoor to the model is small and does not increase as the model increases in size. This is unexpected: large datasets are not necessarily immune to manipulation, which means the provenance of training data becomes increasingly important.

**Why this matters:** A backdoor could be introduced in the training data of a model, or by hosting a malicious post-trained version of the model. We currently have no reliable way to assess the introduction of these backdoors, particularly if they are designed to be targeted at a specific end-user. By looking into logs it is possible to audit the prompt and response from a tool like Claude, but if the weights have been changed via fine tuning we have no visibility into it.

Today, there is no public evidence that widely used open-source models have been deliberately poisoned. However, we know that models have been widely influenced to reject offensive/malicious cyber security prompts, or to reject romantic, unhealthy relationships with users, we call this alignment. In a sense, one user's model poisoning is another's alignment problem.

If a software dependency contains malicious code, we have mature practices for discovering it, tracking its provenance, and reducing its impact. AI models are different. A compromised or subtly manipulated model doesn't need to "break" to create business risk, it only needs to influence decisions in ways that are difficult to detect. Whether that's insecure code generation, biased recommendations, hidden trigger behaviors, or simply outputs that become less trustworthy over time, the consequences can ripple through engineering organizations long before anyone realizes the model itself may be part of the problem.

  
_One country's model poisoning is another country's alignment problem._

### **We don’t know what we don’t know**

So far we've been talking about things we know we don't know: incomplete documentation, opaque datasets, unknown fine-tuning. Those are difficult problems, but at least we know what questions to ask. What unknown unknowns exist? If a model inherits behavior from something earlier in its lineage, how would we recognize it? More importantly, would we even think to ask?

In his classic 1984 Turing Award lecture, [_Reflections on Trusting Trust_](https://www.cs.cmu.edu/~rdriley/487/papers/Thompson_1984_ReflectionsonTrustingTrust.pdf), Ken Thompson described a compiler that had been modified to secretly insert a backdoor into every program it compiled, even into future versions of the compiler itself. The malicious code wasn't present in the compiler's source code, so reviewing the source wouldn't reveal the compromise. The backdoor had effectively become part of the compiler's inheritance, surviving generation after generation. Thompson's conclusion has become one of the foundational lessons of computer security: you can't trust a system simply because you can inspect what's in front of you. You also have to trust everything that was used to build it.

### **Where the industry needs to go**

Should we be worried? Yes. But we should be worried about every model whose lineage we can't understand, not just the ones built in a particular country. Benchmarks are not the answer, they can be cheated, models can be fine-tuned to pass benchmarks easily. As AI becomes part of critical business infrastructure, provenance, reproducibility, and independent evaluation will matter far more than marketing claims or benchmark scores.

That's why the industry needs trusted third parties. We don't rely on software vendors to certify the security of their own products, we have independent researchers, code auditors, penetration testers, CVE programs, and organizations that verify what vendors claim. AI will need the same ecosystem. The companies that earn trust will have to provide an unprecedented level of openness to the outside to let independent players validate the data, filter, and training stages of model development.
