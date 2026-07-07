"use client";

import { useState } from "react";
import { money } from "@/components/Money";
import type { Refund } from "@/lib/types";

type ApiResult<T> = {
  ok: boolean;
  data?: T;
  error?: string;
};

type RefundManagerProps = {
  refunds: Refund[];
};

export function RefundManager({ refunds: initialRefunds }: RefundManagerProps) {
  const [refunds, setRefunds] = useState(initialRefunds);
  const [message, setMessage] = useState("Review refund requests, approve adjustments, and track payout status.");

  async function updateStatus(id: string, status: Refund["status"]) {
    setMessage("Updating refund...");
    const response = await fetch("/api/admin/refunds", {
      method: "PATCH",
      headers: {
        "content-type": "application/json"
      },
      body: JSON.stringify({ id, status })
    });
    const result = (await response.json()) as ApiResult<Refund>;

    if (result.ok && result.data) {
      const updatedRefund = result.data;
      setRefunds((current) =>
        current.map((refund) => (refund.id === id ? { ...refund, status: updatedRefund.status } : refund))
      );
      setMessage(`${updatedRefund.id} marked ${updatedRefund.status}.`);
    } else {
      setMessage(result.error ?? "Unable to update refund.");
    }
  }

  return (
    <section className="panel">
      <div className="panelHeader">
        <div>
          <h2>Refund requests</h2>
          <p className="statusText">{message}</p>
        </div>
      </div>
      <div className="table">
        {refunds.map((refund) => (
          <div className="tableRow refundManagerRow" key={refund.id}>
            <span>{refund.id}</span>
            <span>{refund.orderId}</span>
            <span>{money(refund.amount, refund.currency)}</span>
            <span>{refund.reason}</span>
            <span>{refund.status}</span>
            <span className="rowActions">
              <button type="button" onClick={() => updateStatus(refund.id, "approved")}>Approve</button>
              <button className="ghostButton" type="button" onClick={() => updateStatus(refund.id, "rejected")}>Reject</button>
              <button className="ghostButton" type="button" onClick={() => updateStatus(refund.id, "paid")}>Paid</button>
            </span>
          </div>
        ))}
      </div>
    </section>
  );
}
