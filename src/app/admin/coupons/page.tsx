import { AdminLayout } from "@/components/AdminLayout";
import { CouponCreateForm } from "@/components/CouponCreateForm";
import { listCoupons } from "@/lib/store";

export default function CouponsPage() {
  const coupons = listCoupons();

  return (
    <AdminLayout eyebrow="Marketing" title="Coupons">
      <section className="panel">
        <div className="panelHeader">
          <h2>Promotion codes</h2>
        </div>
        <div className="table">
          {coupons.map((coupon) => (
            <div className="tableRow couponRow" key={coupon.code}>
              <span>{coupon.code}</span>
              <span>{coupon.type}</span>
              <span>{coupon.type === "percentage" ? `${coupon.value}%` : `$${coupon.value}`}</span>
              <span>{coupon.minSubtotal ? `Min $${coupon.minSubtotal}` : "No minimum"}</span>
              <span>{coupon.active ? "Active" : "Inactive"}</span>
            </div>
          ))}
        </div>
      </section>
      <CouponCreateForm />
    </AdminLayout>
  );
}
