import { AdminLayout } from "@/components/AdminLayout";
import { money } from "@/components/Money";
import { listRefunds } from "@/lib/store";

export default function RefundsPage() {
  const refunds = listRefunds();

  return (
    <AdminLayout eyebrow="After-sales" title="Refunds">
      <section className="panel">
        <h2>Refund requests</h2>
        <div className="table">
          {refunds.map((refund) => (
            <div className="tableRow refundRow" key={refund.id}>
              <span>{refund.id}</span>
              <span>{refund.orderId}</span>
              <span>{money(refund.amount, refund.currency)}</span>
              <span>{refund.reason}</span>
              <span>{refund.status}</span>
            </div>
          ))}
        </div>
      </section>
    </AdminLayout>
  );
}
