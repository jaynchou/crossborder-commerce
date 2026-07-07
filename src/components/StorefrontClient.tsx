"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { money } from "@/components/Money";
import { SiteFooter } from "@/components/SiteFooter";
import { SiteHeader } from "@/components/SiteHeader";
import { addStoredCartItem, readStoredCart, writeStoredCart } from "@/components/cartStorage";
import { categoryToSlug } from "@/lib/slugs";
import type { CartItem, Coupon, PageContent, Product, ShippingRate, StoreSettings } from "@/lib/types";

type QuoteItem = CartItem & {
  product: Product;
  subtotal: number;
};

type CartQuote = {
  items: QuoteItem[];
  subtotal: number;
  discount: number;
  shipping: number;
  tax: number;
  total: number;
  currency: string;
  shippingRate: ShippingRate | null;
  coupon: Coupon | null;
};

type ApiResult<T> = {
  ok: boolean;
  data?: T;
  error?: string;
};

type StorefrontClientProps = {
  storeName: string;
  products: Product[];
  categories: string[];
  coupons: Coupon[];
  shippingRates: ShippingRate[];
  initialQuote: CartQuote;
  settings: StoreSettings;
  content: PageContent;
};

function emptyCartQuote(reference: CartQuote): CartQuote {
  return {
    items: [],
    subtotal: 0,
    discount: 0,
    shipping: 0,
    tax: 0,
    total: 0,
    currency: reference.currency,
    shippingRate: null,
    coupon: null
  };
}

export function StorefrontClient({
  storeName,
  products,
  categories,
  coupons,
  shippingRates,
  initialQuote,
  settings,
  content
}: StorefrontClientProps) {
  const featured = useMemo(() => products.filter((product) => product.featured), [products]);
  const heroProduct = products.find((product) => product.id === content.hero.featuredProductId) ?? featured[0] ?? products[0];
  const categoryCards = categories.map((category) => {
    const categoryProducts = products.filter((product) => product.category === category);
    return {
      title: category,
      copy: `${categoryProducts.length} active ${categoryProducts.length === 1 ? "product" : "products"}`,
      image: categoryProducts[0]?.images[0] ?? "/products/scarf.svg",
      href: `/${categoryToSlug(category)}`
    };
  });
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [quote, setQuote] = useState<CartQuote>(() => emptyCartQuote(initialQuote));
  const [message, setMessage] = useState("Curated cross-border essentials, ready to test.");
  const [isCartOpen, setIsCartOpen] = useState(false);

  useEffect(() => {
    setCartItems(readStoredCart());
  }, []);

  useEffect(() => {
    if (!cartItems.length) {
      setQuote(emptyCartQuote(initialQuote));
      return;
    }

    let ignore = false;

    async function refreshQuote() {
      const response = await fetch("/api/cart", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          items: cartItems,
          country: "US",
          couponCode: "LAUNCH10",
          shippingRateId: "standard-global"
        })
      });
      const result = (await response.json()) as ApiResult<CartQuote>;

      if (!ignore) {
        if (result.ok && result.data) {
          setQuote(result.data);
        } else {
          setMessage(result.error ?? "Unable to refresh cart quote.");
        }
      }
    }

    refreshQuote();
    return () => {
      ignore = true;
    };
  }, [cartItems, initialQuote]);

  function addToCart(product: Product) {
    const nextItems = addStoredCartItem(product.id);
    setCartItems(nextItems);
    setMessage(`${product.title} added. Your quote updated instantly.`);
    setIsCartOpen(true);
  }

  function removeFromCart(item: QuoteItem) {
    const nextItems = cartItems.filter((cartItem) => cartItem.productId !== item.productId);
    writeStoredCart(nextItems);
    setCartItems(nextItems);
    setMessage(`${item.product.title} removed from cart.`);
  }

  return (
    <main className="storefront">
      <div className="promoBar">
        {content.promoBar.map((line) => (
          <span key={line}>{line}</span>
        ))}
      </div>

      <SiteHeader
        storeName={storeName}
        categories={categories}
        featuredProducts={featured}
        coupons={coupons}
        cartCount={cartItems.reduce((sum, item) => sum + item.quantity, 0)}
        onCartClick={() => setIsCartOpen(true)}
      />

      {isCartOpen ? (
        <div className="flyCartLayer" role="presentation">
          <button className="flyCartBackdrop" aria-label="Close cart" type="button" onClick={() => setIsCartOpen(false)} />
          <aside className="flyCartDrawer" aria-label="Shopping cart">
            <div className="panelHeader">
              <div>
                <span className="microLabel">Shopping bag</span>
                <h2>Your Cart</h2>
              </div>
              <button className="iconButton" aria-label="Close cart" type="button" onClick={() => setIsCartOpen(false)}>X</button>
            </div>
            {quote.items.length ? (
              <div className="flyCartItems">
                {quote.items.map((item) => (
                  <div className="cartPreviewItem" key={item.productId}>
                    <img src={item.product.images[0]} alt={item.product.title} />
                    <div>
                      <strong>{item.product.title}</strong>
                      <span>Qty {item.quantity}</span>
                      <button
                        className="textButton removeCartItem"
                        type="button"
                        onClick={() => removeFromCart(item)}
                      >
                        Remove
                      </button>
                    </div>
                    <b>{money(item.subtotal, quote.currency)}</b>
                  </div>
                ))}
              </div>
            ) : (
              <div className="emptyState">
                <h3>Your cart is empty</h3>
                <p>Add a product to see shipping, tax, and discount estimates.</p>
              </div>
            )}
            <div className="flyCartSummary">
              <div className="summaryRow"><span>Subtotal</span><strong>{money(quote.subtotal, quote.currency)}</strong></div>
              <div className="summaryRow"><span>Discount</span><strong>-{money(quote.discount, quote.currency)}</strong></div>
              <div className="summaryRow"><span>Shipping</span><strong>{money(quote.shipping, quote.currency)}</strong></div>
              <div className="summaryRow totalRow"><span>Total</span><strong>{money(quote.total, quote.currency)}</strong></div>
            </div>
            <Link className="primaryButton wideButton" href="/checkout">Checkout</Link>
            <Link className="outlineButton wideButton" href="/cart">View cart</Link>
          </aside>
        </div>
      ) : null}

      <section className={`retailHero ${content.template === "product-focus" ? "productFocusHero" : ""}`} id="new">
        <div className="heroCopy">
          <span className="microLabel">{content.hero.eyebrow}</span>
          <h1>{content.hero.title}</h1>
          <p>{content.hero.body}</p>
          <div className="actions">
            <a className="primaryButton" href={content.hero.primaryHref}>{content.hero.primaryLabel}</a>
            <Link className="outlineButton" href={content.hero.secondaryHref}>{content.hero.secondaryLabel}</Link>
          </div>
        </div>
        <div className="heroMerch">
          <div className="heroProduct heroProductLarge">
            <img src={heroProduct.images[0]} alt={heroProduct.title} />
            <div>
              <span>Featured edit</span>
              <strong>{heroProduct.title}</strong>
            </div>
          </div>
          <div className="heroProduct">
            <img src="/products/scarf.svg" alt="Merino Travel Scarf" />
            <strong>Soft layers</strong>
          </div>
          <div className="heroProduct">
            <img src="/products/tea.svg" alt="Cold Brew Tea Set" />
            <strong>Giftable sets</strong>
          </div>
        </div>
      </section>

      <section className="retailSection">
        <div className="retailSectionHeader">
          <h2>Shop by category</h2>
          <p>Organize your first catalog like a real retail site, even while products are changing.</p>
        </div>
        <div className="categoryTiles">
          {categoryCards.map((category) => (
            <Link className="categoryTile" href={category.href} key={category.title}>
              <img src={category.image} alt="" />
              <strong>{category.title}</strong>
              <span>{category.copy}</span>
            </Link>
          ))}
        </div>
      </section>

      <section className="retailSection" id="products">
        <div className="retailSectionHeader splitHeader">
          <div>
            <span className="microLabel">Best sellers</span>
            <h2>Starter catalog</h2>
          </div>
          <p>{message}</p>
        </div>
        <div className="productShelf">
          {featured.map((product) => (
            <article className="retailProductCard" key={product.id}>
              <Link className="retailProductImage" href={`/products/${product.id}`}>
                <img alt={product.title} src={product.images[0]} />
                <span>{product.category}</span>
              </Link>
              <div className="retailProductBody">
                <div>
                  <Link href={`/products/${product.id}`}><h3>{product.title}</h3></Link>
                  <p>{product.subtitle ?? product.description}</p>
                </div>
                <div className="swatchRow" aria-label={`${product.title} sample swatches`}>
                  <span />
                  <span />
                  <span />
                  <small>+2</small>
                </div>
                <div className="priceRow">
                  <strong>{money(product.price, product.currency)}</strong>
                  {product.originalPrice ? <del>{money(product.originalPrice, product.currency)}</del> : null}
                </div>
                <div className="cardActions">
                  <button
                    data-testid={`add-${product.id}`}
                    type="button"
                    onClick={() => addToCart(product)}
                  >
                    Quick add
                  </button>
                  <Link className="textLink" href={`/products/${product.id}`}>Details</Link>
                </div>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="trustStrip">
        <div><strong>Worldwide shipping</strong><span>Rates, duties, and delivery promises surfaced early.</span></div>
        <div><strong>Secure checkout</strong><span>Manual test payment now, card provider adapters next.</span></div>
        <div><strong>Returns ready</strong><span>Structured order records prepare refund workflows.</span></div>
        <div><strong>Operator friendly</strong><span>Admin tools for catalog, inventory, fulfillment, and reports.</span></div>
      </section>

      <section className="collectionBand" id="sale">
        <div>
          <span className="microLabel">Product testing playbook</span>
          <h2>Merchandise like a brand before you know the winning SKU.</h2>
          <p>
            Use collections, categories, coupons, and quick-add flows to validate demand across
            countries before investing in a permanent catalog.
          </p>
          <Link className="primaryButton" href="/admin/products/new">Create a product</Link>
        </div>
        <div className="collectionMosaic">
          {products.map((product) => (
            <img src={product.images[0]} alt={product.title} key={product.id} />
          ))}
        </div>
      </section>

      <SiteFooter settings={settings} coupons={coupons} shippingRates={shippingRates} />
    </main>
  );
}
