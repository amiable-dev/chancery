---
tags: [flashcards, quantum-computing, nvidia, ai-infrastructure]
sr-due: 2026-04-18
sr-interval: 1
sr-ease: 250
---

# NVIDIA Ising — Flashcards

#flashcards/quantum-computing

## Definition <!-- kb:card:919b43 -->
What is NVIDIA Ising?
?
The world's first open-source family of AI models for quantum computing, launched April 2026. It targets the two key bottlenecks to useful quantum computers: processor calibration (Ising Calibration, a VLM) and error correction decoding (Ising Decoding, 3D CNNs). Named after the Ising mathematical model.

## Performance <!-- kb:card:36ca89 -->
What are the headline performance numbers for NVIDIA Ising Decoding vs pyMatching?
?
2.5× faster and 3× more accurate at quantum error correction decoding compared to pyMatching, the current open-source standard.

## Architecture <!-- kb:card:8d8872 -->
What model type powers Ising Calibration vs Ising Decoding?
?
Ising Calibration: 35B-parameter Vision-Language Model (VLM) — interprets calibration plot images and drives an autonomous agent. Ising Decoding: Two 3D CNN variants (one speed-optimised ~912K params, one accuracy-optimised) for real-time syndrome decoding.

## Strategy <!-- kb:card:c075ff -->
What is NVIDIA's open-source strategy with Ising, and what does it protect?
?
Open-source the models, training data, and tools (give away software), while keeping the hardware stack proprietary (CUDA-Q, NVQLink, Grace Blackwell GPUs — sell the silicon). Models also run locally, protecting proprietary QPU data.

## Application <!-- kb:card:264ea3 -->
How does NVIDIA Ising Calibration change the calibration workflow?
?
It replaces multi-day manual calibration cycles with an agentic loop: the VLM interprets measurement outputs, recommends parameter changes, and the agent applies them continuously — reducing setup time from days to hours.
