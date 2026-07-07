"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { money } from "@/components/Money";
import { addStoredCartItem } from "@/components/cartStorage";
import type { Product, ProductVariant, ShippingRate } from "@/lib/types";

type ProductDetailClientProps = {
  product: Product;
  variants: ProductVariant[];
  shippingRates: ShippingRate[];
};

export function ProductDetailClient({ product, variants, shippingRates }: ProductDetailClientProps) {
  const [quantity, setQuantity] = useState(1);
  const [selectedVariantId, setSelectedVariantId] = useState(variants[0]?.id ?? "");
  const [message, setMessage] = useState("Ready to ship from " + product.shipFrom);
  const selectedVariant = variants.find((variant) => variant.id === selectedVariantId);

  const optionGroups = useMemo(() => {
    const groups = new Map<string, Set<string>>();
    for (const variant of variants) {
      for (const [name, value] of Object.entries(variant.attributes)) {
        if (!groups.has(name)) groups.set(name, new Set());
        groups.get(name)?.add(value);
      }
    }
    return Array.from(groups.entries()).map(([name, values]) => ({
      name,
      values: Array.from(values)
    }));
  }, [variants]);

  function addToCart() {
    addStoredCartItem(product.id, quantity);
    setMessage(`${quantity} ${product.title} added to cart.`);
  }

  return (
    <main className="productDetailPage">
      <div className="promoBar">
        <span>Free international shipping on orders $79+</span>
        <span>30-day returns</span>
        <span>Secure checkout</span>
      </div>
      <header className="storeHeader">
        <Link className="brandLockup" href="/">
          <strong>CrossBorder Commerce</strong>
          <span>Global lifestyle commerce</span>
        </Link>
        <nav className="storeNav" aria-label="Product navigation">
          <Link href="/">Home</Link>
          <Link href="/cart">Cart</Link>
          <Link href="/checkout">Checkout</Link>
        </nav>
      </header>

      <section className="productDetailShell">
        <div className="productGallery">
          <div className="galleryHero">
            <img src={product.images[0]} alt={product.title} />
          </div>
          <div className="galleryThumbs">
            {[product.images[0], product.images[0], product.images[0]].map((image, index) => (
              <button type="button" key={`${image}-${index}`}>
                <img src={image} alt={`${product.title} view ${index + 1}`} />
              </button>
            ))}
          </div>
        </div>

        <aside className="productBuyBox">
          <Link className="textLink" href="/">Back to catalog</Link>
          <span className="microLabel">{product.category}</span>
          <h1>{product.title}</h1>
          <p>{product.description}</p>
          <div className="ratingRow">
            <span>★★★★★</span>
            <b>4.8</b>
            <small>24 reviews</small>
          </div>
          <div className="priceRow productPrice">
            <strong>{money(selectedVariant?.price ?? product.price, product.currency)}</strong>
            {product.originalPrice ? <del>{money(product.originalPrice, product.currency)}</del> : null}
          </div>

          {optionGroups.length ? (
            <div className="variantPanel">
              <div className="panelHeader">
                <h2>Options</h2>
                <span>{variants.length} variants</span>
              </div>
              {optionGroups.map((group) => (
                <div className="optionGroup" key={group.name}>
                  <strong>{group.name}</strong>
                  <div className="choiceGrid">
                    {group.values.map((value) => (
                      <button
                        className={
                          selectedVariant?.attributes[group.name] === value ? "choiceActive" : "choiceButton"
                        }
                        type="button"
                        key={value}
                      >
                        {value}
                      </button>
                    ))}
                  </div>
                </div>
              ))}
              <label className="formLine">Variant SKU
                <select value={selectedVariantId} onChange={(event) => setSelectedVariantId(event.target.value)}>
                  {variants.map((variant) => (
                    <option key={variant.id} value={variant.id}>{variant.sku}</option>
                  ))}
                </select>
              </label>
            </div>
          ) : null}

          <div className="purchaseRow">
            <label className="quantityControl">Qty
              <input
                min="1"
                max="99"
                type="number"
                value={quantity}
                onChange={(event) => setQuantity(Math.max(Number(event.target.value), 1))}
              />
            </label>
            <button className="primaryButton" data-testid={`detail-add-${product.id}`} type="button" onClick={addToCart}>
              Add to cart
            </button>
          </div>
          <Link className="outlineButton wideButton" href="/checkout">Checkout now</Link>
          <p className="statusText">{message}</p>

          <div className="detailAccordion">
            <details open>
              <summary>Shipping and delivery</summary>
              <p>
                Ships from {product.shipFrom}. {shippingRates[0]?.name} usually arrives in
                {" "}{shippingRates[0]?.etaDays} business days for supported markets.
              </p>
            </details>
            <details>
              <summary>Product details</summary>
              <p>SKU {product.sku}. Origin {product.originCountry}. Weight {product.weightGrams}g.</p>
            </details>
            <details>
              <summary>Returns</summary>
              <p>30-day returns for unused items. Refund workflows are tracked in the admin area.</p>
            </details>
          </div>
        </aside>
      </section>
    </main>
  );
}
