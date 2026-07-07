"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

type FulfillmentFormProps = {
  orderId: string;
};

type ApiResult<T> = {
  ok: boolean;
  data?: T;
  error?: string;
};

export function FulfillmentForm({ orderId }: FulfillmentFormProps) {
  const router = useRouter();
  const [trackingNumber, setTrackingNumber] = useState("");
  const [adminToken, setAdminToken] = useState("");
  const [message, setMessage] = useState("");

  async function submitFulfillment() {
    const response = await fetch("/api/admin/fulfillment", {
      method: "POST",
      headers: {
        "content-type": "application/json",
        "x-admin-token": adminToken
      },
      body: JSON.stringify({ orderId, trackingNumber })
    });
    const result = (await response.json()) as ApiResult<{ id: string; trackingNumber?: string }>;

    if (result.ok) {
      setMessage(`Tracking saved for ${result.data?.id ?? orderId}.`);
      setTrackingNumber("");
      router.refresh();
    } else {
      setMessage(result.error ?? "Unable to save tracking.");
    }
  }

  return (
    <div className="fulfillmentForm">
      <input
        aria-label={`Tracking number for ${orderId}`}
        data-testid={`tracking-${orderId}`}
        placeholder="Tracking number"
        value={trackingNumber}
        onChange={(event) => setTrackingNumber(event.target.value)}
      />
      <input
        aria-label="Admin token"
        data-testid={`admin-token-${orderId}`}
        placeholder="ADMIN_TOKEN"
        type="password"
        value={adminToken}
        onChange={(event) => setAdminToken(event.target.value)}
      />
      <button data-testid={`save-tracking-${orderId}`} type="button" onClick={submitFulfillment}>Save tracking</button>
      {message ? <span>{message}</span> : null}
    </div>
  );
}
