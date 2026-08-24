# Evals are the new unit tests

**Source:** https://zoyathinks.substack.com/p/evals-are-the-new-unit-tests-2c91f51399d6
**Added:** 2026-08-24
**Tags:** #unsorted

---

> The word “evals” is coming up more and more these days in the context of GenAI model development.

---

The word “evals” is coming up more and more these days in the context of GenAI model development. While referring to the evaluation of GenAI models broadly, there are a lot of different approaches used in practice, some powered by humans, others by LLMs/VLMs (e.g., frequently referred to as “LLM-as-a-judge”) — perhaps the main commonalities being that these evaluations are done at-scale, often to produce statistical reports and/or metrics for tracking progress, benchmarking against the market, collecting feedback for direct improvement (refinement, fine-tuning, post-training), and giving product management a pulse check on shipping readiness (i.e., “is this AI tool _ready_ for my prospective user?”).

Because of the complexity of the GenAI model development process and the many decision forks that come up along the way with regards to data, architecture, training approaches, default settings, initialization, etc. etc., regular evals provide a way to keep models “in check” and moving in the “right” direction. They can also help with the human decision paralysis when there is a combinatorial explosion of possibilities to consider (_though blindly relying on eval metrics for decision making can come with its own dangers…_ _perhaps a topic for a future post._)

[

![](https://substackcdn.com/image/fetch/$s_!icjB!,w_1456,c_limit,f_auto,q_auto:good,fl_progressive:steep/https%3A%2F%2Fsubstack-post-media.s3.amazonaws.com%2Fpublic%2Fimages%2F3695a323-f3c6-4be6-8c1c-406561e22fa4_1024x683.png)

](https://substackcdn.com/image/fetch/$s_!icjB!,f_auto,q_auto:good,fl_progressive:steep/https%3A%2F%2Fsubstack-post-media.s3.amazonaws.com%2Fpublic%2Fimages%2F3695a323-f3c6-4be6-8c1c-406561e22fa4_1024x683.png)

**In traditional software development, automated unit testing and human QA are used to ensure features operate “as expected” and are able to re-produce pre-defined outputs. But what are the expectations when an AI tool is generating non-deterministic, brand new content every time it is run/tested?** (_footnote: yes, randomness can be fixed, but this becomes increasingly complicated when chaining together multiple features that may each depend on their own initializations; further, testing random seeds is also part of evaluating the overall experience_).

A unit test checks whether a specific piece of code produces the **expected output** for a given **input**. But what if that code is an AI model? In this case, we have to rethink what the expected output is, because there is often no single right answer, and the more advanced AI becomes, the more nuance is added. I propose to think of the expected output as the _envelope_ _of possible outputs_ that would be _considered acceptable_ by the _target users_ of the model. The highlighted words are important here, because they shape the evaluation strategy and the way these GenAI “unit tests” ought to be built. For instance, it may not be possible to enumerate all possible acceptable answers, but we can still postulate what properties must be present in the outputs. Further, the notion of what makes an answer acceptable also varies drastically depending on who the target user is, and the context in which the model will be used and evaluated.

Let’s make this more concrete with the example of a text-to-image model. Are the prospective users of the model children or adults? Will they be educators, creative professionals, marketers, etc.? Will they be using the outputs of the model directly, or as part of a bigger tool chain? The answers to all these questions will affect what properties of the model outputs will be most critical to measure: technical quality, prompt alignment, user alignment, production readiness, potential for harm, commercial safety, robustness/stability, diversity, etc. Each of these properties sits atop a hierarchy of other sub-properties. For instance, measuring technical quality can be broken down into measuring visual artifacts like body deformations, physical inaccuracies, sharpness of details, etc. Some of these properties may be deemed more important than others given the goals of the user and the business strategy of the company supplying the model. This is why there can not be a comprehensive prescriptive guide on evals. Evals are custom to the model, the business, and the user. Evals go hand-in-hand with model development, and must evolve along with it. The wrong way to do evals is to not do them thoroughly or thoughtfully enough. Done right, evals can critically shape model and product strategy more broadly. No wonder they’re getting so much attention right now.

Let’s assume we have defined the properties and sub-properties that are important for tracking the development of our model. Next we must define the test sets that will be used as inputs to our models for evals. The composition of the test sets is — surprise, surprise — dependent on the target audience and the context in which the model will be used. The goal is to test the model on cases that are likely to appear in the target audience’s typical usage. We must focus on what is expected to be most likely, while also probing the outer limits, to test both emergent capabilities and risks. The full space of what users might try with the model is infinite, so we must be smart about sampling this space to have good coverage and some guarantees of what the average user will experience when they use the model. In-product analytics are helpful once a model is released to users, but with every new development, we need some assurances of the expected user experience before the experience goes live.

What do our eval “unit tests” look like then? We have inputs that are carefully curated to represent future user inputs, and we have expectations for the model outputs that would be acceptable for those inputs. These unit tests are not deterministic, nor are they pass/fail criteria. Designing them is an art, but using them to measure model performance is a science. Aggregated over test instances, model performance on these test sets can be summarized quantitatively with some confidence bounds. Paired with thoughtful statistics, these evals can provide windows into model strengths & weaknesses, as well as broader product opportunities.

No posts
