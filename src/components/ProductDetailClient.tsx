"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { money } from "@/components/Money";
import { SiteFooter } from "@/components/SiteFooter";
import { SiteHeader } from "@/components/SiteHeader";
import { addStoredCartItem } from "@/components/cartStorage";
import type { Coupon, Product, ProductVariant, Review, ShippingRate, StoreSettings } from "@/lib/types";

type ProductDetailClientProps = {
  product: Product;
  variants: ProductVariant[];
  relatedProducts: Product[];
  reviews: Review[];
  coupons: Coupon[];
  shippingRates: ShippingRate[];
  settings: StoreSettings;
  categories: string[];
};

type ApiResult<T> = {
  ok: boolean;
  data?: T;
  error?: string;
};

export function ProductDetailClient({
  product,
  variants,
  relatedProducts,
  reviews: initialReviews,
  coupons,
  shippingRates,
  settings,
  categories
}: ProductDetailClientProps) {
  const [quantity, setQuantity] = useState(1);
  const [selectedVariantId, setSelectedVariantId] = useState(variants[0]?.id ?? "");
  const [message, setMessage] = useState("Ready to ship from " + product.shipFrom);
  const [reviews] = useState(initialReviews);
  const [reviewName, setReviewName] = useState("");
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewBody, setReviewBody] = useState("");
  const [reviewMessage, setReviewMessage] = useState("Reviews are moderated before publishing.");
  const selectedVariant = variants.find((variant) => variant.id === selectedVariantId);
  const currentPrice = selectedVariant?.price ?? product.price;
  const discountPercent = product.originalPrice
    ? Math.round(((product.originalPrice - currentPrice) / product.originalPrice) * 100)
    : 0;
  const averageRating = reviews.length
    ? Math.round((reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length) * 10) / 10
    : 0;

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

  async function submitReview() {
    setReviewMessage("Submitting review...");
    const response = await fetch(`/api/products/${product.id}/reviews`, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({
        customerName: reviewName,
        rating: reviewRating,
        body: reviewBody
      })
    });
    const result = (await response.json()) as ApiResult<Review>;

    if (result.ok && result.data) {
      setReviewName("");
      setReviewRating(5);
      setReviewBody("");
      setReviewMessage("Review submitted and waiting for admin approval.");
    } else {
      setReviewMessage(result.error ?? "Unable to submit review.");
    }
  }

  return (
    <main className="productDetailPage">
      <div className="promoBar">
        <span>Free international shipping on orders $79+</span>
        <span>30-day returns</span>
        <span>Secure checkout</span>
      </div>
      <SiteHeader
        storeName={settings.name}
        categories={categories}
        featuredProducts={relatedProducts}
        coupons={coupons}
      />
      <Breadcrumbs
        items={[
          { label: "Home", href: "/" },
          { label: product.category, href: "/#products" },
          { label: product.title }
        ]}
      />

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
          <span className="microLabel">{product.category}</span>
          <h1>{product.title}</h1>
          <p>{product.description}</p>
          <div className="ratingRow">
            <span>{averageRating ? `${averageRating}/5` : "New"}</span>
            <b>{reviews.length} reviews</b>
            <small>SKU {product.sku}</small>
          </div>
          <div className="priceRow productPrice">
            <strong>{money(currentPrice, product.currency)}</strong>
            {product.originalPrice ? <del>{money(product.originalPrice, product.currency)}</del> : null}
            {discountPercent > 0 ? <span className="discountBadge">Save {discountPercent}%</span> : null}
          </div>
          <div className="promoStack">
            {coupons.map((coupon) => (
              <div className="promoCard" key={coupon.code}>
                <strong>{coupon.code}</strong>
                <span>
                  {coupon.type === "percentage" ? `${coupon.value}% off` : `${money(coupon.value)} off`}
                  {coupon.minSubtotal ? ` over ${money(coupon.minSubtotal)}` : ""}
                </span>
              </div>
            ))}
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
                        className={selectedVariant?.attributes[group.name] === value ? "choiceActive" : "choiceButton"}
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
                Ships from {product.shipFrom}. {shippingRates[0]?.name} usually arrives in{" "}
                {shippingRates[0]?.etaDays} business days for supported markets.
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

      <section className="retailSection productReviewsSection">
        <div className="retailSectionHeader splitHeader">
          <div>
            <span className="microLabel">Customer proof</span>
            <h2>Reviews</h2>
          </div>
          <p>{reviews.length ? `${reviews.length} approved reviews for this product.` : "Be the first approved review for this product."}</p>
        </div>
        <div className="reviewsLayout">
          <div className="reviewList">
            {reviews.length ? reviews.map((review) => (
              <article className="reviewCard" key={review.id}>
                <div className="panelHeader">
                  <strong>{review.customerName}</strong>
                  <span>{review.rating}/5</span>
                </div>
                <p>{review.body}</p>
              </article>
            )) : (
              <div className="emptyState">
                <h3>No published reviews yet</h3>
                <p>Submit a review and it will appear after moderation.</p>
              </div>
            )}
          </div>
          <div className="reviewForm">
            <h3>Write a review</h3>
            <label>Your name
              <input value={reviewName} onChange={(event) => setReviewName(event.target.value)} />
            </label>
            <label>Rating
              <select value={reviewRating} onChange={(event) => setReviewRating(Number(event.target.value))}>
                {[5, 4, 3, 2, 1].map((rating) => <option value={rating} key={rating}>{rating}/5</option>)}
              </select>
            </label>
            <label>Review
              <textarea value={reviewBody} onChange={(event) => setReviewBody(event.target.value)} />
            </label>
            <button type="button" onClick={submitReview}>Submit review</button>
            <p className="statusText">{reviewMessage}</p>
          </div>
        </div>
      </section>

      <section className="retailSection">
        <div className="retailSectionHeader splitHeader">
          <div>
            <span className="microLabel">You may also like</span>
            <h2>Related products</h2>
          </div>
          <p>Recommendations are ranked by category, shared tags, fulfillment node, and entry price.</p>
        </div>
        <div className="productShelf compactProductShelf">
          {relatedProducts.map((related) => (
            <article className="retailProductCard" key={related.id}>
              <Link className="retailProductImage" href={`/products/${related.id}`}>
                <img alt={related.title} src={related.images[0]} />
                <span>{related.category}</span>
              </Link>
              <div className="retailProductBody">
                <Link href={`/products/${related.id}`}><h3>{related.title}</h3></Link>
                <p>{related.subtitle ?? related.description}</p>
                <div className="priceRow">
                  <strong>{money(related.price, related.currency)}</strong>
                  {related.originalPrice ? <del>{money(related.originalPrice, related.currency)}</del> : null}
                </div>
              </div>
            </article>
          ))}
        </div>
      </section>

      <SiteFooter settings={settings} coupons={coupons} shippingRates={shippingRates} />
    </main>
  );
}
