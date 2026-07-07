import { AdminLayout } from "@/components/AdminLayout";
import { PaymentMethodManager } from "@/components/PaymentMethodManager";
import { listPaymentMethods } from "@/lib/store";

export default function PaymentsPage() {
  const methods = listPaymentMethods();

  return (
    <AdminLayout eyebrow="Finance" title="Payments">
      <PaymentMethodManager methods={methods} />
    </AdminLayout>
  );
}
