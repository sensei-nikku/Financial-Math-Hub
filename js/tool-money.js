/* ===================================================================
   FM PRIMITIVES — CURRENCY and PERCENT
   The two input types Financial Math needs and geometry never did.

   The problem these solve: a student who types $1,200 and a student who
   types 1200 gave the same answer. A checker that marks one of them
   wrong is not teaching arithmetic, it is teaching that the machine is
   arbitrary. Same for 7% and 0.07.

   Both tools follow the `numeric` contract from checker-kit.js exactly:
   tiered feedback, a `traps` array for named misconceptions, and a soft
   tier for unparseable input so a typo never counts toward the 3-miss
   teacher redirect.
   =================================================================== */
(function () {
  'use strict';

  /* ---- parsing ----------------------------------------------------
     Accepts, all as the same number:
       $1,200    $1,200.00    1200    1,200    1200.00    ( 1,200 )
     Parentheses and a leading minus both mean negative, because that is
     how a statement prints an overdraft and a student will copy it.
  ------------------------------------------------------------------ */
  function parseMoney(raw) {
    if (raw == null) return NaN;
    var s = ('' + raw).trim();
    if (!s) return NaN;
    var neg = /^\(.*\)$/.test(s) || /^-/.test(s);
    s = s.replace(/[()\s,$\u2212-]/g, '');       // strip parens, spaces, commas, $, minus, unicode minus
    if (s === '' || !/^\d*\.?\d*$/.test(s)) return NaN;
    var v = parseFloat(s);
    if (isNaN(v)) return NaN;
    return neg ? -v : v;
  }

  function money(v) {
    var neg = v < 0, a = Math.abs(v);
    var s = a.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ',');
    return (neg ? '-$' : '$') + s;
  }

  /* Shared miss handling so both tools behave identically to `numeric`. */
  function grade(v, answer, step) {
    var tol = step.tol != null ? step.tol : 0.01;              // one cent
    if (Math.abs(v - answer) <= tol) return { pass: true };

    if (step.traps) {
      for (var i = 0; i < step.traps.length; i++) {
        var tr = step.traps[i];
        if (Math.abs(v - tr.near) <= (tr.tol != null ? tr.tol : tol)) {
          return { fb: { t: 'err', m: tr.msg } };
        }
      }
    }
    var band = step.closeBand != null ? step.closeBand : 0.02;  // within 2% -> rounding nudge
    if (answer !== 0 && Math.abs(v - answer) <= Math.abs(answer) * band) {
      return { fb: { t: 'warn', m: 'Close \u2014 check your rounding. Answers here go to the cent.' } };
    }
    return null;                                                // caller supplies the generic message
  }

  /* ===================================================================
     CURRENCY
     step = { tool:'currency', answer, tol?, label?, traps?, hint? }
     `answer` is a plain number of dollars: 1200 means $1,200.00
     =================================================================== */
  K.tool('currency', {
    state: function () { return { val: '' }; },

    render: function (step, st, ref) {
      var h = '';
      if (step.ask) h += '<div class="step-text">' + ref.esc(step.ask) + '</div>';
      h += '<div class="calc-row">' +
        '<span style="font-size:1rem;color:var(--muted);font-weight:600">$</span>' +
        '<input type="text" inputmode="decimal" value="' + ref.esc(st.val) + '" placeholder="0.00" ' +
        'oninput="K.input(\'' + ref.p + '\',' + ref.s + ',this.value)" ' +
        'onkeydown="if(event.key===\'Enter\')K.act(\'' + ref.p + '\',' + ref.s + ',\'check\')">' +
        '<button class="btn btn-go" onclick="K.act(\'' + ref.p + '\',' + ref.s + ',\'check\')">Check</button></div>' +
        '<div style="font-size:.7rem;color:var(--muted);margin-top:5px">' +
        'Dollar sign and commas are optional \u2014 1200, 1,200 and $1,200.00 all count as the same answer.</div>';
      return h;
    },

    check: function (step, st) {
      var v = parseMoney(st.val);
      if (isNaN(v)) return { fb: { t: 'err', m: 'Enter a dollar amount.' }, tier: 'soft' };
      var g = grade(v, step.answer, step);
      if (g) return g;
      return { fb: { t: 'err', m: 'Not quite. Check what you multiplied.' } };
    },

    summary: function (step) { return money(step.answer); },

    work: function (step, st, ctx) {
      return '<div class="work-answer">' + ctx.esc(money(step.answer)) + '</div>';
    }
  });

  /* ===================================================================
     PERCENT
     step = { tool:'percent', answer, tol?, label?, traps?, ask? }
     `answer` is stored as a DECIMAL: 0.0796 means 7.96%

     Both readings of the student's input are tested, so 7, 7% and 0.07
     all pass for an answer of 0.07. That removes the guess-what-format-
     it-wants problem entirely. The only casualty is 1% typed bare as
     "1", which reads as 100% — so the field says to use the % sign.
     =================================================================== */
  K.tool('percent', {
    state: function () { return { val: '' }; },

    render: function (step, st, ref) {
      var h = '';
      if (step.ask) h += '<div class="step-text">' + ref.esc(step.ask) + '</div>';
      h += '<div class="calc-row">' +
        '<input type="text" inputmode="decimal" value="' + ref.esc(st.val) + '" placeholder="e.g. 5% or 0.05" ' +
        'oninput="K.input(\'' + ref.p + '\',' + ref.s + ',this.value)" ' +
        'onkeydown="if(event.key===\'Enter\')K.act(\'' + ref.p + '\',' + ref.s + ',\'check\')">' +
        '<button class="btn btn-go" onclick="K.act(\'' + ref.p + '\',' + ref.s + ',\'check\')">Check</button></div>' +
        '<div style="font-size:.7rem;color:var(--muted);margin-top:5px">' +
        'Either form works \u2014 5% or 0.05. For a rate under 1%, use the % sign.</div>';
      return h;
    },

    check: function (step, st) {
      var raw = ('' + (st.val || '')).trim();
      if (!raw) return { fb: { t: 'err', m: 'Enter a percentage.' }, tier: 'soft' };
      var hadPct = /%/.test(raw);
      var v = parseFloat(raw.replace(/[%\s,]/g, ''));
      if (isNaN(v)) return { fb: { t: 'err', m: 'Enter a percentage.' }, tier: 'soft' };

      var tol = step.tol != null ? step.tol : 0.0001;
      var cands = hadPct ? [v / 100] : [v / 100, v];   // with a % sign there is nothing to guess

      for (var i = 0; i < cands.length; i++) {
        if (Math.abs(cands[i] - step.answer) <= tol) return { pass: true };
      }
      if (step.traps) {
        for (var j = 0; j < step.traps.length; j++) {
          var tr = step.traps[j], ttol = tr.tol != null ? tr.tol : tol;
          for (var k = 0; k < cands.length; k++) {
            if (Math.abs(cands[k] - tr.near) <= ttol) return { fb: { t: 'err', m: tr.msg } };
          }
        }
      }
      var band = step.closeBand != null ? step.closeBand : 0.05;
      for (var m = 0; m < cands.length; m++) {
        if (step.answer !== 0 && Math.abs(cands[m] - step.answer) <= Math.abs(step.answer) * band) {
          return { fb: { t: 'warn', m: 'Close \u2014 check your rounding.' } };
        }
      }
      return { fb: { t: 'err', m: 'Not quite. Check which number you divided by.' } };
    },

    summary: function (step) {
      return +(step.answer * 100).toFixed(4) + '%';
    },

    work: function (step, st, ctx) {
      return '<div class="work-answer">' + ctx.esc(+(step.answer * 100).toFixed(4) + '%') + '</div>';
    }
  });

  /* Exposed for the tests, and for any checker that wants to format. */
  K._parseMoney = parseMoney;
  K._money = money;

})();
