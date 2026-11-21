# Coachly

Chat with an AI fitness coach. Every reply moves you toward the next rank.

Next.js (App Router) + Tailwind. The browser talks only to `/api/chat`, which forwards to an n8n webhook, so the webhook URL and token stay server-side. The webhook contract is in `../../workflows/coachly-webhook.md`.

## Run

```
npm install
cp .env.example .env.local   # then fill in the values
npm run dev                  # http://localhost:3000
```

| Variable | Purpose |
|---|---|
| `N8N_WEBHOOK_URL` | Production webhook URL of the n8n workflow (workflow must be active) |
| `N8N_AUTH_TOKEN` | Secret sent as the `X-Coachly-Token` header; must match the n8n Header Auth credential |

## Progress

Message count and rank are stored in this browser's localStorage (`lib/progress.ts`). To store them elsewhere, replace `progressStore`.
