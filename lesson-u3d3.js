/* =====================================================================
   Unit 3 · Day 3 — Three Portfolios, Same Money
   v3 — teaches formula CONSTRUCTION, not formula transcription.

   Every step body walks the same four questions instead of dictating a
   string to retype:

        WANT     what do I want out of this cell?
        HAVE     what do I already have, and in which cells?
        CONNECT  what joins them — an operator, or a function?
        SHAPE    does the answer need rounding to be readable?

   The literal formula lives in `hint`, so a stuck student can still get
   it, but nobody is handed it before they have made the four decisions.
   Step 7 makes them choose functions by name from a description, which
   is the actual skill — knowing MIN exists is useless if you cannot
   recognise the moment you need it.
   ===================================================================== */

export const lesson = {
  id: 'u3d3',
  unit: 'Unit 3 · Day 3',
  title: 'Three Portfolios, Same Money',
  blurb: 'Ten thousand dollars, three years, three ways to hold it. Every formula in here you will build yourself, using the same four questions each time: WANT — what do I want out? HAVE — what do I already have, and where? CONNECT — what joins them, an operator or a function? SHAPE — does the answer need rounding? Answer those four and the formula writes itself. The hint button has the finished line if you get stuck.',
  rows: 45,
  cols: 4,

  given: {
    A1: 'DIVERSIFICATION — THREE PORTFOLIOS, SAME MONEY',

    A3: 'WHAT YOU START WITH',
    A4: 'Invested in each', B4: 10000,

    A6: 'YEARLY RETURNS', B6: 'One stock', C6: '60/40 mix', D6: 'Index fund',
    A7: 'Year 1', B7: 0.65, C7: 0.18, D7: 0.26,
    A8: 'Year 2', B8: -0.45, C8: -0.08, D8: -0.12,
    A9: 'Year 3', B9: 0.30, C9: 0.14, D9: 0.22,

    A11: 'A — ONE YEAR AT A TIME (one stock)',
    A12: 'Year 1 multiplier',
    A13: 'Money after year 1',
    A14: 'Money after year 2',
    A15: 'Money after year 3',

    A17: 'B — ALL THREE YEARS IN ONE CELL',
    A18: 'Ending value',

    A20: 'C — NAME THE FUNCTION THAT DOES THE JOB',
    A21: 'Adds up a list of numbers',
    A22: 'Gives the mean of a list',
    A23: 'Gives the smallest in a list',
    A24: 'Gives the largest in a list',

    A26: 'D — AVERAGE YEARLY RETURN',
    A27: 'Sum of the three years',
    A28: 'Average, by dividing',
    A29: 'Average, using a function',

    A31: 'E — WORST, BEST, AND THE SWING',
    A32: 'Worst year',
    A33: 'Best year',
    A34: 'Swing: best minus worst',

    A36: 'F — THE VERDICT',
    A37: 'Highest average return?',
    A38: 'Most money at the end?',

    A40: 'G — FINISH EARLY: make year 2 worse',
    A41: 'New year 2 for the one stock',
    A42: 'New ending value',
    A43: 'Still beat the index fund?',
  },

  steps: [

    /* ---- A. one year at a time ----------------------------------- */
    {
      title: 'A1 · Turn a percent into a multiplier',
      body: 'First formula, and we will do all four questions out loud.\n\nWANT: a number I can multiply money by, so that +65% happens to it.\nHAVE: the return itself, sitting in B7 as 0.65.\nCONNECT: +65% means the money becomes 165% of what it was, so the multiplier is 1 plus the return. That is addition.\nSHAPE: nothing to shape yet.\n\nEvery formula starts with = so the sheet knows to compute instead of just storing text. Build it in B12.',
      hint: 'Equals sign, then 1, then a plus, then the cell that holds the return:  =1+B7',
      do: 'B12 \u2014 one formula. Start it with = so the sheet computes instead of storing text.',
      targets: [{ cell: 'B12', value: 1.65, mustBeFormula: true }],
      note: '1.65. Notice you did not type 1.65 anywhere \u2014 you pointed at B7 and let the sheet work it out. That is the difference between a spreadsheet and a calculator, and it is why changing B7 later will move everything downstream on its own.',
    },
    {
      title: 'A2 · One year of growth',
      body: 'Same four questions, faster.\n\nWANT: the balance after one year.\nHAVE: the starting amount in B4, and the multiplier you just built in B12.\nCONNECT: to grow money by a multiplier you multiply. The symbol is *\nSHAPE: not yet.\n\nWrite it in B13.',
      hint: '=B4*B12',
      do: 'B13 \u2014 one formula, multiplying two cells.',
      targets: [{ cell: 'B13', value: 16500, mustBeFormula: true }],
      note: '$16,500. A very good year.',
    },
    {
      title: 'A3 · Year two \u2014 you decide what to point at',
      body: 'Year 2 returns \u201345%. Work the questions before you type.\n\nWANT: the balance after year 2.\nHAVE: two candidates for the starting point \u2014 B4 ($10,000) and B13 ($16,500). Only one is right. Year 2 grows whatever you finished year 1 with.\nCONNECT: a multiplier again. But you do not have a cell holding year 2\u2019s multiplier, so build it inside the formula: (1+B8). The parentheses force the addition to happen before the multiplication.\nSHAPE: not yet.\n\nWrite it in B14.',
      hint: 'Start from the year-1 balance, not the original deposit:  =B13*(1+B8)',
      do: 'B14 \u2014 one formula. Two candidates for the starting cell; only one is right.',
      targets: [{ cell: 'B14', value: 9075, mustBeFormula: true }],
      note: '$9,075 \u2014 below where you started, after one year up 65% and one year down 45%. Percentages do not cancel, because the 45% came off a bigger pile than the 65% was added to. If you got $5,500 you started from B4; go back and look at why that is the wrong cell.',
    },
    {
      title: 'A4 · Year three, and the SHAPE question finally matters',
      body: 'WANT: the balance after year 3.\nHAVE: the year-2 balance in B14, and the year-3 return in B9.\nCONNECT: multiply by (1+B9), same as last time.\nSHAPE: this one is money, and money has two decimal places. ROUND fixes that.\n\nHere is how a function is written, and it never changes:\n\n        NAME( argument , argument )\n\nA name, then parentheses, then the things it needs, separated by commas. ROUND needs two: what to round, and how many decimals. So ROUND( your calculation , 2 ). Build it in B15.',
      hint: 'Put the whole multiplication inside ROUND as its first argument, and 2 as its second:  =ROUND(B14*(1+B9),2)',
      do: 'B15 \u2014 one formula, wrapped in ROUND with 2 as its second argument.',
      targets: [{ cell: 'B15', value: 11797.5, mustBeFormula: true }],
      note: '$11,797.50. Four cells, one year at a time. Remember that number \u2014 you are about to get it a second way.',
    },

    /* ---- B. compress, and meet absolute refs when they pay off --- */
    {
      title: 'B1 · Collapse four cells into one',
      body: 'You now know what each year does. So skip the intermediate balances and chain the multipliers together in a single cell.\n\nWANT: the same ending value, in one step.\nHAVE: the deposit in B4 and three returns in B7, B8, B9.\nCONNECT: multiply the deposit by all three multipliers, one after another.\nSHAPE: ROUND to 2, same as before.\n\nOne change: write the deposit as $B$4 instead of B4. The dollar signs pin it. It makes no difference right now \u2014 the next step is where it matters. Build it in B18.',
      hint: '=ROUND($B$4*(1+B7)*(1+B8)*(1+B9),2)',
      do: 'B18 \u2014 one formula. It should return the same number as B15.',
      targets: [{ cell: 'B18', value: 11797.5, mustBeFormula: true }],
      note: 'The same $11,797.50 you got in B15. Two routes, one answer \u2014 which is how you know the compressed version is not a trick.',
    },
    {
      title: 'B2 · Now the pinning pays for itself',
      body: 'Do the same for the other two portfolios. The shape of the formula does not change at all; only which column the returns come from.\n\nAsk the HAVE question carefully: the 60/40 returns are in C7, C8, C9. The index returns are in D7, D8, D9. But all three portfolios start from the same $10,000 \u2014 the one cell that should NOT change as you move across. That is what $B$4 protects.\n\nBuild C18 and D18.',
      hint: 'Copy your B18 formula and change every B7/B8/B9 to C7/C8/C9. Leave $B$4 alone. Then repeat with D.',
      do: 'C18 and D18 \u2014 one formula each, same shape as B18. Change the column letter on the three returns; leave $B$4 exactly as it is.',
      targets: [
        { cell: 'C18', value: 12375.84, mustBeFormula: true },
        { cell: 'D18', value: 13527.36, mustBeFormula: true },
      ],
      note: 'That is the whole point of locking a cell: a value every formula needs, written once. Now read across row 18. The single stock finished last, and it is not close.',
    },

    /* ---- C. choosing the function IS the skill -------------------- */
    {
      title: 'C · Pick the tool before you use it',
      body: 'Four measures are coming, and each one needs a different function. Knowing that MIN exists is useless if you cannot spot the moment you need it \u2014 so match them first, before there is any arithmetic to hide behind.\n\nFour function names: SUM, AVERAGE, MIN, MAX. Column A describes what each one does. Type the matching name into B21, B22, B23 and B24. Just the name, no equals sign and no parentheses \u2014 you are labelling, not calculating yet.',
      hint: 'Read each description literally. "Adds up a list" is SUM. "Mean of a list" is AVERAGE. "Smallest" is MIN, and MIN is short for minimum.',
      do: 'B21, B22, B23, B24 \u2014 four function names as plain text. No equals sign, no parentheses. You are labelling, not calculating.',
      targets: [
        { cell: 'B21', value: 'SUM', text: true },
        { cell: 'B22', value: 'AVERAGE', text: true },
        { cell: 'B23', value: 'MIN', text: true },
        { cell: 'B24', value: 'MAX', text: true },
      ],
      note: 'Those four cover most of what anyone does to a column of numbers. From here on, when you know what you want, ask which of these four gets it \u2014 that question does more work than memorising syntax.',
    },

    /* ---- D. average: long way, then the shorthand ---------------- */
    {
      title: 'D1 · Add up the three returns',
      body: 'WANT: the three yearly returns added together.\nHAVE: them in B7, B8 and B9.\nCONNECT: you named the function for this in B21.\nSHAPE: leave it raw for now.\n\nOne new piece of syntax. Instead of listing three cells, you can give a function a RANGE \u2014 a start cell, a colon, an end cell. B7:B9 means "B7, B8, B9 and anything between." Build the sum in B27.',
      hint: 'Function name, parentheses, one range argument:  =SUM(B7:B9)  \u2014 typing =B7+B8+B9 gets the same number.',
      do: 'B27 \u2014 one formula, using a range as its only argument.',
      targets: [{ cell: 'B27', value: 0.5, mustBeFormula: true }],
      note: '0.5 \u2014 fifty percentage points, spread across three years.',
    },
    {
      title: 'D2 · Turn a sum into an average yourself',
      body: 'Before using AVERAGE, do what it does by hand, so you know what it is doing.\n\nWANT: the average of the three returns.\nHAVE: the sum, in B27.\nCONNECT: an average is a sum divided by how many things went into it. Three years, so divide by 3. The divide symbol is /\nSHAPE: these are rates, not dollars, so 4 decimals rather than 2.\n\nBuild it in B28.',
      hint: '=ROUND(B27/3,4)',
      do: 'B28 \u2014 one formula. ROUND to 4 places this time, not 2.',
      targets: [{ cell: 'B28', value: 0.1667, mustBeFormula: true }],
      note: '0.1667, which reads as 16.67% a year on average.',
    },
    {
      title: 'D3 · Now let the function do it',
      body: 'Two cells for one average is a lot of work. AVERAGE does the adding and the dividing in one move.\n\nWANT: the same average, in one cell.\nHAVE: the range B7:B9.\nCONNECT: the function you named in B22, taking one range argument \u2014 exactly like SUM did.\nSHAPE: ROUND to 4.\n\nBuild it in B29. It should match B28 exactly. If it does not, one of the two is wrong.',
      hint: 'Swap SUM for AVERAGE inside the ROUND:  =ROUND(AVERAGE(B7:B9),4)',
      do: 'B29 \u2014 one formula. It must match B28 exactly.',
      targets: [{ cell: 'B29', value: 0.1667, mustBeFormula: true }],
      note: 'Matching answers. You now know what AVERAGE is doing under the hood, which is the only way you will ever notice when it is the wrong tool for a job.',
    },
    {
      title: 'D4 · Across the other two columns',
      body: 'Same formula, different column. Ask HAVE and nothing else: where do the 60/40 returns live, and where do the index returns live?\n\nBuild C29 and D29.',
      hint: 'Only the column letter inside the range changes:  =ROUND(AVERAGE(C7:C9),4)  then the same with D.',
      do: 'C29 and D29 \u2014 one formula each, same as B29 with the column letter changed.',
      targets: [
        { cell: 'C29', value: 0.08, mustBeFormula: true },
        { cell: 'D29', value: 0.12, mustBeFormula: true },
      ],
      note: 'Stop here and read row 29 against row 18. The single stock has the HIGHEST average yearly return of the three \u2014 16.67% against 12% and 8% \u2014 and in row 18 it has the LEAST money. Both numbers are true. Only one of them is your money.',
    },

    /* ---- E. worst, best, swing ----------------------------------- */
    {
      title: 'E1 · Find the year that hurt',
      body: 'An average hides its worst year, so go get it.\n\nWANT: the smallest of the three returns.\nHAVE: the range B7:B9.\nCONNECT: the function you named in B23.\nSHAPE: nothing \u2014 it is already one of the numbers on screen.\n\nBuild it in B32.',
      hint: 'Same shape as SUM and AVERAGE, one range argument:  =MIN(B7:B9)',
      do: 'B32 \u2014 one formula. No ROUND needed. The answer will be negative.',
      targets: [{ cell: 'B32', value: -0.45, mustBeFormula: true }],
      note: 'A 45% fall. The +30% that followed could not undo it, because that +30% was taken from a much smaller pile.',
    },
    {
      title: 'E2 · And the best year',
      body: 'You already know how this one goes. WANT the largest of the three, HAVE the same range, CONNECT with the function from B24. Build it in B33.',
      hint: 'Identical to the last step with MAX instead of MIN:  =MAX(B7:B9)',
      do: 'B33 \u2014 one formula, same shape as B32.',
      targets: [{ cell: 'B33', value: 0.65, mustBeFormula: true }],
    },
    {
      title: 'E3 · The swing, from two cells you own',
      body: 'How far apart were the best and worst years? That distance is what volatility feels like from the inside.\n\nWANT: the gap between best and worst.\nHAVE: both of them already, in B33 and B32.\nCONNECT: subtract. The minus symbol is -\nSHAPE: a rate, so 4 decimals.\n\nBefore you press Enter, predict the answer. B32 is negative, so subtracting it makes the result BIGGER, not smaller. Build it in B34.',
      hint: 'Best minus worst, in that order:  =ROUND(B33-B32,4)  \u2014 0.65 minus \u20130.45 is 1.10.',
      do: 'B34 \u2014 one formula: best minus worst, in that order, wrapped in ROUND to 4 places.',
      targets: [{ cell: 'B34', value: 1.1, mustBeFormula: true }],
      note: '1.10 \u2014 a hundred and ten percentage points between this portfolio\u2019s best year and its worst. If you got 0.20 you added the negative instead of subtracting it.',
    },
    {
      title: 'E4 · Nest the functions instead of storing them',
      body: 'For the other two columns, you are not going to build separate MIN and MAX cells. A function can go straight inside another expression \u2014 anywhere a number could sit, a function that produces a number can sit instead.\n\nSo instead of pointing at two cells, put MAX and MIN directly into the subtraction. Build C34 and D34.',
      hint: 'Replace B33 and B32 with the functions themselves:  =ROUND(MAX(C7:C9)-MIN(C7:C9),4)  then the same with D.',
      do: 'C34 and D34 \u2014 one formula each. Same ROUND wrapper and same best-minus-worst order as B34, but with MAX(...) and MIN(...) written where B33 and B32 used to be.',
      targets: [
        { cell: 'C34', value: 0.26, mustBeFormula: true },
        { cell: 'D34', value: 0.38, mustBeFormula: true },
      ],
      note: '110 against 26 and 38. Same three years for every portfolio \u2014 the only difference is how the money was spread. And you just wrote a formula three levels deep: ROUND holding a subtraction holding two functions. That is all nesting ever is.',
    },

    /* ---- F. verdict ---------------------------------------------- */
    {
      title: 'F · Read your own table back',
      body: 'No formulas here. Answer from the cells you built, not from memory. In B37 type the portfolio with the highest average yearly return. In B38 type the one that ended with the most money. Spell them exactly as they appear in row 6.',
      hint: 'Row 29 holds the averages. Row 18 holds the ending values. They do not point at the same column, and that is the finding.',
      do: 'B37 and B38 \u2014 plain text, no equals sign. Copy the spelling from row 6: One stock, 60/40 mix, or Index fund.',
      targets: [
        { cell: 'B37', value: 'One stock', text: true },
        { cell: 'B38', value: 'Index fund', text: true },
      ],
      note: 'Two different portfolios. That gap is the whole lesson: an average return tells you nothing about what you actually end up holding, and one terrible year in a concentrated bet does damage the good years cannot repair.',
    },

    /* ---- G. finish early, split into three so each step asks for
             exactly one kind of answer -------------------------------- */
    {
      title: 'G1 \u2014 Break it on purpose',
      body: 'One company can have a far worse year than a basket of five hundred. Test that.\n\nNo formula for this one. B41 is an input cell, like B7 and B8 are \u2014 it just holds a number you choose.',
      hint: 'Type the minus sign, then 0.6 \u2014 so: -0.6',
      do: 'B41 \u2014 type -0.6 as a plain number. No equals sign.',
      targets: [{ cell: 'B41', value: -0.6 }],
      note: 'A 60% drop in year two, sitting in a cell of its own so you can change it again later.',
    },
    {
      title: 'G2 \u2014 Rerun the portfolio',
      body: 'WANT: the ending value if year two had been that bad.\nHAVE: everything B18 used, except year two now comes from B41 instead of B8.\nCONNECT: nothing new \u2014 this is your B18 formula.\nSHAPE: ROUND to 2, same as B18.\n\nExactly one reference changes. Find it before you type.',
      hint: 'Copy B18 and swap B8 for B41:  =ROUND($B$4*(1+B7)*(1+B41)*(1+B9),2)',
      do: 'B42 \u2014 one formula, identical to B18 except for a single cell reference.',
      targets: [{ cell: 'B42', value: 8580, mustBeFormula: true }],
      note: '$8,580 \u2014 less than the $10,000 that went in, after a year that gained 65% and a year that gained 30%.',
    },
    {
      title: 'G3 \u2014 Call it',
      body: 'Compare what you just built in B42 against the index fund\u2019s ending value in D18.',
      hint: 'B42 is $8,580. D18 is $13,527.36.',
      do: 'B43 \u2014 type Yes or No as plain text. No equals sign.',
      targets: [{ cell: 'B43', value: 'No', text: true }],
      note: 'An index fund holding five hundred companies cannot fall 60% because one of them had a catastrophe. That is not a strategy. It is arithmetic.',
    },
  ],

  closing: {
    title: 'What you built',
    body: 'Seventeen formulas, and you were not handed any of them whole. Every one came out of the same four questions: what do I want, what do I have and where, what connects them, does the answer need shaping. That is the method, and it does not care whether the subject is portfolios or payroll or a grocery budget.\n\nTwo things worth trying now that it works. Change B7 to 0.10 and watch exactly which cells move and which sit still. Then set B4 to 1000 and notice that the ending values all change while the averages, the worst years and the swings do not budge at all \u2014 because those measure the shape of the returns, not the size of the deposit.',
  },
};
