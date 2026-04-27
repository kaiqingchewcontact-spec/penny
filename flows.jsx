/* global React */
// ═════════════════════════════════════════════════════════════════
// Demo conversation: scripted intelligent responses for Penny
// Includes the full Shanghai retirement diversification flow,
// plus other example flows triggered by suggested prompts.
// ═════════════════════════════════════════════════════════════════

// Helper: build an AI message object
const ai = (parts, opts = {}) => ({ role: 'ai', parts, chips: opts.chips, id: Math.random().toString(36).slice(2) });
const me = (text) => ({ role: 'user', text, id: Math.random().toString(36).slice(2) });

// ─── Suggested prompts on empty state ────────────────────────────
const SUGGESTED = [
  {
    icon: '📊', tone: 'peach',
    title: 'Diversify my retirement plan',
    sub: '40, 2 properties in Shanghai',
    flow: 'shanghai',
  },
  {
    icon: '☕', tone: 'pink',
    title: 'What did I spend on coffee?',
    sub: 'Last 30 days',
    flow: 'coffee',
  },
  {
    icon: '🏠', tone: 'lav',
    title: 'Can I afford this apartment?',
    sub: '¥6.2M, 50% down',
    flow: 'afford',
  },
  {
    icon: '💸', tone: 'sun',
    title: 'Log an expense',
    sub: 'Quick entry',
    flow: 'log',
  },
  {
    icon: '📈', tone: 'mint',
    title: 'TSLA vs NVDA',
    sub: 'Which is doing better?',
    flow: 'compare',
  },
  {
    icon: '🎯', tone: 'peach',
    title: 'Show my goals',
    sub: '3 active',
    flow: 'goals',
  },
];

// ─── Quick chips on empty state ──────────────────────────────────
const QUICK_CHIPS = [
  'Net worth check-in',
  'Bills due this week',
  'Am I overspending?',
];

// ═════════════════════════════════════════════════════════════════
// Flow definitions — each is a function that returns a sequence of
// messages keyed off user input.
// ═════════════════════════════════════════════════════════════════

const FLOWS = {

  // ─── Shanghai retirement diversification (the showcase flow) ──
  shanghai: {
    initial: 'Help diversify my retirement plan. I\'m 40, I have 2 properties in Shanghai.',
    steps: [
      // Penny: greeting + first cut
      [
        ai([
          { type: 'text', body: "Got it — I love a good real estate question 🏘️\nQuick gut check before I crunch anything: outside the two properties, what does the rest of the picture look like? I'll roll with rough numbers." },
        ], {
          chips: [
            { label: 'Use a sample profile', primary: true, next: 'profile' },
            { label: 'I\'ll fill it in' },
            { label: 'Skip — just principles' },
          ],
        }),
      ],
      // user picks 'sample profile'
      [
        me('Use a sample profile'),
        ai([
          { type: 'text', body: "Cool — I plugged in numbers typical for someone your age in your situation. We can edit any of these as we go." },
          { type: 'rich', kind: 'profile' },
        ], {
          chips: [
            { label: "That's roughly right", primary: true, next: 'analysis' },
            { label: 'Edit numbers' },
          ],
        }),
      ],
      // analysis
      [
        me("That's roughly right"),
        ai([
          { type: 'text', body: "Okay, here's how that allocates today vs. how a more diversified plan could look. The big thing: ~78% of your net worth is in one city's residential property." },
          { type: 'rich', kind: 'alloc' },
        ]),
        ai([
          { type: 'text', body: "Three things stand out:\n\n1. **Concentration risk** — same country, same city, same asset type. If Shanghai property dips 20%, your net worth drops ~16%.\n\n2. **Liquidity** — only ~5% of your wealth is accessible in under a week.\n\n3. **Currency** — you're 100% RMB-denominated. Some USD/HKD exposure is worth considering." },
        ], {
          chips: [
            { label: 'How do I rebalance?', primary: true, next: 'rebalance' },
            { label: 'Sell a property?' },
            { label: 'Why does currency matter?' },
          ],
        }),
      ],
      // rebalance
      [
        me('How do I rebalance?'),
        ai([
          { type: 'text', body: "You don't have to sell anything to rebalance — you can shift where new savings go. Here's a 3-year glidepath, assuming you keep both properties:" },
          { type: 'rich', kind: 'glidepath' },
        ]),
        ai([
          { type: 'text', body: "Tweak the inputs to see how your projected portfolio at 60 changes:" },
          { type: 'rich', kind: 'calc' },
        ], {
          chips: [
            { label: 'Suggest specific funds', primary: true, next: 'funds' },
            { label: 'What about HK/US tax?' },
            { label: 'Save this plan' },
          ],
        }),
      ],
      // funds
      [
        me('Suggest specific funds'),
        ai([
          { type: 'text', body: "Educational examples — not a recommendation. For a global, low-cost core most folks reach for ETFs like these:" },
          { type: 'rich', kind: 'compare' },
        ]),
        ai([
          { type: 'text', body: "A starting frame people often use: 60% global stocks, 20% Asia ex-China, 15% bonds, 5% cash. You'd weight this with your existing property exposure in mind.\n\nBefore acting, please check what you can actually buy from your jurisdiction — Mainland accounts have different access than HK ones. Want me to walk through brokerage options?" },
        ], {
          chips: [
            { label: 'Yes — brokerage options', primary: true },
            { label: 'Save this plan' },
            { label: 'Show me at age 65 instead' },
          ],
        }),
      ],
    ],
  },

  // ─── Coffee spending ──────────────────────────────────────────
  coffee: {
    initial: 'What did I spend on coffee in the last 30 days?',
    steps: [
      [
        ai([
          { type: 'text', body: "Counted up everything tagged ☕ or matching coffee shops in your transactions:" },
          { type: 'rich', kind: 'coffee' },
        ], {
          chips: [
            { label: 'Compare to last month' },
            { label: 'Set a coffee budget', primary: true },
            { label: 'See all transactions' },
          ],
        }),
      ],
    ],
  },

  // ─── Log an expense ───────────────────────────────────────────
  log: {
    initial: 'I want to log an expense.',
    steps: [
      [
        ai([
          { type: 'text', body: "Sure! Here's a quick form — fill what you have, I'll figure out the rest." },
          { type: 'rich', kind: 'expenseForm' },
        ]),
      ],
    ],
  },

  // ─── Compare TSLA vs NVDA ─────────────────────────────────────
  compare: {
    initial: 'TSLA vs NVDA — which is doing better?',
    steps: [
      [
        ai([
          { type: 'text', body: "Snapshot of where each sits today:" },
          { type: 'rich', kind: 'compareStocks' },
        ]),
        ai([
          { type: 'text', body: "Different bets, really — NVDA has been the AI-infrastructure play; TSLA is more about EV demand + autonomy story. \"Better\" depends on what you're trying to do. Want a 5-year chart or fundamentals breakdown?" },
        ], {
          chips: [
            { label: '5-year chart', primary: true },
            { label: 'Fundamentals' },
            { label: 'Should I buy either?' },
          ],
        }),
      ],
    ],
  },

  // ─── Goals ────────────────────────────────────────────────────
  goals: {
    initial: 'Show my goals',
    steps: [
      [
        ai([
          { type: 'text', body: "Here's where each one stands. You're ahead of pace on Japan trip 🎌" },
          { type: 'rich', kind: 'goals' },
        ], {
          chips: [
            { label: 'Add a new goal', primary: true },
            { label: 'Adjust contributions' },
          ],
        }),
      ],
    ],
  },

  // ─── Afford ───────────────────────────────────────────────────
  afford: {
    initial: 'Can I afford this apartment? ¥6.2M, 50% down.',
    steps: [
      [
        ai([
          { type: 'text', body: "Let me run the numbers based on what I know about you. Mortgage assumed at 4.1% / 25y." },
          { type: 'rich', kind: 'afford' },
        ]),
        ai([
          { type: 'text', body: "Short answer: tight but doable.\n\nThe **34% debt-to-income** is on the higher end of comfortable (banks here typically cap around 50%, but past 35% your monthly flexibility shrinks fast).\n\nIf rates went up 1%, your monthly payment jumps ~¥1,800. Worth stress-testing." },
        ], {
          chips: [
            { label: 'Stress-test at 5.1%', primary: true },
            { label: 'What if I put 40% down?' },
            { label: 'Compare to renting' },
          ],
        }),
      ],
    ],
  },
};

// Generic acknowledge for free text not matching a flow
const GENERIC_REPLIES = [
  "I can help with that. Could you tell me a bit more — are you thinking about budgeting, saving, or investing?",
  "Got it. Want me to pull from your linked accounts to ground the answer in real numbers?",
  "Happy to dig in. What outcome would feel like a win here?",
];

window.PENNY_FLOWS = FLOWS;
window.PENNY_SUGGESTED = SUGGESTED;
window.PENNY_QUICK_CHIPS = QUICK_CHIPS;
window.PENNY_GENERIC = GENERIC_REPLIES;
