"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { money } from "@/components/Money";
import { clearStoredCart, readStoredCart, writeStoredCart } from "@/components/cartStorage";
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

type CartClientProps = {
  products: Product[];
  countries: string[];
  shippingRates: ShippingRate[];
};

export function CartClient({ products, countries, shippingRates }: CartClientProps) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [country, setCountry] = useState(countries[0] ?? "US");
  const [couponCode, setCouponCode] = useState("LAUNCH10");
  const [shippingRateId, setShippingRateId] = useState(shippingRates[0]?.id ?? "");
  const [quote, setQuote] = useState<CartQuote | null>(null);
  const [message, setMessage] = useState("Cart is ready.");

  useEffect(() => {
    setItems(readStoredCart());
  }, []);

  useEffect(() => {
    if (!items.length) {
      setQuote(null);
      return;
    }

    let ignore = false;

    async function refreshQuote() {
      setMessage("Updating totals...");
      const response = await fetch("/api/cart", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ items, country, couponCode, shippingRateId })
      });
      const result = (await response.json()) as ApiResult<CartQuote>;

      if (!ignore) {
        if (result.ok && result.data) {
          setQuote(result.data);
          setMessage("Totals updated from API.");
        } else {
          setQuote(null);
          setMessage(result.error ?? "Unable to calculate cart.");
        }
      }
    }

    refreshQuote();
    return () => {
      ignore = true;
    };
  }, [country, couponCode, items, shippingRateId]);

  function setQuantity(productId: string, quantity: number) {
    const nextItems = items
      .map((item) => (item.productId === productId ? { ...item, quantity } : item))
      .filter((item) => item.quantity > 0);
    setItems(nextItems);
    writeStoredCart(nextItems);
  }

  function loadSampleCart() {
    const sample = products.slice(0, 2).map((product, index) => ({
      productId: product.id,
      quantity: index + 1
    }));
    setItems(sample);
    writeStoredCart(sample);
  }

  function clearCart() {
    setItems([]);
    clearStoredCart();
    setMessage("Cart cleared.");
  }

  return (
    <main className="simplePage">
      <nav className="simpleNav">
        <Link href="/">Storefront</Link>
        <Link href="/checkout">Checkout</Link>
        <Link href="/admin">Admin</Link>
      </nav>
      <section className="section">
        <p className="eyebrow">Cart</p>
        <h1>Shopping cart</h1>
        <div className="sectionSplit">
          <div className="panel">
            <div className="panelHeader">
              <h2>Items</h2>
              <div className="actionsInline">
                <button data-testid="load-sample-cart" type="button" onClick={loadSampleCart}>Load sample cart</button>
                <button className="ghostButton" data-testid="clear-cart" type="button" onClick={clearCart}>Clear</button>
              </div>
            </div>

            {items.length ? (
              <div className="table">
                {items.map((item) => {
                  const product = products.find((candidate) => candidate.id === item.productId);
                  if (!product) return null;

                  return (
                    <div className="tableRow cartRow" key={item.productId}>
                      <span>{product.title}</span>
                      <span>{product.sku}</span>
                      <label className="quantityControl">
                        Qty
                        <input
                          data-testid={`qty-${item.productId}`}
                          min="0"
                          max="99"
                          type="number"
                          value={item.quantity}
                          onChange={(event) => setQuantity(item.productId, Number(event.target.value))}
                        />
                      </label>
                      <span>{money(product.price, product.currency)}</span>
                      <span>{money(product.price * item.quantity, product.currency)}</span>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="emptyState">
                <h2>Your cart is empty</h2>
                <p>Add products from the storefront or load the sample cart to test checkout.</p>
              </div>
            )}

            <div className="formPreview twoColumns cartOptions">
              <label>Country
                <select value={country} onChange={(event) => setCountry(event.target.value)}>
                  {countries.map((item) => <option key={item}>{item}</option>)}
                </select>
              </label>
              <label>Coupon code
                <input
                  data-testid="cart-coupon"
                  value={couponCode}
                  onChange={(event) => setCouponCode(event.target.value.toUpperCase())}
                />
              </label>
              <label>Shipping method
                <select
                  data-testid="cart-shipping-rate"
                  value={shippingRateId}
                  onChange={(event) => setShippingRateId(event.target.value)}
                >
                  {shippingRates.map((rate) => <option key={rate.id} value={rate.id}>{rate.name}</option>)}
                </select>
              </label>
            </div>
            <p className="statusText">{message}</p>
          </div>

          <div className="summaryPanel">
            <h2>Order summary</h2>
            {quote ? (
              <>
                <div className="summaryRow"><span>Subtotal</span><strong>{money(quote.subtotal, quote.currency)}</strong></div>
                <div className="summaryRow"><span>Discount</span><strong>-{money(quote.discount, quote.currency)}</strong></div>
                <div className="summaryRow"><span>Shipping</span><strong>{money(quote.shipping, quote.currency)}</strong></div>
                <div className="summaryRow"><span>Tax</span><strong>{money(quote.tax, quote.currency)}</strong></div>
                <div className="summaryRow totalRow"><span>Total</span><strong>{money(quote.total, quote.currency)}</strong></div>
                <Link className="primaryButton" data-testid="proceed-checkout" href="/checkout">Proceed to checkout</Link>
              </>
            ) : (
              <>
                <p>Add at least one item to calculate totals.</p>
                <Link className="secondaryButton darkSecondary" href="/">Browse products</Link>
              </>
            )}
          </div>
        </div>
      </section>
    </main>
  );
}
