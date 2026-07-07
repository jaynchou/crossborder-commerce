import { AdminLayout } from "@/components/AdminLayout";
import { InventoryManager } from "@/components/InventoryManager";
import { listInventory } from "@/lib/store";

export default function InventoryPage() {
  const inventory = listInventory();

  return (
    <AdminLayout eyebrow="Operations" title="Inventory">
      <InventoryManager inventory={inventory} />
    </AdminLayout>
  );
}
