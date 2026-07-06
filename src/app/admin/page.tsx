import {
  getMetrics,
  getSettings,
  listAllProducts,
  listCoupons,
  listCustomers,
  listInventory,
  listOrders,
  listShippingRates
} from "@/lib/store";

export default function AdminPage() {
  const metrics = getMetrics();
  const products = listAllProducts();
  const orders = listOrders();
  const customers = listCustomers();
  const inventory = listInventory();
  const coupons = listCoupons();
  const shippingRates = listShippingRates();
  const settings = getSettings();

  return (
    <main className="adminShell">
      <aside className="sidebar">
        <strong>Commerce Admin</strong>
        <a href="/">Storefront</a>
        <a href="#metrics">Metrics</a>
        <a href="#orders">Orders</a>
        <a href="#products">Products</a>
        <a href="#inventory">Inventory</a>
        <a href="#customers">Customers</a>
        <a href="#fulfillment">Fulfillment</a>
        <a href="#pricing">Pricing</a>
      </aside>
      <section className="adminMain">
        <div className="adminHeader" id="metrics">
          <p className="eyebrow">Operations</p>
          <h1>Operations dashboard</h1>
        </div>
        <div className="metricGrid">
          <div><span>Revenue</span><strong>${metrics.revenue}</strong></div>
          <div><span>Orders</span><strong>{metrics.orders}</strong></div>
          <div><span>Products</span><strong>{metrics.products}</strong></div>
          <div><span>Customers</span><strong>{metrics.customers}</strong></div>
          <div><span>Low stock</span><strong>{metrics.lowStock}</strong></div>
          <div><span>Currency</span><strong>{metrics.currency}</strong></div>
          <div><span>Tax rate</span><strong>{Math.round(settings.taxRate * 100)}%</strong></div>
          <div><span>Markets</span><strong>{settings.supportedCountries.length}</strong></div>
        </div>

        <section className="panel" id="orders">
          <h2>Orders</h2>
          <div className="table">
            {orders.map((order) => (
              <div className="tableRow orderRow" key={order.id}>
                <span>{order.id}</span>
                <span>{order.customer.name}</span>
                <span>{order.customer.country}</span>
                <span>${order.subtotal}</span>
                <span>${order.shipping}</span>
                <span>${order.tax}</span>
                <span>${order.total}</span>
                <span>{order.status}</span>
              </div>
            ))}
          </div>
        </section>

        <section className="panel" id="products">
          <h2>Product catalog</h2>
          <div className="table">
            {products.map((product) => (
              <div className="tableRow productRow" key={product.id}>
                <span>{product.sku}</span>
                <span>{product.title}</span>
                <span>{product.category}</span>
                <span>${product.price}</span>
                <span>{product.originCountry}</span>
                <span>{product.shipFrom}</span>
                <span>{product.status}</span>
              </div>
            ))}
          </div>
        </section>

        <section className="panel" id="inventory">
          <h2>Inventory</h2>
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

        <section className="panel" id="customers">
          <h2>Customers</h2>
          <div className="table">
            {customers.map((customer) => (
              <div className="tableRow customerRow" key={customer.id}>
                <span>{customer.name}</span>
                <span>{customer.email}</span>
                <span>{customer.phone ?? "No phone"}</span>
                <span>{customer.country}</span>
              </div>
            ))}
          </div>
        </section>

        <section className="panel" id="fulfillment">
          <h2>Fulfillment</h2>
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

        <section className="panel" id="pricing">
          <h2>Coupons, tax, and shipping</h2>
          <div className="adminCards">
            <div>
              <h3>Coupons</h3>
              {coupons.map((coupon) => (
                <div className="miniRow" key={coupon.code}>
                  <span>{coupon.code}</span>
                  <strong>{coupon.type === "percentage" ? `${coupon.value}%` : `$${coupon.value}`}</strong>
                </div>
              ))}
            </div>
            <div>
              <h3>Shipping</h3>
              {shippingRates.map((rate) => (
                <div className="miniRow" key={rate.id}>
                  <span>{rate.name}</span>
                  <strong>${rate.basePrice}+ / {rate.etaDays} days</strong>
                </div>
              ))}
            </div>
            <div>
              <h3>Store settings</h3>
              <div className="miniRow"><span>Currency</span><strong>{settings.defaultCurrency}</strong></div>
              <div className="miniRow"><span>Tax</span><strong>{Math.round(settings.taxRate * 100)}%</strong></div>
              <div className="miniRow"><span>Countries</span><strong>{settings.supportedCountries.join(", ")}</strong></div>
            </div>
          </div>
        </section>
      </section>
    </main>
  );
}
