"use client";

import Link from "next/link";
import type { Coupon, Product } from "@/lib/types";
import { money } from "@/components/Money";

type SiteHeaderProps = {
  storeName?: string;
  categories?: string[];
  featuredProducts?: Product[];
  coupons?: Coupon[];
  cartCount?: number;
  onCartClick?: () => void;
};

export function SiteHeader({
  storeName = "CrossBorder Commerce",
  categories = [],
  featuredProducts = [],
  coupons = [],
  cartCount = 0,
  onCartClick
}: SiteHeaderProps) {
  return (
    <header className="storeHeader">
      <Link className="brandLockup" href="/">
        <strong>{storeName}</strong>
        <span>Global lifestyle commerce</span>
      </Link>
      <nav className="storeNav megaNav" aria-label="Store navigation">
        <Link href="/">Home</Link>
        <div className="megaNavItem">
          <a href="/#products">Shop</a>
          <div className="megaMenu" aria-label="Shop categories">
            <div>
              <span className="microLabel">Categories</span>
              {categories.map((category) => (
                <a href={`/#products`} key={category}>{category}</a>
              ))}
            </div>
            <div>
              <span className="microLabel">Featured</span>
              {featuredProducts.slice(0, 3).map((product) => (
                <Link className="megaProduct" href={`/products/${product.id}`} key={product.id}>
                  <img src={product.images[0]} alt="" />
                  <span>{product.title}</span>
                  <strong>{money(product.price, product.currency)}</strong>
                </Link>
              ))}
            </div>
            <div>
              <span className="microLabel">Promotions</span>
              {coupons.slice(0, 3).map((coupon) => (
                <span className="promoPill" key={coupon.code}>
                  {coupon.code}: {coupon.type === "percentage" ? `${coupon.value}% off` : `${money(coupon.value)} off`}
                </span>
              ))}
            </div>
          </div>
        </div>
        <Link href="/cart">Cart</Link>
        <Link href="/checkout">Checkout</Link>
        <Link href="/admin">Admin</Link>
      </nav>
      <div className="storeActions">
        {onCartClick ? (
          <button className="cartLink" type="button" onClick={onCartClick}>
            Cart ({cartCount})
          </button>
        ) : (
          <Link href="/cart">Cart</Link>
        )}
      </div>
    </header>
  );
}
