import { AdminLayout } from "@/components/AdminLayout";
import { CouponCreateForm } from "@/components/CouponCreateForm";
import { CouponManagerTable } from "@/components/CouponManagerTable";
import { listCoupons } from "@/lib/store";

export default function CouponsPage() {
  const coupons = listCoupons();

  return (
    <AdminLayout eyebrow="Marketing" title="Coupons">
      <CouponManagerTable coupons={coupons} />
      <CouponCreateForm />
    </AdminLayout>
  );
}
