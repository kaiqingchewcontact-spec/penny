# Penny PWA

> Your money buddy. Warm AI financial assistant with deterministic calculators.

A multi-jurisdiction (MY/US/SG/UK) financial chat app built on Vite + React + TypeScript, deployed on Vercel, with Anthropic for AI and Stripe for subscriptions.

**Architecture in one breath:** Browser-side SPA → `/api/chat` Vercel function → Anthropic with tool-use → server-side calculator dispatch → typed results back to the chat. No API keys ever touch the browser. Stripe webhooks update tier state. PWA manifest + service worker for "install to home screen."

---

## What's in the box

```
penny-pwa/
├── src/
│   ├── lib/
│   │   ├── jurisdictions/      # MY/US/SG/UK config — single source of truth
│   │   ├── calculators/        # 17 deterministic calculators, fully tested
│   │   ├── tools/              # Anthropic tool-use schemas (one per calc)
│   │   └── prompts/            # Versioned system prompts
│   ├── routes/                 # Landing, Chat, Account, Terms, Privacy
│   ├── components/             # PennyMascot, ChatBubble, PaywallModal, etc.
│   └── styles/                 # CSS tokens + Tailwind
├── api/
│   ├── chat.ts                 # Tool-use loop — runs calcs server-side
│   └── stripe/
│       ├── create-checkout.ts  # Subscription start
│       └── webhook.ts          # Tier source-of-truth
├── tests/calculators.test.ts   # 41 tests, all green
└── docs/
    ├── ARCHITECTURE.md
    ├── SKILLSETS.md            # What Penny can do, by tier
    ├── RAG_PLAN.md             # Knowledge corpus plan
    └── COMPLIANCE.md           # MY PDPA + general disclaimers
```

---

## Quick start (local)

```bash
# 1. Install
npm install

# 2. Set up env
cp .env.example .env.local
# Edit .env.local — at minimum, add ANTHROPIC_API_KEY.
# (Stripe vars only needed if you want to test paid tiers locally.)

# 3. Run frontend + backend
npm run dev                          # Terminal 1: Vite on :3000
npx vercel dev --listen 3001         # Terminal 2: API routes on :3001
# Open http://localhost:3000
```

The Vite dev server proxies `/api/*` to the Vercel CLI on port 3001. If you skip the Vercel CLI, the chat will fail to call the AI — but you can still see the UI.

---

## Deploy to Vercel

See **[DEPLOY.md](./DEPLOY.md)** for the step-by-step. Short version:

1. Push this repo to GitHub
2. Import at [vercel.com/new](https://vercel.com/new) — Vite preset, no config needed
3. Add env vars in **Settings → Environment Variables** (see `.env.example`)
4. Deploy

Stripe webhook setup is in DEPLOY.md too — don't skip it or your subscriptions won't work.

---

## Tests

```bash
npm test          # one-shot, CI mode
npm run test:watch
```

41 calculator tests. They're not for show — every retirement projection, tax bracket, debt-strategy comparison, Monte Carlo run is verified against expected math. If you change a calculator, run them.

```bash
npm run typecheck    # strict TS, no errors allowed
npm run lint         # ESLint, no warnings allowed
```

---

## Tier model

| Tier | Calculators | Messages | Price |
|------|-------------|----------|-------|
| **Free** | Compound, loan, allocation suggestions | 20/day | $0 |
| **Pro** | + retirement projection, tax brackets, debt strategy, refi break-even | Unlimited | ~$9-12/mo |
| **Premium** | + Monte Carlo, DCF, NPV/IRR, bond YTM, expert sessions | Unlimited | ~$24-29/mo |

Tier gating happens in **three layers**:

1. `getToolsForTier(userTier)` filters which tools the LLM even sees → it can't ask to use one it doesn't have
2. `runCalculator()` dispatch double-checks tier on the server → defense in depth
3. Stripe webhook is **the** source of truth for what tier a user actually has → never trust localStorage

Edit `CALCULATOR_TIERS` in `src/lib/calculators/index.ts` to change which calc lives in which tier.

---

## What works, what to wire up

**Working out of the box:**
- Vite build + PWA manifest + service worker
- All 17 calculators with tests
- Tool-use chat loop end-to-end (with `ANTHROPIC_API_KEY`)
- Stripe Checkout creation + webhook handler with signature verification
- Multi-jurisdiction config (MY/US/SG/UK)
- Landing → Chat → Account → Paywall → Expert escalation flow
- Mobile-first layout, safe-area aware, install-to-home-screen ready

**You'll need to wire up:**
- **Auth.** There's no login yet. The webhook stores subscriptions by `userId` (in metadata), but the front-end doesn't have a user ID to pass yet. Drop in [Supabase Auth](https://supabase.com/docs/guides/auth) or [Clerk](https://clerk.com) and pass the user ID through. ~1 day of work.
- **Database.** Subscription state lives in an in-memory `Map` in `api/stripe/webhook.ts`. That works for dev/demo but you need a real DB (Supabase Postgres is the path of least resistance). The `SubscriptionRecord` shape is defined — swap the Map for DB calls. ~half a day.
- **Rate limiting.** `/api/chat` will happily burn your Anthropic budget if someone scripts it. Add Upstash Redis-based rate limiting (env vars in `.env.example`). ~1 hour.
- **Knowledge corpus / RAG.** Penny gives general frameworks today. To cite specific local rules ("EPF Account 2 limits as of YYYY"), you'll want a RAG layer. Plan in [`docs/RAG_PLAN.md`](./docs/RAG_PLAN.md).

---

## Voice & content principles

These shaped every decision; reading them helps if you change anything:

1. **Numbers are sacred.** The LLM never does math by hand — it calls calculators that return verified deterministic results.
2. **Education, not advice.** Frameworks, math, analysis. Not "you should buy X" or "claim Y on your taxes." When the user crosses that line, route to a human.
3. **Jurisdictionally aware.** Tax brackets and retirement accounts are not US-default-with-others-as-afterthought. All four are first-class.
4. **Honest about limits.** Real data is updated periodically; we surface that. AI can be wrong; we say so.

---

## Stack

- **Vite 6** + **React 18** + **TypeScript 5.7** (strict mode)
- **Tailwind 3.4** with Penny design tokens
- **React Router 6** (single SPA, no SSR)
- **vite-plugin-pwa** for manifest + workbox
- **Anthropic SDK** for the chat backend
- **Stripe SDK** for subscriptions
- **Vitest** for tests
- **Vercel** for hosting (serverless functions for `/api/*`)

---

## License

Proprietary. Don't redistribute the source. The calculator math is public-domain math; the implementation, prompts, and design are not.
