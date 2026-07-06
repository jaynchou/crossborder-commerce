import { AdminLayout } from "@/components/AdminLayout";
import { listPaymentMethods } from "@/lib/store";

export default function PaymentsPage() {
  const methods = listPaymentMethods();

  return (
    <AdminLayout eyebrow="Finance" title="Payments">
      <section className="panel">
        <div className="panelHeader">
          <h2>Payment methods</h2>
          <button>Connect provider</button>
        </div>
        <div className="table">
          {methods.map((method) => (
            <div className="tableRow paymentRow" key={method.id}>
              <span>{method.name}</span>
              <span>{method.provider}</span>
              <span>{method.currencies.join(", ")}</span>
              <span>{method.enabled ? "Enabled" : "Disabled"}</span>
            </div>
          ))}
        </div>
      </section>
    </AdminLayout>
  );
}
