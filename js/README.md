# js/

Checker engine and per-primitive tools.

## Port from the geometry repo, unchanged
`checker-kit.js`, `tool-label.js`, `tool-match.js`, `tool-order.js`,
`tool-plot.js`, `tool-solve.js`

## Do not port
`fig-triangle.js`, `fig-orientations.js` — geometry figure renderers, no FM use.

## Build new — the money primitives
- `tool-currency.js` — accepts `$1,200`, `1200`, and `1,200.00` as one answer
- `tool-percent.js` — accepts `7%` and `0.07` as one answer
- cent-level tolerance so a rounding difference isn't scored as wrong
