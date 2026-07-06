"use client";

import { useMemo, useState } from "react";

type ProductCreateFormProps = {
  categories: string[];
  tags: string[];
  attributes: { name: string; values: string[] }[];
};

type PreviewImage = {
  name: string;
  url: string;
};

export function ProductCreateForm({ categories, tags, attributes }: ProductCreateFormProps) {
  const [title, setTitle] = useState("New cross-border product");
  const [sku, setSku] = useState("CB-NEW-001");
  const [price, setPrice] = useState("49");
  const [salePrice, setSalePrice] = useState("39");
  const [stock, setStock] = useState("100");
  const [category, setCategory] = useState(categories[0] ?? "General");
  const [selectedTags, setSelectedTags] = useState<string[]>(tags.slice(0, 2));
  const [color, setColor] = useState(attributes.find((item) => item.name === "Color")?.values[0] ?? "Black");
  const [size, setSize] = useState(attributes.find((item) => item.name === "Size")?.values[0] ?? "M");
  const [images, setImages] = useState<PreviewImage[]>([]);
  const [adminToken, setAdminToken] = useState("");
  const [message, setMessage] = useState("Not saved yet");

  const variants = useMemo(() => {
    const colors = color.split(",").map((item) => item.trim()).filter(Boolean);
    const sizes = size.split(",").map((item) => item.trim()).filter(Boolean);
    return colors.flatMap((colorValue) =>
      sizes.map((sizeValue) => ({
        sku: `${sku}-${colorValue.toUpperCase()}-${sizeValue.toUpperCase()}`.replace(/\s+/g, "-"),
        color: colorValue,
        size: sizeValue,
        price: Number(salePrice || price || 0),
        stock: Math.max(1, Math.floor(Number(stock || 0) / Math.max(colors.length * sizes.length, 1)))
      }))
    );
  }, [color, price, salePrice, size, sku, stock]);

  function onImageChange(files: FileList | null) {
    if (!files) return;
    setImages(
      Array.from(files).map((file) => ({
        name: file.name,
        url: URL.createObjectURL(file)
      }))
    );
  }

  function toggleTag(tag: string) {
    setSelectedTags((current) =>
      current.includes(tag) ? current.filter((item) => item !== tag) : [...current, tag]
    );
  }

  function saveDraft() {
    const draft = buildPayload();
    localStorage.setItem("crossborder-product-draft", JSON.stringify({ ...draft, variants, images }));
    setMessage("Draft saved in this browser");
  }

  async function createProduct() {
    const response = await fetch("/api/admin/products", {
      method: "POST",
      headers: {
        "content-type": "application/json",
        "x-admin-token": adminToken
      },
      body: JSON.stringify(buildPayload())
    });
    const result = await response.json();
    setMessage(result.ok ? `Created product ${result.data.sku}` : result.error);
  }

  function buildPayload() {
    return {
      sku,
      title,
      subtitle: "Created from local admin",
      description: "Product created from the local product editor.",
      price: Number(salePrice || price),
      currency: "USD",
      originalPrice: Number(price),
      category,
      originCountry: "CN",
      shipFrom: "CN-SZX",
      weightGrams: 650,
      stock: Number(stock),
      reserved: 0,
      images: images.length ? images.map((image) => image.url) : ["/products/bag.svg"],
      tags: selectedTags,
      featured: false,
      status: "draft" as const
    };
  }

  return (
    <div className="editorGrid">
      <section className="panel">
        <h2>Product information</h2>
        <div className="formPreview">
          <label>Product name<input value={title} onChange={(event) => setTitle(event.target.value)} /></label>
          <label>SKU<input value={sku} onChange={(event) => setSku(event.target.value)} /></label>
          <label>Regular price<input value={price} onChange={(event) => setPrice(event.target.value)} /></label>
          <label>Sale price<input value={salePrice} onChange={(event) => setSalePrice(event.target.value)} /></label>
          <label>Stock quantity<input value={stock} onChange={(event) => setStock(event.target.value)} /></label>
        </div>
      </section>

      <section className="panel">
        <h2>Upload images</h2>
        <label className="uploadBox">
          <strong>Choose product images</strong>
          <span>Local preview works immediately. Real cloud storage can be added later.</span>
          <input multiple type="file" accept="image/*" onChange={(event) => onImageChange(event.target.files)} />
        </label>
        {images.length ? (
          <div className="mediaGrid smallMediaGrid">
            {images.map((image) => (
              <article className="mediaCard" key={image.url}>
                <img src={image.url} alt={image.name} />
                <strong>{image.name}</strong>
              </article>
            ))}
          </div>
        ) : null}
      </section>

      <section className="panel">
        <h2>Categories and tags</h2>
        <div className="formPreview">
          <label>Category
            <select value={category} onChange={(event) => setCategory(event.target.value)}>
              {categories.map((item) => <option key={item}>{item}</option>)}
            </select>
          </label>
        </div>
        <div className="choiceGrid">
          {tags.map((tag) => (
            <button className={selectedTags.includes(tag) ? "choiceActive" : "choiceButton"} key={tag} type="button" onClick={() => toggleTag(tag)}>
              {tag}
            </button>
          ))}
        </div>
      </section>

      <section className="panel">
        <h2>Attributes and variants</h2>
        <div className="formPreview twoColumns">
          <label>Colors, comma separated<input value={color} onChange={(event) => setColor(event.target.value)} /></label>
          <label>Sizes, comma separated<input value={size} onChange={(event) => setSize(event.target.value)} /></label>
        </div>
        <div className="table">
          {variants.map((variant) => (
            <div className="tableRow variantRow" key={variant.sku}>
              <span>{variant.sku}</span>
              <span>Color: {variant.color}, Size: {variant.size}</span>
              <span>${variant.price}</span>
              <span>Stock {variant.stock}</span>
              <span>Auto generated</span>
            </div>
          ))}
        </div>
      </section>

      <section className="panel">
        <h2>Save product</h2>
        <div className="formPreview">
          <label>Admin token for API create<input value={adminToken} onChange={(event) => setAdminToken(event.target.value)} placeholder="ADMIN_TOKEN" /></label>
        </div>
        <div className="actionsRow">
          <button type="button" onClick={saveDraft}>Save local draft</button>
          <button type="button" onClick={createProduct}>Create through API</button>
        </div>
        <p className="statusText">{message}</p>
      </section>
    </div>
  );
}
