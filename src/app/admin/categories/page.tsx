import { AdminLayout } from "@/components/AdminLayout";
import { listCategoryStats } from "@/lib/store";

export default function CategoriesPage() {
  const categories = listCategoryStats();

  return (
    <AdminLayout eyebrow="Catalog" title="Categories">
      <section className="panel">
        <div className="panelHeader">
          <h2>Category management</h2>
          <button>Add category</button>
        </div>
        <div className="table">
          {categories.map((category) => (
            <div className="tableRow categoryRow" key={category.name}>
              <span>{category.name}</span>
              <span>{category.products} products</span>
              <span>{category.active} active</span>
              <span>{category.stock} units</span>
            </div>
          ))}
        </div>
      </section>
    </AdminLayout>
  );
}
