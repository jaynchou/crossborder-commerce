import Link from "next/link";
import { AdminLayout } from "@/components/AdminLayout";
import { money } from "@/components/Money";
import { listActivePromotions, listAllProducts, listRelatedProducts } from "@/lib/store";

export default function MerchandisingPage() {
  const products = listAllProducts();
  const promotions = listActivePromotions();

  return (
    <AdminLayout eyebrow="Growth" title="Merchandising">
      <section className="panel">
        <div className="panelHeader">
          <div>
            <h2>Cross-sell rules</h2>
            <p className="statusText">Recommendations currently rank by category match, shared tags, fulfillment node, and lower entry price.</p>
          </div>
          <Link className="primaryButton" href="/admin/products/new">Create product</Link>
        </div>
        <div className="table">
          {products.map((product) => {
            const related = listRelatedProducts(product.id, 3);
            return (
              <div className="tableRow merchandisingRow" key={product.id}>
                <span>
                  <strong>{product.title}</strong>
                  <small>{product.category} | {product.shipFrom}</small>
                </span>
                <span>{product.tags.join(", ") || "No tags"}</span>
                <span>
                  {related.map((item) => (
                    <Link href={`/products/${item.id}`} key={item.id}>{item.title}</Link>
                  ))}
                </span>
                <span>{product.originalPrice ? `${money(product.originalPrice - product.price, product.currency)} markdown` : "No markdown"}</span>
              </div>
            );
          })}
        </div>
      </section>

      <section className="panel">
        <div className="panelHeader">
          <div>
            <h2>Promotion placements</h2>
            <p className="statusText">Active promotions appear in the mega menu, product detail page, footer, cart, and checkout.</p>
          </div>
          <Link className="outlineButton" href="/admin/coupons">Manage coupons</Link>
        </div>
        <div className="adminCards">
          {promotions.map((promotion) => (
            <div key={promotion.code}>
              <h3>{promotion.code}</h3>
              <strong>{promotion.type === "percentage" ? `${promotion.value}%` : money(promotion.value)} off</strong>
              <p>{promotion.minSubtotal ? `Minimum subtotal ${money(promotion.minSubtotal)}` : "No minimum subtotal"}</p>
            </div>
          ))}
        </div>
      </section>
    </AdminLayout>
  );
}
