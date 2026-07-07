"use client";

import { useState } from "react";
import { money } from "@/components/Money";
import type { Order } from "@/lib/types";

type ApiResult<T> = {
  ok: boolean;
  data?: T;
  error?: string;
};

type OrderStatusManagerProps = {
  orders: Order[];
};

export function OrderStatusManager({ orders: initialOrders }: OrderStatusManagerProps) {
  const [orders, setOrders] = useState(initialOrders);
  const [message, setMessage] = useState("Move orders through payment, processing, cancellation, and refund states.");

  async function updateOrder(id: string, status: Order["status"]) {
    setMessage("Updating order...");
    const response = await fetch("/api/admin/orders", {
      method: "PATCH",
      headers: {
        "content-type": "application/json"
      },
      body: JSON.stringify({ id, status })
    });
    const result = (await response.json()) as ApiResult<Order>;

    if (result.ok && result.data) {
      const updatedOrder = result.data;
      setOrders((current) => current.map((order) => (order.id === id ? updatedOrder : order)));
      setMessage(`${updatedOrder.id} is now ${updatedOrder.status}.`);
    } else {
      setMessage(result.error ?? "Unable to update order.");
    }
  }

  return (
    <section className="panel">
      <div className="panelHeader">
        <div>
          <h2>Order management</h2>
          <p className="statusText">{message}</p>
        </div>
      </div>
      <div className="table">
        {orders.map((order) => (
          <div className="tableRow orderManagerRow" key={order.id}>
            <span>{order.id}</span>
            <span>{order.customer.name}</span>
            <span>{order.paymentStatus}</span>
            <span>{order.fulfillmentStatus}</span>
            <span>{money(order.total, order.currency)}</span>
            <span>{order.status}</span>
            <span className="rowActions">
              <button type="button" onClick={() => updateOrder(order.id, "paid")}>Mark paid</button>
              <button className="ghostButton" type="button" onClick={() => updateOrder(order.id, "processing")}>Processing</button>
              <button className="ghostButton" type="button" onClick={() => updateOrder(order.id, "cancelled")}>Cancel</button>
              <button className="ghostButton" type="button" onClick={() => updateOrder(order.id, "refunded")}>Refunded</button>
            </span>
          </div>
        ))}
      </div>
    </section>
  );
}
