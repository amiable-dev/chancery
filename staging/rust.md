# antislop - Rust

**Source:** https://docs.rs/antislop/latest/antislop/
**Added:** 2026-08-24
**Tags:** #unsorted

---

> antislop

---

Expand description

A blazing-fast, multi-language linter for detecting AI-generated code slop.

Antislop identifies lazy placeholders, hedging language, stubs, and deferrals commonly produced by quantized or rushed LLMs.

### [§](#example)Example

```
use antislop::{Config, Scanner};

let config = Config::default();
let scanner = Scanner::new(config.patterns).unwrap();
let content = "def foo():\n    # TODO: implement\n    pass\n";
let result = scanner.scan_file("example.py", content);
```

### [§](#slop-categories)Slop Categories

-   **Placeholder**: TODO, FIXME, HACK, NOTE, XXX comments
-   **Deferral**: “for now”, “temporary”, “quick implementation”
-   **Hedging**: “hopefully”, “should work”, “this is a simple”
-   **Stub**: Empty functions near placeholder comments

[config](https://docs.rs/antislop/latest/antislop/config/index.html "mod antislop::config")

Configuration loading and management.

[detector](https://docs.rs/antislop/latest/antislop/detector/index.html "mod antislop::detector")

Slop detection engine.

[filename\_checker](https://docs.rs/antislop/latest/antislop/filename_checker/index.html "mod antislop::filename_checker")

Filename convention checking.

[profile](https://docs.rs/antislop/latest/antislop/profile/index.html "mod antislop::profile")

Community profiles for antislop.

[report](https://docs.rs/antislop/latest/antislop/report/index.html "mod antislop::report")

Reporting and output formatting.

[walker](https://docs.rs/antislop/latest/antislop/walker/index.html "mod antislop::walker")

Parallel file traversal with gitignore support.

[Comment](https://docs.rs/antislop/latest/antislop/struct.Comment.html "struct antislop::Comment")

A comment extracted from source code.

[Config](https://docs.rs/antislop/latest/antislop/struct.Config.html "struct antislop::Config")

Main configuration structure.

[FileScanResult](https://docs.rs/antislop/latest/antislop/struct.FileScanResult.html "struct antislop::FileScanResult")

Result of scanning a single file.

[FilenameCheckConfig](https://docs.rs/antislop/latest/antislop/struct.FilenameCheckConfig.html "struct antislop::FilenameCheckConfig")

Configuration for filename checking behavior.

[FilenameChecker](https://docs.rs/antislop/latest/antislop/struct.FilenameChecker.html "struct antislop::FilenameChecker")

Filename convention analyzer.

[Finding](https://docs.rs/antislop/latest/antislop/struct.Finding.html "struct antislop::Finding")

A single slop finding.

[Pattern](https://docs.rs/antislop/latest/antislop/struct.Pattern.html "struct antislop::Pattern")

A single slop detection pattern.

[Profile](https://docs.rs/antislop/latest/antislop/struct.Profile.html "struct antislop::Profile")

A community profile containing slop detection patterns.

[ProfileLoader](https://docs.rs/antislop/latest/antislop/struct.ProfileLoader.html "struct antislop::ProfileLoader")

Profile loader with support for multiple sources.

[Reporter](https://docs.rs/antislop/latest/antislop/struct.Reporter.html "struct antislop::Reporter")

Reporter for scan results.

[ScanSummary](https://docs.rs/antislop/latest/antislop/struct.ScanSummary.html "struct antislop::ScanSummary")

Summary of a scan operation.

[Scanner](https://docs.rs/antislop/latest/antislop/struct.Scanner.html "struct antislop::Scanner")

The main scanner.

[Walker](https://docs.rs/antislop/latest/antislop/struct.Walker.html "struct antislop::Walker")

Parallel file walker.

[Error](https://docs.rs/antislop/latest/antislop/enum.Error.html "enum antislop::Error")

Error types for antislop.

[Format](https://docs.rs/antislop/latest/antislop/enum.Format.html "enum antislop::Format")

Output format.

[PatternCategory](https://docs.rs/antislop/latest/antislop/enum.PatternCategory.html "enum antislop::PatternCategory")

Category of slop pattern.

[ProfileSource](https://docs.rs/antislop/latest/antislop/enum.ProfileSource.html "enum antislop::ProfileSource")

Source for loading a profile.

[Severity](https://docs.rs/antislop/latest/antislop/enum.Severity.html "enum antislop::Severity")

Severity level for a slop finding.

[CONFIG\_FILES](https://docs.rs/antislop/latest/antislop/constant.CONFIG_FILES.html "constant antislop::CONFIG_FILES")

Default configuration file names.

[VERSION](https://docs.rs/antislop/latest/antislop/constant.VERSION.html "constant antislop::VERSION")

Version information.

[Result](https://docs.rs/antislop/latest/antislop/type.Result.html "type antislop::Result")

Result type for antislop operations.
