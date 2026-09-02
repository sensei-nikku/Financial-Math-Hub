/* ===================================================================
   Tests for the FM money primitives and the Day 3 answer key.
   Run:  npm install   then   node tests/money.test.js
   Headless via jsdom. No browser, no network.
   =================================================================== */
const fs = require('fs');
const path = require('path');
const { JSDOM } = require('jsdom');

const root = path.join(__dirname, '..');
const load = f => fs.readFileSync(path.join(root, f), 'utf8');

function freshWindow() {
  const dom = new JSDOM('<header><div id="hdrDots"></div></header><main id="main"></main>',
                        { runScripts: 'outside-only', pretendToBeVisual: true });
  const w = dom.window;
  w.scrollTo = () => {};
  w.eval(load('js/checker-kit.js'));
  w.eval(load('js/tool-money.js'));
  w.eval(load('js/tool-explain.js'));
  return w;
}

let pass = 0, fail = 0;
const t = (name, got, want) => {
  const ok = JSON.stringify(got) === JSON.stringify(want);
  ok ? pass++ : fail++;
  console.log((ok ? '  ok   ' : '  FAIL ') + name +
    (ok ? '' : `\n         got ${JSON.stringify(got)}  want ${JSON.stringify(want)}`));
};
const section = s => console.log('\n' + s);

/* ---- 1. parseMoney: every shape a student actually types ---------- */
section('parseMoney');
{
  const w = freshWindow();
  const P = w.K._parseMoney;
  [['$1,200', 1200], ['1200', 1200], ['1,200', 1200], ['1200.00', 1200],
   ['$1,200.00', 1200], [' 1,200 ', 1200], ['$0.04', 0.04], ['.5', 0.5],
   ['(1,200)', -1200], ['-1200', -1200], ['$1,040,000', 1040000]]
    .forEach(([raw, want]) => t(`${JSON.stringify(raw)} -> ${want}`, P(raw), want));
  ['', '   ', 'abc', '$', '1.2.3'].forEach(raw =>
    t(`${JSON.stringify(raw)} -> NaN`, Number.isNaN(P(raw)), true));

  t('money(1200) formats', w.K._money(1200), '$1,200.00');
  t('money(4) formats', w.K._money(4), '$4.00');
  t('money(1040000) formats', w.K._money(1040000), '$1,040,000.00');
}

/* ---- 2. Drive the tools for real, through the runner -------------- */
/* A tiny synthetic checker so we can assert acceptance and rejection
   without depending on the Day 3 content. */
function driver(pipeline) {
  const w = freshWindow();
  w.eval(`K.run([{id:'p', num:'P', prompt:'test', pipeline:${JSON.stringify(pipeline)}}])`);
  const done = () => (w.document.getElementById('main').innerHTML.match(/fb ok show/g) || []).length;
  return {
    /* returns true if this value advanced the step */
    try(si, val) {
      const before = done();
      w.K.input('p', si, val);
      w.K.act('p', si, 'check');
      return done() > before;
    },
    feedback(si) {
      const h = w.document.getElementById('main').innerHTML;
      const m = h.match(/fb (err|warn) show"[^>]*>([^<]*)</);
      return m ? m[1] : null;
    }
  };
}

section('currency accepts every format for the same answer');
['1200', '$1,200', '1,200.00', '$1200.00', ' 1200 ', '1200.001'].forEach(v => {
  const d = driver([{ tool: 'currency', answer: 1200 }]);
  t(`accepts ${JSON.stringify(v)}`, d.try(0, v), true);
});

section('currency rejects wrong answers and names known mistakes');
{
  let d = driver([{ tool: 'currency', answer: 200, traps: [{ near: 2000, msg: 'ten years' }] }]);
  t('rejects 2000 when answer is 200', d.try(0, '2000'), false);
  t('  and flags it as an error, not a typo', d.feedback(0), 'err');

  d = driver([{ tool: 'currency', answer: 200 }]);
  t('rejects 199 (outside one cent)', d.try(0, '199'), false);
  t('  but calls it close, not wrong', d.feedback(0), 'warn');

  d = driver([{ tool: 'currency', answer: 200 }]);
  t('unparseable input does not advance', d.try(0, 'twelve'), false);
}

section('percent accepts both readings, requires neither');
[['5%', 0.05], ['5', 0.05], ['0.05', 0.05], ['.05', 0.05],
 ['7.96%', 0.0796], ['7.96', 0.0796], ['0.0796', 0.0796],
 ['0.04%', 0.0004]].forEach(([v, ans]) => {
  const d = driver([{ tool: 'percent', answer: ans }]);
  t(`accepts ${JSON.stringify(v)} for ${ans}`, d.try(0, v), true);
});

section('percent still catches the real mistake');
{
  let d = driver([{ tool: 'percent', answer: 0.05, traps: [{ near: 0.04, msg: 'coupon rate' }] }]);
  t('rejects 4% when answer is 5%', d.try(0, '4%'), false);
  t('  flagged as error', d.feedback(0), 'err');

  d = driver([{ tool: 'percent', answer: 0.0796, traps: [{ near: 0.08, msg: 'no fee taken out' }] }]);
  t('rejects 8% when answer is 7.96%', d.try(0, '8%'), false);
}

/* ---- 3. The Day 3 answer key ------------------------------------- */
section('Day 3 checker — structure');
const w = freshWindow();
const html = load('checkers/unit3-day3-bonds.html');
w.eval(html.split('<script>').pop().split('</script>')[0].replace(/K\.run\(PROBLEMS\);\s*$/, ''));
const P = w.PROBLEMS;
t('three problems', P.length, 3);
t('step counts', P.map(p => p.pipeline.length), [5, 3, 7]);
t('every step has a label', P.every(p => p.pipeline.every(s => !!s.label)), true);

section('Day 3 checker — arithmetic derived, not typed');
const S = (q, s) => P[q].pipeline[s];
t('Q1 one year of coupon', S(0,1).answer, 5000 * 0.04);
t('Q1 ten years of coupon', S(0,2).answer, 5000 * 0.04 * 10);
t('Q1 interest plus face back', S(0,3).answer, 5000 * 0.04 * 10 + 5000);
t('Q2 current yield', S(1,0).answer, 200 / 4000);
t('Q3 Fund A net of fee', +S(2,0).answer.toFixed(6), +(0.08 - 0.0004).toFixed(6));
t('Q3 Fund B net of fee', +S(2,1).answer.toFixed(6), +(0.08 - 0.01).toFixed(6));
t('Q3 Fund A fee on 10k', S(2,2).answer, 10000 * 0.0004);
t('Q3 Fund B fee on 10k', S(2,3).answer, 10000 * 0.01);
t('Q3 the gap', S(2,4).answer, 10000 * 0.01 - 10000 * 0.0004);

section('Day 3 checker — no trap collides with its own answer');
P.forEach((p, qi) => p.pipeline.forEach((s, si) => {
  (s.traps || []).forEach(tr => {
    const tol = tr.tol != null ? tr.tol : (s.tool === 'percent' ? 0.0001 : 0.01);
    t(`Q${qi+1}.${si+1} trap ${tr.near} sits clear of the answer`,
      Math.abs(tr.near - s.answer) > tol, true);
  });
}));

section('Day 3 checker — choice hashes resolve to exactly one option');
P.forEach((p, qi) => p.pipeline.forEach((s, si) => {
  if (s.tool !== 'choice') return;
  t(`Q${qi+1}.${si+1} hash matches one option`,
    s.options.filter(o => w.K._djb2(o) === s.ch).length, 1);
}));

section('Day 3 checker — every explain step ships a model answer');
P.forEach((p, qi) => p.pipeline.forEach((s, si) => {
  if (s.tool !== 'explain') return;
  t(`Q${qi+1}.${si+1} has a key of real length`, (s.key || '').length > 80, true);
}));

console.log(`\n${pass} passed, ${fail} failed\n`);
process.exit(fail ? 1 : 0);
