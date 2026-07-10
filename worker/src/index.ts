type KVNamespace = {
  get(key: string): Promise<string | null>;
  get<T = unknown>(key: string, type: "json"): Promise<T | null>;
  put(key: string, value: string): Promise<void>;
};

type Env = {
  DONATION_TOTAL: KVNamespace;
  ALLOWED_ORIGIN?: string;
};

type StoredDownloadTotal = {
  totalDownloads: number;
  updatedAt: string;
};

const DOWNLOAD_TOTAL_KEY = "download-total";

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

async function readTotal(env: Env): Promise<StoredDownloadTotal> {
  const downloadTotal = await readStoredDownloadTotal(env);
  return {
    totalDownloads: downloadTotal.totalDownloads,
    updatedAt: downloadTotal.updatedAt
  };
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
    "Access-Control-Allow-Headers": "Content-Type"
  };
}
