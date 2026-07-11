# Happy Boo Download Counter Worker

This Cloudflare Worker stores a public download total for the Happy Boo download store.

The store also includes `chatbot-worker.js`, a separate Cloudflare Workers AI endpoint for the
Happy Boo guide chatbot.

## Endpoints

- `GET /total` returns the public site-wide download total and per-product download totals.
- `POST /download` increments the site-wide total and, when `productId` is provided, that product's total.

## Setup

1. Install Wrangler outside the site dependencies if needed:

   ```bash
   npm install --global wrangler
   ```

2. Copy the example config:

   ```bash
   cp worker/wrangler.toml.example worker/wrangler.toml
   ```

3. Create a KV namespace and put its ID in `worker/wrangler.toml`:

   ```bash
   wrangler kv namespace create DONATION_TOTAL
   ```

4. Deploy:

   ```bash
   wrangler deploy
   ```

5. Set the frontend environment variable before building the store:

   ```bash
   VITE_STORE_STATS_URL=https://your-worker-url/total npm run build
   ```

Without `VITE_STORE_STATS_URL`, the site still builds and shows `Updates soon` for the download total.

## Chatbot Worker

Deploy `worker/chatbot-worker.js` as a separate Worker named `happy-boo-chatbot` with:

- an Workers AI binding named `AI`
- `ALLOWED_ORIGIN=https://store.arjunrao.dev`

The frontend expects:

```bash
VITE_CHATBOT_URL=https://happy-boo-chatbot.your-subdomain.workers.dev/chat
```

The chatbot does not use a public AI API key. Cloudflare runs the model through the Worker account
binding, and the site only receives the Worker URL.
