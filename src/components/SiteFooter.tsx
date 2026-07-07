import Link from "next/link";
import type { Coupon, ShippingRate, StoreSettings } from "@/lib/types";
import { money } from "@/components/Money";

type SiteFooterProps = {
  settings: StoreSettings;
  coupons?: Coupon[];
  shippingRates?: ShippingRate[];
};

export function SiteFooter({ settings, coupons = [], shippingRates = [] }: SiteFooterProps) {
  return (
    <footer className="storeFooter">
      <div>
        <strong>{settings.name}</strong>
        <p>Curated lifestyle essentials with cross-border shipping, promotion testing, and admin operations built in.</p>
      </div>
      <div>
        <h3>Shop</h3>
        <Link href="/">Storefront</Link>
        <Link href="/cart">Cart</Link>
        <Link href="/checkout">Checkout</Link>
      </div>
      <div>
        <h3>Promotions</h3>
        {coupons.map((coupon) => (
          <span key={coupon.code}>
            {coupon.code}: {coupon.type === "percentage" ? `${coupon.value}% off` : `${money(coupon.value)} off`}
          </span>
        ))}
      </div>
      <div>
        <h3>Shipping</h3>
        {shippingRates.slice(0, 3).map((rate) => (
          <span key={rate.id}>{rate.name}: {rate.etaDays} days</span>
        ))}
        <span>Markets: {settings.supportedCountries.join(", ")}</span>
      </div>
    </footer>
  );
}
