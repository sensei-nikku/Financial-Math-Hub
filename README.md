# Financial Math — self-check hub

The Financial Math counterpart to `TEC-Papago-geometry-self-check`. Same
stylesheet, same conventions. The hub landing page is static: no build step, no
framework, no JS on `index.html`.

**This repo is canonical.** Lesson and engine fixes are made here.

## Files

| path | what it is |
| --- | --- |
| `index.html` | the hub landing page — cards for every lesson and tool |
| `walkthrough.html` | the spreadsheet walkthrough; `?lesson=` picks which |
| `engine.js` | spreadsheet engine |
| `lesson-u2d3.js`, `lesson-u3d1.js`, `lesson-u3d2.js`, `lesson-u3d3.js` | one per walkthrough |
| `checkers/unit3-day3-bonds.html` | bond + fund-fee checker |
| `checkers/unit3-day3-selfcheck.html` | offline Day 3 self check, no dependencies |
| `js/` | checker kit ported from the geometry repo, plus `tool-money.js` |
| `tests/money.test.js` | 76 assertions |
| `assets/styles.css` | hub stylesheet |
| `package.json` | jsdom, for the tests |
| `README.md` | this file |

## Rules that have already been broken once

Read these before moving or overwriting anything here.

- **`index.html` and `walkthrough.html` are different files with different
  jobs. Never merge them, and never let one overwrite the other.** `index.html`
  is the hub the root URL serves; `walkthrough.html` is the spreadsheet tool.
  Overwriting the hub with the walkthrough drops students straight into a
  lesson instead of the hub — that has happened twice, both times from an
  instruction to "upload these files, overwriting `index.html`". Quick check:

  ```bash
  grep -c "hub-card" index.html        # expect > 0
  grep -c "gridwrap" index.html        # expect 0
  grep -c "gridwrap" walkthrough.html  # expect > 0
  grep -c "hub-card" walkthrough.html  # expect 0
  ```

- **`engine.js` and every `lesson-*.js` must stay in the repo root.**
  `walkthrough.html` imports them with `./` relative paths. Moving them into a
  subfolder renders a blank page with no visible error — it looks like a
  caching problem and it is not.

- **`fm-walkthroughs` is a legacy mirror, not a second source.** It exists only
  so the QR codes printed on the Unit 3 Day 1–3 student handouts keep
  resolving. This repo is canonical: fix a lesson here, then copy it across.
  Retire that repo once no printed packet points at it.

## Adding a lesson

Two lines in `walkthrough.html`: one `import`, and one entry in the `LESSONS`
map. Nothing else changes. A missing lesson file fails loudly at load and an
unknown `?lesson=` value renders an error naming the lessons that do exist.

## Routes

    walkthrough.html                 -> Three Portfolios, Same Money (default)
    walkthrough.html?lesson=u3d1     -> Why Start Early?
    walkthrough.html?lesson=u3d2     -> What a Share Is Worth
    walkthrough.html?lesson=u3d3     -> Three Portfolios, Same Money
    walkthrough.html?lesson=u2d3     -> Jordan's Payoff Network

## `.nojekyll`

Present at the root, and it should stay. GitHub Pages runs Jekyll, and the
build **fails outright** if any file contains Liquid syntax (`{{` or `{%`) —
the checker kit in `js/` is the likely future trigger. A failed build keeps
serving the previous version silently, which is indistinguishable from a cache
problem.

It cannot be added with GitHub's web uploader, which silently skips dotfiles.
Use **Add file → Create new file**, type `.nojekyll`, leave the body empty,
commit.

## Activating a card

Cards start life greyed out:

```html
<a class="hub-card hub-soon" href="#"><div class="tag">U1 · D1 · soon</div><h3>Intro to Banking</h3></a>
```

To turn one on: drop `hub-soon`, drop `· soon` from the tag, set the `href`, and
add a `<p>` describing what the student will actually do. That is the whole
process.

Three card states:

- **plain `hub-card`** — lives in this repo (a checker under `checkers/`, or
  `walkthrough.html`)
- **`hub-ext`** — leaves the repo; the tag renders purple. The Apps Script sim
  is the remaining external one
- **`hub-soon`** — not built yet; dimmed and unclickable

## The kit

Ported from the geometry repo and working: `checker-kit.js` (the runner, plus
the `numeric` and `choice` primitives), `tool-solve`, `tool-explain`,
`tool-order`, `tool-match`, `tool-label`, `tool-plot`. The geometry figure
renderers were deliberately left behind.

Written for FM, in `js/tool-money.js`:

- **`currency`** — `$1,200`, `1200`, `1,200.00`, `(1,200)` for a negative, all
  the same answer. Graded to the cent. Anything unparseable is a *soft* miss so
  a typo never counts toward the teacher redirect.
- **`percent`** — `5%`, `5` and `0.05` all pass for an answer of `0.05`. Both
  readings are tested, so there is no format to guess. Answers are stored as
  decimals. The one casualty is a bare `1` meaning 1%, which reads as 100% —
  the field tells students to use the `%` sign below 1%.

Both take a `traps` array so a known misconception gets named instead of a
generic "not quite":

```js
{ tool:'percent', answer:0.05,
  traps:[{ near:0.04, msg:'That is the coupon rate on the original $5,000.' }] }
```

Three misses on any step triggers the kit's teacher redirect — *"bring your work
to your teacher"* — with a "teacher helped, continue" button. That is the whole
reason this beats a worksheet: it routes a stuck student to a person instead of
letting them guess.

## Tests

```
npm install
node tests/money.test.js
```

76 assertions: money parsing across every format a student types, acceptance and
rejection driven through the real runner, and a validation pass over the Day 3
answer key — arithmetic derived from the source numbers rather than retyped,
every trap checked for collision with its own answer, and every choice hash
confirmed to resolve to exactly one option. That last check caught two hashes
computed from shell-escaped strings, which would have made two questions
unanswerable.

## Still to do

1. **Wire `demo.html`** — every primitive on one page, same as the geometry
   repo, so a new checker can be assembled by copying markup.
2. **Confirm the credit quiz URL** and point the Unit 2 exam card at it.
3. **Paste The Long Run's `/exec` URL** into the sim card.
4. **More checkers.** Health insurance (deductible → coinsurance → OOP max) is
   the strongest next candidate — it is pure arithmetic with famous
   misconceptions, which is exactly what `traps` are for.
5. **Decide on `checkers/u3d3-walkthrough.html`** — a self-contained older copy
   of the u3d3 walkthrough, superseded by `walkthrough.html?lesson=u3d3` and
   linked from nowhere. Archive or delete it once confirmed.

## Conventions worth not breaking

- Currency is checked to the cent, never to the dollar.
- Percentages are stored as decimals and displayed as percentages.
- A checker states its answer *and why it is the answer*. Marking something
  wrong without explaining it teaches nothing.
- Every checker works on a phone. Half the room is on a phone.
