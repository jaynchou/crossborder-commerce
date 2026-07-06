import Link from "next/link";
import { money } from "@/components/Money";
import { calculateCart, getSettings, listShippingRates } from "@/lib/store";

export default function CheckoutPage() {
  const settings = getSettings();
  const rates = listShippingRates("US");
  const checkout = calculateCart(
    [
      { productId: "album-cloud-001", quantity: 1 },
      { productId: "album-tea-002", quantity: 2 }
    ],
    { country: "US", couponCode: "LAUNCH10", shippingRateId: "standard-global" }
  );

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
            <div className="formPreview">
              <label>Name<input readOnly value="Demo Buyer" /></label>
              <label>Email<input readOnly value="buyer@example.com" /></label>
              <label>Country<input readOnly value="US" /></label>
              <label>Address<input readOnly value="88 Demo Street, Los Angeles, CA 90001" /></label>
            </div>
          </section>

          <section className="panel">
            <h2>Shipping method</h2>
            {rates.map((rate) => (
              <div className="miniRow" key={rate.id}>
                <span>{rate.name}</span>
                <strong>{money(rate.basePrice, settings.defaultCurrency)}+ / {rate.etaDays} days</strong>
              </div>
            ))}
          </section>

          <section className="panel">
            <h2>Payment</h2>
            <div className="miniRow"><span>Provider</span><strong>Stripe or PayPal adapter next</strong></div>
            <div className="miniRow"><span>Status</span><strong>Unpaid demo checkout</strong></div>
          </section>

          <section className="summaryPanel">
            <h2>Order total</h2>
            <div className="summaryRow"><span>Subtotal</span><strong>{money(checkout.subtotal, checkout.currency)}</strong></div>
            <div className="summaryRow"><span>Coupon {checkout.coupon?.code}</span><strong>-{money(checkout.discount, checkout.currency)}</strong></div>
            <div className="summaryRow"><span>Shipping</span><strong>{money(checkout.shipping, checkout.currency)}</strong></div>
            <div className="summaryRow"><span>Tax</span><strong>{money(checkout.tax, checkout.currency)}</strong></div>
            <div className="summaryRow totalRow"><span>Total</span><strong>{money(checkout.total, checkout.currency)}</strong></div>
            <button>Place order</button>
          </section>
        </div>
      </section>
    </main>
  );
}
