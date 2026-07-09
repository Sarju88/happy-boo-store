import React from "react";
import ReactDOM from "react-dom/client";
import { Check, Minus, Plus, ShoppingBag, Sparkles, Trash2, X } from "lucide-react";
import "./styles.css";
import { products, type Product } from "./products";

const asset = (path: string) => `${import.meta.env.BASE_URL}${path}`;

type CartItem = {
  product: Product;
  quantity: number;
  option: string;
};

const formatPrice = (value: number) =>
  new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD"
  }).format(value);

function App() {
  const [cart, setCart] = React.useState<Record<string, CartItem>>({});
  const [checkoutOpen, setCheckoutOpen] = React.useState(false);
  const [activeCategory, setActiveCategory] = React.useState("All");

  const categories = ["All", ...Array.from(new Set(products.map((product) => product.category)))];
  const visibleProducts =
    activeCategory === "All"
      ? products
      : products.filter((product) => product.category === activeCategory);
  const cartItems = Object.values(cart);
  const cartCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);
  const subtotal = cartItems.reduce((sum, item) => sum + item.product.price * item.quantity, 0);

  const addToCart = (product: Product) => {
    const option = product.options[0] ?? "Standard";
    const key = `${product.id}:${option}`;

    setCart((current) => ({
      ...current,
      [key]: current[key]
        ? { ...current[key], quantity: current[key].quantity + 1 }
        : { product, option, quantity: 1 }
    }));
  };

  const updateQuantity = (key: string, nextQuantity: number) => {
    setCart((current) => {
      if (nextQuantity <= 0) {
        const { [key]: _removed, ...rest } = current;
        return rest;
      }

      return {
        ...current,
        [key]: {
          ...current[key],
          quantity: nextQuantity
        }
      };
    });
  };

  return (
    <main className="store-shell">
      <header className="hero">
        <nav className="topbar" aria-label="Store navigation">
          <a className="brand" href="#top" aria-label="Happy Boo Merch Store home">
            <img src={asset("assets/icon.png")} alt="" />
            <span>Happy Boo Merch</span>
          </a>
          <a className="play-link" href="#products">
            Shop drops
          </a>
        </nav>

        <section className="hero-grid" id="top">
          <div className="hero-copy">
            <p className="eyebrow">Fresh from the in-game skin shop</p>
            <h1>Happy Boo merch for every skin, run, and coin streak.</h1>
            <p>
              A bright demo storefront for plushies, tees, pins, and desk goods inspired by
              Classic Boo, Berry Boo, Mint Boo, Gold Boo, Sappy Boo, food pickups, bombs, and
              monster waves.
            </p>
            <div className="hero-actions">
              <a className="button primary" href="#products">
                <ShoppingBag size={19} aria-hidden="true" />
                Shop merch
              </a>
              <a className="button secondary" href="#cart">
                <Sparkles size={19} aria-hidden="true" />
                View demo cart
              </a>
            </div>
          </div>

          <div className="hero-products" aria-label="Featured Happy Boo skins">
            {products.slice(0, 5).map((product) => (
              <article
                className="mini-card"
                style={{ "--accent": product.accentColor } as React.CSSProperties}
                key={product.id}
              >
                <img src={product.image} alt={product.name} />
                <span>{product.name.replace(" Plush", "")}</span>
              </article>
            ))}
          </div>
        </section>
      </header>

      <section className="section product-section" id="products">
        <div className="section-heading">
          <div>
            <p className="eyebrow">Store catalog</p>
            <h2>Boo skins, survival gear, and monster-wave keepsakes</h2>
          </div>
          <div className="tabs" aria-label="Filter products by category">
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
                <div className="option-row" aria-label={`${product.name} options`}>
                  {product.options.map((option) => (
                    <span key={option}>{option}</span>
                  ))}
                </div>
              </div>
              <div className="product-footer">
                <strong>{formatPrice(product.price)}</strong>
                <button
                  className="button compact"
                  data-testid={`add-${product.id}`}
                  onClick={() => addToCart(product)}
                  type="button"
                >
                  <Plus size={18} aria-hidden="true" />
                  Add
                </button>
              </div>
            </article>
          ))}
        </div>
      </section>

      <aside className="cart-panel" id="cart" aria-label="Demo shopping cart">
        <div className="cart-header">
          <div>
            <p className="eyebrow">Demo checkout</p>
            <h2>Cart</h2>
          </div>
          <span className="cart-count">{cartCount} item{cartCount === 1 ? "" : "s"}</span>
        </div>

        {cartItems.length === 0 ? (
          <div className="empty-cart">
            <ShoppingBag size={38} aria-hidden="true" />
            <p>Add a Boo plush or survival good to preview the cart.</p>
          </div>
        ) : (
          <div className="cart-items">
            {cartItems.map((item) => {
              const key = `${item.product.id}:${item.option}`;
              return (
                <article className="cart-item" key={key}>
                  <img src={item.product.image} alt="" />
                  <div>
                    <h3>{item.product.name}</h3>
                    <p>{item.option}</p>
                    <strong>{formatPrice(item.product.price * item.quantity)}</strong>
                  </div>
                  <div className="quantity-controls" aria-label={`${item.product.name} quantity`}>
                    <button
                      aria-label={`Remove one ${item.product.name}`}
                      onClick={() => updateQuantity(key, item.quantity - 1)}
                      type="button"
                    >
                      <Minus size={16} aria-hidden="true" />
                    </button>
                    <span>{item.quantity}</span>
                    <button
                      aria-label={`Add one ${item.product.name}`}
                      onClick={() => updateQuantity(key, item.quantity + 1)}
                      type="button"
                    >
                      <Plus size={16} aria-hidden="true" />
                    </button>
                    <button
                      aria-label={`Remove ${item.product.name} from cart`}
                      onClick={() => updateQuantity(key, 0)}
                      type="button"
                    >
                      <Trash2 size={16} aria-hidden="true" />
                    </button>
                  </div>
                </article>
              );
            })}
          </div>
        )}

        <div className="cart-total">
          <span>Subtotal</span>
          <strong>{formatPrice(subtotal)}</strong>
        </div>
        <button
          className="button checkout"
          data-testid="checkout-preview"
          disabled={cartItems.length === 0}
          onClick={() => setCheckoutOpen(true)}
          type="button"
        >
          <Check size={19} aria-hidden="true" />
          Preview checkout
        </button>
      </aside>

      <footer className="footer">
        <span>Happy Boo Merch Store</span>
        <span>Static demo storefront. No payment is collected.</span>
      </footer>

      {checkoutOpen ? (
        <div className="modal-backdrop" role="presentation">
          <section
            aria-labelledby="checkout-title"
            aria-modal="true"
            className="checkout-modal"
            role="dialog"
          >
            <button
              aria-label="Close checkout preview"
              className="icon-button"
              data-testid="close-checkout"
              onClick={() => setCheckoutOpen(false)}
              type="button"
            >
              <X size={20} aria-hidden="true" />
            </button>
            <div className="modal-art">
              <img src={asset("assets/boo/gold-boo.png")} alt="" />
            </div>
            <p className="eyebrow">Coming soon</p>
            <h2 id="checkout-title">Checkout is a demo for now.</h2>
            <p>
              Your cart totals {formatPrice(subtotal)}, but this storefront does not collect
              payment yet. Product IDs and checkout links can be wired to a real provider later.
            </p>
            <button className="button primary" onClick={() => setCheckoutOpen(false)} type="button">
              Back to store
            </button>
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
