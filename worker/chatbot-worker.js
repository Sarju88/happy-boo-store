const MODEL = "@cf/meta/llama-3.1-8b-instruct";
const MAX_MESSAGE_LENGTH = 700;

const SYSTEM_PROMPT = `
You are Boo Guide, the support chatbot for the Happy Boo digital download store.
Only answer questions about:
- the Happy Boo store at store.arjunrao.dev
- free digital downloads such as profile pictures, wallpapers, icons, and fan extras
- optional PayPal tip jar donations before downloads
- Happy Boo game strategy, pickups, skins, coins, bombs, food, bee enemies, slime or spike enemies, and monster waves

Store facts:
- Every download is free.
- Donations are optional and use a PayPal tip jar QR code.
- The catalog includes Classic Boo, Berry Boo, Mint Boo, Gold Boo, and Sappy Boo art.
- Downloads include profile pictures, desktop wallpapers, folder or shortcut icons, and digital fan extras.

Behavior rules:
- If a user asks about anything unrelated, politely say you can only help with the Happy Boo store and Happy Boo game strategy.
- Do not claim to collect payments, verify donations, or unlock paid downloads.
- Keep answers short, practical, and friendly.
`.trim();

export default {
  async fetch(request, env) {
    const url = new URL(request.url);

    if (request.method === "OPTIONS") {
      return new Response(null, { headers: corsHeaders(env) });
    }

    if (request.method === "GET" && url.pathname === "/health") {
      return json({ ok: true, service: "happy-boo-chatbot" }, env);
    }

    if (request.method === "POST" && url.pathname === "/chat") {
      return handleChat(request, env);
    }

    return json({ error: "Not found" }, env, 404);
  }
};

async function handleChat(request, env) {
  let body;
  try {
    body = await request.json();
  } catch {
    return json({ error: "Expected JSON body." }, env, 400);
  }

  const userMessage = readUserMessage(body);
  if (!userMessage) {
    return json({ error: "Message is required." }, env, 400);
  }

  const recentMessages = readRecentMessages(body);
  const messages = [
    { role: "system", content: SYSTEM_PROMPT },
    ...recentMessages,
    { role: "user", content: userMessage }
  ];

  const response = await env.AI.run(MODEL, { messages });
  const reply = typeof response?.response === "string" ? response.response : "I can help with Happy Boo downloads and game strategy.";

  return json({ reply }, env);
}

function readUserMessage(body) {
  const message = typeof body?.message === "string" ? body.message.trim() : "";
  return message.slice(0, MAX_MESSAGE_LENGTH);
}

function readRecentMessages(body) {
  if (!Array.isArray(body?.messages)) {
    return [];
  }

  return body.messages
    .slice(-6)
    .map((message) => ({
      role: message?.role === "assistant" ? "assistant" : "user",
      content: String(message?.content ?? "").trim().slice(0, MAX_MESSAGE_LENGTH)
    }))
    .filter((message) => message.content);
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
