"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { money } from "@/components/Money";
import { clearStoredCart, readStoredCart } from "@/components/cartStorage";
import type { Address, CartItem, Coupon, Product, ShippingRate, StoreSettings } from "@/lib/types";

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

type OrderResult = {
  id: string;
  total: number;
  currency: string;
  status: string;
};

type ApiResult<T> = {
  ok: boolean;
  data?: T;
  error?: string;
};

type CheckoutClientProps = {
  settings: StoreSettings;
  shippingRates: ShippingRate[];
};

export function CheckoutClient({ settings, shippingRates }: CheckoutClientProps) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [couponCode, setCouponCode] = useState("LAUNCH10");
  const [shippingRateId, setShippingRateId] = useState(shippingRates[0]?.id ?? "");
  const [quote, setQuote] = useState<CartQuote | null>(null);
  const [message, setMessage] = useState("Complete the checkout details.");
  const [order, setOrder] = useState<OrderResult | null>(null);
  const [address, setAddress] = useState<Address>({
    name: "Demo Buyer",
    phone: "+1 555 0100",
    email: "buyer@example.com",
    country: settings.supportedCountries[0] ?? "US",
    province: "CA",
    city: "Los Angeles",
    line1: "88 Demo Street",
    postalCode: "90001"
  });

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
      const response = await fetch("/api/checkout", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          items,
          country: address.country,
          couponCode,
          shippingRateId
        })
      });
      const result = (await response.json()) as ApiResult<CartQuote>;

      if (!ignore) {
        if (result.ok && result.data) {
          setQuote(result.data);
          setMessage("Checkout quote is current.");
        } else {
          setQuote(null);
          setMessage(result.error ?? "Unable to quote checkout.");
        }
      }
    }

    refreshQuote();
    return () => {
      ignore = true;
    };
  }, [address.country, couponCode, items, shippingRateId]);

  function updateAddress<K extends keyof Address>(key: K, value: Address[K]) {
    setAddress((current) => ({ ...current, [key]: value }));
  }

  async function placeOrder() {
    if (!items.length) {
      setMessage("Add at least one item before placing an order.");
      return;
    }

    setMessage("Creating order...");
    const response = await fetch("/api/orders", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ customer: address, items, couponCode, shippingRateId })
    });
    const result = (await response.json()) as ApiResult<OrderResult>;

    if (result.ok && result.data) {
      setOrder(result.data);
      clearStoredCart();
      setItems([]);
      setMessage(`Order ${result.data.id} created. Inventory is reserved.`);
    } else {
      setMessage(result.error ?? "Unable to create order.");
    }
  }

  return (
    <main className="simplePage">
      <nav className="simpleNav">
        <Link href="/">Storefront</Link>
        <Link href="/cart">Cart</Link>
        <Link href="/admin/orders">Orders</Link>
      </nav>
      <section className="section">
        <p className="eyebrow">Checkout</p>
        <h1>Checkout workflow</h1>
        <div className="checkoutGrid">
          <section className="panel">
            <h2>Customer and billing</h2>
            <div className="formPreview twoColumns">
              <label>Name<input data-testid="checkout-name" value={address.name} onChange={(event) => updateAddress("name", event.target.value)} /></label>
              <label>Email<input data-testid="checkout-email" value={address.email ?? ""} onChange={(event) => updateAddress("email", event.target.value)} /></label>
              <label>Phone<input data-testid="checkout-phone" value={address.phone} onChange={(event) => updateAddress("phone", event.target.value)} /></label>
              <label>Country
                <select data-testid="checkout-country" value={address.country} onChange={(event) => updateAddress("country", event.target.value)}>
                  {settings.supportedCountries.map((country) => <option key={country}>{country}</option>)}
                </select>
              </label>
              <label>Province<input data-testid="checkout-province" value={address.province} onChange={(event) => updateAddress("province", event.target.value)} /></label>
              <label>City<input data-testid="checkout-city" value={address.city} onChange={(event) => updateAddress("city", event.target.value)} /></label>
              <label>Address<input data-testid="checkout-line1" value={address.line1} onChange={(event) => updateAddress("line1", event.target.value)} /></label>
              <label>Postal code<input data-testid="checkout-postal-code" value={address.postalCode} onChange={(event) => updateAddress("postalCode", event.target.value)} /></label>
            </div>
          </section>

          <section className="panel">
            <h2>Shipping method</h2>
            <div className="formPreview">
              <label>Shipping
                <select data-testid="checkout-shipping-rate" value={shippingRateId} onChange={(event) => setShippingRateId(event.target.value)}>
                  {shippingRates.map((rate) => (
                    <option key={rate.id} value={rate.id}>
                      {rate.name} | {money(rate.basePrice, settings.defaultCurrency)}+ | {rate.etaDays} days
                    </option>
                  ))}
                </select>
              </label>
              <label>Coupon<input data-testid="checkout-coupon" value={couponCode} onChange={(event) => setCouponCode(event.target.value.toUpperCase())} /></label>
            </div>
          </section>

          <section className="panel">
            <h2>Payment</h2>
            <div className="miniRow"><span>Provider</span><strong>Manual test payment</strong></div>
            <div className="miniRow"><span>Status</span><strong>Creates unpaid order for admin review</strong></div>
          </section>

          <section className="summaryPanel">
            <h2>Order total</h2>
            {quote ? (
              <>
                <div className="summaryRow"><span>Subtotal</span><strong>{money(quote.subtotal, quote.currency)}</strong></div>
                <div className="summaryRow"><span>Coupon {quote.coupon?.code ?? "None"}</span><strong>-{money(quote.discount, quote.currency)}</strong></div>
                <div className="summaryRow"><span>Shipping</span><strong>{money(quote.shipping, quote.currency)}</strong></div>
                <div className="summaryRow"><span>Tax</span><strong>{money(quote.tax, quote.currency)}</strong></div>
                <div className="summaryRow totalRow"><span>Total</span><strong>{money(quote.total, quote.currency)}</strong></div>
              </>
            ) : (
              <p>Your browser cart is empty. Add products before checkout.</p>
            )}
            <button data-testid="place-order" type="button" disabled={!quote} onClick={placeOrder}>Place order</button>
            <p className="statusText">{message}</p>
            {order ? (
              <div className="successBox">
                <strong>{order.id}</strong>
                <span>{money(order.total, order.currency)} | {order.status}</span>
              </div>
            ) : null}
          </section>
        </div>
      </section>
    </main>
  );
}
