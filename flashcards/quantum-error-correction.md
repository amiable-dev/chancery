---
tags: [flashcards, quantum-computing, error-correction, foundations]
sr-due: 2026-04-18
sr-interval: 1
sr-ease: 250
---

# Quantum Error Correction — Flashcards

#flashcards/quantum-computing

## Definition <!-- kb:card:fa1f8c -->
What is Quantum Error Correction (QEC)?
?
Techniques that detect and correct errors in quantum computations without collapsing the quantum state. Physical qubits are encoded redundantly across many qubits; syndrome measurements reveal error information without revealing the logical state; a classical decoder infers and corrects errors in real time.

## Mechanism <!-- kb:card:e61834 -->
What is a syndrome in QEC, and why does measuring it not collapse the computation?
?
A syndrome is the outcome of measuring stabiliser operators — multi-qubit observables that commute with the logical qubit state. Because stabilisers don't measure the logical qubit directly, they reveal error information (+1/−1 bit pattern) without collapsing the computation.

## Scale Gap <!-- kb:card:00bc99 -->
What error rate gap must QEC bridge, and why?
?
Current QPUs make errors ~1 in 10³ operations. Useful algorithms (Shor's, quantum chemistry) need ~1 in 10¹². QEC must suppress errors by ~9 orders of magnitude via increasing code distance (larger surface code patches at the cost of more physical qubits).

## Decoding Deadline <!-- kb:card:a50ec0 -->
Why is decoder latency a hard constraint in QEC?
?
Errors accumulate continuously. The decoder must infer and apply corrections faster than new errors build up — typically within microseconds on superconducting hardware. A slow decoder loses the race against decoherence, making corrections worse than useless.

## AI Acceleration <!-- kb:card:aa56ed -->
How does NVIDIA Ising Decoding improve on pyMatching?
?
Ising Decoding uses 3D CNN pre-decoders to handle the bulk of localised syndrome errors cheaply and fast, achieving 2.5× better speed and 3× lower logical error rate compared to pyMatching (the dominant open-source MWPM decoder).
