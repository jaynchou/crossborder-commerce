import { AdminLayout } from "@/components/AdminLayout";
import { ProductCreateForm } from "@/components/ProductCreateForm";
import { listCategoryStats, listProductAttributes, listTags } from "@/lib/store";

export default function NewProductPage() {
  const categories = listCategoryStats().map((category) => category.name);
  const tags = listTags();
  const attributes = listProductAttributes();

  return (
    <AdminLayout eyebrow="Catalog" title="Add product">
      <ProductCreateForm categories={categories} tags={tags} attributes={attributes} />
    </AdminLayout>
  );
}
