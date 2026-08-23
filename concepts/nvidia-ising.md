---
title: "NVIDIA Ising"
date: 2026-04-18
domain: quantum-computing
maturity: emerging
source_type: announcement
tags: [concept, quantum-computing, ai-infrastructure, nvidia, open-source, domain/quantum-computing, maturity/emerging, source-type/announcement]
status: draft
sources:
  - url: https://nvidianews.nvidia.com/news/nvidia-launches-ising-the-worlds-first-open-ai-models-to-accelerate-the-path-to-useful-quantum-computers
    hash: sha256:f3c649a2ac85cc13f03b695744afd09138d052266868f2a7a4899f00aaed14ce
    retrieved: 2026-08-21
    class: unclassified
    reachability: ok
  - url: https://developer.nvidia.com/blog/nvidia-ising-introduces-ai-powered-workflows-to-build-fault-tolerant-quantum-systems/
    hash: sha256:afaafa3d3566e59e4314d305901f7899252480a6f70a9f26d53050e91caf9cc2
    retrieved: 2026-08-21
    class: unclassified
    reachability: ok
  - url: https://thequantuminsider.com/2026/04/14/nvidia-launches-ising-the-worlds-first-open-ai-models-to-accelerate-the-path-to-useful-quantum-computers/
    hash: sha256:bd8cc1c7c2086c1433e89aedf4e050f6653ef7279e8624f974b7c6c7ff74fe50
    retrieved: 2026-08-21
    class: unclassified
    reachability: ok
---

# NVIDIA Ising

## Definition
NVIDIA Ising is the world's first open-source family of AI models purpose-built for quantum computing, launched in April 2026. It targets the two fundamental bottlenecks to useful quantum computers: **processor calibration** and **quantum error correction decoding**. The name honours the Ising model, a foundational mathematical framework that simplified understanding of complex physical systems (ferromagnetism, phase transitions).

## Explanation
Quantum processors are inherently noisy — current best-in-class QPUs make an error roughly once per thousand operations. To become useful accelerators, error rates must drop to one in a trillion or better. NVIDIA Ising addresses two stages of this problem:

- **Ising Calibration**: A 35B-parameter vision-language model (VLM) trained on data from multiple qubit modalities (superconducting qubits, quantum dots, ions, neutral atoms, electrons on helium). It interprets graphical measurement outputs from quantum processors and drives an AI agent that continuously calibrates the QPU — reducing setup time from days to hours. Benchmarked via QCalEval (NVIDIA's purpose-built evaluation suite, developed with quantum partners).

- **Ising Decoding**: Two 3D convolutional neural network (CNN) variants — one optimised for speed (~912K parameters), one for accuracy — that perform real-time quantum error correction decoding. Achieves 2.5× faster and 3× more accurate results compared to pyMatching, the current open-source standard.

Both models are open-source, fine-tuneable, and can run locally so that proprietary QPU data never leaves a research facility.

## Key Properties
- **Open source**: Models, training data, tools, and cookbooks all released on HuggingFace under open licences
- **Dual architecture**: VLM for calibration; 3D CNN for decoding — different model classes serving different real-time roles
- **Fine-tunable**: Pre-trained base models work out of the box; researchers can specialise for their hardware/noise profile
- **Integrated into NVIDIA quantum stack**: CUDA-Q (hybrid quantum-classical SDK), NVQLink (QPU-GPU interconnect), NIM microservices for deployment
- **Broad ecosystem adoption at launch**: IonQ, IQM, Atom Computing, Infleqtion, Q-CTRL, Harvard, Cornell, Sandia National Labs, UC Santa Barbara, and others

## Relationships
- Implements [[ai-as-control-plane]]: AI models act as the operating system/control layer for physical quantum hardware
- Targets [[quantum-error-correction]]: Ising Decoding specifically accelerates the decoding stage of QEC
- Targets [[quantum-processor-calibration]]: Ising Calibration automates the QPU tuning workflow
- Related to [[agentic-decision-intelligence]]: The calibration model drives an autonomous feedback loop with minimal human oversight
- Related to [[constrained-agent-actions]]: The calibration agent has a bounded action space (tuning parameters within hardware-safe ranges)

## Applications
- **QPU builders and operators**: Fine-tune base models for their specific hardware to reduce time-to-useful-quantum
- **Research labs**: Run calibration agents that continuously tune QPUs overnight instead of manual tuning over days
- **Decoder developers**: Build error correction decoders that scale from current code distances to lattice surgery
- **Platform insight**: Open-source model strategy while monetising hardware stack (CUDA-Q, NVQLink, Grace Blackwell GPUs) — classic "give away the software, sell the silicon"

## Study
- Flashcards: [[flashcards/nvidia-ising|Practice this concept]]

## Sources
- [NVIDIA Newsroom — Ising Launch](https://nvidianews.nvidia.com/news/nvidia-launches-ising-the-worlds-first-open-ai-models-to-accelerate-the-path-to-useful-quantum-computers) — official announcement, ecosystem partners
- [NVIDIA Technical Blog — Ising Deep Dive](https://developer.nvidia.com/blog/nvidia-ising-introduces-ai-powered-workflows-to-build-fault-tolerant-quantum-systems/) — model architecture, QCalEval benchmark, decoding framework details
- [The Quantum Insider](https://thequantuminsider.com/2026/04/14/nvidia-launches-ising-the-worlds-first-open-ai-models-to-accelerate-the-path-to-useful-quantum-computers/) — market context, Jensen Huang quotes

## See Also
- [[ai-as-control-plane]]
- [[quantum-error-correction]]
- [[quantum-processor-calibration]]
- Hybrid Quantum Classical Computing
