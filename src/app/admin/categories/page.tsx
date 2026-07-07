import { AdminLayout } from "@/components/AdminLayout";
import { CategoryManager } from "@/components/CategoryManager";
import { listCategoryStats } from "@/lib/store";

export default function CategoriesPage() {
  const categories = listCategoryStats();

  return (
    <AdminLayout eyebrow="Catalog" title="Categories">
      <CategoryManager categories={categories} />
    </AdminLayout>
  );
}
