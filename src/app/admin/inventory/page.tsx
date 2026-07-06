import { AdminLayout } from "@/components/AdminLayout";
import { listInventory } from "@/lib/store";

export default function InventoryPage() {
  const inventory = listInventory();

  return (
    <AdminLayout eyebrow="Operations" title="Inventory">
      <section className="panel">
        <h2>Stock and reservations</h2>
        <div className="table">
          {inventory.map((item) => (
            <div className="tableRow inventoryRow" key={item.productId}>
              <span>{item.sku}</span>
              <span>{item.title}</span>
              <span>Stock {item.stock}</span>
              <span>Reserved {item.reserved}</span>
              <span>Available {item.available}</span>
              <span>{item.shipFrom}</span>
            </div>
          ))}
        </div>
      </section>
    </AdminLayout>
  );
}
