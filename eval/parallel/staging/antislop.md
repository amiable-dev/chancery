# GitHub - skew202/antislop: A blazing-fast, multi-language linter for detecting AI-generated code slop

**Source:** https://github.com/skew202/antislop
**Added:** 2026-08-24
**Tags:** #unsorted

---

> A blazing-fast, multi-language linter for detecting AI-generated code slop - skew202/antislop

---

[![CI](https://github.com/skew202/antislop/actions/workflows/ci.yml/badge.svg)](https://github.com/skew202/antislop/actions/workflows/ci.yml) [![Crates.io](https://camo.githubusercontent.com/00fc5ae8648dcdeba85cdbe4d58c616a1d19cf552660be958bbabe987e004b96/68747470733a2f2f696d672e736869656c64732e696f2f6372617465732f762f616e7469736c6f702e737667)](https://crates.io/crates/antislop) [![npm](https://camo.githubusercontent.com/4355014d78de9a920cd52059c05bba704266a16ba9ad7f2685e0c1d6bf6e84bc/68747470733a2f2f696d672e736869656c64732e696f2f6e706d2f762f616e7469736c6f702e737667)](https://www.npmjs.com/package/antislop) [![Docs](https://camo.githubusercontent.com/7b57f104a4671dee681d247e9ea01073337e49d24b7f08cf144fe327aad6b31d/68747470733a2f2f696d672e736869656c64732e696f2f62616467652f646f63732d6c61746573742d626c75652e737667)](https://skew202.github.io/antislop/) [![License](https://camo.githubusercontent.com/e89efb1f812bc1589fc160ac2364506bb3d82cf867d7e5694f637923fb86772b/68747470733a2f2f696d672e736869656c64732e696f2f62616467652f6c6963656e73652d4d49542532464170616368652d2d322e302d626c75652e737667)](https://github.com/skew202/antislop)

**A blazing-fast, multi-language linter for detecting AI-generated code slop.**

AntiSlop helps you maintain code quality by identifying lazily generated code, deferrals, hedging, and placeholders often left behind by AI coding assistants.

## What is Slop?

[](#what-is-slop)

AI models often produce code that works but is littered with signs of hesitation or incompleteness. AntiSlop detects:

-   **Placeholders**: `TODO`, `FIXME`, `HACK`, `XXX` comments
-   **Deferrals**: "for now", "temporary fix", "quick implementation"
-   **Hedging**: "hopefully", "should work", "assumes"
-   **Stubs**: Empty functions or macro stubs like `todo!()`
-   **Noise**: Redundant comments like `// increments i`

## Philosophy

[](#philosophy)

AntiSlop is built on **First Principles**:

1.  **Code is Liability**: Every line of code is a future maintenance cost.
2.  **Intent != Implementation**: Comments like `TODO` or `for now` signal a gap between what was intended and what was built.
3.  **Speed is a Feature**: Verification must be instant to be useful.

We believe that AI generated code should be treated with **Zero Trust**. Verify everything.

### Pattern Hygiene (Orthogonal)

[](#pattern-hygiene-orthogonal)

We follow a **Mutually Exclusive, Collectively Exhaustive** strategy with standard linters like MegaLinter.

-   **AntiSlop**: Detects AI shortcuts (stubs, hallucinated API usage, hedging).
-   **Standard Linters**: Detect syntax errors, style issues, and bugs.
-   **Rule**: If `eslint` or `clippy` catches it by default, AntiSlop will **not** cover it (unless explicitly whitelisted).

## Comparison

[](#comparison)

Feature

AntiSlop

Standard Linters (ESLint/Clippy)

AI Refactors

**Focus**

**Intent & Completeness**

Syntax & Best Practices

Improvements

**Speed**

**Milliseconds**

Seconds/Minutes

Slow

**Parsing**

**Hybrid (Regex + AST)**

AST Only

AST/LLM

**Target**

**AI Slop**

Bugs/Style

Refactoring

**LSP**

**Yes**

Yes

Sometimes

## Demo

[](#demo)

**The Problem**: Your AI assistant generated this code. It passes `eslint`, `clippy`, and all your linters. But look closer...

[![AntiSlop Demo](https://github.com/skew202/antislop/raw/main/.marketing/assets/many_findings.png)](https://github.com/skew202/antislop/blob/main/.marketing/assets/many_findings.png)

**AntiSlop catches what linters miss:**

```
$ antislop --profile antislop-standard api/

api/metrics.py 2:5: MEDIUM [placeholder]
  │ Placeholder: TODO comment
  │
  1 │ def calculate_user_metrics(user_id: str) -> dict:
  2 │     # TODO: implement actual metrics calculation
          ^^^^
  3 │     # For now, just return dummy data

api/metrics.py 3:5: HIGH [deferral]
  │ Deferral: 'for now' indicates incomplete implementation
  │
  2 │     # TODO: implement actual metrics calculation
  3 │     # For now, just return dummy data
          ^^^^^^^
  4 │     # This should work in most cases

api/metrics.py 4:5: MEDIUM [hedging]
  │ Hedging: 'should work' expresses uncertainty
  │
  3 │     # For now, just return dummy data
  4 │     # This should work in most cases
          ^^^^^^^^^^^^
  5 │     return {"score": 42, "level": "gold"}  # Placeholder values

api/metrics.py 5:47: HIGH [stub]
  │ Stub: placeholder/dummy data detected
  │
  4 │     # This should work in most cases
  5 │     return {"score": 42, "level": "gold"}  # Placeholder values
                                                    ^^^^^^^^^^^
  6 │

────────────────────────────────────────────────────────────
📁 12 scanned, 1 with findings
⚠ 4 total findings
💀 85 sloppy score

  By severity: 2 HIGH 2 MEDIUM 

⚠⚠⚠ High slop detected - AI shortcuts found!
```

**Zero false positives. Maximum signal.** AntiSlop finds the intent gaps that syntax checkers can't see.

## Performance

[](#performance)

AntiSlop uses tree-sitter AST parsing for accurate detection. Regex-only mode is ~10x faster.

Language

Mode

Time

Throughput

**Python**

AST

**4.0 ms**

416 KiB/s

**JavaScript**

AST

**1.5 ms**

856 KiB/s

**TypeScript**

AST

**4.9 ms**

381 KiB/s

**Go**

AST

**1.3 ms**

1.2 MiB/s

**Rust**

AST

**3.6 ms**

606 KiB/s

**Python**

Regex

**0.47 ms**

—

**Rust**

Regex

**0.54 ms**

—

**Scaling:**

Lines

Time

1,000

**10.5 ms**

10,000

**78 ms**

50,000

**392 ms**

_Benchmarks run on standard laptop hardware (Linux x86\_64). Run `cargo bench` to reproduce._

## Installation

[](#installation)

### From Pre-built Binaries (Recommended)

[](#from-pre-built-binaries-recommended)

# via npm (downloads platform-specific binary)
npm install -g antislop

# via cargo-dist (Shell)
curl --proto '\=https' --tlsv1.2 -LsSf https://github.com/skew202/antislop/releases/latest/download/antislop-installer.sh | sh

# via Homebrew
brew install skew202/tap/antislop

# via PowerShell
powershell -c "irm https://github.com/skew202/antislop/releases/latest/download/antislop-installer.ps1 | iex"

### From Source

[](#from-source)

cargo install antislop

## Usage

[](#usage)

# Scan current directory
antislop

# Scan specific paths
antislop src/ tests/

# JSON output (for integration)
antislop --json

# Custom config
antislop -c custom-config.toml

# Run hygiene survey (detect linters, formatters, CI/CD)
antislop --hygiene-survey

### Profiles

[](#profiles)

AntiSlop follows a **Zero False Positive** philosophy for its default core.

-   **Core** (Default): Critical stubs & placeholders only. Zero false positives.
-   **trict** (`--profile antislop-strict`): Maximum coverage. Detects all forms of slop.
-   **Standard** (`--profile antislop-standard`): **Recommended Baseline**. Adds checks for deferrals ("for now"), hedging ("should work"), and dummy data.
-   **Strict** (`--profile antislop-strict`): Maximum coverage.

# Recommended for most projects
antislop --profile antislop-standard src/

Profile

Focus

Best For

**Core**

`TODO`, `FIXME`, Stubs

CI Pipelines (Blocker)

**Standard**

\+ Deferrals, Hedging, Mock Data

Daily Development

**Strict**

\+ Nitpicks, Style Enforced

Code Audits

### CI/CD Integration

[](#cicd-integration)

**GitHub Actions Example:**

jobs:
  antislop:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - name: Install AntiSlop
        run: curl -sSf https://raw.githubusercontent.com/skew202/antislop/main/install.sh | sh
      - name: Run Scan
        run: antislop --profile antislop-standard .

## Installation Options

[](#installation-options)

AntiSlop is modular. You can optimize for binary size by choosing specific languages:

# Default (Standard Languages)
cargo install antislop

# Minimal (Regex only, no AST)
cargo install antislop --no-default-features --features parallel

# Specific Languages (Tiny binary)
cargo install antislop --no-default-features --features python,rust

# All Languages (inc. C#, PHP, Ruby, Kotlin, etc.)
cargo install antislop --features all-langs

## Configuration

[](#configuration)

Create `antislop.toml` in your project root to customize patterns:

file\_extensions = \[".py", ".rs", ".js", ".ts"\]

\[\[patterns\]\]
regex = "(?i)TODO:"
severity = "medium"
message = "Placeholder comment found"
category = "placeholder"

## Language Support

[](#language-support)

Language

Extension

Support Level

C/C++

`.c`, `.cpp`

Full (AST + Regex)

C#

`.cs`

Full (AST + Regex)

Go

`.go`

Full (AST + Regex)

Haskell

`.hs`

Full (AST + Regex)

Java

`.java`

Full (AST + Regex)

JavaScript

`.js`

Full (AST + Regex)

Kotlin

`.kt`

Regex Only

Lua

`.lua`

Full (AST + Regex)

Perl

`.pl`

Regex Only

PHP

`.php`

Regex Only

Python

`.py`

Full (AST + Regex)

R

`.r`

Regex Only

Ruby

`.rb`

Full (AST + Regex)

Rust

`.rs`

Full (AST + Regex)

Scala

`.scala`

Full (AST + Regex)

Swift

`.swift`

Regex Only

TypeScript

`.ts`

Full (AST + Regex)

## License

[](#license)

Licensed under either of

-   Apache License, Version 2.0 ([LICENSE-APACHE](https://github.com/skew202/antislop/blob/main/LICENSE-APACHE) or [http://www.apache.org/licenses/LICENSE-2.0](http://www.apache.org/licenses/LICENSE-2.0))
-   MIT license ([LICENSE-MIT](https://github.com/skew202/antislop/blob/main/LICENSE-MIT) or [http://opensource.org/licenses/MIT](http://opensource.org/licenses/MIT))

at your option.

### Contribution

[](#contribution)

Unless you explicitly state otherwise, any contribution intentionally submitted for inclusion in the work by you, as defined in the Apache-2.0 license, shall be dual licensed as above, without any additional terms or conditions.
