# NVIDIA Ising Introduces AI-Powered Workflows to Build Fault-Tolerant Quantum Systems

**Source:** https://developer.nvidia.com/blog/nvidia-ising-introduces-ai-powered-workflows-to-build-fault-tolerant-quantum-systems/
**Added:** 2026-08-24
**Tags:** #unsorted

---

> NVIDIA Ising is the world&rsquo;s first family of open AI models for building quantum processors, launching with two model domains: Ising Calibration and Ising…

---

[NVIDIA Ising](https://www.nvidia.com/en-us/solutions/quantum-computing/ising/) is the world’s first family of open AI models for building quantum processors, launching with two model domains: Ising Calibration and Ising Decoding.

Both target the fundamental challenge in [quantum computing](https://www.nvidia.com/en-us/glossary/quantum-computing/)—qubits are inherently noisy. The best quantum processors make an error roughly once in every thousand operations. To become useful accelerators for scientific and enterprise problems, error rates must drop to one in a trillion or better. AI is the most promising path to closing that gap at scale.

Calibration is the process of understanding the noise in each quantum processor and tuning it to achieve the best possible performance. Calibration minimizes error, but because of noise in quantum systems, errors must be corrected in real time by a classical computer, faster than they accumulate. This process is called quantum error correction decoding. Both calibration and decoding are computationally intensive and need improved methods to drive progress. Ising delivers advanced performance on calibration and error correction decoding, using techniques for scaling to millions of qubits.

NVIDIA Ising provides open base models, a training framework, and workflows for fine-tuning, quantization, and deployment. The pre-trained models deliver top performance out of the box, and because everything is open, users can also specialize for their own hardware and noise characteristics while keeping proprietary QPU data on-site.

In this post, we dive into how NVIDIA Ising delivers starting points for users to select base models, train their own, fine-tune, quantize, and deploy optimized inference workflows wherever needed, improving QPU performance and providing a path to scale to Quantum-GPU Supercomputers capable of solving useful problems.

The NVIDIA Ising family launches with two breakthrough models: 

-   **NVIDIA Ising Calibration**: A [vision-language model](https://www.nvidia.com/en-us/glossary/vision-language-models/) (VLM) model for automating QPU calibration tasks.
-   **NVIDIA Ising Decoding**: Consists of two 3D CNN models for demanding decoding needed during quantum error correction.

_Video 1. NVIDIA Ising accelerates useful quantum computing_

## NVIDIA Ising Calibration[](#nvidia_ising_calibration)

NVIDIA Ising Calibration is a VLM capable of understanding quantum computing scientific experiment output and how it compares to expected trends. 

This VLM can be used in an agentic workflow that responds to measurement results and actively calibrates a quantum processor until its operation falls within desired specifications. 

The Ising-Calibration-1 model was trained on data generated from information provided by partners spanning multiple qubit modalities, including superconducting qubits, quantum dots, ions, neutral atoms, electrons on Helium, and others specializing in calibration and control. 

In the absence of a standard benchmark for evaluating quantum calibration models, NVIDIA collaborated with quantum partners to develop [QCalEval](https://huggingface.co/datasets/nvidia/QCalEval), the world’s first benchmark for agentic quantum computer calibration, containing real quantum computer outputs.  

This benchmark is a six-part semantic scoring test that assesses any model’s effectiveness at relevant calibration tasks. QCalEval measures a model’s ability to interpret experimental results, classify outcomes, evaluate their significance, assess fit quality and key features, and generate actionable next-step recommendations. Learn more about the [QCalEval benchmark](https://research.nvidia.com/publication/2026-04_qcaleval-benchmarking-vision-language-models-quantum-calibration-plot), along with model architecture and evaluation results

Ising-Calibration-1 repeatedly outperforms state-of-the-art open and closed models of a range of parameters. As shown in Figure 1, Ising Calibration 1 scores 3.27% better on average than Gemini 3.1 Pro, 9.68% better than Claude Opus 4.6, and 14.5% better than GPT 5.4. The 35B parameter VLM is suited for data center GPUs such as NVIDIA Grace Blackwell and NVIDIA Vera Rubin, and consumer cards like NVIDIA DGX Spark. 

![Quantum calibration evaluation by model performance chart with six performance comparisons and one average showing Gemini 3.1 Pro, Claude Opus 4.6, GPT 5.4, and Ising Calibration 1 (all data).](https://developer-blogs.nvidia.com/wp-content/uploads/2026/04/Ising-Benchmark.webp)

_Figure 1. Ising Calibration 1 advances AI and quantum computing calibration by outperforming all comparable open models out of the box, on the QCalEval benchmark_

With the [NVIDIA NeMo Agent Toolkit](https://developer.nvidia.com/nemo-agent-toolkit), developers can build agents that integrate with a wide range of models to automate the calibration process. Using this approach with the Ising-Calibration-1 model, developers can effectively automate calibration workflows with minimal human oversight.

NVIDIA partners have demonstrated integration of this agentic workflow within a wide range of calibration and control software stacks, and through popular coding agents, like Coda, Cursor, or Claude Code. 

Learn more about deploying Ising-Calibration-1 with an agent by checking out the [blueprint on GitHub](https://github.com/NVIDIA/Quantum-Calibration-Agent-Blueprint/).

## NVIDIA Ising Decoding[](#nvidia_ising_decoding)

Using the NVIDIA Ising Decoding training framework, QPU builders, operators, and decoder developers can train small 3D CNN AI decoders. Real-time operations that scale in both space and time help improve latency and logical error rates. These pre-decoders accelerate and improve decoder accuracy by handling a large quantity of localized syndrome errors. They can also scale to arbitrary code distances, helping teams deploy quantum error correction decoders that will scale with their QPUs all the way to lattice surgery.

Users need only define their noise model, the orientation of the rotated surface code, and model depth (deeper is more accurate). The training framework then uses the [cuStabilizer library](https://docs.nvidia.com/cuda/cuquantum/latest/custabilizer/index.html) within [NVIDIA cuQuantum](https://developer.nvidia.com/cuquantum-sdk) and [PyTorch](https://catalog.ngc.nvidia.com/orgs/nvidia/containers/pytorch?version=26.03-py3) to generate synthetic training data and train a 3D CNN that optimizes decoding performance for the task. Users can also opt for more or fewer layers, which creates a runtime and accuracy trade-off. The best CNN model depends on the code distance, physical error rate, global decoder effectiveness, and round-trip latency budget.

### Accuracy or speed: selecting the right base model[](#accuracy_or_speed_selecting_the_right_base_model)

Two base-model examples, optimized for either accuracy or speed, are available on [HuggingFace](https://huggingface.co/collections/nvidia/nvidia-ising).

Ising-Decoder-SurfaceCode-1-Fast has fewer layers, a receptive field of 9, and is trained on input volumes of size 9x9x9 (although arbitrary input volumes can be used during [inference](https://www.nvidia.com/en-us/glossary/ai-inference/)). This model has roughly 912,000 parameters. Due to its small size, it runs efficiently on a GPU but provides less improvement to the logical error rate (LER) compared to a larger model. The Fast pre-decoder plus [PyMatching](https://github.com/oscarhiggott/PyMatching) is 2.5x faster than PyMatching and 1.11x more accurate at d=13 for p=0.003.

[Ising-Decoder-SurfaceCode-1-Accurate](https://huggingface.co/nvidia/Ising-Decoder-SurfaceCode-1-Accurate) has more layers, a receptive field of 13, and is trained on input volumes of size 13x13x13. This model has roughly 1.79 million parameters. Given its larger size, it can correct larger error chains compared to the Fast decoder, but takes longer to run. As long as this end-to-end speed is in the desired range for the target QPU, the large improvement in LER may be worth the added runtime cost. The Accurate pre-decoder plus PyMatching is 2.25x faster than PyMatching and 1.53x more accurate than PyMatching for d=13 at p=0.003

Figure 2 shows the trade-off between fast and accurate models, compared to the minimum weight perfect matching (MWPM) baseline. It shows the ideal regime for deploying the pre-decoder model given some physical error rate and code distance. For example, the accurate model can deliver 3x improvement in LER at d=31 for p=0.003, when trained on d=13 data. 

![The trade-off of using either the fast or accurate pre-decoder on NVIDIA DGX GB300 + PyMatching on NVIDIA Grace Neoverse-V2 CPU compared to PyMatching alone, shows the code distance and physical error rate where the pre-decoder outperforms the global decoder on its own. ](https://developer-blogs.nvidia.com/wp-content/uploads/2026/04/Pre-decoder-1.webp)

_Figure 2. Fast and accurate pre-decoder run on NVIDIA DGX GB300 with PyMatching run on NVIDIA Grace Neoverse-V2 CPU_

This approach improves LER and latency across a range of noise models and supports Union Find, correlated matching, and machine-learning decoders as global decoders, enabling more scalable quantum error correction strategies.

We have also developed a real-time API built on [NVIDIA CUDA-Q QEC](https://nvidia.github.io/cudaqx/components/qec/introduction.html), [CUDAQ-Realtime](https://nvidia.github.io/cuda-quantum/blogs/blog/2026/03/16/launching-cudaq-realtime/), and [NVIDIA NVQLink](https://www.nvidia.com/en-us/solutions/quantum-computing/nvqlink/), designed to deliver the low latency needed for quantum computing. We have shown that for the Accurate model + PyMatching, GB300, FP16 Precision, physical error rate of 0.003, 104 rounds, surface code d=13, we can achieve 2.33 μs / round, providing a 2.25x speedup, and 1.53x improvement in LER. 

We projected that, given 13 GB300 GPUs, FP8 precision, physical error rate of 0.003, 1000 rounds, Surface code d=13, the fast model can achieve 0.11 μs / round. This pre-decoder model architecture is designed to accelerate and improve the accuracy of decoders, bringing us closer to useful fault-tolerant quantum computing. Read more in our [CUDA-Q QEC](https://nvidia.github.io/cuda-quantum/blogs/blog/2026/04/14/cudaq-qec-0.6/) blog post. 

Learn more about [NVIDIA Ising Decoder model architecture](https://research.nvidia.com/publication/2026-04_fast-ai-based-pre-decoders-surface-codes) and explore a wide range of analysis and results. 

## Start building with NVIDIA Ising open resources[](#start_building_with_nvidia_ising_open_resources)

The [NVIDIA Ising model family](https://developer.nvidia.com/ising) is fully open. Weights, training frameworks, data, benchmarks, and recipes are provided to enable others to modify, deploy, train, and fine-tune their own models and variants for their specific QPUs. 

### Model weights[](#model_weights)

Full parameter checkpoints for [Ising Calibration 1](https://huggingface.co/nvidia/NVIDIA-Ising-Calibration-1) and [Ising Decoder SurfaceCode 1](https://huggingface.co/nvidia/Ising-Decoder-SurfaceCode-1-Accurate) are available on Hugging Face, with Ising Calibration 1 also available through [NVIDIA NIM](https://catalog.ngc.nvidia.com/orgs/nim/teams/nvidia/containers/ising-calibration-1-35b-a3b) and [NVIDIA Build](https://build.nvidia.com/nvidia/ising-calibration-1-35b-a3b). The [NVIDIA Open Model License](https://www.nvidia.com/en-us/agreements/enterprise-software/nvidia-open-model-license/) gives QPU builders and operators the flexibility to maintain data control and deploy anywhere.

### Training framework[](#training_framework)

NVIDIA is releasing a complete training framework for [Ising Decoder SurfaceCode 1](https://github.com/NVIDIA/Ising-Decoding) that enables users to generate synthetic data with the NVIDIA cuQuantum library, NVIDIA [cuStabilizer](https://docs.nvidia.com/cuda/cuquantum/latest/custabilizer/index.html) on the fly, while training with [PyTorch](https://catalog.ngc.nvidia.com/orgs/nvidia/containers/pytorch?version=26.03-py3). This framework enables developers to produce decoder models tailored to their specific QPU noise characteristics. 

### Deployment recipes[](#deployment_recipes)

Ready-to-use cookbook and examples are available for major inference engines, each with configuration templates, performance tuning guidance, and reference scripts:

-   [Real-time decoding](https://nvidia.github.io/cudaqx/examples_rst/qec/realtime_predecoder_pymatching.html) is an example of running real-time pre-decoding with Decoder SurfaceCode 1 and PyMatching using NVIDIA TensorRT in CUDA-Q QEC. 
-   [Training a decoder](https://github.com/NVIDIA/Ising-Decoding/tree/tutorial) with Ising-Decoding, cuStabilizer, and PyTorch, and quantizing it. 
-   [Quantum calibration agent](https://github.com/NVIDIA/Quantum-Calibration-Agent-Blueprint/) is a script for deploying an agentic workflow using Ising Calibration 1 with the NVIDIA Nemo Agent Toolkit to quickly set up quantum calibration experiment automation.

### Fine-tuning and quantization recipes[](#fine-tuning_and_quantization_recipes)

Explore NVIDIA Ising customization cookbooks to quantize or fine-tune for a specific domain (LoRA/SFT) or advance its agentic reasoning capabilities (GRPO/DAPO):

-   [Quantization to FP8](https://github.com/NVIDIA/Ising-Decoding/tree/tutorial) for Ising-Decoder-SurfaceCode-1.

### Open datasets and QCalEval benchmark[](#open_datasets_and_qcaleval_benchmark)

NVIDIA Ising Calibration 1 is built on real QPU data provided by partners and collaborators. A semantic quantum calibration benchmark has also been released to evaluate model effectiveness for this task. 

-   The details on QCalEval are [available in this research paper](https://research.nvidia.com/publication/2026-04_qcaleval-benchmarking-vision-language-models-quantum-calibration-plot), with a script to run this on GitHub.
-   Review the data set on [HuggingFace](https://huggingface.co/datasets/nvidia/QCalEval).

## Get started[](#get_started)

NVIDIA Ising is available with the following resources for getting started:  Learn more about the fundamentals of [quantum error correction](https://www.nvidia.com/en-us/glossary/quantum-error-correction/).

-   [Ising Decoding](https://github.com/NVIDIA/Ising-Decoding) training framework and cookbook GitHub under Apache 2.0. 
-   Ising Calibration NIM: available on [build.nvidia.com](https://build.nvidia.com/nvidia/ising-calibration-1-35b-a3b) and the [NVIDIA NGC Catalog](https://catalog.ngc.nvidia.com/orgs/nim/teams/nvidia/containers/ising-calibration-1-35b-a3b). 
-   [Ising Calibration](https://github.com/NVIDIA/Quantum-Calibration-Agent-Blueprint/) agentic workflow and cookbook GitHub under Apache 2.0.
