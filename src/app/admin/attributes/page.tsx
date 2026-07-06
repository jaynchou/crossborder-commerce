import { AdminLayout } from "@/components/AdminLayout";
import { listProductAttributes } from "@/lib/store";

export default function AttributesPage() {
  const attributes = listProductAttributes();

  return (
    <AdminLayout eyebrow="Catalog" title="Attributes">
      <section className="panel">
        <div className="panelHeader">
          <h2>Product attributes</h2>
          <button>Add attribute</button>
        </div>
        <div className="table">
          {attributes.map((attribute) => (
            <div className="tableRow attributeRow" key={attribute.id}>
              <span>{attribute.name}</span>
              <span>{attribute.values.join(", ")}</span>
              <span>{attribute.visible ? "Visible" : "Hidden"}</span>
              <span>{attribute.variation ? "Used for variations" : "Information only"}</span>
            </div>
          ))}
        </div>
      </section>
    </AdminLayout>
  );
}
