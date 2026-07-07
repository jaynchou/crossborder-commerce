"use client";

import Link from "next/link";
import { useState } from "react";
import type { Product } from "@/lib/types";

type ApiResult<T> = {
  ok: boolean;
  data?: T;
  error?: string;
};

type ProductEditFormProps = {
  product: Product;
  categories: string[];
  tags: string[];
};

export function ProductEditForm({ product, categories, tags }: ProductEditFormProps) {
  const [title, setTitle] = useState(product.title);
  const [subtitle, setSubtitle] = useState(product.subtitle ?? "");
  const [description, setDescription] = useState(product.description);
  const [sku, setSku] = useState(product.sku);
  const [price, setPrice] = useState(String(product.price));
  const [originalPrice, setOriginalPrice] = useState(product.originalPrice ? String(product.originalPrice) : "");
  const [stock, setStock] = useState(String(product.stock));
  const [reserved, setReserved] = useState(String(product.reserved));
  const [weightGrams, setWeightGrams] = useState(String(product.weightGrams));
  const [originCountry, setOriginCountry] = useState(product.originCountry);
  const [shipFrom, setShipFrom] = useState(product.shipFrom);
  const [category, setCategory] = useState(product.category);
  const [images, setImages] = useState(product.images.join(", "));
  const [selectedTags, setSelectedTags] = useState(product.tags);
  const [featured, setFeatured] = useState(product.featured);
  const [status, setStatus] = useState<Product["status"]>(product.status);
  const [message, setMessage] = useState("Update product content, pricing, inventory, and merchandising status.");

  function toggleTag(tag: string) {
    setSelectedTags((current) =>
      current.includes(tag) ? current.filter((item) => item !== tag) : [...current, tag]
    );
  }

  async function saveProduct() {
    setMessage("Saving product...");
    const response = await fetch(`/api/admin/products/${product.id}`, {
      method: "PUT",
      headers: {
        "content-type": "application/json"
      },
      body: JSON.stringify({
        sku,
        title,
        subtitle,
        description,
        price: Number(price),
        currency: product.currency,
        originalPrice: originalPrice ? Number(originalPrice) : undefined,
        category,
        originCountry,
        shipFrom,
        weightGrams: Number(weightGrams),
        stock: Number(stock),
        reserved: Number(reserved),
        images: images.split(",").map((image) => image.trim()).filter(Boolean),
        tags: selectedTags,
        featured,
        status
      })
    });
    const result = (await response.json()) as ApiResult<Product>;

    if (result.ok && result.data) {
      setMessage(`Saved ${result.data.title}.`);
    } else {
      setMessage(result.error ?? "Unable to save product.");
    }
  }

  return (
    <div className="productEditorPro">
      <div className="editorTopbar">
        <div>
          <span className="microLabel">Catalog editor</span>
          <h2>Edit product</h2>
          <p>Update the live product record used by storefront, cart, checkout, inventory, and merchandising.</p>
        </div>
        <div className="editorActions">
          <Link className="ghostButton" href="/admin/products">Back to products</Link>
          <button data-testid="save-product" type="button" onClick={saveProduct}>Save product</button>
        </div>
      </div>

      <div className="editorWorkspace">
        <div className="editorMainColumn">
          <section className="adminEditorPanel">
            <div className="panelHeader">
              <h2>Product information</h2>
              <span>{product.id}</span>
            </div>
            <div className="professionalForm twoColumns">
              <label className="fullField">Product name<input value={title} onChange={(event) => setTitle(event.target.value)} /></label>
              <label className="fullField">Subtitle<input value={subtitle} onChange={(event) => setSubtitle(event.target.value)} /></label>
              <label className="fullField">Description<textarea value={description} onChange={(event) => setDescription(event.target.value)} /></label>
              <label>SKU<input value={sku} onChange={(event) => setSku(event.target.value)} /></label>
              <label>Category
                <select value={category} onChange={(event) => setCategory(event.target.value)}>
                  {Array.from(new Set([...categories, category])).map((item) => <option key={item}>{item}</option>)}
                </select>
              </label>
            </div>
          </section>

          <section className="adminEditorPanel">
            <div className="panelHeader">
              <h2>Pricing and inventory</h2>
              <span>{product.currency}</span>
            </div>
            <div className="professionalForm twoColumns">
              <label>Price<input inputMode="decimal" value={price} onChange={(event) => setPrice(event.target.value)} /></label>
              <label>Compare-at price<input inputMode="decimal" value={originalPrice} onChange={(event) => setOriginalPrice(event.target.value)} /></label>
              <label>Stock<input inputMode="numeric" value={stock} onChange={(event) => setStock(event.target.value)} /></label>
              <label>Reserved<input inputMode="numeric" value={reserved} onChange={(event) => setReserved(event.target.value)} /></label>
              <label>Weight grams<input inputMode="numeric" value={weightGrams} onChange={(event) => setWeightGrams(event.target.value)} /></label>
            </div>
          </section>

          <section className="adminEditorPanel">
            <div className="panelHeader">
              <h2>Media URLs</h2>
              <span>{product.images.length} images</span>
            </div>
            <label className="fullField formLine">Image URLs
              <textarea value={images} onChange={(event) => setImages(event.target.value)} />
            </label>
            <div className="mediaGrid smallMediaGrid">
              {images.split(",").map((image) => image.trim()).filter(Boolean).map((image) => (
                <article className="mediaCard" key={image}>
                  <img src={image} alt={title} />
                  <strong>{image}</strong>
                  <span>Product gallery</span>
                </article>
              ))}
            </div>
          </section>
        </div>

        <aside className="editorSideColumn">
          <section className="adminEditorPanel publishCard">
            <h2>Publish</h2>
            <label>Status
              <select value={status} onChange={(event) => setStatus(event.target.value as Product["status"])}>
                <option value="active">Active</option>
                <option value="draft">Draft</option>
              </select>
            </label>
            <label className="toggleLine">
              <input checked={featured} type="checkbox" onChange={(event) => setFeatured(event.target.checked)} />
              Feature on storefront
            </label>
            <p className="statusText">{message}</p>
          </section>

          <section className="adminEditorPanel">
            <h2>Tags</h2>
            <div className="choiceGrid">
              {Array.from(new Set([...tags, ...selectedTags])).map((tag) => (
                <button
                  className={selectedTags.includes(tag) ? "choiceActive" : "choiceButton"}
                  key={tag}
                  type="button"
                  onClick={() => toggleTag(tag)}
                >
                  {tag}
                </button>
              ))}
            </div>
          </section>

          <section className="adminEditorPanel">
            <h2>Shipping and customs</h2>
            <div className="professionalForm">
              <label>Origin country<input value={originCountry} onChange={(event) => setOriginCountry(event.target.value.toUpperCase())} /></label>
              <label>Ship-from node<input value={shipFrom} onChange={(event) => setShipFrom(event.target.value.toUpperCase())} /></label>
            </div>
          </section>
        </aside>
      </div>
    </div>
  );
}
