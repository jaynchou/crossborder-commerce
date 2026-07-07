"use client";

import { useState } from "react";
import type { Coupon } from "@/lib/types";

type ApiResult<T> = {
  ok: boolean;
  data?: T;
  error?: string;
};

type CouponManagerTableProps = {
  coupons: Coupon[];
};

export function CouponManagerTable({ coupons: initialCoupons }: CouponManagerTableProps) {
  const [coupons, setCoupons] = useState(initialCoupons);
  const [message, setMessage] = useState("Toggle promotions without redeploying the storefront.");

  async function setCouponActive(code: string, active: boolean) {
    setMessage("Updating promotion...");
    const response = await fetch("/api/admin/coupons", {
      method: "PATCH",
      headers: {
        "content-type": "application/json"
      },
      body: JSON.stringify({ code, active })
    });
    const result = (await response.json()) as ApiResult<Coupon>;

    if (result.ok && result.data) {
      const updatedCoupon = result.data;
      setCoupons((current) =>
        current.map((coupon) => (coupon.code === code ? { ...coupon, active: updatedCoupon.active } : coupon))
      );
      setMessage(`${code} is now ${updatedCoupon.active ? "active" : "inactive"}.`);
    } else {
      setMessage(result.error ?? "Unable to update promotion.");
    }
  }

  return (
    <section className="panel">
      <div className="panelHeader">
        <div>
          <h2>Promotion codes</h2>
          <p className="statusText">{message}</p>
        </div>
      </div>
      <div className="table">
        {coupons.map((coupon) => (
          <div className="tableRow couponManagerRow" key={coupon.code}>
            <span>{coupon.code}</span>
            <span>{coupon.type}</span>
            <span>{coupon.type === "percentage" ? `${coupon.value}%` : `$${coupon.value}`}</span>
            <span>{coupon.minSubtotal ? `Min $${coupon.minSubtotal}` : "No minimum"}</span>
            <span>{coupon.active ? "Active" : "Inactive"}</span>
            <span className="rowActions">
              <button type="button" onClick={() => setCouponActive(coupon.code, true)}>Enable</button>
              <button className="ghostButton" type="button" onClick={() => setCouponActive(coupon.code, false)}>Disable</button>
            </span>
          </div>
        ))}
      </div>
    </section>
  );
}
