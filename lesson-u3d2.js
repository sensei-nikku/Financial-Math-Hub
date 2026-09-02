/* =====================================================================
   Unit 3 · Day 2 — What a Share Is Worth
   A lesson is data. The engine and the shell never change; to build a new
   walkthrough, write another file shaped like this one.

   Every dollar cell is wrapped in ROUND(...,2) so the checker compares
   clean numbers and students see money that looks like money. The share
   count uses ROUND(...,0) because you cannot own 2.7 shares here.
   ===================================================================== */

export const lesson = {
  id: 'u3d2',
  unit: 'Unit 3 · Day 2',
  title: 'What a Share Is Worth',
  blurb: 'Marcus puts $400 into the company he already keeps running every night. Build the model and find out what he actually owns, what the two ways of getting paid are worth, and what the whole company is worth two years later.',
  rows: 31,
  cols: 4,

  // Cells that are printed for the student and cannot be edited.
  given: {
    A1: 'WHAT A SHARE IS WORTH — OWNERSHIP MODEL',

    A3: 'THE IPO',
    A4: 'Money the company wants to raise', B4: 800000,
    A5: 'Shares it will issue', B5: 20000,
    A6: 'Price per share',

    A8: 'WHAT MARCUS BUYS',
    A9: 'Dollars he invests', B9: 400,
    A10: 'Shares he gets',
    A11: 'Slice of the company he owns',

    A13: 'TWO YEARS LATER',
    A14: 'Price per share now', B14: 52,
    A15: 'Dividend paid per share each year', B15: 1.25,
    A16: 'Years he has held', B16: 2,

    A18: 'WAY ONE — Dividend',
    A19: 'Dividend income so far',

    A21: 'WAY TWO — Capital gain',
    A22: 'What his shares are worth now',
    A23: 'Capital gain if he sells',

    A25: 'PUTTING IT TOGETHER',
    A26: 'Total money made',
    A27: 'Total return, as a decimal',
    A28: 'Market cap of the whole company now',

    A30: 'Which way made him more?',
  },

  steps: [
    {
      title: 'Price the shares',
      body: 'An IPO is the one moment the money a buyer pays actually goes to the company. The company decides how much it wants to raise and how many shares to cut itself into; the price per share falls out of that. In B6 write =ROUND(B4/B5,2).',
      hint: 'Divide the money it wants to raise by the number of shares it is issuing.',
      targets: [{ cell: 'B6', value: 40, mustBeFormula: true }],
      note: 'Forty dollars a share — the same forty dollars Dani spent on her phone before her shift. That number was not set by anyone in a good pair of shoes. It came out of two numbers the company chose.',
    },
    {
      title: 'What Marcus actually gets',
      body: 'Marcus has $400. In B10 write =ROUND(B9/B6,0) for the number of shares he can buy. Then in B11 write =B10/B5 — that is his slice of the entire company.',
      hint: 'B9 is his money, B6 is the price you just built. For the slice, put his shares over the total shares the company issued.',
      targets: [
        { cell: 'B10', value: 10, mustBeFormula: true },
        { cell: 'B11', value: 0.0005, mustBeFormula: true },
      ],
      note: 'Ten shares, and 0.0005 of the company — one twentieth of one percent. Small. But it is the same kind of thing the biggest owner holds, just less of it. There is no separate instrument for people who work the night shift.',
    },
    {
      title: 'Way one — the dividend',
      body: 'A dividend is a slice of profit the company hands to owners while they still hold the stock. It is paid per share, per year. In B19 write =ROUND(B10*B15*B16,2).',
      hint: 'Shares times dividend per share times the number of years he has held.',
      targets: [{ cell: 'B19', value: 25, mustBeFormula: true }],
      note: 'Twenty-five dollars, arriving without him selling anything. This is the way people forget exists.',
    },
    {
      title: 'Way two — the capital gain',
      body: 'The other way you get paid is the price going up. In B22 write =ROUND(B10*B14,2) for what his shares are worth today. Then in B23 write =ROUND(B22-B9,2) for the gain if he sells.',
      hint: 'Value now is shares times today\'s price. The gain is that value minus what he originally put in.',
      targets: [
        { cell: 'B22', value: 520, mustBeFormula: true },
        { cell: 'B23', value: 120, mustBeFormula: true },
      ],
      note: 'A $120 gain — but only on paper. Until he sells, it is not money, and if the price falls next month it was never money. That is the whole difference between the two ways.',
    },
    {
      title: 'Add them up',
      body: 'In B26 write =ROUND(B23+B19,2) to combine the capital gain and the dividend income.',
      hint: 'B23 is the gain, B19 is the dividend total.',
      targets: [{ cell: 'B26', value: 145, mustBeFormula: true }],
      note: '$145 on $400. Notice that neither way alone tells the whole story.',
    },
    {
      title: 'Total return',
      body: 'A dollar amount does not tell you whether this was a good outcome — $145 means one thing on $400 and something very different on $40,000. Divide the money made by the money put in. In B27 write =ROUND(B26/B9,4).',
      hint: 'Total made over total invested. Four decimal places so you can read it as a percent.',
      targets: [{ cell: 'B27', value: 0.3625, mustBeFormula: true }],
      note: '0.3625, which is 36.25%. Over two years. Real markets do not hand that out on schedule — this is one company having a good couple of years, not a promise.',
    },
    {
      title: 'What the whole company is worth',
      body: 'The same arithmetic scales all the way up. Multiply today\'s share price by every share outstanding and you get the market\'s running estimate of the entire company — its market capitalization. In B28 write =ROUND(B14*B5,2).',
      hint: 'Price per share now, times the total shares issued.',
      targets: [{ cell: 'B28', value: 1040000, mustBeFormula: true }],
      note: 'The company raised $800,000 and the market now says the whole thing is worth $1,040,000. Same building, same night crew. What changed was what buyers and sellers agreed it was worth.',
    },
    {
      title: 'Name the bigger one',
      body: 'In B30, type which of the two ways put more money in his pocket — write it exactly as it appears in column A: Dividend or Capital gain.',
      hint: 'Compare B19 and B23.',
      targets: [{ cell: 'B30', value: 'Capital gain', text: true }],
      note: 'The capital gain, by a lot — $120 to $25. But flip B14 from 52 back to 40 and the capital gain vanishes while the dividend does not. One of these depends on other people changing their minds.',
    },
  ],

  closing: {
    title: 'What you built',
    body: 'An ownership model. A price per share is a company dividing itself up, not a number handed down from somewhere. A slice of ownership is a fraction you can compute. And there are exactly two ways that slice pays you: a dividend that arrives while you hold, and a capital gain that only exists if you sell. Change B14 to 31 and watch the gain go negative while the dividend stays put — that is the difference between owning something and being paid by it.',
  },
};
