/* =====================================================================
   sheet engine — a small, honest spreadsheet
   Formula syntax is deliberately identical to Google Sheets and Excel so
   that everything learned here transfers. Supports: cell refs (A1, $B$2),
   ranges (B11:E11), + - * / ^ and comparisons, parentheses, and the
   functions listed in FUNCS below.
   ===================================================================== */

export const colName = (i) => {
  let s = '';
  i += 1;
  while (i > 0) { const r = (i - 1) % 26; s = String.fromCharCode(65 + r) + s; i = (i - r - 1) / 26; }
  return s;
};
export const colIndex = (s) => {
  let n = 0;
  for (const ch of s.toUpperCase()) n = n * 26 + (ch.charCodeAt(0) - 64);
  return n - 1;
};
export const refToRC = (ref) => {
  const m = /^\$?([A-Za-z]+)\$?(\d+)$/.exec(ref);
  if (!m) return null;
  return { c: colIndex(m[1]), r: parseInt(m[2], 10) - 1 };
};
export const rcToRef = (r, c) => colName(c) + (r + 1);

/* ---------- tokenizer ---------- */
function tokenize(src) {
  const t = [];
  let i = 0;
  while (i < src.length) {
    const ch = src[i];
    if (/\s/.test(ch)) { i++; continue; }
    if (/[0-9.]/.test(ch)) {
      let j = i; while (j < src.length && /[0-9.]/.test(src[j])) j++;
      t.push({ k: 'num', v: parseFloat(src.slice(i, j)) }); i = j; continue;
    }
    if (ch === '"') {
      let j = i + 1, s = '';
      while (j < src.length && src[j] !== '"') { s += src[j]; j++; }
      t.push({ k: 'str', v: s }); i = j + 1; continue;
    }
    if (/[A-Za-z$]/.test(ch)) {
      let j = i; while (j < src.length && /[A-Za-z0-9$_.]/.test(src[j])) j++;
      const word = src.slice(i, j);
      if (src[j] === '(') { t.push({ k: 'fn', v: word.toUpperCase() }); i = j; continue; }
      if (src[j] === ':' && /^\$?[A-Za-z]+\$?\d+$/.test(word)) {
        let k2 = j + 1; while (k2 < src.length && /[A-Za-z0-9$]/.test(src[k2])) k2++;
        t.push({ k: 'range', v: [word, src.slice(j + 1, k2)] }); i = k2; continue;
      }
      if (/^\$?[A-Za-z]+\$?\d+$/.test(word)) { t.push({ k: 'ref', v: word }); i = j; continue; }
      t.push({ k: 'name', v: word.toUpperCase() }); i = j; continue;
    }
    const two = src.slice(i, i + 2);
    if (['<=', '>=', '<>'].includes(two)) { t.push({ k: 'op', v: two }); i += 2; continue; }
    if ('+-*/^(),<>='.includes(ch)) { t.push({ k: 'op', v: ch }); i++; continue; }
    throw new Error(`Unexpected character "${ch}"`);
  }
  return t;
}

/* ---------- parser (recursive descent) ---------- */
function parse(tokens) {
  let p = 0;
  const peek = () => tokens[p];
  const eat = (v) => {
    const t = tokens[p];
    if (!t || (v && t.v !== v)) throw new Error(v ? `Expected "${v}"` : 'Unexpected end of formula');
    p++; return t;
  };
  function primary() {
    const t = peek();
    if (!t) throw new Error('Formula ends too early');
    if (t.k === 'num' || t.k === 'str') { p++; return { n: 'lit', v: t.v }; }
    if (t.k === 'ref') { p++; return { n: 'ref', v: t.v }; }
    if (t.k === 'range') { p++; return { n: 'range', v: t.v }; }
    if (t.k === 'name') {
      p++;
      if (t.v === 'TRUE') return { n: 'lit', v: true };
      if (t.v === 'FALSE') return { n: 'lit', v: false };
      throw new Error(`Unknown name "${t.v}"`);
    }
    if (t.k === 'fn') {
      p++; eat('(');
      const args = [];
      if (peek() && peek().v !== ')') {
        args.push(expr());
        while (peek() && peek().v === ',') { p++; args.push(expr()); }
      }
      eat(')');
      return { n: 'call', f: t.v, args };
    }
    if (t.v === '(') { p++; const e = expr(); eat(')'); return e; }
    if (t.v === '-') { p++; return { n: 'neg', a: primary() }; }
    if (t.v === '+') { p++; return primary(); }
    throw new Error(`Unexpected "${t.v}"`);
  }
  function power() {
    let l = primary();
    while (peek() && peek().v === '^') { p++; l = { n: 'bin', o: '^', l, r: primary() }; }
    return l;
  }
  function term() {
    let l = power();
    while (peek() && (peek().v === '*' || peek().v === '/')) {
      const o = eat().v; l = { n: 'bin', o, l, r: power() };
    }
    return l;
  }
  function add() {
    let l = term();
    while (peek() && (peek().v === '+' || peek().v === '-')) {
      const o = eat().v; l = { n: 'bin', o, l, r: term() };
    }
    return l;
  }
  function expr() {
    let l = add();
    while (peek() && ['<', '>', '=', '<=', '>=', '<>'].includes(peek().v)) {
      const o = eat().v; l = { n: 'bin', o, l, r: add() };
    }
    return l;
  }
  const out = expr();
  if (p < tokens.length) throw new Error('Extra text after the formula');
  return out;
}

/* ---------- functions ---------- */
const flat = (vals) => vals.flat(Infinity);
const nums = (vals) => flat(vals).filter((v) => typeof v === 'number' && isFinite(v));

const FUNCS = {
  SUM: (a) => nums(a).reduce((x, y) => x + y, 0),
  COUNT: (a) => nums(a).length,
  AVERAGE: (a) => { const n = nums(a); if (!n.length) throw new Error('AVERAGE needs numbers'); return n.reduce((x, y) => x + y, 0) / n.length; },
  MIN: (a) => { const n = nums(a); if (!n.length) throw new Error('MIN needs numbers'); return Math.min(...n); },
  MAX: (a) => { const n = nums(a); if (!n.length) throw new Error('MAX needs numbers'); return Math.max(...n); },
  ABS: (a) => Math.abs(nums(a)[0]),
  ROUND: (a) => { const f = flat(a); const d = f.length > 1 ? f[1] : 0; const m = Math.pow(10, d); return Math.round(f[0] * m) / m; },
  IF: (a) => (a[0] ? (a.length > 1 ? a[1] : true) : (a.length > 2 ? a[2] : false)),
  SUMPRODUCT: (a) => {
    const arrs = a.map((x) => flat([x]));
    const len = arrs[0].length;
    if (arrs.some((x) => x.length !== len)) throw new Error('SUMPRODUCT ranges must be the same size');
    let s = 0;
    for (let i = 0; i < len; i++) {
      let pr = 1;
      for (const arr of arrs) pr *= (typeof arr[i] === 'number' ? arr[i] : 0);
      s += pr;
    }
    return s;
  },
};

/* ---------- sheet ---------- */
export class Sheet {
  constructor(rows, cols) {
    this.rows = rows; this.cols = cols;
    this.raw = new Map();      // "A1" -> raw string
    this.cache = new Map();    // "A1" -> computed value
    this.errors = new Map();
  }
  setRaw(ref, text) { 
    if (text === '' || text == null) this.raw.delete(ref); else this.raw.set(ref, text);
    this.recalc();
  }
  getRaw(ref) { return this.raw.get(ref) ?? ''; }
  isFormula(ref) { return String(this.getRaw(ref)).trim().startsWith('='); }

  recalc() {
    this.cache.clear(); this.errors.clear();
    for (const ref of this.raw.keys()) {
      try { this.value(ref, new Set()); }
      catch (e) { this.errors.set(ref, e.message); this.cache.set(ref, NaN); }
    }
  }

  value(ref, seen = new Set()) {
    if (this.cache.has(ref)) return this.cache.get(ref);
    const raw = this.raw.get(ref);
    if (raw === undefined || raw === '') return 0;
    // Throw rather than return: returning NaN lets the caller's success path
    // clear the error we just recorded, so the cycle goes unreported.
    if (seen.has(ref)) throw new Error('Circular reference');
    const s = String(raw).trim();
    if (!s.startsWith('=')) {
      const n = Number(s.replace(/[$,%\s]/g, ''));
      const v = (s !== '' && isFinite(n) && /[0-9]/.test(s)) ? n : s;
      this.cache.set(ref, v); return v;
    }
    seen.add(ref);
    let v;
    try {
      v = this.evalNode(parse(tokenize(s.slice(1))), seen);
      this.errors.delete(ref);
    } catch (e) {
      this.errors.set(ref, e.message); v = NaN;
    }
    seen.delete(ref);
    this.cache.set(ref, v); return v;
  }

  rangeRefs(a, b) {
    const A = refToRC(a), B = refToRC(b);
    if (!A || !B) throw new Error('Bad range');
    const out = [];
    for (let r = Math.min(A.r, B.r); r <= Math.max(A.r, B.r); r++)
      for (let c = Math.min(A.c, B.c); c <= Math.max(A.c, B.c); c++)
        out.push(rcToRef(r, c));
    return out;
  }

  evalNode(node, seen) {
    switch (node.n) {
      case 'lit': return node.v;
      case 'neg': return -this.evalNode(node.a, seen);
      case 'ref': {
        const rc = refToRC(node.v);
        if (!rc) throw new Error(`Bad cell reference "${node.v}"`);
        return this.value(rcToRef(rc.r, rc.c), seen);
      }
      case 'range': return this.rangeRefs(node.v[0], node.v[1]).map((r) => this.value(r, seen));
      case 'call': {
        const f = FUNCS[node.f];
        if (!f) throw new Error(`${node.f} is not available here`);
        return f(node.args.map((a) => this.evalNode(a, seen)));
      }
      case 'bin': {
        const l = this.evalNode(node.l, seen), r = this.evalNode(node.r, seen);
        const ln = typeof l === 'number' ? l : (l === '' ? 0 : l);
        const rn = typeof r === 'number' ? r : (r === '' ? 0 : r);
        switch (node.o) {
          case '+': return ln + rn; case '-': return ln - rn;
          case '*': return ln * rn;
          case '/': if (rn === 0) throw new Error('Division by zero'); return ln / rn;
          case '^': return Math.pow(ln, rn);
          case '=': return ln === rn; case '<>': return ln !== rn;
          case '<': return ln < rn; case '>': return ln > rn;
          case '<=': return ln <= rn; case '>=': return ln >= rn;
        }
        throw new Error(`Unknown operator ${node.o}`);
      }
    }
    throw new Error('Could not read that formula');
  }
}

/* Cells and ranges mentioned in a formula — used to light up the grid. */
export function referencedCells(src) {
  const out = new Set();
  if (!src || !String(src).trim().startsWith('=')) return out;
  let toks;
  try { toks = tokenize(String(src).trim().slice(1)); } catch { return out; }
  for (const t of toks) {
    if (t.k === 'ref') { const rc = refToRC(t.v); if (rc) out.add(rcToRef(rc.r, rc.c)); }
    if (t.k === 'range') {
      const A = refToRC(t.v[0]), B = refToRC(t.v[1]);
      if (A && B) for (let r = Math.min(A.r, B.r); r <= Math.max(A.r, B.r); r++)
        for (let c = Math.min(A.c, B.c); c <= Math.max(A.c, B.c); c++) out.add(rcToRef(r, c));
    }
  }
  return out;
}
