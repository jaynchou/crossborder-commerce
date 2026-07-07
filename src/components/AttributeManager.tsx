"use client";

import { useState } from "react";
import type { ProductAttribute } from "@/lib/types";

type ApiResult<T> = {
  ok: boolean;
  data?: T;
  error?: string;
};

type AttributeManagerProps = {
  attributes: ProductAttribute[];
};

export function AttributeManager({ attributes: initialAttributes }: AttributeManagerProps) {
  const [attributes, setAttributes] = useState(initialAttributes);
  const [name, setName] = useState("Pattern");
  const [values, setValues] = useState("Solid, Stripe, Print");
  const [visible, setVisible] = useState(true);
  const [variation, setVariation] = useState(false);
  const [message, setMessage] = useState("Attributes power filters, product specs, and variant generation.");

  async function createAttribute() {
    setMessage("Creating attribute...");
    const response = await fetch("/api/admin/attributes", {
      method: "POST",
      headers: {
        "content-type": "application/json"
      },
      body: JSON.stringify({
        name,
        values: values.split(",").map((value) => value.trim()).filter(Boolean),
        visible,
        variation
      })
    });
    const result = (await response.json()) as ApiResult<ProductAttribute>;

    if (result.ok && result.data) {
      setAttributes((current) => [result.data as ProductAttribute, ...current]);
      setMessage(`Created attribute ${result.data.name}.`);
    } else {
      setMessage(result.error ?? "Unable to create attribute.");
    }
  }

  return (
    <section className="panel">
      <div className="panelHeader">
        <div>
          <h2>Product attributes</h2>
          <p className="statusText">{message}</p>
        </div>
        <button type="button" onClick={createAttribute}>Add attribute</button>
      </div>
      <div className="professionalForm twoColumns compactAdminForm">
        <label>Name
          <input value={name} onChange={(event) => setName(event.target.value)} />
        </label>
        <label>Values
          <input value={values} onChange={(event) => setValues(event.target.value)} />
        </label>
        <label className="toggleLine">
          <input checked={visible} type="checkbox" onChange={(event) => setVisible(event.target.checked)} />
          Visible on product page
        </label>
        <label className="toggleLine">
          <input checked={variation} type="checkbox" onChange={(event) => setVariation(event.target.checked)} />
          Used for variations
        </label>
      </div>
      <div className="table">
        {attributes.map((attribute) => (
          <div className="tableRow attributeRow" key={attribute.id}>
            <span>{attribute.name}</span>
            <span>{attribute.values.join(", ")}</span>
            <span>{attribute.visible ? "Visible" : "Hidden"}</span>
            <span>{attribute.variation ? "Used for variations" : "Information only"}</span>
          </div>
        ))}
      </div>
    </section>
  );
}
