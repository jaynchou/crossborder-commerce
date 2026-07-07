"use client";

import { useState } from "react";
import type { Coupon } from "@/lib/types";

type ApiResult<T> = {
  ok: boolean;
  data?: T;
  error?: string;
};

export function CouponCreateForm() {
  const [code, setCode] = useState("WELCOME15");
  const [type, setType] = useState<Coupon["type"]>("percentage");
  const [value, setValue] = useState("15");
  const [minSubtotal, setMinSubtotal] = useState("50");
  const [message, setMessage] = useState("Create a promotion code for storefront and checkout testing.");

  async function createPromotion() {
    setMessage("Creating promotion...");
    const response = await fetch("/api/admin/coupons", {
      method: "POST",
      headers: {
        "content-type": "application/json"
      },
      body: JSON.stringify({
        code,
        type,
        value: Number(value),
        active: true,
        minSubtotal: minSubtotal ? Number(minSubtotal) : undefined
      })
    });
    const result = (await response.json()) as ApiResult<Coupon>;
    setMessage(result.ok && result.data ? `Created promotion ${result.data.code}.` : result.error ?? "Unable to create promotion.");
  }

  return (
    <section className="panel">
      <div className="panelHeader">
        <div>
          <h2>Create promotion</h2>
          <p className="statusText">New codes are available to validation, cart totals, product detail promotions, and the storefront footer.</p>
        </div>
        <button data-testid="create-coupon" type="button" onClick={createPromotion}>Create coupon</button>
      </div>
      <div className="professionalForm twoColumns">
        <label>Code
          <input value={code} onChange={(event) => setCode(event.target.value.toUpperCase())} />
        </label>
        <label>Type
          <select value={type} onChange={(event) => setType(event.target.value as Coupon["type"])}>
            <option value="percentage">Percentage</option>
            <option value="fixed">Fixed amount</option>
          </select>
        </label>
        <label>Value
          <input inputMode="decimal" value={value} onChange={(event) => setValue(event.target.value)} />
        </label>
        <label>Minimum subtotal
          <input inputMode="decimal" value={minSubtotal} onChange={(event) => setMinSubtotal(event.target.value)} />
        </label>
      </div>
      <p className="statusText">{message}</p>
    </section>
  );
}
