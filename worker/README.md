# Happy Boo Download Counter Worker

This Cloudflare Worker stores a public download total for the Happy Boo download store.

## Endpoints

- `GET /total` returns the public download total.
- `POST /download` increments and returns the public download total.

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
