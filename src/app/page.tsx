import Link from "next/link";
import {
  calculateCart,
  listCategories,
  listCoupons,
  listProducts,
  listShippingRates
} from "@/lib/store";

export default function StorefrontPage() {
  const products = listProducts();
  const featured = products.filter((product) => product.featured);
  const categories = listCategories();
  const coupons = listCoupons();
  const shippingRates = listShippingRates("US");
  const quote = calculateCart(
    [
      { productId: "album-cloud-001", quantity: 1 },
      { productId: "album-tea-002", quantity: 2 }
    ],
    { country: "US", couponCode: "LAUNCH10", shippingRateId: "standard-global" }
  );

  return (
    <main>
      <section className="hero">
        <nav className="nav">
          <strong>{process.env.NEXT_PUBLIC_STORE_NAME ?? "CrossBorder Commerce"}</strong>
          <div>
            <a href="#products">Products</a>
            <a href="#checkout">Checkout</a>
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
                  SKU {product.sku} · Ships from {product.shipFrom} · Origin {product.originCountry}
                </p>
                <p>{product.description}</p>
                <div className="priceRow">
                  <strong>${product.price}</strong>
                  {product.originalPrice ? <del>${product.originalPrice}</del> : null}
                </div>
                <button>Add to cart</button>
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
            This panel renders the backend pricing result for a sample US cart. It includes stock
            checks, coupon discount, shipping, tax, and final total.
          </p>
          <div className="summaryPanel">
            {quote.items.map((item) => (
              <div className="summaryRow" key={item.productId}>
                <span>{item.product.title} x {item.quantity}</span>
                <strong>${item.subtotal}</strong>
              </div>
            ))}
            <div className="summaryRow"><span>Subtotal</span><strong>${quote.subtotal}</strong></div>
            <div className="summaryRow"><span>Coupon {quote.coupon?.code}</span><strong>-${quote.discount}</strong></div>
            <div className="summaryRow"><span>Shipping {quote.shippingRate?.name}</span><strong>${quote.shipping}</strong></div>
            <div className="summaryRow"><span>Tax</span><strong>${quote.tax}</strong></div>
            <div className="summaryRow totalRow"><span>Total</span><strong>${quote.total}</strong></div>
          </div>
        </div>

        <div className="sideStack">
          <div className="panel compactPanel">
            <h3>Coupons</h3>
            {coupons.map((coupon) => (
              <div className="miniRow" key={coupon.code}>
                <span>{coupon.code}</span>
                <strong>{coupon.type === "percentage" ? `${coupon.value}%` : `$${coupon.value}`}</strong>
              </div>
            ))}
          </div>
          <div className="panel compactPanel">
            <h3>Shipping rates</h3>
            {shippingRates.map((rate) => (
              <div className="miniRow" key={rate.id}>
                <span>{rate.name}</span>
                <strong>${rate.basePrice}+ · {rate.etaDays} days</strong>
              </div>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
