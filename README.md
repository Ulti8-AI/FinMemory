# FinMemory 2.0 — Full Stack

FinMemory is the full-stack version of the earlier four-file FinMemory prototype.

## Files

- `public/index.html`
- `public/styles.css`
- `public/app.js`
- `server.js`
- `package.json`
- `README.md`

## OneBit

Create this as a **Node.js/Web Service**, not Static Hosting.

Environment variables:

- `SUPABASE_URL` = your Supabase project URL
- `SUPABASE_KEY` = your Supabase publishable key

Never put a Supabase secret/service-role key in GitHub.

The app uses `npm start`, and OneBit supplies the `PORT`.

## Supabase

The project should already have these tables:

- profiles
- transactions
- categories
- budgets
- goals

RLS policies ensure authenticated users can only access their own rows.

## Current features

Email/password accounts, user profiles, transaction recording, built-in categories, Money Memory search, calendar, Money Replay, patterns, Money Detective, forecast, budgets, goals, basic local Money Assistant, and JSON export.

## Next modules

Custom-category UI, recurring transactions, transfers, multiple wallets, receipt/statement import, voice logging, subscriptions, bills, debt, net worth, multi-currency accounts, offline PWA, real AI assistant, AI insights, and production launch/monetization hardening.
