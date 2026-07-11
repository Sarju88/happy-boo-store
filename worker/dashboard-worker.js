const DOWNLOAD_TOTAL_KEY = "download-total";
const PRODUCT_DOWNLOADS_KEY = "product-downloads";

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

    return json({ error: "Not found" }, env, 404);
  }
};

async function handleDownload(request, env) {
  let productId = "";
  const rawBody = await request.text();
  try {
    const body = rawBody ? JSON.parse(rawBody) : {};
    productId = normalizeProductId(body?.productId);
  } catch {
    productId = "";
  }

  const current = await readStoredDownloadTotal(env);
  const productDownloads = await readStoredProductDownloads(env);
  if (productId) {
    productDownloads[productId] = (productDownloads[productId] ?? 0) + 1;
  }

  const updated = {
    totalDownloads: current.totalDownloads + 1,
    updatedAt: new Date().toISOString()
  };

  await Promise.all([
    env.DONATION_TOTAL.put(DOWNLOAD_TOTAL_KEY, JSON.stringify(updated)),
    env.DONATION_TOTAL.put(PRODUCT_DOWNLOADS_KEY, JSON.stringify(productDownloads))
  ]);

  return json(await readTotal(env), env);
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
  const downloadTotal = await readStoredDownloadTotal(env);
  const productDownloads = await readStoredProductDownloads(env);
  return {
    totalDownloads: downloadTotal.totalDownloads,
    productDownloads,
    updatedAt: downloadTotal.updatedAt
  };
}

async function readStoredProductDownloads(env) {
  const stored = await env.DONATION_TOTAL.get(PRODUCT_DOWNLOADS_KEY, "json");
  if (stored && typeof stored === "object" && !Array.isArray(stored)) {
    return stored;
  }

  return {};
}

function normalizeProductId(value) {
  if (typeof value !== "string") {
    return "";
  }

  return value.trim().toLowerCase().replace(/[^a-z0-9-]/g, "").slice(0, 80);
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
    "Access-Control-Allow-Headers": "Content-Type"
  };
}
