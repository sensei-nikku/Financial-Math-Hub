/* =====================================================================
   Unit 3 · Day 3 — Three Portfolios, Same Money
   A lesson is data. The engine and the shell never change; to build a new
   walkthrough, write another file shaped like this one.

   The whole lesson is one argument the student proves on themselves:
   the single stock has the HIGHEST average yearly return and the LOWEST
   ending value. Nothing in here says "diversify" — the table says it.

   Dollar cells use ROUND(...,2); rate cells use ROUND(...,4) so the
   1e-6 checker gets clean numbers instead of repeating decimals.
   ===================================================================== */

export const lesson = {
  id: 'u3d3',
  unit: 'Unit 3 · Day 3',
  title: 'Three Portfolios, Same Money',
  blurb: 'Ten thousand dollars, three years, three different ways to hold it. Same money, same years — you build the table and see which one you would rather have owned. One of these wins on average and loses on money.',
  rows: 31,
  cols: 4,

  // Cells that are printed for the student and cannot be edited.
  given: {
    A1: 'DIVERSIFICATION — THREE PORTFOLIOS, SAME MONEY',

    A3: 'STARTING AMOUNT',
    A4: 'Invested in each, at the start', B4: 10000,

    A6: 'YEARLY RETURNS', B6: 'One stock', C6: '60/40 mix', D6: 'Index fund',
    A7: 'Year 1', B7: 0.65, C7: 0.18, D7: 0.26,
    A8: 'Year 2', B8: -0.45, C8: -0.08, D8: -0.12,
    A9: 'Year 3', B9: 0.30, C9: 0.14, D9: 0.22,

    A11: 'STEP 1 — ending value',
    A12: 'Worth after 3 years',

    A14: 'STEP 2 — average yearly return',
    A15: 'Average of the three years',

    A17: 'STEP 3 — worst single year',
    A18: 'Worst year',

    A20: 'STEP 4 — the swing',
    A21: 'Best year minus worst year',

    A23: 'STEP 5 — read your own table',
    A24: 'Highest average return?',
    A25: 'Most money at the end?',

    A27: 'FINISH EARLY — make year 2 worse',
    A28: 'New year 2 for the one stock',
    A29: 'New ending value, one stock',
    A30: 'Does it still beat the index fund?',
  },

  steps: [
    {
      title: 'Ending value',
      body: 'Money does not grow by adding percentages — it grows by multiplying. A +65% year multiplies your money by 1.65; a −45% year multiplies it by 0.55. Chain all three years together. In B12 write =ROUND($B$4*(1+B7)*(1+B8)*(1+B9),2), then do the same in C12 and D12, shifting to columns C and D.',
      hint: 'The dollar signs in $B$4 lock the starting amount so all three columns pull from the same cell. Everything else shifts one column right each time.',
      targets: [
        { cell: 'B12', value: 11797.5, mustBeFormula: true },
        { cell: 'C12', value: 12375.84, mustBeFormula: true },
        { cell: 'D12', value: 13527.36, mustBeFormula: true },
      ],
      note: 'Same $10,000, same three years. The one stock finished last. Hold on to that — the next step is going to make it look like a winner.',
    },
    {
      title: 'Average yearly return',
      body: 'Now the number a salesperson would put on a slide. In B15 write =ROUND(AVERAGE(B7:B9),4), and do the same across C15 and D15.',
      hint: 'AVERAGE takes a range. B7:B9 means "everything from B7 down to B9."',
      targets: [
        { cell: 'B15', value: 0.1667, mustBeFormula: true },
        { cell: 'C15', value: 0.08, mustBeFormula: true },
        { cell: 'D15', value: 0.12, mustBeFormula: true },
      ],
      note: 'Look at what just happened. The one stock averaged 16.67% a year — the best of the three by a wide margin — and it ended with the least money. Both numbers are true. Only one of them is your money.',
    },
    {
      title: 'Worst single year',
      body: 'Averages hide the years that hurt. In B18 write =MIN(B7:B9), then C18 and D18.',
      hint: 'MIN finds the smallest value in a range. All three answers are negative.',
      targets: [
        { cell: 'B18', value: -0.45, mustBeFormula: true },
        { cell: 'C18', value: -0.08, mustBeFormula: true },
        { cell: 'D18', value: -0.12, mustBeFormula: true },
      ],
      note: 'There it is. A 45% drop takes a bite the following +30% cannot put back, because the +30% is calculated on a much smaller pile.',
    },
    {
      title: 'The swing',
      body: 'One more measure: how far apart the best and worst years were. That distance is what volatility feels like from the inside. In B21 write =ROUND(MAX(B7:B9)-MIN(B7:B9),4), then C21 and D21.',
      hint: 'MAX works exactly like MIN. Subtracting a negative number makes the result bigger — that is not a mistake.',
      targets: [
        { cell: 'B21', value: 1.1, mustBeFormula: true },
        { cell: 'C21', value: 0.26, mustBeFormula: true },
        { cell: 'D21', value: 0.38, mustBeFormula: true },
      ],
      note: 'The one stock swung 110 points from best year to worst. The 60/40 mix swung 26. Same three years — the difference is entirely in how the money was spread out.',
    },
    {
      title: 'Read your own table',
      body: 'Answer from the numbers you built, not from memory. In B24, type the name of the portfolio with the highest average yearly return. In B25, type the one that ended with the most money. Use the labels exactly as they appear in row 6.',
      hint: 'Compare row 15 for the first answer and row 12 for the second. They are not the same column.',
      targets: [
        { cell: 'B24', value: 'One stock', text: true },
        { cell: 'B25', value: 'Index fund', text: true },
      ],
      note: 'Two different portfolios. That gap is the entire point of today: an average return tells you nothing about what you actually end up holding, and a single bad year in a concentrated bet does damage the good years cannot undo.',
    },
    {
      title: 'Finish early — make year 2 worse',
      body: 'One company can have a much worse year than a basket of five hundred. In B28, type -0.6 — a 60% drop. Then in B29 write =ROUND($B$4*(1+B7)*(1+B28)*(1+B9),2) for the new ending value. Finally in B30, type Yes or No: does the one stock still beat the index fund?',
      hint: 'B29 is the same formula as B12, but pointing at B28 instead of B8. Compare your answer to D12.',
      targets: [
        { cell: 'B28', value: -0.6 },
        { cell: 'B29', value: 8580, mustBeFormula: true },
        { cell: 'B30', value: 'No', text: true },
      ],
      note: '$8,580 — less than the $10,000 that went in, after a year that gained 65% and a year that gained 30%. An index fund of five hundred companies cannot drop 60% because one of them had a catastrophe. That is not a strategy. It is arithmetic.',
    },
  ],

  closing: {
    title: 'What you built',
    body: 'A comparison, not a lecture. Three portfolios, one set of years, four measures each: ending value, average return, worst year, and swing. The single stock won on average and lost on money — and the reason is visible in row 18. Diversification is not about giving up return. It is about not needing a specific year to go your way.',
  },
};
