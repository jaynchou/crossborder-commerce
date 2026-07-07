"use client";

import Link from "next/link";
import { useState } from "react";

type CategoryStat = {
  name: string;
  slug: string;
  description: string;
  image: string;
  products: number;
  active: number;
  stock: number;
};

type ApiResult<T> = {
  ok: boolean;
  data?: T;
  error?: string;
};

type CategoryManagerProps = {
  categories: CategoryStat[];
};

export function CategoryManager({ categories: initialCategories }: CategoryManagerProps) {
  const [categories, setCategories] = useState(initialCategories);
  const [name, setName] = useState("Accessories");
  const [description, setDescription] = useState("Curated accessories with lightweight shipping, giftable pricing, and simple cross-border merchandising.");
  const [image, setImage] = useState("/products/scarf.svg");
  const [message, setMessage] = useState("Create catalog categories before adding products.");

  async function createCategory() {
    setMessage("Creating category...");
    const response = await fetch("/api/admin/categories", {
      method: "POST",
      headers: {
        "content-type": "application/json"
      },
      body: JSON.stringify({ name, description, image })
    });
    const result = (await response.json()) as ApiResult<CategoryStat>;

    if (result.ok && result.data) {
      setCategories((current) => [result.data as CategoryStat, ...current]);
      setName("");
      setDescription("");
      setImage("/products/scarf.svg");
      setMessage(`Created category page /${result.data.slug}.`);
    } else {
      setMessage(result.error ?? "Unable to create category.");
    }
  }

  return (
    <section className="panel">
      <div className="panelHeader">
        <div>
          <h2>Category pages</h2>
          <p className="statusText">{message}</p>
        </div>
        <button type="button" onClick={createCategory}>Create category page</button>
      </div>
      <div className="professionalForm twoColumns compactAdminForm">
        <label>Category name
          <input value={name} onChange={(event) => setName(event.target.value)} />
        </label>
        <label>Hero image URL
          <input value={image} onChange={(event) => setImage(event.target.value)} />
        </label>
        <label className="fullField">Page description
          <textarea value={description} onChange={(event) => setDescription(event.target.value)} />
        </label>
      </div>
      <div className="table">
        {categories.map((category) => (
          <div className="tableRow categoryRow" key={category.name}>
            <span><strong>{category.name}</strong><small>{category.description}</small></span>
            <span>/{category.slug}</span>
            <span>{category.products} products</span>
            <span>{category.active} active</span>
            <span>{category.stock} units</span>
            <span><Link className="textLink" href={`/${category.slug}`}>Open page</Link></span>
          </div>
        ))}
      </div>
    </section>
  );
}
