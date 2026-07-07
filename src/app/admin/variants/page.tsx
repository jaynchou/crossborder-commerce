import { AdminLayout } from "@/components/AdminLayout";
import { VariantManager } from "@/components/VariantManager";
import { listAllProducts, listProductVariants } from "@/lib/store";

export default function VariantsPage() {
  const variants = listProductVariants();
  const products = listAllProducts();

  return (
    <AdminLayout eyebrow="Catalog" title="Variants">
      <VariantManager products={products} variants={variants} />
    </AdminLayout>
  );
}
