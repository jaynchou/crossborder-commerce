"use client";

import { useState } from "react";

type InventoryItem = {
  productId: string;
  sku: string;
  title: string;
  stock: number;
  reserved: number;
  available: number;
  shipFrom: string;
};

type ApiResult<T> = {
  ok: boolean;
  data?: T;
  error?: string;
};

type InventoryManagerProps = {
  inventory: InventoryItem[];
};

export function InventoryManager({ inventory: initialInventory }: InventoryManagerProps) {
  const [inventory, setInventory] = useState(initialInventory);
  const [message, setMessage] = useState("Adjust stock and reserved quantities before launch campaigns.");

  async function saveInventory(item: InventoryItem, stock: number, reserved: number) {
    setMessage("Updating inventory...");
    const response = await fetch("/api/admin/inventory", {
      method: "PATCH",
      headers: {
        "content-type": "application/json"
      },
      body: JSON.stringify({ productId: item.productId, stock, reserved })
    });
    const result = (await response.json()) as ApiResult<InventoryItem>;

    if (result.ok && result.data) {
      const updatedItem = result.data;
      setInventory((current) =>
        current.map((candidate) => (candidate.productId === item.productId ? updatedItem : candidate))
      );
      setMessage(`${updatedItem.sku} inventory updated.`);
    } else {
      setMessage(result.error ?? "Unable to update inventory.");
    }
  }

  return (
    <section className="panel">
      <div className="panelHeader">
        <div>
          <h2>Stock and reservations</h2>
          <p className="statusText">{message}</p>
        </div>
      </div>
      <div className="table">
        {inventory.map((item) => (
          <InventoryRow item={item} key={item.productId} onSave={saveInventory} />
        ))}
      </div>
    </section>
  );
}

function InventoryRow({
  item,
  onSave
}: {
  item: InventoryItem;
  onSave: (item: InventoryItem, stock: number, reserved: number) => void;
}) {
  const [stock, setStock] = useState(String(item.stock));
  const [reserved, setReserved] = useState(String(item.reserved));

  return (
    <div className="tableRow inventoryManagerRow">
      <span>{item.sku}</span>
      <span>{item.title}</span>
      <label>Stock
        <input inputMode="numeric" value={stock} onChange={(event) => setStock(event.target.value)} />
      </label>
      <label>Reserved
        <input inputMode="numeric" value={reserved} onChange={(event) => setReserved(event.target.value)} />
      </label>
      <span>Available {item.available}</span>
      <span>{item.shipFrom}</span>
      <span className="rowActions">
        <button type="button" onClick={() => onSave(item, Number(stock), Number(reserved))}>Save</button>
      </span>
    </div>
  );
}
