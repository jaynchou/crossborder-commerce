import { getMetrics, listAllProducts, listOrders } from "@/lib/store";

export default function AdminPage() {
  const metrics = getMetrics();
  const products = listAllProducts();
  const orders = listOrders();

  return (
    <main className="adminShell">
      <aside className="sidebar">
        <strong>Commerce Admin</strong>
        <a href="/">Storefront</a>
        <a href="#orders">Orders</a>
        <a href="#products">Products</a>
      </aside>
      <section className="adminMain">
        <div className="adminHeader">
          <p className="eyebrow">Operations</p>
          <h1>Operations dashboard</h1>
        </div>
        <div className="metricGrid">
          <div><span>Revenue</span><strong>${metrics.revenue}</strong></div>
          <div><span>Orders</span><strong>{metrics.orders}</strong></div>
          <div><span>Products</span><strong>{metrics.products}</strong></div>
          <div><span>Low stock</span><strong>{metrics.lowStock}</strong></div>
        </div>

        <section className="panel" id="orders">
          <h2>Recent orders</h2>
          <div className="table">
            {orders.map((order) => (
              <div className="tableRow" key={order.id}>
                <span>{order.id}</span>
                <span>{order.customer.name}</span>
                <span>${order.total}</span>
                <span>{order.status}</span>
              </div>
            ))}
          </div>
        </section>

        <section className="panel" id="products">
          <h2>Product management</h2>
          <div className="table">
            {products.map((product) => (
              <div className="tableRow" key={product.id}>
                <span>{product.title}</span>
                <span>{product.category}</span>
                <span>库存 {product.stock}</span>
                <span>{product.status}</span>
              </div>
            ))}
          </div>
        </section>
      </section>
    </main>
  );
}
