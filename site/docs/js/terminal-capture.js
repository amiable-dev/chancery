/* GENERATED — real CLI output, captured 2026-08-24.
 * capture 1: kb verify --format human, this repository.
 * capture 2: kb sources --apply + kb revalidate against https://httpbin.org/uuid
 *            (content changes per fetch, so the drift is genuine).
 * Regenerate: node site/capture/capture-terminal.mjs */
window.KBL_TERMINAL = {
  "captured": "2026-08-24",
  "source": "https://httpbin.org/uuid",
  "lines": [
    [
      "$ ",
      "#53d6c2",
      "kb verify",
      "#e8ecf4"
    ],
    [
      "",
      "#fff",
      "PASS — 486 files checked, 0 error(s), 251 warning(s)",
      "#33d6c2"
    ],
    [
      "",
      "#fff",
      " ",
      "#c5d0e2"
    ],
    [
      "$ ",
      "#53d6c2",
      "kb revalidate",
      "#e8ecf4"
    ],
    [
      "  ",
      "#fff",
      "checked 1 url(s) across 1 concept(s)",
      "#c5d0e2"
    ],
    [
      "  ",
      "#fff",
      "1 drifted, 0 newly unreachable",
      "#c5d0e2"
    ],
    [
      "  ✗ ",
      "#ff7a8a",
      "DRIFT  drift-demo  https://httpbin.org/uuid  (baseline 2026-08-24)",
      "#c5d0e2"
    ],
    [
      "→ ",
      "#53d6c2",
      "queued for review — accept a new baseline with `kb revalidate --accept <slug>`",
      "#7f8ba0"
    ]
  ]
};
