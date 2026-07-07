import { notFound } from "next/navigation";
import { AdminLayout } from "@/components/AdminLayout";
import { ProductEditForm } from "@/components/ProductEditForm";
import { getProduct, listCategoryStats, listTags } from "@/lib/store";

type ProductEditPageProps = {
  params: Promise<{ id: string }>;
};

export default async function ProductEditPage({ params }: ProductEditPageProps) {
  const { id } = await params;
  const product = getProduct(id);

  if (!product) {
    notFound();
  }

  return (
    <AdminLayout eyebrow="Catalog" title="Edit product">
      <ProductEditForm
        product={product}
        categories={listCategoryStats().map((category) => category.name)}
        tags={listTags()}
      />
    </AdminLayout>
  );
}
