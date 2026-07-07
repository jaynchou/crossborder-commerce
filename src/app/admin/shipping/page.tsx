import { AdminLayout } from "@/components/AdminLayout";
import { ShippingRateManager } from "@/components/ShippingRateManager";
import { listShippingRates } from "@/lib/store";

export default function ShippingPage() {
  const rates = listShippingRates();

  return (
    <AdminLayout eyebrow="Logistics" title="Shipping">
      <ShippingRateManager rates={rates} />
    </AdminLayout>
  );
}
