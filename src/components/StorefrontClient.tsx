"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { money } from "@/components/Money";
import { addStoredCartItem, readStoredCart } from "@/components/cartStorage";
import type { CartItem, Coupon, Product, ShippingRate } from "@/lib/types";

type QuoteItem = CartItem & {
  product: Product;
  subtotal: number;
};

type CartQuote = {
  items: QuoteItem[];
  subtotal: number;
  discount: number;
  shipping: number;
  tax: number;
  total: number;
  currency: string;
  shippingRate: ShippingRate | null;
  coupon: Coupon | null;
};

type ApiResult<T> = {
  ok: boolean;
  data?: T;
  error?: string;
};

type StorefrontClientProps = {
  storeName: string;
  products: Product[];
  categories: string[];
  coupons: Coupon[];
  shippingRates: ShippingRate[];
  initialQuote: CartQuote;
};

const categoryVisuals = [
  { title: "New Arrivals", copy: "Fresh SKUs for fast product testing", image: "/products/scarf.svg" },
  { title: "Bags", copy: "Packable pieces with simple variants", image: "/products/bag.svg" },
  { title: "Lifestyle", copy: "Lightweight gifts and daily essentials", image: "/products/tea.svg" },
  { title: "Sale", copy: "Promotions, bundles, and margin tests", image: "/products/scarf.svg" }
];

export function StorefrontClient({
  storeName,
  products,
  categories,
  coupons,
  shippingRates,
  initialQuote
}: StorefrontClientProps) {
  const featured = useMemo(() => products.filter((product) => product.featured), [products]);
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [quote, setQuote] = useState<CartQuote>(initialQuote);
  const [message, setMessage] = useState("Curated cross-border essentials, ready to test.");
  const [isCartOpen, setIsCartOpen] = useState(false);

  useEffect(() => {
    setCartItems(readStoredCart());
  }, []);

  useEffect(() => {
    if (!cartItems.length) {
      setQuote(initialQuote);
      return;
    }

    let ignore = false;

    async function refreshQuote() {
      const response = await fetch("/api/cart", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          items: cartItems,
          country: "US",
          couponCode: "LAUNCH10",
          shippingRateId: "standard-global"
        })
      });
      const result = (await response.json()) as ApiResult<CartQuote>;

      if (!ignore) {
        if (result.ok && result.data) {
          setQuote(result.data);
        } else {
          setMessage(result.error ?? "Unable to refresh cart quote.");
        }
      }
    }

    refreshQuote();
    return () => {
      ignore = true;
    };
  }, [cartItems, initialQuote]);

  function addToCart(product: Product) {
    const nextItems = addStoredCartItem(product.id);
    setCartItems(nextItems);
    setMessage(`${product.title} added. Your quote updated instantly.`);
    setIsCartOpen(true);
  }

  return (
    <main className="storefront">
      <div className="promoBar">
        <span>Free international shipping on orders $79+</span>
        <span>10% off with code LAUNCH10</span>
        <span>30-day returns on test orders</span>
      </div>

      <header className="storeHeader">
        <Link className="brandLockup" href="/">
          <strong>{storeName}</strong>
          <span>Global lifestyle commerce</span>
        </Link>
        <nav className="storeNav" aria-label="Store navigation">
          <a href="#new">New In</a>
          {categories.map((category) => (
            <a href="#products" key={category}>{category}</a>
          ))}
          <a href="#sale">Sale</a>
        </nav>
        <div className="storeActions">
          <Link href="/admin">Admin</Link>
          <button className="cartLink" type="button" onClick={() => setIsCartOpen(true)}>
            Cart ({cartItems.reduce((sum, item) => sum + item.quantity, 0)})
          </button>
        </div>
      </header>

      {isCartOpen ? (
        <div className="flyCartLayer" role="presentation">
          <button className="flyCartBackdrop" aria-label="Close cart" type="button" onClick={() => setIsCartOpen(false)} />
          <aside className="flyCartDrawer" aria-label="Shopping cart">
            <div className="panelHeader">
              <div>
                <span className="microLabel">Shopping bag</span>
                <h2>Your Cart</h2>
              </div>
              <button className="iconButton" aria-label="Close cart" type="button" onClick={() => setIsCartOpen(false)}>×</button>
            </div>
            {quote.items.length ? (
              <div className="flyCartItems">
                {quote.items.map((item) => (
                  <div className="cartPreviewItem" key={item.productId}>
                    <img src={item.product.images[0]} alt={item.product.title} />
                    <div>
                      <strong>{item.product.title}</strong>
                      <span>Qty {item.quantity}</span>
                    </div>
                    <b>{money(item.subtotal, quote.currency)}</b>
                  </div>
                ))}
              </div>
            ) : (
              <div className="emptyState">
                <h3>Your cart is empty</h3>
                <p>Add a product to see shipping, tax, and discount estimates.</p>
              </div>
            )}
            <div className="flyCartSummary">
              <div className="summaryRow"><span>Subtotal</span><strong>{money(quote.subtotal, quote.currency)}</strong></div>
              <div className="summaryRow"><span>Discount</span><strong>-{money(quote.discount, quote.currency)}</strong></div>
              <div className="summaryRow"><span>Shipping</span><strong>{money(quote.shipping, quote.currency)}</strong></div>
              <div className="summaryRow totalRow"><span>Total</span><strong>{money(quote.total, quote.currency)}</strong></div>
            </div>
            <Link className="primaryButton wideButton" href="/checkout">Checkout</Link>
            <Link className="outlineButton wideButton" href="/cart">View cart</Link>
          </aside>
        </div>
      ) : null}

      <section className="retailHero" id="new">
        <div className="heroCopy">
          <span className="microLabel">New collection</span>
          <h1>Effortless products for global shoppers.</h1>
          <p>
            Launch a polished storefront with fashion-inspired merchandising, cross-border shipping
            logic, coupons, inventory reservations, and an admin workflow ready for product testing.
          </p>
          <div className="actions">
            <a className="primaryButton" href="#products">Shop best sellers</a>
            <Link className="outlineButton" href="/cart">Review cart</Link>
          </div>
        </div>
        <div className="heroMerch">
          <div className="heroProduct heroProductLarge">
            <img src="/products/bag.svg" alt="Packable Daily Tote" />
            <div>
              <span>Featured edit</span>
              <strong>Packable Daily Tote</strong>
            </div>
          </div>
          <div className="heroProduct">
            <img src="/products/scarf.svg" alt="Merino Travel Scarf" />
            <strong>Soft layers</strong>
          </div>
          <div className="heroProduct">
            <img src="/products/tea.svg" alt="Cold Brew Tea Set" />
            <strong>Giftable sets</strong>
          </div>
        </div>
      </section>

      <section className="retailSection">
        <div className="retailSectionHeader">
          <h2>Shop by category</h2>
          <p>Organize your first catalog like a real retail site, even while products are changing.</p>
        </div>
        <div className="categoryTiles">
          {categoryVisuals.map((category) => (
            <a className="categoryTile" href="#products" key={category.title}>
              <img src={category.image} alt="" />
              <strong>{category.title}</strong>
              <span>{category.copy}</span>
            </a>
          ))}
        </div>
      </section>

      <section className="retailSection" id="products">
        <div className="retailSectionHeader splitHeader">
          <div>
            <span className="microLabel">Best sellers</span>
            <h2>Starter catalog</h2>
          </div>
          <p>{message}</p>
        </div>
        <div className="productShelf">
          {featured.map((product) => (
            <article className="retailProductCard" key={product.id}>
              <Link className="retailProductImage" href={`/products/${product.id}`}>
                <img alt={product.title} src={product.images[0]} />
                <span>{product.category}</span>
              </Link>
              <div className="retailProductBody">
                <div>
                  <Link href={`/products/${product.id}`}><h3>{product.title}</h3></Link>
                  <p>{product.subtitle ?? product.description}</p>
                </div>
                <div className="swatchRow" aria-label={`${product.title} sample swatches`}>
                  <span />
                  <span />
                  <span />
                  <small>+2</small>
                </div>
                <div className="priceRow">
                  <strong>{money(product.price, product.currency)}</strong>
                  {product.originalPrice ? <del>{money(product.originalPrice, product.currency)}</del> : null}
                </div>
                <div className="cardActions">
                  <button
                    data-testid={`add-${product.id}`}
                    type="button"
                    onClick={() => addToCart(product)}
                  >
                    Quick add
                  </button>
                  <Link className="textLink" href={`/products/${product.id}`}>Details</Link>
                </div>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="trustStrip">
        <div><strong>Worldwide shipping</strong><span>Rates, duties, and delivery promises surfaced early.</span></div>
        <div><strong>Secure checkout</strong><span>Manual test payment now, card provider adapters next.</span></div>
        <div><strong>Returns ready</strong><span>Structured order records prepare refund workflows.</span></div>
        <div><strong>Operator friendly</strong><span>Admin tools for catalog, inventory, fulfillment, and reports.</span></div>
      </section>

      <section className="collectionBand" id="sale">
        <div>
          <span className="microLabel">Product testing playbook</span>
          <h2>Merchandise like a brand before you know the winning SKU.</h2>
          <p>
            Use collections, categories, coupons, and quick-add flows to validate demand across
            countries before investing in a permanent catalog.
          </p>
          <Link className="primaryButton" href="/admin/products/new">Create a product</Link>
        </div>
        <div className="collectionMosaic">
          {products.map((product) => (
            <img src={product.images[0]} alt={product.title} key={product.id} />
          ))}
        </div>
      </section>

      <footer className="storeFooter">
        <div>
          <strong>{storeName}</strong>
          <p>Curated fashion and lifestyle essentials, delivered worldwide.</p>
        </div>
        <div>
          <h3>Customer care</h3>
          <span>Shipping & delivery</span>
          <span>Returns & exchanges</span>
          <span>Track your order</span>
        </div>
        <div>
          <h3>Promotions</h3>
          {coupons.map((coupon) => (
            <span key={coupon.code}>{coupon.code}: {coupon.type === "percentage" ? `${coupon.value}% off` : `${money(coupon.value)} off`}</span>
          ))}
        </div>
        <div>
          <h3>Shipping</h3>
          {shippingRates.map((rate) => (
            <span key={rate.id}>{rate.name}: {rate.etaDays} days</span>
          ))}
        </div>
      </footer>
    </main>
  );
}
