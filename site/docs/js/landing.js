/* chancery landing interactions (design_handoff_chancery_brand):
   gate terminal (380ms type-in, replay), the two-phase stepper.
   Data is the handoff's final copy, with commands corrected to the
   published package (@amiable-dev/chancery) and renamed repo. */
(function () {
  function init() {
    // ---- terminal ----
    var termBody = document.getElementById('kbl-term-body');
    if (termBody) {
      var LINES = [
        ['$ ', '#53d6c2', 'kb verify', '#e8ecf4'],
        ['  ✓ ', '#33d6c2', 'schema      480 files', '#c5d0e2'],
        ['  ✓ ', '#33d6c2', 'links       1,912 graph edges', '#c5d0e2'],
        ['  ✓ ', '#33d6c2', 'index       244 concepts, regenerated clean', '#c5d0e2'],
        ['  ✓ ', '#33d6c2', 'cards       1,240 stable ids', '#c5d0e2'],
        ['  ✗ ', '#ff7a8a', 'citations   2 sources drifted since ingest', '#c5d0e2'],
        ['', '#fff', ' ', '#c5d0e2'],
        ['', '#fff', 'verify: FAIL (exit 1) — evidence drifted, not just links dead', '#ff7a8a'],
        ['→ ', '#53d6c2', 'kb revalidate   · deterministic · no model · no network', '#7f8ba0'],
      ];
      var timer = null;
      function render(n) {
        termBody.innerHTML = '';
        for (var i = 0; i < n; i++) {
          var d = document.createElement('div');
          d.className = 'ln';
          var m = document.createElement('span'); m.style.color = LINES[i][1]; m.textContent = LINES[i][0];
          var t = document.createElement('span'); t.style.color = LINES[i][3]; t.textContent = LINES[i][2];
          d.appendChild(m); d.appendChild(t); termBody.appendChild(d);
        }
        var caret = document.createElement('span'); caret.className = 'kbl-caret';
        termBody.appendChild(caret);
      }
      function play() {
        clearInterval(timer);
        var n = 0; render(0);
        timer = setInterval(function () {
          n++; render(n);
          if (n >= LINES.length) clearInterval(timer);
        }, 380);
      }
      var replay = document.getElementById('kbl-term-replay');
      if (replay) replay.addEventListener('click', play);
      play();
    }

    // ---- stepper ----
    var stepperRoot = document.getElementById('kbl-stepper-root');
    if (stepperRoot) {
      var STAGES = [
        { n: '1', label: 'ingest', kicker: 'untrusted inflow', title: 'kb ingest', color: '#19b3a1',
          desc: 'Every source lands in staging/ with its content hashed into an append-only evidence store. Nothing enters canon directly — on any interface.',
          code: '$ kb ingest https://example.com/attention-sinks\n→ staging/attention-sinks.md   (sha256 pinned, evidence stored)' },
        { n: '2', label: 'assess', kicker: 'phase 1 — emit the task', title: 'kb assess', color: '#4289c3',
          desc: 'Commands that need judgment never call a model. Phase 1 emits a self-contained task envelope: the note, the rubric, the bounds an answer must respect.',
          code: '$ kb assess staging/attention-sinks.md\n→ task.json   (rubric: promotion@3 · knockouts checked first)' },
        { n: '3', label: 'your agent', kicker: 'judgment — outside kb', title: 'Your agent answers', color: '#7c3aed',
          desc: 'Claude Code, a council, a human — any schema-conforming supplier. Judgment belongs to the model; kb stays deterministic and never picks a supplier.',
          code: '# your harness, your model\nagent < task.json > answer.json' },
        { n: '4', label: 'apply', kicker: 'phase 2 — validate & apply', title: 'kb assess --verdict', color: '#5848c7',
          desc: 'The answer is schema-validated and applied by rule. Stale, replayed, or out-of-bounds verdicts are refused; a discard is a recommendation, never a deletion.',
          code: '$ kb assess staging/attention-sinks.md --verdict answer.json\n→ promote   (knockouts: none · the apply verifies itself)' },
        { n: '5', label: 'verify', kicker: 'the contract', title: 'kb verify', color: '#6b19ca',
          desc: 'CI re-checks everything deterministically — schema, links, index, cards — with no API keys and no network. Only then is the note canon.',
          code: '$ kb verify\n480 files · schema ✓ links ✓ index ✓ cards ✓   (~1s, hermetic)' },
      ];
      var active = 0;
      function paint() {
        var s = STAGES[active];
        var row = document.getElementById('kbl-stepper');
        row.innerHTML = '';
        STAGES.forEach(function (st, i) {
          var b = document.createElement('button');
          b.className = 'kbl-step' + (i === active ? ' active' : '');
          b.style.setProperty('--s', st.color);
          b.innerHTML = '<span class="c">' + st.n + '</span><span class="l">' + st.label + '</span>';
          b.addEventListener('click', function () { active = i; paint(); });
          row.appendChild(b);
          if (i < STAGES.length - 1) {
            var c = document.createElement('span');
            c.className = 'kbl-conn' + (i < active ? ' passed' : '');
            c.style.setProperty('--s', st.color);
            row.appendChild(c);
          }
        });
        var card = document.getElementById('kbl-stage-card');
        card.style.setProperty('--s', s.color);
        card.querySelector('.kbl-kicker').textContent = s.kicker;
        card.querySelector('h3').textContent = s.title;
        card.querySelector('.desc').textContent = s.desc;
        card.querySelector('pre').textContent = s.code;
        document.getElementById('kbl-prev').disabled = active === 0;
        document.getElementById('kbl-next').disabled = active === STAGES.length - 1;
      }
      document.getElementById('kbl-prev').addEventListener('click', function () { if (active > 0) { active--; paint(); } });
      document.getElementById('kbl-next').addEventListener('click', function () { if (active < STAGES.length - 1) { active++; paint(); } });
      paint();
    }
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
  else init();
})();
