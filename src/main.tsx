import React from "react";
import ReactDOM from "react-dom/client";
import { Download, Gift, Heart, Image, Send, X } from "lucide-react";
import "./styles.css";
import { products, type Product } from "./products";

const asset = (path: string) => `${import.meta.env.BASE_URL}${path}`;
const statsUrl = import.meta.env.VITE_STORE_STATS_URL?.trim() ?? "";
const downloadTrackerUrl = statsUrl ? statsUrl.replace(/\/total\/?$/, "/download") : "";
const chatbotUrl = import.meta.env.VITE_CHATBOT_URL?.trim() ?? "";

type StoreStats = {
  totalDownloads?: number;
  productDownloads?: Record<string, number>;
  updatedAt?: string;
};

type ChatMessage = {
  role: "assistant" | "user";
  content: string;
};

type BooMood = "idle" | "thinking" | "responding" | "blocked";

function App() {
  const [activeCreation, setActiveCreation] = React.useState<"Happy Boo" | "Smart Hub">("Happy Boo");
  const [activeCategory, setActiveCategory] = React.useState("All");
  const [storeStats, setStoreStats] = React.useState<StoreStats | null>(null);
  const [statsStatus, setStatsStatus] = React.useState<"idle" | "loading" | "ready" | "unavailable">(
    statsUrl ? "loading" : "idle"
  );
  const [pendingDownload, setPendingDownload] = React.useState<Product | null>(null);
  const [isChatOpen, setIsChatOpen] = React.useState(false);
  const [chatInput, setChatInput] = React.useState("");
  const [chatStatus, setChatStatus] = React.useState<"idle" | "sending">("idle");
  const [booMood, setBooMood] = React.useState<BooMood>("idle");
  const [chatMessages, setChatMessages] = React.useState<ChatMessage[]>([
    {
      role: "assistant",
      content: "I’m the Happy Boo specialist for Arjun Rao’s Creation Digital Store. Ask me about Happy Boo downloads or game strategy."
    }
  ]);

  const creationProducts = products.filter(
    (product) => (product.creation ?? "Happy Boo") === activeCreation
  );
  const categories = ["All", ...Array.from(new Set(creationProducts.map((product) => product.category)))];
  const visibleProducts =
    activeCategory === "All"
      ? creationProducts
      : creationProducts.filter((product) => product.category === activeCategory);

  const selectCreation = (creation: "Happy Boo" | "Smart Hub") => {
    setActiveCreation(creation);
    setActiveCategory("All");
  };

  const refreshTotals = React.useCallback((signal?: AbortSignal) => {
    if (!statsUrl) {
      return;
    }

    setStatsStatus("loading");

    fetch(statsUrl, { signal })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Store stats request failed.");
        }
        return response.json() as Promise<StoreStats>;
      })
      .then((stats) => {
        setStoreStats(stats);
        setStatsStatus("ready");
      })
      .catch((error: unknown) => {
        if (error instanceof DOMException && error.name === "AbortError") {
          return;
        }
        setStatsStatus("unavailable");
      });
  }, []);

  const recordDownload = (product: Product) => {
    if (!downloadTrackerUrl) {
      return;
    }

    fetch(downloadTrackerUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ productId: product.id })
    })
      .then((response) => {
        if (!response.ok) {
          return null;
        }
        return response.json() as Promise<StoreStats>;
      })
      .then((stats) => {
        if (stats) {
          setStoreStats(stats);
          setStatsStatus("ready");
        }
      })
      .catch(() => {
        refreshTotals();
      });
  };

  const startDownload = (product: Product) => {
    recordDownload(product);
    const link = document.createElement("a");
    link.href = product.downloadUrl;
    link.download = product.fileName;
    document.body.appendChild(link);
    link.click();
    link.remove();
    setPendingDownload(null);
  };

  const setTemporaryBooMood = (mood: BooMood, duration = 2600) => {
    setBooMood(mood);
    window.setTimeout(() => {
      setBooMood((currentMood) => (currentMood === mood ? "idle" : currentMood));
    }, duration);
  };

  const isLimitedTopicReply = (reply: string) =>
    /only (help|answer|talk|assist).{0,70}happy boo|can only (help|assist)|happy boo store and happy boo game strategy/i.test(
      reply
    );

  const sendChatMessage = (message: string) => {
    const trimmed = message.trim();
    if (!trimmed || chatStatus === "sending") {
      return;
    }

    const outgoingMessages: ChatMessage[] = [...chatMessages, { role: "user", content: trimmed }];
    setChatMessages(outgoingMessages);
    setChatInput("");
    setBooMood("thinking");

    if (!chatbotUrl) {
      setTemporaryBooMood("blocked");
      setChatMessages([
        ...outgoingMessages,
        {
          role: "assistant",
          content: "The Happy Boo guide is not connected yet. Add VITE_CHATBOT_URL to enable it."
        }
      ]);
      return;
    }

    setChatStatus("sending");
    fetch(chatbotUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        message: trimmed,
        messages: chatMessages.slice(-8)
      })
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Chat request failed.");
        }
        return response.json() as Promise<{ reply?: string }>;
      })
      .then((data) => {
        const reply = data.reply ?? "I can help with Happy Boo downloads and game strategy.";
        setTemporaryBooMood(isLimitedTopicReply(reply) ? "blocked" : "responding");
        setChatMessages([
          ...outgoingMessages,
          {
            role: "assistant",
            content: reply
          }
        ]);
      })
      .catch(() => {
        setTemporaryBooMood("blocked");
        setChatMessages([
          ...outgoingMessages,
          {
            role: "assistant",
            content: "The Happy Boo guide is unavailable right now. Try again after the Worker is deployed."
          }
        ]);
      })
      .finally(() => setChatStatus("idle"));
  };

  React.useEffect(() => {
    if (!statsUrl) {
      return;
    }

    const controller = new AbortController();
    refreshTotals(controller.signal);

    return () => controller.abort();
  }, [refreshTotals]);

  const downloadCountLabel =
    statsStatus === "ready" && storeStats?.totalDownloads !== undefined
      ? storeStats.totalDownloads.toLocaleString()
      : statsStatus === "loading"
        ? "Loading..."
        : "Updates soon";

  const getProductDownloadLabel = (productId: string) => {
    if (statsStatus === "loading") {
      return "Loading";
    }

    if (statsStatus !== "ready") {
      return "Updates soon";
    }

    const downloads = storeStats?.productDownloads?.[productId] ?? 0;
    return `${downloads.toLocaleString()} ${downloads === 1 ? "download" : "downloads"}`;
  };

  return (
    <main className="store-shell">
      <header className="hero">
        <nav className="topbar" aria-label="Store navigation">
          <a className="brand" href="#top" aria-label="Arjun Rao's Creation Digital Store home">
            <span className="brand-mark" aria-hidden="true">AR</span>
            <span>Arjun Rao&apos;s Creation Digital Store</span>
          </a>
          <a className="play-link" href="#downloads">
            Browse freebies
          </a>
        </nav>

        <section className="hero-grid" id="top">
          <div className="hero-copy">
            <p className="eyebrow">Free creations by Arjun Rao</p>
            <h1>Art and extras from the worlds I create.</h1>
            <p>
              Browse free wallpapers, profile art, creator packs, and digital extras from Happy
              Boo and Smart Hub. Pick a creation below, then download anything you like for $0.
            </p>
            <div className="hero-actions">
              <a className="button primary" href="#downloads">
                <Download size={19} aria-hidden="true" />
                Get downloads
              </a>
              <a className="button secondary" href="#support-note">
                <Heart size={19} aria-hidden="true" />
                How donations work
              </a>
            </div>
          </div>

          <div className="hero-products" aria-label={`Featured ${activeCreation} downloads`}>
            {creationProducts.slice(0, 5).map((product) => (
              <article
                className="mini-card"
                style={{ "--accent": product.accentColor } as React.CSSProperties}
                key={product.id}
              >
                <img src={product.image} alt={product.name} />
                <span>{product.shortName}</span>
              </article>
            ))}
          </div>
        </section>
      </header>

      <nav className="section creation-tabs" aria-label="Choose a creation">
        <div>
          <p className="eyebrow">Shop by creation</p>
          <strong>Choose a world</strong>
        </div>
        <div className="creation-tab-list" role="tablist" aria-label="Creation storefronts">
          {(["Happy Boo", "Smart Hub"] as const).map((creation) => (
            <button
              aria-selected={activeCreation === creation}
              className={activeCreation === creation ? "creation-tab active" : "creation-tab"}
              key={creation}
              onClick={() => selectCreation(creation)}
              role="tab"
              type="button"
            >
              <img
                alt=""
                src={asset(
                  creation === "Happy Boo" ? "assets/boo/classic-boo.png" : "assets/smart-hub/smart-hub-logo.png"
                )}
              />
              <span>{creation}</span>
              <small>{creation === "Happy Boo" ? "Game art & fan packs" : "Community art & backgrounds"}</small>
            </button>
          ))}
        </div>
      </nav>

      <section className="section support-strip" id="support-note">
        <Gift size={32} aria-hidden="true" />
        <div>
          <p className="eyebrow">Free first</p>
          <h2>Everything here costs $0.</h2>
          <p>
            Before each download, the store shows the same PayPal tip jar QR code. Scan it if you
            want to support future creations, or continue without donating.
          </p>
        </div>
        <aside className="donation-total-card" aria-label="Download total">
          <span>Downloads</span>
          <strong>{downloadCountLabel}</strong>
        </aside>
      </section>

      <section className="section product-section" id="downloads">
        <div className="section-heading">
          <div>
            <p className="eyebrow">{activeCreation} collection</p>
            <h2>{activeCreation === "Happy Boo" ? "Game art, wallpapers, icons, and fan downloads" : "Smart Hub backgrounds and profile art"}</h2>
          </div>
          <div className="tabs" aria-label="Filter downloads by category">
            {categories.map((category) => (
              <button
                className={activeCategory === category ? "tab active" : "tab"}
                key={category}
                onClick={() => setActiveCategory(category)}
                type="button"
              >
                {category}
              </button>
            ))}
          </div>
        </div>

        <div className="product-grid">
          {visibleProducts.map((product) => (
            <article
              className="product-card"
              key={product.id}
              style={{ "--accent": product.accentColor } as React.CSSProperties}
            >
              <div className="product-art">
                <img src={product.image} alt={product.name} />
              </div>
              <div className="product-info">
                <p className="category">{product.category}</p>
                <h3>{product.name}</h3>
                <p>{product.description}</p>
                <div className="option-row" aria-label={`${product.name} file details`}>
                  {product.details.map((detail) => (
                    <span key={detail}>{detail}</span>
                  ))}
                </div>
              </div>
              <div className="product-footer">
                <div className="product-popularity" aria-label={`${product.name} download count`}>
                  <strong>Free</strong>
                  <span>{getProductDownloadLabel(product.id)}</span>
                </div>
                <button
                  className="button compact"
                  data-testid={`download-${product.id}`}
                  onClick={() => setPendingDownload(product)}
                  type="button"
                >
                  <Download size={18} aria-hidden="true" />
                  Download
                </button>
              </div>
            </article>
          ))}
        </div>
      </section>

      <footer className="footer">
        <span>Arjun Rao&apos;s Creation Digital Store</span>
        <span>All items are free. Donations are optional.</span>
        <span>© 2026 Sarju88</span>
      </footer>

      <aside
        className={isChatOpen ? "chat-widget open" : "chat-widget"}
        data-boo-mood={booMood}
        aria-label="Happy Boo guide"
      >
        {isChatOpen ? (
          <section className="chat-panel" aria-label="Happy Boo guide chat">
            <div className="chat-header">
              <div>
                <strong>Boo Guide</strong>
                <span>Store help and game strategy</span>
              </div>
              <button
                aria-label="Close Happy Boo guide"
                className="icon-button"
                onClick={() => setIsChatOpen(false)}
                type="button"
              >
                <X size={19} aria-hidden="true" />
              </button>
            </div>

            <div className="chat-log" aria-live="polite">
              {chatMessages.map((message, index) => (
                <p className={`chat-message ${message.role}`} key={`${message.role}-${index}`}>
                  {message.content}
                </p>
              ))}
              {chatStatus === "sending" ? <p className="chat-message assistant">Thinking...</p> : null}
            </div>

            <div className="chat-prompts" aria-label="Suggested Happy Boo guide questions">
              {["Which download should I get?", "How do food pickups help?", "Give me a game strategy"].map(
                (prompt) => (
                  <button key={prompt} onClick={() => sendChatMessage(prompt)} type="button">
                    {prompt}
                  </button>
                )
              )}
            </div>

            <form
              className="chat-form"
              onSubmit={(event) => {
                event.preventDefault();
                sendChatMessage(chatInput);
              }}
            >
              <input
                aria-label="Ask the Happy Boo guide"
                onChange={(event) => setChatInput(event.target.value)}
                placeholder="Ask about downloads or strategy"
                value={chatInput}
              />
              <button aria-label="Send message" disabled={chatStatus === "sending"} type="submit">
                <Send size={18} aria-hidden="true" />
              </button>
            </form>
          </section>
        ) : null}

        <button
          className="chat-launcher boo-pet-button"
          onClick={() => setIsChatOpen(true)}
          aria-label="Open Happy Boo AI guide"
          type="button"
        >
          <span className="boo-pet-stage" aria-hidden="true">
            <span className="boo-aura" />
            <img className="boo-pet" src={asset("assets/boo/classic-boo.png")} alt="" />
            <span className="boo-face boo-face-thinking">
              <span />
              <span />
              <span />
            </span>
            <span className="boo-face boo-face-responding">
              <span />
              <span />
            </span>
            <span className="boo-face boo-face-blocked">!</span>
          </span>
        </button>
      </aside>

      {pendingDownload ? (
        <div className="donation-backdrop" role="presentation">
          <section
            aria-labelledby="donation-title"
            aria-modal="true"
            className="donation-modal"
            role="dialog"
          >
            <button
              aria-label="Close donation prompt"
              className="icon-button donation-close"
              data-testid="close-donation"
              onClick={() => setPendingDownload(null)}
              type="button"
            >
              <X size={22} aria-hidden="true" />
            </button>

            <div
              className="donation-preview"
              style={{ "--accent": pendingDownload.accentColor } as React.CSSProperties}
              aria-hidden="true"
            >
              <Image size={28} />
              <img src={pendingDownload.image} alt="" />
              <span>{pendingDownload.fileType}</span>
            </div>

            <p className="eyebrow">Optional support</p>
            <h2 id="donation-title">Keep Happy Boo downloads free</h2>
            <p>
              You are about to download <strong>{pendingDownload.name}</strong> for free. If you
              want to support more free creations, scan the PayPal tip jar before continuing.
            </p>

            <div className="tip-jar-card">
              <img src={asset("assets/donations/paypal-tip-jar-qr.png")} alt="PayPal tip jar QR code" />
              <div>
                <strong>PayPal Tip Jar</strong>
                <span>Scan with your phone camera to donate.</span>
                <small>Downloads: {downloadCountLabel}</small>
              </div>
            </div>

            <div className="donation-actions">
              <button
                className="button donate"
                onClick={() => startDownload(pendingDownload)}
                type="button"
              >
                <Heart size={19} aria-hidden="true" />
                I donated, download
              </button>
              <button
                className="continue-link"
                data-testid="continue-download"
                onClick={() => startDownload(pendingDownload)}
                type="button"
              >
                Continue without donating
              </button>
            </div>
          </section>
        </div>
      ) : null}
    </main>
  );
}

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
