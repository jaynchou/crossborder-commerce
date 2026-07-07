"use client";

import { useState } from "react";
import { money } from "@/components/Money";
import type { Product, ProductVariant } from "@/lib/types";

type ApiResult<T> = {
  ok: boolean;
  data?: T;
  error?: string;
};

type VariantManagerProps = {
  products: Product[];
  variants: ProductVariant[];
};

export function VariantManager({ products, variants: initialVariants }: VariantManagerProps) {
  const [variants, setVariants] = useState(initialVariants);
  const [productId, setProductId] = useState(products[0]?.id ?? "");
  const [sku, setSku] = useState("CB-NEW-VARIANT");
  const [attributes, setAttributes] = useState("Color: Stone, Size: M");
  const [price, setPrice] = useState("39");
  const [stock, setStock] = useState("24");
  const [weightGrams, setWeightGrams] = useState("320");
  const [image, setImage] = useState("/products/scarf.svg");
  const [message, setMessage] = useState("Create purchasable SKU variants for existing products.");

  async function createVariant() {
    setMessage("Creating variant...");
    const response = await fetch("/api/admin/variants", {
      method: "POST",
      headers: {
        "content-type": "application/json"
      },
      body: JSON.stringify({
        productId,
        sku,
        attributes: parseAttributePairs(attributes),
        price: Number(price),
        stock: Number(stock),
        weightGrams: Number(weightGrams),
        image
      })
    });
    const result = (await response.json()) as ApiResult<ProductVariant>;

    if (result.ok && result.data) {
      setVariants((current) => [result.data as ProductVariant, ...current]);
      setMessage(`Created variant ${result.data.sku}.`);
    } else {
      setMessage(result.error ?? "Unable to create variant.");
    }
  }

  return (
    <section className="panel">
      <div className="panelHeader">
        <div>
          <h2>Product variants</h2>
          <p className="statusText">{message}</p>
        </div>
        <button type="button" onClick={createVariant}>Create variant</button>
      </div>
      <div className="professionalForm twoColumns compactAdminForm">
        <label>Product
          <select value={productId} onChange={(event) => setProductId(event.target.value)}>
            {products.map((product) => <option value={product.id} key={product.id}>{product.title}</option>)}
          </select>
        </label>
        <label>Variant SKU
          <input value={sku} onChange={(event) => setSku(event.target.value)} />
        </label>
        <label className="fullField">Attributes
          <input value={attributes} onChange={(event) => setAttributes(event.target.value)} />
        </label>
        <label>Price
          <input inputMode="decimal" value={price} onChange={(event) => setPrice(event.target.value)} />
        </label>
        <label>Stock
          <input inputMode="numeric" value={stock} onChange={(event) => setStock(event.target.value)} />
        </label>
        <label>Weight grams
          <input inputMode="numeric" value={weightGrams} onChange={(event) => setWeightGrams(event.target.value)} />
        </label>
        <label>Image
          <input value={image} onChange={(event) => setImage(event.target.value)} />
        </label>
      </div>
      <div className="table">
        {variants.map((variant) => (
          <div className="tableRow variantRow" key={variant.id}>
            <span>{variant.sku}</span>
            <span>{Object.entries(variant.attributes).map(([key, value]) => `${key}: ${value}`).join(", ")}</span>
            <span>{money(variant.price)}</span>
            <span>Stock {variant.stock}</span>
            <span>{variant.weightGrams}g</span>
          </div>
        ))}
      </div>
    </section>
  );
}

function parseAttributePairs(value: string) {
  return value.split(",").reduce<Record<string, string>>((attributes, pair) => {
    const [key, ...rest] = pair.split(":");
    const attributeName = key?.trim();
    const attributeValue = rest.join(":").trim();
    if (attributeName && attributeValue) {
      attributes[attributeName] = attributeValue;
    }
    return attributes;
  }, {});
}
