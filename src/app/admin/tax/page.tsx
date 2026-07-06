import { AdminLayout } from "@/components/AdminLayout";
import { getSettings } from "@/lib/store";

export default function TaxPage() {
  const settings = getSettings();

  return (
    <AdminLayout eyebrow="Finance" title="Tax">
      <section className="panel">
        <h2>Tax settings</h2>
        <div className="adminCards">
          <div>
            <h3>Default tax rate</h3>
            <strong className="largeValue">{Math.round(settings.taxRate * 100)}%</strong>
          </div>
          <div>
            <h3>Taxable markets</h3>
            <p>{settings.supportedCountries.join(", ")}</p>
          </div>
          <div>
            <h3>Calculation method</h3>
            <p>Tax is calculated after coupon discount and before final order total.</p>
          </div>
        </div>
      </section>
    </AdminLayout>
  );
}
