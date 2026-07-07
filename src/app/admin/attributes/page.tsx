import { AdminLayout } from "@/components/AdminLayout";
import { AttributeManager } from "@/components/AttributeManager";
import { listProductAttributes } from "@/lib/store";

export default function AttributesPage() {
  const attributes = listProductAttributes();

  return (
    <AdminLayout eyebrow="Catalog" title="Attributes">
      <AttributeManager attributes={attributes} />
    </AdminLayout>
  );
}
