import { AdminLayout } from "@/components/AdminLayout";
import { money } from "@/components/Money";
import { listProductVariants } from "@/lib/store";

export default function VariantsPage() {
  const variants = listProductVariants();

  return (
    <AdminLayout eyebrow="Catalog" title="Variants">
      <section className="panel">
        <div className="panelHeader">
          <h2>Product variants</h2>
          <button>Generate variants</button>
        </div>
        <div className="table">
          {variants.map((variant) => (
            <div className="tableRow variantRow" key={variant.id}>
              <span>{variant.sku}</span>
              <span>{Object.entries(variant.attributes).map(([key, value]) => `${key}: ${value}`).join(", ")}</span>
              <span>{money(variant.price)}</span>
              <span>Stock {variant.stock}</span>
              <span>{variant.weightGrams}g</span>
            </div>
          ))}
        </div>
      </section>
    </AdminLayout>
  );
}
