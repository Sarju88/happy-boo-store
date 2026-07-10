import React from "react";
import ReactDOM from "react-dom/client";
import { Download, Gift, Heart, Image, X } from "lucide-react";
import "./styles.css";
import { products, type Product } from "./products";

const asset = (path: string) => `${import.meta.env.BASE_URL}${path}`;
const statsUrl = import.meta.env.VITE_STORE_STATS_URL?.trim() ?? "";
const downloadTrackerUrl = statsUrl ? statsUrl.replace(/\/total\/?$/, "/download") : "";

type StoreStats = {
  totalDownloads?: number;
  updatedAt?: string;
};

function App() {
  const [activeCategory, setActiveCategory] = React.useState("All");
  const [storeStats, setStoreStats] = React.useState<StoreStats | null>(null);
  const [statsStatus, setStatsStatus] = React.useState<"idle" | "loading" | "ready" | "unavailable">(
    statsUrl ? "loading" : "idle"
  );
  const [pendingDownload, setPendingDownload] = React.useState<Product | null>(null);

  const categories = ["All", ...Array.from(new Set(products.map((product) => product.category)))];
  const visibleProducts =
    activeCategory === "All"
      ? products
      : products.filter((product) => product.category === activeCategory);

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

  return (
    <main className="store-shell">
      <header className="hero">
        <nav className="topbar" aria-label="Store navigation">
          <a className="brand" href="#top" aria-label="Happy Boo Digital Store home">
            <img src={asset("assets/icon.png")} alt="" />
            <span>Happy Boo Downloads</span>
          </a>
          <a className="play-link" href="#downloads">
            Browse freebies
          </a>
        </nav>

        <section className="hero-grid" id="top">
          <div className="hero-copy">
            <p className="eyebrow">Free digital goodies</p>
            <h1>Happy Boo downloads for profiles, desktops, and game fans.</h1>
            <p>
              Grab free profile pictures, wallpapers, icon art, and printable-style digital
              extras inspired by Classic Boo, Berry Boo, Mint Boo, Gold Boo, Sappy Boo, pickups,
              bombs, and monster waves.
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

          <div className="hero-products" aria-label="Featured Happy Boo downloads">
            {products.slice(0, 5).map((product) => (
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

      <section className="section support-strip" id="support-note">
        <Gift size={32} aria-hidden="true" />
        <div>
          <p className="eyebrow">Free first</p>
          <h2>Everything here costs $0.</h2>
          <p>
            Before each download, the store shows a PayPal tip jar QR code. Scan it if you want
            to donate, or continue without donating.
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
            <p className="eyebrow">Digital catalog</p>
            <h2>Profile pictures, wallpapers, icons, and fan downloads</h2>
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
                <strong>Free</strong>
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
        <span>Happy Boo Digital Downloads</span>
        <span>All items are free. Donations are optional.</span>
        <span>© 2026 Sarju88</span>
      </footer>

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
              want to support more Happy Boo extras, scan the PayPal tip jar before continuing.
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
