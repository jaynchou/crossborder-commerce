import { AdminLayout } from "@/components/AdminLayout";
import { money } from "@/components/Money";
import { getReports } from "@/lib/store";

export default function ReportsPage() {
  const reports = getReports();

  return (
    <AdminLayout eyebrow="Analytics" title="Reports">
      <div className="metricGrid">
        <div><span>Revenue</span><strong>{money(reports.revenue)}</strong></div>
        <div><span>Units sold</span><strong>{reports.units}</strong></div>
        <div><span>Average order</span><strong>{money(reports.averageOrderValue)}</strong></div>
        <div><span>Refund requests</span><strong>{reports.refundRequests}</strong></div>
        <div><span>Pending reviews</span><strong>{reports.pendingReviews}</strong></div>
        <div><span>Markets</span><strong>{reports.topCountries.join(", ")}</strong></div>
      </div>
      <section className="panel">
        <h2>Report areas to build next</h2>
        <div className="adminCards">
          <div><h3>Sales by product</h3><p>Revenue, units, refunds, and margin by SKU.</p></div>
          <div><h3>Customer cohorts</h3><p>Repeat customers, lifetime value, and acquisition source.</p></div>
          <div><h3>Inventory forecast</h3><p>Sell-through, stockout risk, and reorder suggestions.</p></div>
        </div>
      </section>
    </AdminLayout>
  );
}
