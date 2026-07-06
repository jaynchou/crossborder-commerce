import { AdminLayout } from "@/components/AdminLayout";
import { money } from "@/components/Money";
import { getMetrics, getSettings, listOrders } from "@/lib/store";

export default function AdminPage() {
  const metrics = getMetrics();
  const settings = getSettings();
  const orders = listOrders();

  return (
    <AdminLayout eyebrow="Operations" title="Dashboard">
      <div className="metricGrid">
        <div><span>Revenue</span><strong>{money(metrics.revenue, metrics.currency)}</strong></div>
        <div><span>Orders</span><strong>{metrics.orders}</strong></div>
        <div><span>Products</span><strong>{metrics.products}</strong></div>
        <div><span>Customers</span><strong>{metrics.customers}</strong></div>
        <div><span>Low stock</span><strong>{metrics.lowStock}</strong></div>
        <div><span>Currency</span><strong>{metrics.currency}</strong></div>
        <div><span>Tax rate</span><strong>{Math.round(settings.taxRate * 100)}%</strong></div>
        <div><span>Markets</span><strong>{settings.supportedCountries.length}</strong></div>
      </div>

      <section className="panel">
        <h2>Recent order activity</h2>
        <div className="table">
          {orders.map((order) => (
            <div className="tableRow orderRow" key={order.id}>
              <span>{order.id}</span>
              <span>{order.customer.name}</span>
              <span>{order.customer.country}</span>
              <span>{money(order.subtotal, order.currency)}</span>
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
