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
| `.nojekyll` | Stops GitHub Pages from hiding anything that starts with an underscore. |

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

## Still to do

1. **Port the checker kit.** Copy from the geometry repo:
   `js/checker-kit.js`, `js/tool-label.js`, `js/tool-match.js`,
   `js/tool-order.js`, `js/tool-plot.js`, `js/tool-solve.js`. Leave
   `js/fig-triangle.js` and `js/fig-orientations.js` behind — those draw
   geometry figures and have no FM use.
2. **Build the FM primitives the kit is missing.** Money-specific checking:
   a currency input that accepts `$1,200`, `1200`, and `1,200.00` as the same
   answer; a percent input that accepts `7%` and `0.07`; and a
   tolerance-to-the-cent numeric so rounding differences don't read as wrong.
3. **Wire `demo.html`** once the kit is in, same as the geometry repo — every
   primitive on one page so a checker can be assembled by copying markup.
4. **Confirm the credit quiz URL** and point the Unit 2 exam card at it.
5. **Paste The Long Run's `/exec` URL** into the sim card.

## Conventions worth not breaking

- Currency is checked to the cent, never to the dollar.
- Percentages are stored as decimals and displayed as percentages.
- A checker states its answer *and why it is the answer*. Marking something
  wrong without explaining it teaches nothing.
- Every checker works on a phone. Half the room is on a phone.
