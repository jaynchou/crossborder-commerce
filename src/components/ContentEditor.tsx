"use client";

import { useState } from "react";
import type { PageContent, Product } from "@/lib/types";

type ApiResult<T> = {
  ok: boolean;
  data?: T;
  error?: string;
};

type ContentEditorProps = {
  content: PageContent;
  defaultContent: PageContent;
  products: Product[];
};

export function ContentEditor({ content, defaultContent, products }: ContentEditorProps) {
  const [promoBar, setPromoBar] = useState(content.promoBar.join("\n"));
  const [template, setTemplate] = useState<PageContent["template"]>(content.template);
  const [eyebrow, setEyebrow] = useState(content.hero.eyebrow);
  const [title, setTitle] = useState(content.hero.title);
  const [body, setBody] = useState(content.hero.body);
  const [primaryLabel, setPrimaryLabel] = useState(content.hero.primaryLabel);
  const [primaryHref, setPrimaryHref] = useState(content.hero.primaryHref);
  const [secondaryLabel, setSecondaryLabel] = useState(content.hero.secondaryLabel);
  const [secondaryHref, setSecondaryHref] = useState(content.hero.secondaryHref);
  const [featuredProductId, setFeaturedProductId] = useState(content.hero.featuredProductId);
  const [message, setMessage] = useState("Homepage content is loaded.");
  const featuredProduct = products.find((product) => product.id === featuredProductId) ?? products[0];

  function toContent(): PageContent {
    return {
      promoBar: promoBar
        .split("\n")
        .map((item) => item.trim())
        .filter(Boolean),
      template,
      hero: {
        eyebrow,
        title,
        body,
        primaryLabel,
        primaryHref,
        secondaryLabel,
        secondaryHref,
        featuredProductId
      }
    };
  }

  function loadContent(nextContent: PageContent) {
    setPromoBar(nextContent.promoBar.join("\n"));
    setTemplate(nextContent.template);
    setEyebrow(nextContent.hero.eyebrow);
    setTitle(nextContent.hero.title);
    setBody(nextContent.hero.body);
    setPrimaryLabel(nextContent.hero.primaryLabel);
    setPrimaryHref(nextContent.hero.primaryHref);
    setSecondaryLabel(nextContent.hero.secondaryLabel);
    setSecondaryHref(nextContent.hero.secondaryHref);
    setFeaturedProductId(nextContent.hero.featuredProductId);
  }

  async function saveContent() {
    setMessage("Saving homepage content...");
    const nextContent = toContent();

    const response = await fetch("/api/admin/content", {
      method: "PUT",
      headers: {
        "content-type": "application/json"
      },
      body: JSON.stringify(nextContent)
    });
    const result = (await response.json()) as ApiResult<PageContent>;
    setMessage(
      result.ok && result.data
        ? "Homepage content saved. Refresh the storefront to preview it."
        : result.error ?? "Unable to save homepage content."
    );
  }

  function resetToDefault() {
    loadContent(defaultContent);
    setMessage("Default homepage template loaded. Save to publish it.");
  }

  return (
    <section className="panel settingsEditor">
      <div className="panelHeader">
        <div>
          <h2>Homepage editor</h2>
          <p className="statusText">Use the active storefront template without editing source code.</p>
        </div>
        <div className="buttonCluster">
          <button className="ghostButton" type="button" onClick={resetToDefault}>Restore default</button>
          <button data-testid="save-content" type="button" onClick={saveContent}>Save content</button>
        </div>
      </div>

      <div className="professionalForm twoColumns">
        <label>Template
          <select value={template} onChange={(event) => setTemplate(event.target.value as PageContent["template"])}>
            <option value="editorial-grid">Editorial product grid</option>
            <option value="product-focus">Single product focus</option>
          </select>
        </label>
        <label>Featured hero product
          <select value={featuredProductId} onChange={(event) => setFeaturedProductId(event.target.value)}>
            {products.map((product) => (
              <option value={product.id} key={product.id}>{product.title}</option>
            ))}
          </select>
        </label>
        <label className="fullField">Promo bar lines
          <textarea
            rows={4}
            value={promoBar}
            onChange={(event) => setPromoBar(event.target.value)}
            placeholder="One promo per line"
          />
        </label>
        <label>Hero eyebrow
          <input value={eyebrow} onChange={(event) => setEyebrow(event.target.value)} />
        </label>
        <label>Hero title
          <input value={title} onChange={(event) => setTitle(event.target.value)} />
        </label>
        <label className="fullField">Hero body
          <textarea rows={4} value={body} onChange={(event) => setBody(event.target.value)} />
        </label>
        <label>Primary button text
          <input value={primaryLabel} onChange={(event) => setPrimaryLabel(event.target.value)} />
        </label>
        <label>Primary button link
          <input value={primaryHref} onChange={(event) => setPrimaryHref(event.target.value)} />
        </label>
        <label>Secondary button text
          <input value={secondaryLabel} onChange={(event) => setSecondaryLabel(event.target.value)} />
        </label>
        <label>Secondary button link
          <input value={secondaryHref} onChange={(event) => setSecondaryHref(event.target.value)} />
        </label>
      </div>
      <div className="contentPreview">
        <div className="previewPromo">
          {toContent().promoBar.map((line) => (
            <span key={line}>{line}</span>
          ))}
        </div>
        <div className={`previewHero ${template === "product-focus" ? "previewHeroFocus" : ""}`}>
          <div>
            <span className="microLabel">{eyebrow}</span>
            <h3>{title}</h3>
            <p>{body}</p>
            <div className="actions">
              <span className="primaryButton">{primaryLabel}</span>
              <span className="outlineButton">{secondaryLabel}</span>
            </div>
          </div>
          {featuredProduct ? (
            <div className="previewProduct">
              <img src={featuredProduct.images[0]} alt={featuredProduct.title} />
              <strong>{featuredProduct.title}</strong>
              <span>{featuredProduct.subtitle ?? featuredProduct.category}</span>
            </div>
          ) : null}
        </div>
      </div>
      <p className="statusText">{message}</p>
    </section>
  );
}
