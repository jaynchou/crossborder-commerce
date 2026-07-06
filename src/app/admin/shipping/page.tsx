import { AdminLayout } from "@/components/AdminLayout";
import { money } from "@/components/Money";
import { listShippingRates } from "@/lib/store";

export default function ShippingPage() {
  const rates = listShippingRates();

  return (
    <AdminLayout eyebrow="Logistics" title="Shipping">
      <section className="panel">
        <div className="panelHeader">
          <h2>Shipping zones and rates</h2>
          <button>Add rate</button>
        </div>
        <div className="table">
          {rates.map((rate) => (
            <div className="tableRow shippingRow" key={rate.id}>
              <span>{rate.name}</span>
              <span>{rate.countries.join(", ")}</span>
              <span>{money(rate.basePrice)}</span>
              <span>{money(rate.perKgPrice)} / kg</span>
              <span>{rate.etaDays} days</span>
            </div>
          ))}
        </div>
      </section>
    </AdminLayout>
  );
}
