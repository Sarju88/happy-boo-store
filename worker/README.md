# Happy Boo Donation Tracker Worker

This Cloudflare Worker stores a public donation total for the Happy Boo download store.

## Endpoints

- `GET /total` returns the public donation total.
- `POST /download` increments and returns the public download total.
- `POST /paypal/webhook` receives PayPal webhook events, verifies them with PayPal, deduplicates event IDs, and adds completed payments to the total.

## Important PayPal note

The current site shows a PayPal QR image. A QR by itself does not guarantee this worker will receive PayPal webhook events. For automatic tracking, the PayPal donation flow must be connected to a PayPal developer app/webhook, or you need a separate transaction-polling job against your PayPal account.

This worker is set up for the webhook path.

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

4. Set PayPal secrets:

   ```bash
   cd worker
   wrangler secret put PAYPAL_CLIENT_ID
   wrangler secret put PAYPAL_CLIENT_SECRET
   wrangler secret put PAYPAL_WEBHOOK_ID
   ```

5. Deploy:

   ```bash
   wrangler deploy
   ```

6. In the PayPal developer dashboard, set the webhook URL to:

   ```text
   https://your-worker-url/paypal/webhook
   ```

7. Set the frontend environment variable before building the store:

   ```bash
   VITE_DONATION_TOTAL_URL=https://your-worker-url/total npm run build
   ```

Without `VITE_DONATION_TOTAL_URL`, the site still builds and shows `Updates soon` for the donation total.
