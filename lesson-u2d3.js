/* =====================================================================
   Unit 2 · Day 3 — Jordan's Payoff Network
   A lesson is data. The engine and the shell never change; to build a new
   walkthrough, write another file shaped like this one.
   ===================================================================== */

export const lesson = {
  id: 'u2d3',
  unit: 'Unit 2 · Day 3',
  title: "Jordan's Payoff Network",
  blurb: 'Build Jordan’s four debts as a network, write the network as a matrix, and use it to say where the money goes two payoffs from now.',
  rows: 22,
  cols: 7,

  // Cells that are printed for the student and cannot be edited.
  given: {
    A1: "JORDAN'S PAYOFF NETWORK",
    A3: 'Debt', B3: 'Balance', C3: 'APR', D3: 'Minimum',
    A4: 'Store card',  B4: 840,  C4: 0.2699, D4: 35,
    A5: 'Credit card', B5: 3200, C5: 0.2299, D5: 80,
    A6: 'Auto loan',   B6: 6400, C6: 0.0749, D6: 215,
    A7: 'Medical bill',B7: 1900, C7: 0,      D7: 60,
    A9: 'SNOWBALL — who hands off to whom',
    B10: 'to S', C10: 'to C', D10: 'to A', E10: 'to M', F10: 'Row sum',
    A11: 'from S', A12: 'from C', A13: 'from A', A14: 'from M',
    A16: 'A SQUARED — two payoffs later',
    B17: 'to S', C17: 'to C', D17: 'to A', E17: 'to M',
    A18: 'from S',
  },

  steps: [
    {
      title: 'Order the debts',
      body: 'Snowball sorts by balance, smallest first. Read the balances in column B and put the payoff position — 1, 2, 3, or 4 — next to each debt in column E.',
      hint: 'The store card is $840. Nothing is smaller, so it is position 1.',
      targets: [
        { cell: 'E4', value: 1 }, { cell: 'E5', value: 3 },
        { cell: 'E6', value: 4 }, { cell: 'E7', value: 2 },
      ],
      note: 'Avalanche would sort by column C instead, and would give a different order for three of these four.',
    },
    {
      title: 'Draw the first arrow',
      body: 'An arrow from one debt to another means: the month this debt is paid off, its payment rolls over to that one. The store card is position 1 and the medical bill is position 2, so the store card hands off to the medical bill. Put a 1 in the cell where row "from S" meets column "to M". Leave the rest of that row as 0.',
      hint: 'Row 11 is "from S". Column E is "to M". So the 1 goes in E11, and B11, C11, D11 all get 0.',
      targets: [
        { cell: 'B11', value: 0 }, { cell: 'C11', value: 0 },
        { cell: 'D11', value: 0 }, { cell: 'E11', value: 1 },
      ],
    },
    {
      title: 'Finish the matrix',
      body: 'Fill in the remaining three rows the same way. Medical (position 2) hands off to the credit card (position 3). The credit card hands off to the auto loan (position 4). The auto loan is last — it hands off to nothing, so its row is all zeros.',
      hint: 'Row 12 is "from C" and the credit card hands to the auto loan, so D12 is 1. Row 14 is "from M" and medical hands to the credit card, so C14 is 1. Row 13 is all zeros.',
      targets: [
        { cell: 'B12', value: 0 }, { cell: 'C12', value: 0 }, { cell: 'D12', value: 1 }, { cell: 'E12', value: 0 },
        { cell: 'B13', value: 0 }, { cell: 'C13', value: 0 }, { cell: 'D13', value: 0 }, { cell: 'E13', value: 0 },
        { cell: 'B14', value: 0 }, { cell: 'C14', value: 1 }, { cell: 'D14', value: 0 }, { cell: 'E14', value: 0 },
      ],
      note: 'This table is the adjacency matrix. Sixteen cells, four 1s — one for each hand-off, and the last debt has none.',
    },
    {
      title: 'Add the row sums',
      body: 'In F11, add up the whole row with a formula: =SUM(B11:E11). Then do the same for rows 12, 13 and 14.',
      hint: 'Type =SUM(B11:E11) in F11, =SUM(B12:E12) in F12, and so on. The formula must be typed, not the answer.',
      targets: [
        { cell: 'F11', value: 1, mustBeFormula: true },
        { cell: 'F12', value: 1, mustBeFormula: true },
        { cell: 'F13', value: 0, mustBeFormula: true },
        { cell: 'F14', value: 1, mustBeFormula: true },
      ],
      note: 'Three rows sum to 1 and one sums to 0. A row sum counts the arrows leaving a debt — and every debt hands off to exactly one other, except the one that gets paid last.',
    },
    {
      title: 'Name the last debt',
      body: 'Exactly one row summed to zero. In B20, type the label of that debt exactly as it appears in column A.',
      hint: 'F13 is the row that summed to 0. Row 13 is "from A".',
      targets: [{ cell: 'B20', value: 'Auto loan', text: true }],
      note: 'A row sum of zero is how the matrix tells you which debt is retired last, without you having to trace anything.',
    },
    {
      title: 'Two payoffs later — the first entry',
      body: 'Now the useful part. Squaring the matrix answers a question the matrix alone cannot: where can the money get to in exactly two hand-offs? For the entry in row "from S", column "to C", pair each cell of row 11 with the matching cell of column B, multiply, and add. In B18 type: =B11*B11 + C11*B12 + D11*B13 + E11*B14',
      hint: 'That formula walks across row 11 and down column B at the same time. Type it exactly, including the = sign.',
      targets: [{ cell: 'B18', value: 0, mustBeFormula: true }],
      note: 'Zero. Starting from the store card, you cannot reach the store card in two hand-offs — which is a relief, because money should not come back around.',
    },
    {
      title: 'Finish the row',
      body: 'Do the same for the other three entries of row 18. Each one walks across row 11 and down a different column: C18 uses column C, D18 uses column D, E18 uses column E.',
      hint: 'C18 is =B11*C11 + C11*C12 + D11*C13 + E11*C14. The pattern only changes which column letter you walk down.',
      targets: [
        { cell: 'C18', value: 1, mustBeFormula: true },
        { cell: 'D18', value: 0, mustBeFormula: true },
        { cell: 'E18', value: 0, mustBeFormula: true },
      ],
      note: 'Exactly one 1, in the "to C" column. Two hand-offs after the store card is retired, Jordan’s extra payment is going to the credit card.',
    },
    {
      title: 'Say what it means',
      body: 'In B21, type the label of the debt that receives the money two hand-offs after the store card is paid off.',
      hint: 'Look at which column of row 18 held the 1.',
      targets: [{ cell: 'B21', value: 'Credit card', text: true }],
      note: 'Check it against the arrows: store card → medical bill → credit card. Two steps. The matrix found it without tracing, and it would still work with forty debts instead of four.',
    },
  ],

  closing: {
    title: 'What you built',
    body: 'A payoff plan is a network: debts are dots, and an arrow is where the payment goes when a debt dies. Written as a matrix, the row sums tell you which debt is last, and squaring it tells you what is two hand-offs away. Avalanche is the same four dots with the arrows drawn in a different order — and that is the only difference between the two methods.',
  },
};
