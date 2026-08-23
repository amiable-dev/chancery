---
sr-due: 2026-04-14
sr-ease: 250
sr-interval: 1
tags:
- flashcards
- ast
- code-analysis
- static-analysis
---


# AST-Based Code Analysis — Flashcards

#flashcards/ast


## Definition <!-- kb:card:dccadb -->
What is AST-based code analysis?
?
A static analysis technique that parses source code into an Abstract Syntax Tree, then traverses that tree to extract code entities (functions, classes, imports), their relationships (calls, inheritance, references), and structural properties — without executing the code.

## Mechanism <!-- kb:card:bd98ae -->
What does Tree-sitter enable in AST-based analysis that makes it practical for large codebases?
?
Incremental, error-tolerant parsing: only changed sub-trees are re-parsed, enabling sub-second graph updates even on codebases with thousands of files. It also provides a single library supporting 100+ languages.

## Application <!-- kb:card:f81bf0 -->
When would you use AST-based code analysis instead of reading raw source files?
?
When an AI assistant needs codebase context: instead of feeding raw files (expensive in tokens), extract structural summaries — function signatures, call graphs, dependency edges — that carry the same semantic signal at a fraction of the token cost.

## Limitation <!-- kb:card:80b5cc -->
What can AST-based code analysis NOT detect?
?
Runtime-only relationships: dynamic dispatch, monkey-patching, reflection-generated calls, and runtime polymorphism. These require dynamic analysis (executing the code) to observe. AST analysis is purely structural.

## Relationship <!-- kb:card:a22a18 -->
How does AST-based code analysis relate to blast-radius dependency tracing?
?
AST analysis produces the call graph and import graph that blast-radius tracing traverses. Without the AST-derived graph, you have no edges to follow when computing which files are affected by a change.
