import { AdminLayout } from "@/components/AdminLayout";
import { money } from "@/components/Money";
import { listOrders } from "@/lib/store";

export default function OrdersPage() {
  const orders = listOrders();

  return (
    <AdminLayout eyebrow="Sales" title="Orders">
      <section className="panel">
        <h2>Order management</h2>
        <div className="table">
          {orders.map((order) => (
            <div className="tableRow orderRow" key={order.id}>
              <span>{order.id}</span>
              <span>{order.customer.name}</span>
              <span>{order.paymentStatus}</span>
              <span>{order.fulfillmentStatus}</span>
              <span>{money(order.shipping, order.currency)}</span>
              <span>{money(order.tax, order.currency)}</span>
              <span>{money(order.total, order.currency)}</span>
              <span>{order.status}</span>
            </div>
          ))}
        </div>
      </section>
    </AdminLayout>
  );
}
