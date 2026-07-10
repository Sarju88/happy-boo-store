type KVNamespace = {
  get(key: string): Promise<string | null>;
  get<T = unknown>(key: string, type: "json"): Promise<T | null>;
  put(key: string, value: string): Promise<void>;
};

type Env = {
  DONATION_TOTAL: KVNamespace;
  PAYPAL_CLIENT_ID: string;
  PAYPAL_CLIENT_SECRET: string;
  PAYPAL_WEBHOOK_ID: string;
  PAYPAL_API_BASE?: string;
  ALLOWED_ORIGIN?: string;
  DONATION_CURRENCY?: string;
};

type StoredTotal = {
  totalCents: number;
  currency: string;
  updatedAt: string;
};

type StoredDownloadTotal = {
  totalDownloads: number;
  updatedAt: string;
};

type PayPalEvent = {
  id?: string;
  event_type?: string;
  resource?: {
    id?: string;
    amount?: {
      value?: string;
      currency_code?: string;
      total?: string;
    };
  };
};

const TOTAL_KEY = "donation-total";
const DOWNLOAD_TOTAL_KEY = "download-total";
const CENTS_PER_UNIT = 100;

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    const url = new URL(request.url);

    if (request.method === "OPTIONS") {
      return new Response(null, { headers: corsHeaders(env) });
    }

    if (request.method === "GET" && url.pathname === "/total") {
      return json(await readTotal(env), env);
    }

    if (request.method === "POST" && url.pathname === "/download") {
      return handleDownload(request, env);
    }

    if (request.method === "POST" && url.pathname === "/paypal/webhook") {
      return handlePayPalWebhook(request, env);
    }

    return json({ error: "Not found" }, env, 404);
  }
};

async function handleDownload(request: Request, env: Env): Promise<Response> {
  await request.text();

  const current = await readStoredDownloadTotal(env);
  const updated: StoredDownloadTotal = {
    totalDownloads: current.totalDownloads + 1,
    updatedAt: new Date().toISOString()
  };

  await env.DONATION_TOTAL.put(DOWNLOAD_TOTAL_KEY, JSON.stringify(updated));

  return json(await readTotal(env), env);
}

async function handlePayPalWebhook(request: Request, env: Env): Promise<Response> {
  const rawBody = await request.text();
  const event = JSON.parse(rawBody) as PayPalEvent;

  const verified = await verifyPayPalWebhook(request, rawBody, event, env);
  if (!verified) {
    return json({ error: "Webhook verification failed" }, env, 400);
  }

  const eventId = event.id?.trim();
  if (!eventId) {
    return json({ error: "Missing event id" }, env, 400);
  }

  const existingEvent = await env.DONATION_TOTAL.get(`event:${eventId}`);
  if (existingEvent) {
    return json({ ok: true, duplicate: true }, env);
  }

  const donation = extractDonation(event, env.DONATION_CURRENCY ?? "USD");
  if (!donation) {
    await env.DONATION_TOTAL.put(`event:${eventId}`, "ignored");
    return json({ ok: true, ignored: true }, env);
  }

  const current = await readStoredTotal(env, donation.currency);
  const updated: StoredTotal = {
    totalCents: current.totalCents + donation.amountCents,
    currency: donation.currency,
    updatedAt: new Date().toISOString()
  };

  await env.DONATION_TOTAL.put(TOTAL_KEY, JSON.stringify(updated));
  await env.DONATION_TOTAL.put(`event:${eventId}`, "counted");

  return json({ ok: true, total: await readTotal(env) }, env);
}

function extractDonation(event: PayPalEvent, expectedCurrency: string): { amountCents: number; currency: string } | null {
  if (!["PAYMENT.CAPTURE.COMPLETED", "PAYMENT.SALE.COMPLETED"].includes(event.event_type ?? "")) {
    return null;
  }

  const amount = event.resource?.amount;
  const value = amount?.value ?? amount?.total;
  const currency = amount?.currency_code ?? expectedCurrency;
  if (!value || currency !== expectedCurrency) {
    return null;
  }

  const amountCents = Math.round(Number(value) * CENTS_PER_UNIT);
  if (!Number.isFinite(amountCents) || amountCents <= 0) {
    return null;
  }

  return { amountCents, currency };
}

async function verifyPayPalWebhook(request: Request, rawBody: string, event: PayPalEvent, env: Env): Promise<boolean> {
  const accessToken = await getPayPalAccessToken(env);
  const paypalBase = env.PAYPAL_API_BASE ?? "https://api-m.paypal.com";
  const response = await fetch(`${paypalBase}/v1/notifications/verify-webhook-signature`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${accessToken}`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      auth_algo: request.headers.get("paypal-auth-algo"),
      cert_url: request.headers.get("paypal-cert-url"),
      transmission_id: request.headers.get("paypal-transmission-id"),
      transmission_sig: request.headers.get("paypal-transmission-sig"),
      transmission_time: request.headers.get("paypal-transmission-time"),
      webhook_id: env.PAYPAL_WEBHOOK_ID,
      webhook_event: JSON.parse(rawBody) as PayPalEvent
    })
  });

  if (!response.ok) {
    return false;
  }

  const result = (await response.json()) as { verification_status?: string };
  return result.verification_status === "SUCCESS" && Boolean(event.id);
}

async function getPayPalAccessToken(env: Env): Promise<string> {
  const paypalBase = env.PAYPAL_API_BASE ?? "https://api-m.paypal.com";
  const credentials = btoa(`${env.PAYPAL_CLIENT_ID}:${env.PAYPAL_CLIENT_SECRET}`);
  const response = await fetch(`${paypalBase}/v1/oauth2/token`, {
    method: "POST",
    headers: {
      Authorization: `Basic ${credentials}`,
      "Content-Type": "application/x-www-form-urlencoded"
    },
    body: "grant_type=client_credentials"
  });

  if (!response.ok) {
    throw new Error("Could not get PayPal access token.");
  }

  const result = (await response.json()) as { access_token?: string };
  if (!result.access_token) {
    throw new Error("PayPal access token response was missing access_token.");
  }

  return result.access_token;
}

async function readStoredTotal(env: Env, currency: string): Promise<StoredTotal> {
  const stored = await env.DONATION_TOTAL.get<StoredTotal>(TOTAL_KEY, "json");
  if (stored) {
    return stored;
  }

  return {
    totalCents: 0,
    currency,
    updatedAt: new Date().toISOString()
  };
}

async function readStoredDownloadTotal(env: Env): Promise<StoredDownloadTotal> {
  const stored = await env.DONATION_TOTAL.get<StoredDownloadTotal>(DOWNLOAD_TOTAL_KEY, "json");
  if (stored) {
    return stored;
  }

  return {
    totalDownloads: 0,
    updatedAt: new Date().toISOString()
  };
}

async function readTotal(env: Env): Promise<ReturnType<typeof publicTotal>> {
  const [donationTotal, downloadTotal] = await Promise.all([
    readStoredTotal(env, env.DONATION_CURRENCY ?? "USD"),
    readStoredDownloadTotal(env)
  ]);
  return publicTotal(donationTotal, downloadTotal);
}

function publicTotal(total: StoredTotal, downloadTotal: StoredDownloadTotal) {
  return {
    totalCents: total.totalCents,
    currency: total.currency,
    totalFormatted: formatMoney(total.totalCents, total.currency),
    totalDownloads: downloadTotal.totalDownloads,
    updatedAt: total.updatedAt
  };
}

function formatMoney(totalCents: number, currency: string): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency
  }).format(totalCents / CENTS_PER_UNIT);
}

function json(data: unknown, env: Env, status = 200): Response {
  return new Response(JSON.stringify(data), {
    status,
    headers: {
      "Content-Type": "application/json",
      ...corsHeaders(env)
    }
  });
}

function corsHeaders(env: Env): HeadersInit {
  return {
    "Access-Control-Allow-Origin": env.ALLOWED_ORIGIN ?? "*",
    "Access-Control-Allow-Methods": "GET,POST,OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type,PayPal-Auth-Algo,PayPal-Cert-Url,PayPal-Transmission-Id,PayPal-Transmission-Sig,PayPal-Transmission-Time"
  };
}
