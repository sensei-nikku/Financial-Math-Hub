# Financial Math — self-check hub

The Financial Math counterpart to `TEC-Papago-geometry-self-check`. Same layout,
same stylesheet, same rule: **the hub is static.** No build step, no framework,
no JS on the landing page.

## Files

| path | what it is |
| --- | --- |
| `index.html` | The hub. Every lesson in the course, live or greyed out. |
| `assets/styles.css` | Design system, copied verbatim from the geometry repo. Dark by default; add `data-theme="light"` to `<html>` for warm paper. |
| `checkers/` | One HTML file per lesson checker. Empty for now. |
| `js/` | Checker engine and per-primitive tools. Empty for now — see below. |
| `tests/` | jsdom tests. Empty for now. |
| `package.json` | jsdom, for the tests. |

No `.nojekyll` in this archive on purpose — GitHub's web uploader silently skips
dotfiles, so shipping one would just look like it worked. See below.

## Setting it up by drag-and-drop

Unzip and drag **the contents** into the upload box, not the folder itself —
dragging the folder gets you a nested `fm-hub/` directory and Pages will serve
nothing at the root.

### About `.nojekyll`

You do not need it for this repo as it stands. GitHub Pages runs Jekyll, and
Jekyll hides paths beginning with `_` or `.` — this repo has none. Nothing here
contains Liquid syntax either.

You *will* need it the moment either of those changes, and the most likely
trigger is porting the checker kit: if any JS file contains `{{` or `{%`, the
Pages build fails outright rather than degrading. Add it then, via
**Add file → Create new file**, type `.nojekyll` as the filename, leave the body
empty, commit. The web editor allows empty files; the uploader is what doesn't.
Twenty seconds, and it is the only way to get a dotfile in through the browser.

## Activating a card

Cards start life greyed out:

```html
<a class="hub-card hub-soon" href="#"><div class="tag">U1 · D1 · soon</div><h3>Intro to Banking</h3></a>
```

To turn one on: drop `hub-soon`, drop `· soon` from the tag, set the `href`, and
add a `<p>` describing what the student will actually do. That is the whole
process.

Three card states:

- **plain `hub-card`** — a checker that lives in this repo, under `checkers/`
- **`hub-ext`** — leaves the repo; the tag renders purple. Walkthroughs and the
  Apps Script sim are external
- **`hub-soon`** — not built yet; dimmed and unclickable

## What is already live

The spreadsheet walkthroughs live in a separate repo,
[`fm-walkthroughs`](https://github.com/sensei-nikku/fm-walkthroughs), and are
linked from here rather than absorbed. That is deliberate: QR codes are already
printed on student handouts pointing at
`sensei-nikku.github.io/fm-walkthroughs/`, and moving the files would break
paper that is already in a filing cabinet. The `?lesson=` parameter selects the
lesson, so one deployment serves every day.

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

## Conventions worth not breaking

- Currency is checked to the cent, never to the dollar.
- Percentages are stored as decimals and displayed as percentages.
- A checker states its answer *and why it is the answer*. Marking something
  wrong without explaining it teaches nothing.
- Every checker works on a phone. Half the room is on a phone.
