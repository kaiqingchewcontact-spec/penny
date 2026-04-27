# DEPLOY.md

End-to-end deploy: GitHub → Vercel → Stripe webhook → live URL.

Time: ~30 minutes if you have accounts already.

---

## 1. Push to GitHub

```bash
# From the unzipped folder
git init
git add .
git commit -m "initial scaffold"
git branch -M main
git remote add origin https://github.com/<your-org>/penny.git
git push -u origin main
```

If you cloned this from somewhere with history, just `git push` — same outcome.

---

## 2. Import to Vercel

1. Go to [vercel.com/new](https://vercel.com/new)
2. **Import** your GitHub repo
3. **Framework Preset:** Vite (auto-detected)
4. **Build Command:** `npm run build` (default)
5. **Output Directory:** `dist` (default)
6. Don't deploy yet — click **Environment Variables** first

---

## 3. Set environment variables

In Vercel → **Project → Settings → Environment Variables**, add the following.
Set each one for **Production, Preview, and Development** unless noted.

### Required for chat to work

| Variable | Value | Notes |
|---|---|---|
| `ANTHROPIC_API_KEY` | `sk-ant-api03-...` | From [console.anthropic.com/settings/keys](https://console.anthropic.com/settings/keys). Server-only — do NOT prefix with `VITE_`. |
| `ANTHROPIC_MODEL` | `claude-sonnet-4-5-20250929` | Or whichever model you want as default. |
| `APP_URL` | `https://your-app.vercel.app` | Used in Stripe redirects. Update after first deploy. |
| `ALLOWED_ORIGINS` | `https://your-app.vercel.app` | CORS allowlist. Comma-separate if multiple. |

### Required for subscriptions

| Variable | Value | Notes |
|---|---|---|
| `STRIPE_SECRET_KEY` | `sk_test_...` (start with test) | [dashboard.stripe.com/test/apikeys](https://dashboard.stripe.com/test/apikeys) |
| `STRIPE_WEBHOOK_SECRET` | `whsec_...` | Set after creating the webhook in step 5. |
| `STRIPE_PRICE_PRO_MONTHLY` | `price_...` | From step 4. |
| `STRIPE_PRICE_PRO_YEARLY` | `price_...` | |
| `STRIPE_PRICE_PREMIUM_MONTHLY` | `price_...` | |
| `STRIPE_PRICE_PREMIUM_YEARLY` | `price_...` | |
| `VITE_STRIPE_PUBLISHABLE_KEY` | `pk_test_...` | Public key. The `VITE_` prefix exposes it to the browser — that's correct for the publishable key. |

Now click **Deploy**. First build takes ~90 seconds.

---

## 4. Create Stripe products and prices

In [Stripe Dashboard → Products](https://dashboard.stripe.com/test/products), create:

### Penny Pro
- **Name:** Penny Pro
- **Pricing:** Recurring, two prices
  - $12 / month → copy the price ID (`price_...`) → `STRIPE_PRICE_PRO_MONTHLY`
  - $108 / year → copy → `STRIPE_PRICE_PRO_YEARLY`

### Penny Premium
- **Name:** Penny Premium
- **Pricing:** Recurring, two prices
  - $29 / month → `STRIPE_PRICE_PREMIUM_MONTHLY`
  - $290 / year → `STRIPE_PRICE_PREMIUM_YEARLY`

Update the env vars in Vercel with these IDs and **Redeploy** so the API routes pick them up.

(Adjust prices to taste. The numbers above match the README.)

---

## 5. Set up Stripe webhook

This step is critical. Without it, subscriptions never update tier state.

1. [Stripe Dashboard → Developers → Webhooks → Add endpoint](https://dashboard.stripe.com/test/webhooks/create)
2. **Endpoint URL:** `https://your-app.vercel.app/api/stripe/webhook`
3. **Events to send** — select these:
   - `checkout.session.completed`
   - `customer.subscription.created`
   - `customer.subscription.updated`
   - `customer.subscription.deleted`
   - `invoice.payment_failed`
4. Click **Add endpoint**
5. Copy the **Signing secret** (`whsec_...`) → paste into Vercel env vars as `STRIPE_WEBHOOK_SECRET`
6. **Redeploy** in Vercel so the webhook handler picks up the new secret

---

## 6. Test the full flow

1. Visit `https://your-app.vercel.app`
2. Pick a jurisdiction → start chat → ask "I'm 32 with $50k saved, will I retire OK at 65?"
3. Penny should respond. (If not: check Vercel function logs for `/api/chat` errors.)
4. Click **Upgrade** in the paywall → Stripe Checkout opens (in test mode)
5. Use card `4242 4242 4242 4242`, any future expiry, any CVC, any zip
6. Should redirect back to `/account?checkout=success`
7. Check Stripe webhook logs — the `checkout.session.completed` event should show up with a 200 response
8. Check Vercel function logs for the webhook → should print `[webhook] checkout.completed userId=anonymous tier=pro`

If all that works, you're good. Switch Stripe to **live mode** when ready, regenerate keys, update env vars, redeploy.

---

## 7. Promote to production

When ready for real users:

1. Stripe → toggle **Test mode → Live mode**, regenerate API keys, repeat steps 4 + 5 with live keys/webhook
2. Update Vercel env vars with the live `sk_live_*`, `whsec_*`, and live price IDs
3. Update `APP_URL` and `ALLOWED_ORIGINS` to your production domain
4. **Critical:** Replace the in-memory `subscriptionStore` Map in `api/stripe/webhook.ts` with a real database (see PRODUCTION TODO comment in the file). Without this, all subscription state vanishes when the function cold-starts.
5. Add auth (Supabase, Clerk, etc.) and pass real `userId`s to checkout creation so webhooks can attribute subscriptions correctly

---

## Troubleshooting

**"AI call failed" in chat**
Open Vercel → Functions → `/api/chat` logs. Most common: missing `ANTHROPIC_API_KEY`, or the key is wrong, or the model name is invalid.

**Webhook returns 400 "Invalid signature"**
Either `STRIPE_WEBHOOK_SECRET` doesn't match the signing secret in Stripe, or you didn't redeploy after adding it. The secret in Vercel must match exactly.

**Webhook returns 200 but tier doesn't update**
Expected with the in-memory store on Vercel — serverless functions are stateless across invocations. Wire up a real DB.

**Stripe Checkout returns "No price configured"**
You haven't set the `STRIPE_PRICE_*` env vars yet, or you set them but didn't redeploy.

**`/api/chat` works locally but 500s in production**
Check that env vars are set for the **Production** environment (not just Development) in Vercel settings.

**Tests fail after my changes**
Good — that's the point. Run `npm test` and read the failures. The math is well-tested; if you broke it, the test will tell you exactly which expectation diverged.

---

## Optional but recommended

- **Custom domain.** Vercel → Settings → Domains. Update `APP_URL` and `ALLOWED_ORIGINS` after.
- **Rate limiting.** Free Upstash Redis tier + add 5-line middleware to `/api/chat`. Stops anyone from running up your Anthropic bill.
- **Error tracking.** Sentry or similar — drop the SDK into `main.tsx` and the API routes.
- **Analytics.** Vercel Analytics is free and respects privacy.

That's it. You should now have a live, deployed, working Penny.
