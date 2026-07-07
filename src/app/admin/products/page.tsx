import Link from "next/link";
import { AdminLayout } from "@/components/AdminLayout";
import { money } from "@/components/Money";
import { listAllProducts, listCategoryStats, listMediaAssets, listProductAttributes, listProductVariants } from "@/lib/store";

export default function ProductsPage() {
  const products = listAllProducts();
  const categories = listCategoryStats();
  const attributes = listProductAttributes();
  const variants = listProductVariants();
  const media = listMediaAssets();

  return (
    <AdminLayout eyebrow="Catalog" title="Products">
      <div className="metricGrid">
        <div><span>Products</span><strong>{products.length}</strong></div>
        <div><span>Categories</span><strong>{categories.length}</strong></div>
        <div><span>Attributes</span><strong>{attributes.length}</strong></div>
        <div><span>Variants</span><strong>{variants.length}</strong></div>
      </div>
      <section className="panel">
        <div className="panelHeader">
          <h2>Product management</h2>
          <Link className="primaryButton" href="/admin/products/new">Add product</Link>
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
              <span>
                {product.status}
                <Link className="textLink" href={`/admin/products/${product.id}`}>Edit</Link>
              </span>
            </div>
          ))}
        </div>
      </section>
      <section className="panel">
        <h2>Product building blocks</h2>
        <div className="adminCards">
          <div><h3>Images</h3><strong>{media.length}</strong><p>Upload gallery images and thumbnails.</p></div>
          <div><h3>Attributes</h3><strong>{attributes.length}</strong><p>Create color, size, material, and other specs.</p></div>
          <div><h3>Variants</h3><strong>{variants.length}</strong><p>Generate purchasable SKU combinations.</p></div>
        </div>
      </section>
    </AdminLayout>
  );
}
