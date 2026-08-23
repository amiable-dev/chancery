---
tags: [flashcards, quantum-computing, calibration, vlm, automation]
sr-due: 2026-04-18
sr-interval: 1
sr-ease: 250
---

# Quantum Processor Calibration — Flashcards

#flashcards/quantum-computing

## Definition <!-- kb:card:85ee50 -->
What is quantum processor calibration?
?
The process of characterising and fine-tuning a QPU's physical parameters (drive frequencies, pulse shapes, coupling strengths, readout thresholds) to minimise noise and maximise gate fidelity. Because qubits drift over time, calibration must be repeated continuously — not just during initial setup.

## Traditional vs AI-Driven <!-- kb:card:9eae9a -->
How does AI-driven calibration differ from traditional calibration?
?
Traditional: engineers run characterisation experiments, manually interpret result plots, adjust parameters — takes days for large QPUs. AI-driven (Ising Calibration): a VLM interprets measurement plot images and drives an agentic loop that applies parameter changes autonomously — collapses days to hours.

## VLM Benchmark <!-- kb:card:279623 -->
What is QCalEval and what does it measure?
?
QCalEval is NVIDIA's purpose-built benchmark for evaluating quantum calibration models — the first of its kind. It tests six capabilities: interpreting experimental results, classifying outcomes, evaluating significance, assessing fit quality, identifying key features, and generating actionable next-step recommendations using real quantum computer outputs.

## Specialist vs General <!-- kb:card:7fd6d5 -->
Why does Ising-Calibration-1 outperform frontier general-purpose LLMs on calibration tasks?
?
Domain specialisation: it was trained specifically on real experimental outputs from multiple qubit modalities (superconducting, trapped-ion, neutral atom, quantum-dot). On QCalEval, it outperforms Gemini 3.1 Pro (+3.27%), Claude Opus 4.6 (+9.68%), and GPT 5.4 (+14.5%) despite being smaller (35B).

## Relationship <!-- kb:card:ba6b9c -->
How does calibration quality affect quantum error correction effectiveness?
?
Better calibrated QPUs have lower physical error rates. Since QEC suppression scales with code distance only if physical errors are below the threshold (~1%), calibration directly determines how much QEC overhead is needed to reach fault tolerance — lower physical error rate = smaller code distances = fewer physical qubits needed.
