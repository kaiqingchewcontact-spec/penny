import type { UserProfile } from './profile';

// ─── Archetypes ──────────────────────────────────────────────
export interface LearningPath {
  id: string;
  name: string;
  emoji: string;
  description: string;
  trigger: string; // what the user says that maps here
  lessons: Lesson[];
}

export interface Lesson {
  id: string;
  title: string;
  emoji: string;
  objective: string;       // what they'll understand after
  concepts: string[];      // key terms Penny will explain
  quizQuestion: string;    // comprehension check
  quizOptions: string[];
  quizAnswer: number;      // index of correct option
  actionStep: string;      // one thing to do today
  nextLesson: string | null;
}

export const LEARNING_PATHS: LearningPath[] = [
  {
    id: 'anxious-beginner',
    name: 'The anxious beginner',
    emoji: '😰',
    description: "You're new to managing money and it feels overwhelming. Let's start with safety and basics.",
    trigger: "scared|anxious|no idea|don't know|overwhelmed|lost|beginner",
    lessons: [
      {
        id: 'ab-1', title: 'Your money snapshot', emoji: '📸',
        objective: 'Know exactly where your money is right now',
        concepts: ['net worth', 'income vs expenses', 'cash flow'],
        quizQuestion: "If you earn RM4,000 and spend RM3,500, what's your monthly cash flow?",
        quizOptions: ['RM4,000', 'RM500', 'RM3,500', 'RM7,500'],
        quizAnswer: 1,
        actionStep: "Write down every account you have and its balance — savings, current, e-wallets. That's your starting point.",
        nextLesson: 'ab-2',
      },
      {
        id: 'ab-2', title: 'The 50/30/20 budget', emoji: '📊',
        objective: 'Have a simple framework for where your money should go',
        concepts: ['needs vs wants', '50/30/20 rule', 'fixed vs variable expenses'],
        quizQuestion: "In the 50/30/20 rule, which category gets 20%?",
        quizOptions: ['Needs (rent, food, bills)', 'Wants (dining, shopping)', 'Savings & debt repayment', 'Taxes'],
        quizAnswer: 2,
        actionStep: "Look at last month's bank statement. Categorise your top 5 expenses as Need or Want.",
        nextLesson: 'ab-3',
      },
      {
        id: 'ab-3', title: 'Emergency fund', emoji: '🛟',
        objective: 'Understand why you need a safety net and how big it should be',
        concepts: ['emergency fund', 'months of expenses', 'liquid savings', 'high-yield savings'],
        quizQuestion: "How many months of expenses should an emergency fund cover?",
        quizOptions: ['1 month', '2 months', '3-6 months', '12 months minimum'],
        quizAnswer: 2,
        actionStep: "Calculate your monthly essential expenses. Multiply by 3. That's your emergency fund target.",
        nextLesson: 'ab-4',
      },
      {
        id: 'ab-4', title: 'Good debt vs bad debt', emoji: '⚖️',
        objective: 'Know which debts to tackle first',
        concepts: ['interest rates', 'secured vs unsecured', 'good debt vs bad debt', 'minimum payments'],
        quizQuestion: "Which debt should you typically pay off first?",
        quizOptions: ['The biggest one', 'The one with highest interest rate', 'The oldest one', 'The one with lowest balance'],
        quizAnswer: 1,
        actionStep: "List all your debts with their interest rates. Circle the highest one.",
        nextLesson: 'ab-5',
      },
      {
        id: 'ab-5', title: 'Your EPF is already investing', emoji: '🌱',
        objective: 'Understand that you already have investments through EPF/CPF/401k',
        concepts: ['EPF/CPF/401k', 'employer match', 'compound growth', 'retirement accounts'],
        quizQuestion: "If your employer contributes 13% of your salary to EPF, and you contribute 11%, what percentage of your salary goes to retirement?",
        quizOptions: ['11%', '13%', '24%', '2%'],
        quizAnswer: 2,
        actionStep: "Log into your EPF/CPF/retirement account online. Note your total balance and which funds your money is in.",
        nextLesson: null,
      },
    ],
  },
  {
    id: 'curious-explorer',
    name: 'The curious explorer',
    emoji: '🧭',
    description: "You want to understand how money and markets work. Let's build your knowledge.",
    trigger: "learn|understand|curious|how does|explain|teach me",
    lessons: [
      {
        id: 'ce-1', title: 'What is investing, really?', emoji: '🌍',
        objective: 'Understand investing as buying future cash flows',
        concepts: ['stocks', 'bonds', 'risk vs return', 'time horizon'],
        quizQuestion: "When you buy a stock, what are you actually buying?",
        quizOptions: ['A lottery ticket', 'A small piece of ownership in a company', 'A loan to the government', 'Insurance against losses'],
        quizAnswer: 1,
        actionStep: "Pick one company you use daily (Grab, Petronas, Apple). Google their stock price. You now know what one share costs.",
        nextLesson: 'ce-2',
      },
      {
        id: 'ce-2', title: 'Risk is not the same as danger', emoji: '🎲',
        objective: 'Understand risk as volatility, not loss',
        concepts: ['volatility', 'risk tolerance', 'diversification', 'time reduces risk'],
        quizQuestion: "If a stock drops 20% in one month, which statement is most accurate?",
        quizOptions: ['You lost 20% of your money permanently', 'The stock is now cheaper but may recover', 'You should sell immediately', 'The company is failing'],
        quizAnswer: 1,
        actionStep: "Think about how you'd feel if your investments dropped 30% tomorrow. Write down your honest reaction — that's your risk tolerance.",
        nextLesson: 'ce-3',
      },
      {
        id: 'ce-3', title: 'ETFs: the lazy investor's best friend', emoji: '🧺',
        objective: "Understand why index funds beat most active strategies",
        concepts: ['ETF', 'index fund', 'expense ratio', 'passive vs active', 'diversification'],
        quizQuestion: "What makes an index ETF different from picking individual stocks?",
        quizOptions: ['It guarantees profits', 'It holds hundreds of stocks at once, spreading risk', 'It only holds safe stocks', "It's managed by AI"],
        quizAnswer: 1,
        actionStep: "Search for 'VWRA' or 'VOO' on Google. Read the top line: what index does it track, and how many companies does it hold?",
        nextLesson: 'ce-4',
      },
      {
        id: 'ce-4', title: 'The power of compound interest', emoji: '📈',
        objective: 'See how time is your biggest investing advantage',
        concepts: ['compound interest', 'rule of 72', 'early start advantage', 'reinvesting returns'],
        quizQuestion: "At 7% annual return, roughly how many years does it take to double your money?",
        quizOptions: ['5 years', '7 years', '10 years', '15 years'],
        quizAnswer: 2,
        actionStep: "Try this: RM500/month at 7% for 30 years = ~RM567,000. You only put in RM180,000. The rest is compound interest.",
        nextLesson: 'ce-5',
      },
      {
        id: 'ce-5', title: 'Building your first portfolio', emoji: '🧱',
        objective: 'Know the basic building blocks of a simple portfolio',
        concepts: ['asset allocation', 'stocks/bonds split', 'rebalancing', 'age-based allocation'],
        quizQuestion: "A common rule of thumb for stock allocation is '110 minus your age'. If you're 30, how much should be in stocks?",
        quizOptions: ['30%', '70%', '80%', '110%'],
        quizAnswer: 2,
        actionStep: "Write down your age. Subtract from 110. That percentage in stocks, the rest in bonds — that's your starting allocation.",
        nextLesson: null,
      },
    ],
  },
  {
    id: 'goal-chaser',
    name: 'The goal chaser',
    emoji: '🎯',
    description: "You have something specific you're working toward. Let's build a plan with real numbers.",
    trigger: "save for|house|retire|wedding|car|goal|target|down payment",
    lessons: [
      {
        id: 'gc-1', title: 'Define your goal in numbers', emoji: '🔢',
        objective: 'Turn a vague goal into a specific target with a deadline',
        concepts: ['SMART goals', 'target amount', 'timeline', 'monthly savings needed'],
        quizQuestion: "Which is a better financial goal?",
        quizOptions: ["'Save more money'", "'Save RM50,000 for a house down payment in 3 years'", "'Be rich by 40'", "'Invest in stocks'"],
        quizAnswer: 1,
        actionStep: "Write your goal as: 'I want [amount] by [date] for [purpose]'. Calculate the monthly savings needed.",
        nextLesson: 'gc-2',
      },
      {
        id: 'gc-2', title: 'Where to park your money', emoji: '🏦',
        objective: 'Match the right savings vehicle to your timeline',
        concepts: ['savings account', 'fixed deposit', 'ASB/unit trust', 'timeline matching'],
        quizQuestion: "If your goal is 2 years away, where should you keep the money?",
        quizOptions: ['Stocks — highest returns', 'High-yield savings or fixed deposit — safe and accessible', 'Crypto — might moon', 'Under the mattress'],
        quizAnswer: 1,
        actionStep: "Check your current savings account interest rate. Compare it with at least 2 alternatives (FD rates, ASB, money market).",
        nextLesson: 'gc-3',
      },
      {
        id: 'gc-3', title: 'Automate so you can forget', emoji: '⚙️',
        objective: 'Set up systems so saving happens without willpower',
        concepts: ['pay yourself first', 'auto-transfer', 'separate accounts', 'friction'],
        quizQuestion: "When should you transfer money to savings each month?",
        quizOptions: ['After paying all bills', 'At the end of the month if anything is left', 'Right after payday, before spending', 'Only when you feel like it'],
        quizAnswer: 2,
        actionStep: "Set up an auto-transfer from your main account to your goal account for the day after payday.",
        nextLesson: 'gc-4',
      },
      {
        id: 'gc-4', title: 'Track and adjust', emoji: '📊',
        objective: 'Know if you are on track and how to course-correct',
        concepts: ['progress tracking', 'milestone rewards', 'adjusting timeline', 'bonus windfalls'],
        quizQuestion: "If you're 6 months in and only 35% toward your goal (should be 50%), what should you do?",
        quizOptions: ['Give up', 'Increase monthly savings or extend the timeline', 'Ignore it and hope for the best', 'Take on debt to catch up'],
        quizAnswer: 1,
        actionStep: "Calculate: (current savings / target) × 100. That's your progress percentage. Are you on track?",
        nextLesson: null,
      },
    ],
  },
  {
    id: 'debt-fighter',
    name: 'The debt fighter',
    emoji: '⚔️',
    description: "Debt feels heavy but it's a math problem with a solution. Let's attack it systematically.",
    trigger: "debt|owe|loan|ptptn|credit card|drowning|pay off",
    lessons: [
      {
        id: 'df-1', title: 'Face the full picture', emoji: '🔍',
        objective: 'Know exactly what you owe, to whom, and at what rate',
        concepts: ['total debt', 'interest rates', 'minimum payments', 'principal vs interest'],
        quizQuestion: "Why is knowing the interest rate on each debt important?",
        quizOptions: ['It helps you feel bad', 'Higher-rate debts cost more over time, so you prioritise them', "It doesn't matter, all debt is the same", 'Banks like it when you ask'],
        quizAnswer: 1,
        actionStep: "List every debt: who you owe, total balance, interest rate, minimum payment. Put them in a table.",
        nextLesson: 'df-2',
      },
      {
        id: 'df-2', title: 'Avalanche vs snowball', emoji: '❄️',
        objective: 'Choose a debt payoff strategy that fits your personality',
        concepts: ['avalanche method', 'snowball method', 'psychological wins', 'interest savings'],
        quizQuestion: "The avalanche method pays off debts in order of:",
        quizOptions: ['Smallest balance first', 'Highest interest rate first', 'Oldest debt first', 'Random order'],
        quizAnswer: 1,
        actionStep: "Sort your debt list by interest rate (highest first). That's your avalanche order. Now sort by balance (smallest first). That's your snowball order. Which feels more motivating?",
        nextLesson: 'df-3',
      },
      {
        id: 'df-3', title: 'Finding extra money', emoji: '🔎',
        objective: 'Identify where to find extra ringgit to throw at debt',
        concepts: ['expense audit', 'subscriptions', 'side income', 'negotiating rates'],
        quizQuestion: "Which approach gives the fastest debt reduction?",
        quizOptions: ['Cut all spending to zero', 'Find 2-3 expenses to reduce and redirect that money to debt', 'Wait for a raise', 'Only pay minimums'],
        quizAnswer: 1,
        actionStep: "Check your subscriptions right now. Cancel one you haven't used in 30 days. Redirect that money to your highest-rate debt.",
        nextLesson: 'df-4',
      },
      {
        id: 'df-4', title: 'Staying debt-free', emoji: '🛡️',
        objective: 'Build habits so you never end up here again',
        concepts: ['emergency fund prevents debt', 'credit card discipline', 'sinking funds', 'lifestyle inflation'],
        quizQuestion: "What is the best defence against falling back into debt?",
        quizOptions: ['Never use credit cards', 'Having an emergency fund so unexpected costs don\'t go on credit', 'Earning more money', 'Avoiding all purchases'],
        quizAnswer: 1,
        actionStep: "Even while paying off debt, start a tiny emergency fund — even RM500. It prevents new debt from surprises.",
        nextLesson: null,
      },
    ],
  },
  {
    id: 'market-watcher',
    name: 'The market watcher',
    emoji: '📈',
    description: "You're interested in markets but need to separate signal from noise.",
    trigger: "stock|crypto|market|invest|trade|buy|sell|bitcoin|tesla",
    lessons: [
      {
        id: 'mw-1', title: 'Speculation vs investing', emoji: '🎰',
        objective: 'Know the difference between gambling on price and investing in value',
        concepts: ['speculation', 'investing', 'fundamental value', 'price vs value'],
        quizQuestion: "Buying a stock because 'it went up 50% last month' is an example of:",
        quizOptions: ['Smart investing', 'Speculation based on momentum', 'Fundamental analysis', 'Diversification'],
        quizAnswer: 1,
        actionStep: "Think of the last stock or crypto you were excited about. Did you research the company/project, or did you see the price going up?",
        nextLesson: 'mw-2',
      },
      {
        id: 'mw-2', title: 'How to read a stock', emoji: '📋',
        objective: 'Understand basic metrics without being an analyst',
        concepts: ['P/E ratio', 'market cap', 'revenue growth', 'dividend yield'],
        quizQuestion: "A P/E ratio of 50 means:",
        quizOptions: ['The stock costs RM50', "You're paying RM50 for every RM1 of earnings", 'The stock gained 50%', 'The company has 50 employees'],
        quizAnswer: 1,
        actionStep: "Pick any stock on Bursa/NYSE. Look up its P/E ratio and revenue growth. Is the P/E higher or lower than its industry average?",
        nextLesson: 'mw-3',
      },
      {
        id: 'mw-3', title: 'Diversification is your seatbelt', emoji: '🧺',
        objective: "Understand why concentrating in one stock or sector is dangerous",
        concepts: ['concentration risk', 'sector diversification', 'geographic diversification', 'correlation'],
        quizQuestion: "If 80% of your portfolio is in one tech stock, your main risk is:",
        quizOptions: ['You might make too much money', 'Concentration — one bad quarter could wipe out most of your gains', 'You\'re too diversified', 'None, tech always goes up'],
        quizAnswer: 1,
        actionStep: "If you own any investments, calculate what percentage is in your single largest holding. If it's over 20%, think about why.",
        nextLesson: 'mw-4',
      },
      {
        id: 'mw-4', title: 'Your edge (you probably don\'t have one)', emoji: '🪞',
        objective: 'Understand why individual stock picking rarely beats the market',
        concepts: ['efficient market hypothesis', 'index investing', 'active vs passive', 'fees drag'],
        quizQuestion: "Over 20 years, what percentage of actively managed funds underperform the index?",
        quizOptions: ['About 30%', 'About 50%', 'About 70%', 'Over 85%'],
        quizAnswer: 3,
        actionStep: "Compare the 10-year return of your favourite stock with the S&P 500 or FTSE Bursa Malaysia KLCI. Did your pick win?",
        nextLesson: null,
      },
    ],
  },
];

// ─── Get path for user ──────────────────────────────────────
export function getPathForUser(profile: UserProfile): LearningPath | null {
  if (!profile.archetype) return null;
  return LEARNING_PATHS.find(p => p.id === profile.archetype) || null;
}

export function getNextLesson(profile: UserProfile): Lesson | null {
  const path = getPathForUser(profile);
  if (!path) return null;
  
  const completed = new Set(profile.lessonsCompleted || []);
  for (const lesson of path.lessons) {
    if (!completed.has(lesson.id)) return lesson;
  }
  return null; // all done
}

export function getProgress(profile: UserProfile): { completed: number; total: number; percentage: number } {
  const path = getPathForUser(profile);
  if (!path) return { completed: 0, total: 0, percentage: 0 };
  
  const completed = (profile.lessonsCompleted || []).filter(id => 
    path.lessons.some(l => l.id === id)
  ).length;
  
  return {
    completed,
    total: path.lessons.length,
    percentage: Math.round((completed / path.lessons.length) * 100),
  };
}

// ─── Generate follow-up suggestions ──────────────────────────
export function generateFollowUps(aiText: string, profile: UserProfile): string[] {
  const suggestions: string[] = [];
  const t = aiText.toLowerCase();

  // If there's a next lesson, suggest it
  const next = getNextLesson(profile);
  if (next) {
    suggestions.push(`Teach me: ${next.title}`);
  }

  if (t.includes('budget') || t.includes('spending')) {
    suggestions.push("How do I start budgeting?");
  }
  if (t.includes('invest') || t.includes('stock') || t.includes('etf')) {
    suggestions.push("What's an ETF?");
  }
  if (t.includes('save') || t.includes('emergency')) {
    suggestions.push("Where should I keep my savings?");
  }
  if (t.includes('debt') || t.includes('loan')) {
    suggestions.push("Snowball vs avalanche?");
  }
  if (t.includes('retire') || t.includes('epf')) {
    suggestions.push("Am I saving enough to retire?");
  }

  if (suggestions.length === 0) {
    suggestions.push("What should I learn next?", "Run some numbers for me");
  }

  return [...new Set(suggestions)].slice(0, 3);
}
