import { AdminLayout } from "@/components/AdminLayout";
import { ContentEditor } from "@/components/ContentEditor";
import { getDefaultPageContent, getPageContent, listAllProducts } from "@/lib/store";

export default function ContentPage() {
  const content = getPageContent();
  const defaultContent = getDefaultPageContent();
  const products = listAllProducts();

  return (
    <AdminLayout eyebrow="Experience" title="Content editor">
      <section className="panel">
        <h2>Page templates</h2>
        <div className="adminCards">
          <div>
            <h3>Editorial product grid</h3>
            <p>Best for a marketplace-style homepage with categories, shelves, and promotional blocks.</p>
          </div>
          <div>
            <h3>Single product focus</h3>
            <p>Best for a campaign or hero-led landing page that pushes one featured SKU.</p>
          </div>
          <div>
            <h3>Current template</h3>
            <strong>{content.template === "editorial-grid" ? "Editorial product grid" : "Single product focus"}</strong>
          </div>
        </div>
      </section>
      <ContentEditor content={content} defaultContent={defaultContent} products={products} />
    </AdminLayout>
  );
}
