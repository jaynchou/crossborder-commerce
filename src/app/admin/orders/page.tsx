import { AdminLayout } from "@/components/AdminLayout";
import { OrderStatusManager } from "@/components/OrderStatusManager";
import { listOrders } from "@/lib/store";

export default function OrdersPage() {
  const orders = listOrders();

  return (
    <AdminLayout eyebrow="Sales" title="Orders">
      <OrderStatusManager orders={orders} />
    </AdminLayout>
  );
}
