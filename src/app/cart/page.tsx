import Link from "next/link";
import { money } from "@/components/Money";
import { calculateCart } from "@/lib/store";

export default function CartPage() {
  const cart = calculateCart(
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
        <Link href="/checkout">Checkout</Link>
        <Link href="/admin">Admin</Link>
      </nav>
      <section className="section">
        <p className="eyebrow">Cart</p>
        <h1>Shopping cart</h1>
        <div className="sectionSplit">
          <div className="panel">
            <h2>Items</h2>
            <div className="table">
              {cart.items.map((item) => (
                <div className="tableRow cartRow" key={item.productId}>
                  <span>{item.product.title}</span>
                  <span>{item.product.sku}</span>
                  <span>Qty {item.quantity}</span>
                  <span>{money(item.product.price, cart.currency)}</span>
                  <span>{money(item.subtotal, cart.currency)}</span>
                </div>
              ))}
            </div>
          </div>
          <div className="summaryPanel">
            <div className="summaryRow"><span>Subtotal</span><strong>{money(cart.subtotal, cart.currency)}</strong></div>
            <div className="summaryRow"><span>Discount</span><strong>-{money(cart.discount, cart.currency)}</strong></div>
            <div className="summaryRow"><span>Shipping</span><strong>{money(cart.shipping, cart.currency)}</strong></div>
            <div className="summaryRow"><span>Tax</span><strong>{money(cart.tax, cart.currency)}</strong></div>
            <div className="summaryRow totalRow"><span>Total</span><strong>{money(cart.total, cart.currency)}</strong></div>
            <Link className="primaryButton" href="/checkout">Proceed to checkout</Link>
          </div>
        </div>
      </section>
    </main>
  );
}
