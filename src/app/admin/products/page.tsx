import { AdminLayout } from "@/components/AdminLayout";
import { money } from "@/components/Money";
import { listAllProducts } from "@/lib/store";

export default function ProductsPage() {
  const products = listAllProducts();

  return (
    <AdminLayout eyebrow="Catalog" title="Products">
      <section className="panel">
        <div className="panelHeader">
          <h2>Product management</h2>
          <button>Add product</button>
        </div>
        <div className="table">
          {products.map((product) => (
            <div className="tableRow productRow" key={product.id}>
              <span>{product.sku}</span>
              <span>{product.title}</span>
              <span>{product.category}</span>
              <span>{money(product.price, product.currency)}</span>
              <span>{product.originCountry}</span>
              <span>{product.shipFrom}</span>
              <span>{product.status}</span>
            </div>
          ))}
        </div>
      </section>
    </AdminLayout>
  );
}
