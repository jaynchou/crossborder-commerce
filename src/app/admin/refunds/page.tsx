import { AdminLayout } from "@/components/AdminLayout";
import { RefundManager } from "@/components/RefundManager";
import { listRefunds } from "@/lib/store";

export default function RefundsPage() {
  const refunds = listRefunds();

  return (
    <AdminLayout eyebrow="After-sales" title="Refunds">
      <RefundManager refunds={refunds} />
    </AdminLayout>
  );
}
