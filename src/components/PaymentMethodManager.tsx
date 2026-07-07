"use client";

import { useState } from "react";
import type { PaymentMethod } from "@/lib/types";

type ApiResult<T> = {
  ok: boolean;
  data?: T;
  error?: string;
};

type PaymentMethodManagerProps = {
  methods: PaymentMethod[];
};

export function PaymentMethodManager({ methods: initialMethods }: PaymentMethodManagerProps) {
  const [methods, setMethods] = useState(initialMethods);
  const [message, setMessage] = useState("Enable manual payment for tests, then connect real providers when credentials are ready.");

  async function setEnabled(id: string, enabled: boolean) {
    setMessage("Updating payment method...");
    const response = await fetch("/api/admin/payments", {
      method: "PATCH",
      headers: {
        "content-type": "application/json"
      },
      body: JSON.stringify({ id, enabled })
    });
    const result = (await response.json()) as ApiResult<PaymentMethod>;

    if (result.ok && result.data) {
      const updatedMethod = result.data;
      setMethods((current) =>
        current.map((method) => (method.id === id ? { ...method, enabled: updatedMethod.enabled } : method))
      );
      setMessage(`${updatedMethod.name} is now ${updatedMethod.enabled ? "enabled" : "disabled"}.`);
    } else {
      setMessage(result.error ?? "Unable to update payment method.");
    }
  }

  return (
    <section className="panel">
      <div className="panelHeader">
        <div>
          <h2>Payment methods</h2>
          <p className="statusText">{message}</p>
        </div>
      </div>
      <div className="table">
        {methods.map((method) => (
          <div className="tableRow paymentManagerRow" key={method.id}>
            <span>{method.name}</span>
            <span>{method.provider}</span>
            <span>{method.currencies.join(", ")}</span>
            <span>{method.enabled ? "Enabled" : "Disabled"}</span>
            <span className="rowActions">
              <button type="button" onClick={() => setEnabled(method.id, true)}>Enable</button>
              <button className="ghostButton" type="button" onClick={() => setEnabled(method.id, false)}>Disable</button>
            </span>
          </div>
        ))}
      </div>
    </section>
  );
}
