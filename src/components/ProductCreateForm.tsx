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

type DraftStatus = "active" | "draft";

export function ProductCreateForm({ categories, tags, attributes }: ProductCreateFormProps) {
  const [title, setTitle] = useState("Linen Travel Wrap");
  const [subtitle, setSubtitle] = useState("Soft, packable layer for international gifting");
  const [description, setDescription] = useState(
    "A lightweight lifestyle SKU with simple variants, clear customs attributes, and strong cross-border shipping economics."
  );
  const [sku, setSku] = useState("CB-WRAP-004");
  const [price, setPrice] = useState("69");
  const [salePrice, setSalePrice] = useState("49");
  const [stock, setStock] = useState("120");
  const [weightGrams, setWeightGrams] = useState("420");
  const [originCountry, setOriginCountry] = useState("CN");
  const [shipFrom, setShipFrom] = useState("CN-SZX");
  const [category, setCategory] = useState(categories[0] ?? "General");
  const [status, setStatus] = useState<DraftStatus>("draft");
  const [featured, setFeatured] = useState(true);
  const [selectedTags, setSelectedTags] = useState<string[]>(tags.slice(0, 2));
  const [color, setColor] = useState(attributes.find((item) => item.name === "Color")?.values.join(", ") ?? "Stone, Sage, Black");
  const [size, setSize] = useState(attributes.find((item) => item.name === "Size")?.values.join(", ") ?? "S, M, L");
  const [images, setImages] = useState<PreviewImage[]>([]);
  const [message, setMessage] = useState("Draft has not been saved.");

  const variants = useMemo(() => {
    const colors = parseOptions(color);
    const sizes = parseOptions(size);
    const variantCount = Math.max(colors.length * sizes.length, 1);
    const baseStock = Math.max(0, Number(stock) || 0);

    return colors.flatMap((colorValue) =>
      sizes.map((sizeValue) => ({
        sku: `${sku}-${colorValue.toUpperCase()}-${sizeValue.toUpperCase()}`.replace(/\s+/g, "-"),
        attributes: { Color: colorValue, Size: sizeValue },
        price: Number(salePrice || price || 0),
        stock: Math.max(0, Math.floor(baseStock / variantCount)),
        weightGrams: Number(weightGrams || 0),
        image: images[0]?.url ?? "/products/scarf.svg"
      }))
    );
  }, [color, images, price, salePrice, size, sku, stock, weightGrams]);

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
    localStorage.setItem("crossborder-product-draft", JSON.stringify(buildPayload()));
    setMessage("Draft saved in this browser, including generated variants.");
  }

  async function createProduct() {
    const response = await fetch("/api/admin/products", {
      method: "POST",
      headers: {
        "content-type": "application/json"
      },
      body: JSON.stringify(buildPayload())
    });
    const result = await response.json();
    setMessage(result.ok ? `Created product ${result.data.sku} with ${variants.length} variants.` : result.error);
  }

  function buildPayload() {
    return {
      sku,
      title,
      subtitle,
      description,
      price: Number(salePrice || price),
      currency: "USD",
      originalPrice: Number(price),
      category,
      originCountry,
      shipFrom,
      weightGrams: Number(weightGrams),
      stock: Number(stock),
      reserved: 0,
      images: images.length ? images.map((image) => image.url) : ["/products/scarf.svg"],
      tags: selectedTags,
      featured,
      status,
      variants
    };
  }

  return (
    <div className="productEditorPro">
      <div className="editorTopbar">
        <div>
          <span className="microLabel">Catalog editor</span>
          <h2>Create product</h2>
          <p>Build a publishable product with media, pricing, inventory, shipping fields, and SKU variants.</p>
        </div>
        <div className="editorActions">
          <button className="ghostButton" data-testid="save-product-draft" type="button" onClick={saveDraft}>Save draft</button>
          <button data-testid="create-product" type="button" onClick={createProduct}>Create product</button>
        </div>
      </div>

      <div className="editorWorkspace">
        <div className="editorMainColumn">
          <section className="adminEditorPanel">
            <div className="panelHeader">
              <h2>Product information</h2>
              <span>Required</span>
            </div>
            <div className="professionalForm twoColumns">
              <label className="fullField">Product name<input value={title} onChange={(event) => setTitle(event.target.value)} /></label>
              <label className="fullField">Subtitle<input value={subtitle} onChange={(event) => setSubtitle(event.target.value)} /></label>
              <label className="fullField">Description<textarea value={description} onChange={(event) => setDescription(event.target.value)} /></label>
              <label>Base SKU<input value={sku} onChange={(event) => setSku(event.target.value)} /></label>
              <label>Category
                <select value={category} onChange={(event) => setCategory(event.target.value)}>
                  {categories.map((item) => <option key={item}>{item}</option>)}
                </select>
              </label>
            </div>
          </section>

          <section className="adminEditorPanel">
            <div className="panelHeader">
              <h2>Media</h2>
              <span>{images.length || 1} asset</span>
            </div>
            <label className="proUploadBox">
              <strong>Drop images or choose files</strong>
              <span>Use square product shots first. Real object storage can replace local previews later.</span>
              <input multiple type="file" accept="image/*" onChange={(event) => onImageChange(event.target.files)} />
            </label>
            <div className="mediaGrid smallMediaGrid">
              {(images.length ? images : [{ name: "default-scarf.svg", url: "/products/scarf.svg" }]).map((image) => (
                <article className="mediaCard" key={image.url}>
                  <img src={image.url} alt={image.name} />
                  <strong>{image.name}</strong>
                  <span>Product gallery</span>
                </article>
              ))}
            </div>
          </section>

          <section className="adminEditorPanel">
            <div className="panelHeader">
              <h2>Pricing and inventory</h2>
              <span>Margin inputs</span>
            </div>
            <div className="professionalForm twoColumns">
              <label>Regular price<input value={price} onChange={(event) => setPrice(event.target.value)} /></label>
              <label>Sale price<input value={salePrice} onChange={(event) => setSalePrice(event.target.value)} /></label>
              <label>Total stock<input value={stock} onChange={(event) => setStock(event.target.value)} /></label>
              <label>Weight grams<input value={weightGrams} onChange={(event) => setWeightGrams(event.target.value)} /></label>
            </div>
          </section>

          <section className="adminEditorPanel">
            <div className="panelHeader">
              <h2>Variants</h2>
              <span>{variants.length} generated SKUs</span>
            </div>
            <div className="professionalForm twoColumns">
              <label>Color options<input value={color} onChange={(event) => setColor(event.target.value)} /></label>
              <label>Size options<input value={size} onChange={(event) => setSize(event.target.value)} /></label>
            </div>
            <div className="variantMatrix">
              <div className="variantMatrixHeader">
                <span>SKU</span>
                <span>Options</span>
                <span>Price</span>
                <span>Stock</span>
                <span>Weight</span>
              </div>
              {variants.map((variant) => (
                <div className="variantMatrixRow" key={variant.sku}>
                  <strong>{variant.sku}</strong>
                  <span>{Object.entries(variant.attributes).map(([key, value]) => `${key}: ${value}`).join(", ")}</span>
                  <span>${variant.price}</span>
                  <span>{variant.stock}</span>
                  <span>{variant.weightGrams}g</span>
                </div>
              ))}
            </div>
          </section>
        </div>

        <aside className="editorSideColumn">
          <section className="adminEditorPanel publishCard">
            <h2>Publish</h2>
            <label>Status
              <select value={status} onChange={(event) => setStatus(event.target.value as DraftStatus)}>
                <option value="draft">Draft</option>
                <option value="active">Active</option>
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
              {tags.map((tag) => (
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

          <section className="adminEditorPanel seoPreview">
            <h2>SEO preview</h2>
            <strong>{title}</strong>
            <span>{subtitle}</span>
            <p>{description.slice(0, 150)}</p>
          </section>
        </aside>
      </div>
    </div>
  );
}

function parseOptions(value: string) {
  return value.split(",").map((item) => item.trim()).filter(Boolean);
}
