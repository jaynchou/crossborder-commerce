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
  const [message, setMessage] = useState("Add a product to start a real cart.");

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
    setMessage(`${product.title} added to cart.`);
  }

  return (
    <main>
      <section className="hero">
        <nav className="nav">
          <strong>{storeName}</strong>
          <div>
            <a href="#products">Products</a>
            <Link href="/cart">Cart</Link>
            <Link href="/checkout">Checkout</Link>
            <Link href="/admin">Admin</Link>
          </div>
        </nav>
        <div className="heroContent">
          <p className="eyebrow">Cross-border commerce starter</p>
          <h1>Launch first, choose the winning products later.</h1>
          <p>
            A portable commerce backend for product discovery, checkout, inventory, shipping, tax,
            orders, and fulfillment. Deploy on Vercel now, move to any Docker cloud later.
          </p>
          <div className="actions">
            <a className="primaryButton" href="#products">Browse catalog</a>
            <Link className="secondaryButton" href="/cart">View cart</Link>
            <Link className="secondaryButton" href="/admin">Open admin</Link>
          </div>
        </div>
      </section>

      <section className="section" id="products">
        <div className="sectionHeader">
          <p className="eyebrow">Catalog and categories</p>
          <h2>Starter catalog</h2>
        </div>
        <div className="categoryBar" aria-label="Product categories">
          {categories.map((category) => (
            <span key={category}>{category}</span>
          ))}
        </div>
        <div className="grid">
          {featured.map((product) => (
            <article className="productCard" key={product.id}>
              <div className="productImage">
                <img alt={product.title} src={product.images[0]} />
              </div>
              <div className="productBody">
                <div className="tagRow">
                  {product.tags.map((tag) => (
                    <span key={tag}>{tag}</span>
                  ))}
                </div>
                <h3>{product.title}</h3>
                <p className="metaLine">
                  SKU {product.sku} | Ships from {product.shipFrom} | Origin {product.originCountry}
                </p>
                <p>{product.description}</p>
                <div className="priceRow">
                  <strong>{money(product.price, product.currency)}</strong>
                  {product.originalPrice ? <del>{money(product.originalPrice, product.currency)}</del> : null}
                </div>
                <button
                  data-testid={`add-${product.id}`}
                  type="button"
                  onClick={() => addToCart(product)}
                >
                  Add to cart
                </button>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="section sectionSplit" id="checkout">
        <div>
          <p className="eyebrow">Cart, coupons, shipping, tax</p>
          <h2>Checkout quote preview</h2>
          <p className="sectionCopy">
            This panel renders the backend pricing result for your browser cart. It includes stock
            checks, coupon discount, shipping, tax, and final total.
          </p>
          <p className="statusText">{message}</p>
          <div className="summaryPanel">
            {quote.items.map((item) => (
              <div className="summaryRow" key={item.productId}>
                <span>{item.product.title} x {item.quantity}</span>
                <strong>{money(item.subtotal, quote.currency)}</strong>
              </div>
            ))}
            <div className="summaryRow"><span>Subtotal</span><strong>{money(quote.subtotal, quote.currency)}</strong></div>
            <div className="summaryRow"><span>Coupon {quote.coupon?.code ?? "None"}</span><strong>-{money(quote.discount, quote.currency)}</strong></div>
            <div className="summaryRow"><span>Shipping {quote.shippingRate?.name ?? "None"}</span><strong>{money(quote.shipping, quote.currency)}</strong></div>
            <div className="summaryRow"><span>Tax</span><strong>{money(quote.tax, quote.currency)}</strong></div>
            <div className="summaryRow totalRow"><span>Total</span><strong>{money(quote.total, quote.currency)}</strong></div>
            <Link className="primaryButton" href="/cart">Manage cart</Link>
          </div>
        </div>

        <div className="sideStack">
          <div className="panel compactPanel">
            <h3>Coupons</h3>
            {coupons.map((coupon) => (
              <div className="miniRow" key={coupon.code}>
                <span>{coupon.code}</span>
                <strong>{coupon.type === "percentage" ? `${coupon.value}%` : money(coupon.value)}</strong>
              </div>
            ))}
          </div>
          <div className="panel compactPanel">
            <h3>Shipping rates</h3>
            {shippingRates.map((rate) => (
              <div className="miniRow" key={rate.id}>
                <span>{rate.name}</span>
                <strong>{money(rate.basePrice)}+ | {rate.etaDays} days</strong>
              </div>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
