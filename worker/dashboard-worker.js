const TOTAL_KEY = "donation-total";
const DOWNLOAD_TOTAL_KEY = "download-total";
const CENTS_PER_UNIT = 100;

export default {
  async fetch(request, env) {
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

async function handleDownload(request, env) {
  await request.text();

  const current = await readStoredDownloadTotal(env);
  const updated = {
    totalDownloads: current.totalDownloads + 1,
    updatedAt: new Date().toISOString()
  };

  await env.DONATION_TOTAL.put(DOWNLOAD_TOTAL_KEY, JSON.stringify(updated));

  return json(await readTotal(env), env);
}

async function handlePayPalWebhook(request, env) {
  const rawBody = await request.text();
  const event = JSON.parse(rawBody);

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
  const updated = {
    totalCents: current.totalCents + donation.amountCents,
    currency: donation.currency,
    updatedAt: new Date().toISOString()
  };

  await env.DONATION_TOTAL.put(TOTAL_KEY, JSON.stringify(updated));
  await env.DONATION_TOTAL.put(`event:${eventId}`, "counted");

  return json({ ok: true, total: await readTotal(env) }, env);
}

function extractDonation(event, expectedCurrency) {
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

async function verifyPayPalWebhook(request, rawBody, event, env) {
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
      webhook_event: JSON.parse(rawBody)
    })
  });

  if (!response.ok) {
    return false;
  }

  const result = await response.json();
  return result.verification_status === "SUCCESS" && Boolean(event.id);
}

async function getPayPalAccessToken(env) {
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

  const result = await response.json();
  if (!result.access_token) {
    throw new Error("PayPal access token response was missing access_token.");
  }

  return result.access_token;
}

async function readStoredTotal(env, currency) {
  const stored = await env.DONATION_TOTAL.get(TOTAL_KEY, "json");
  if (stored) {
    return stored;
  }

  return {
    totalCents: 0,
    currency,
    updatedAt: new Date().toISOString()
  };
}

async function readStoredDownloadTotal(env) {
  const stored = await env.DONATION_TOTAL.get(DOWNLOAD_TOTAL_KEY, "json");
  if (stored) {
    return stored;
  }

  return {
    totalDownloads: 0,
    updatedAt: new Date().toISOString()
  };
}

async function readTotal(env) {
  const [donationTotal, downloadTotal] = await Promise.all([
    readStoredTotal(env, env.DONATION_CURRENCY ?? "USD"),
    readStoredDownloadTotal(env)
  ]);
  return publicTotal(donationTotal, downloadTotal);
}

function publicTotal(total, downloadTotal) {
  return {
    totalCents: total.totalCents,
    currency: total.currency,
    totalFormatted: formatMoney(total.totalCents, total.currency),
    totalDownloads: downloadTotal.totalDownloads,
    updatedAt: total.updatedAt
  };
}

function formatMoney(totalCents, currency) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency
  }).format(totalCents / CENTS_PER_UNIT);
}

function json(data, env, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: {
      "Content-Type": "application/json",
      ...corsHeaders(env)
    }
  });
}

function corsHeaders(env) {
  return {
    "Access-Control-Allow-Origin": env.ALLOWED_ORIGIN ?? "*",
    "Access-Control-Allow-Methods": "GET,POST,OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type,PayPal-Auth-Algo,PayPal-Cert-Url,PayPal-Transmission-Id,PayPal-Transmission-Sig,PayPal-Transmission-Time"
  };
}
