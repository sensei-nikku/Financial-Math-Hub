/* =====================================================================
   Unit 3 · Day 1 — Why Start Early?
   A lesson is data. The engine and the shell never change; to build a new
   walkthrough, write another file shaped like this one.

   Contribution timing: end of year. Every balance is rounded to cents with
   ROUND(...,2) so the checker compares clean numbers and students see money
   that looks like money.
   ===================================================================== */

export const lesson = {
  id: 'u3d1',
  unit: 'Unit 3 · Day 1',
  title: 'Why Start Early?',
  blurb: 'Two people, same $2,000 a year, same 7% return — one starts at 25 and stops after ten years, the other starts at 35 and never stops. Build the model and find out which one ends up ahead, and by how much.',
  rows: 27,
  cols: 4,

  // Cells that are printed for the student and cannot be edited.
  given: {
    A1: 'WHY START EARLY — COMPOUND GROWTH MODEL',

    A3: 'INPUTS',
    A4: 'Yearly contribution', B4: 2000,
    A5: 'Average yearly return', B5: 0.07,

    A7: 'THE TWO PLANS', B7: 'Person A', C7: 'Person B',
    A8: 'Years contributing', B8: 10, C8: 30,
    A9: 'Years growing after that', B9: 30, C9: 0,

    A11: 'STEP 1 — total contributed',
    A12: 'Total put in',

    A14: 'STEP 2 — growth factors',
    A15: 'Factor: contributing years',
    A16: 'Factor: waiting years',

    A18: 'STEP 3 — balance when they stop',
    A19: 'Balance the year they stop',

    A21: 'STEP 4 — balance at 65',
    A22: 'Balance at 65',

    A24: 'STEP 5 — the verdict',
    A25: 'Who has more at 65?',
    A26: 'Dollars back per dollar in',
  },

  steps: [
    {
      title: 'Total contributed',
      body: 'Start with the easy number: how much money each person actually puts in over their whole life. That is the yearly contribution times the number of years they contribute. In B12 write =$B$4*B8, and in C12 write =$B$4*C8.',
      hint: 'The dollar signs in $B$4 lock that cell so it always points at the yearly contribution, no matter which column you are in. B8 and C8 are the years each person contributes.',
      targets: [
        { cell: 'B12', value: 20000, mustBeFormula: true },
        { cell: 'C12', value: 60000, mustBeFormula: true },
      ],
      note: 'Person B puts in three times as much money. Hold on to that number — it is the thing the rest of this model is going to argue with.',
    },
    {
      title: 'Growth factor — the contributing years',
      body: 'A growth factor answers: one dollar, left alone at this rate for this many years, becomes how many dollars? It is (1 + rate) raised to the number of years. In B15 write =(1+$B$5)^B8, and in C15 write =(1+$B$5)^C8.',
      hint: 'The ^ symbol means "to the power of". (1+0.07)^10 is 1.07 multiplied by itself ten times.',
      targets: [
        { cell: 'B15', value: 1.9671513572895665, mustBeFormula: true },
        { cell: 'C15', value: 7.612255042662042, mustBeFormula: true },
      ],
      note: 'Ten years turns a dollar into about $1.97. Thirty years turns it into about $7.61. Three times the years, but almost eight times the money — that gap is the whole lesson.',
    },
    {
      title: 'Growth factor — the waiting years',
      body: 'Person A stops contributing at 35, but the money she already put in keeps growing for another 30 years. Person B contributes right up to 65, so he has no waiting years. Same formula, different row: in B16 write =(1+$B$5)^B9, and in C16 write =(1+$B$5)^C9.',
      hint: 'C9 is 0. Anything raised to the power of zero is 1, which is the model saying "no time left to grow."',
      targets: [
        { cell: 'B16', value: 7.612255042662042, mustBeFormula: true },
        { cell: 'C16', value: 1, mustBeFormula: true },
      ],
      note: 'Person A gets a second growth factor of 7.61 that Person B never gets. She is not contributing during those years. She is just waiting.',
    },
    {
      title: 'Balance the year they stop',
      body: 'Now the balance at the moment each person stops contributing. Because the money goes in a little at a time, each contribution grows for a different number of years — the formula that adds all of that up is contribution × ((growth factor − 1) ÷ rate). In B19 write =ROUND($B$4*((B15-1)/$B$5),2), and in C19 write =ROUND($B$4*((C15-1)/$B$5),2).',
      hint: 'ROUND(value, 2) rounds to the nearest cent. Count your parentheses: there is one for ROUND, one around the whole (B15-1)/$B$5 piece, and one around B15-1.',
      targets: [
        { cell: 'B19', value: 27632.9, mustBeFormula: true },
        { cell: 'C19', value: 188921.57, mustBeFormula: true },
      ],
      note: 'At 35, Person A has about $27,633 and is done. At 65, Person B has about $188,922. Right now it is not close. Keep going.',
    },
    {
      title: 'Balance at 65',
      body: 'Take each balance and let it sit for the waiting years. That is just the balance times the waiting-years growth factor. In B22 write =ROUND(B19*B16,2), and in C22 write =ROUND(C19*C16,2).',
      hint: 'Person B multiplies by 1, so his number does not change. That is the model being honest, not the model being broken.',
      targets: [
        { cell: 'B22', value: 210348.68, mustBeFormula: true },
        { cell: 'C22', value: 188921.57, mustBeFormula: true },
      ],
      note: 'Person A: about $210,349. Person B: about $188,922. She stopped contributing thirty years earlier and still finished ahead by roughly $21,000.',
    },
    {
      title: 'Name the winner',
      body: 'In B25, type the name of the person with more money at 65 — exactly as it appears in row 7.',
      hint: 'Compare B22 and C22.',
      targets: [{ cell: 'B25', value: 'Person A', text: true }],
      note: 'Person A. Not because she invested more, not because she picked better, but because her dollars were in the market longer.',
    },
    {
      title: 'Dollars back per dollar in',
      body: 'One last number, and it is the one worth remembering. Divide each ending balance by the total that person actually contributed. In B26 write =ROUND(B22/B12,2), and in C26 write =ROUND(C22/C12,2).',
      hint: 'B22 is the balance at 65. B12 is the total put in. Same idea for column C.',
      targets: [
        { cell: 'B26', value: 10.52, mustBeFormula: true },
        { cell: 'C26', value: 3.15, mustBeFormula: true },
      ],
      note: 'Every dollar Person A put in came back about ten and a half times. Every dollar Person B put in came back about three times. Same rate, same market, same discipline — the only difference was when they started.',
    },
  ],

  closing: {
    title: 'What you built',
    body: 'A compound growth model with two moving parts: how long money goes in, and how long it sits afterward. Change B5 to 0.04 and watch both numbers collapse. Change Person A\'s contributing years from 10 to 12 and watch how much a two-year head start is worth. The model does not care how much you earn. It cares how early you begin.',
  },
};
