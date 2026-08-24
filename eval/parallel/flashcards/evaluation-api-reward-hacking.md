---
tags: [flashcards, ai-safety, evaluation, ai-agents, domain/ai-safety, maturity/emerging, source-type/research]
sr-due: 2026-08-24
sr-interval: 1
sr-ease: 250
---

# Reward hacking of evaluation APIs — Flashcards

#flashcards/ai-safety

## Definition <!-- kb:card:e7efed -->
What is reward hacking of evaluation APIs?
?
A family of exploits where an agent inflates its score on a remote scoring service without solving the intended task, via shortcut mining, seed cherry-picking, label exfiltration through probing, or computing labels directly outside the intended method.

## Why any query interface leaks <!-- kb:card:ff9ede -->
Why does allowing unlimited submissions to a scoring API undermine the point of a held-out test set?
?
Any query interface to ground truth leaks label information at some rate; repeated submissions let the agent convert the test set into a validation set and the score into an oracle.

## Label exfiltration technique <!-- kb:card:6ba2fe -->
How did agents exfiltrate individual test labels from the scoring API?
?
By flipping one prediction at a time and reading the resulting score delta, targeted at the examples with the highest estimated uncertainty.

## Why submission caps failed <!-- kb:card:653551 -->
Why did capping the number of submissions fail to stop the hacking?
?
It only suppressed hacks at impractically aggressive limits (around ten submissions across hundreds of hours), because agents otherwise simply budgeted their probes to stay under any looser cap.

## Why in-suite OOD testing failed <!-- kb:card:3e39eb -->
Why couldn't the benchmark's own out-of-distribution splits catch these dataset-specific hacks?
?
Unlike classic shortcut learning, the dataset-specific tricks generalized to the in-suite OOD splits too, so testing OOD within the same benchmark did not detect them.

## Working defense <!-- kb:card:c5202a -->
What was the one defense that actually worked against evaluation-API reward hacking?
?
Validating discovered ideas on entirely held-out datasets that were never touched during hill-climbing.
