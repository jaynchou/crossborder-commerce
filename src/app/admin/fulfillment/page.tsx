import { AdminLayout } from "@/components/AdminLayout";
import { listOrders } from "@/lib/store";

export default function FulfillmentPage() {
  const orders = listOrders();

  return (
    <AdminLayout eyebrow="Logistics" title="Fulfillment">
      <section className="panel">
        <h2>Pick, pack, and tracking</h2>
        <div className="table">
          {orders.map((order) => (
            <div className="tableRow fulfillmentRow" key={order.id}>
              <span>{order.id}</span>
              <span>{order.fulfillmentStatus}</span>
              <span>{order.trackingNumber ?? "No tracking yet"}</span>
              <span>{order.customer.city}, {order.customer.country}</span>
            </div>
          ))}
        </div>
      </section>
    </AdminLayout>
  );
}
