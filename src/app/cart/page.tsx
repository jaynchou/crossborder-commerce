import type { Metadata } from "next";
import { CartClient } from "@/components/CartClient";
import { getSettings, listCategories, listCoupons, listProducts, listShippingRates } from "@/lib/store";

export const metadata: Metadata = {
  title: "Cart",
  robots: {
    index: false,
    follow: false
  }
};

export default function CartPage() {
  const products = listProducts();
  const settings = getSettings();
  const shippingRates = listShippingRates();

  return (
    <CartClient
      products={products}
      categories={listCategories()}
      coupons={listCoupons()}
      countries={settings.supportedCountries}
      shippingRates={shippingRates}
      settings={settings}
    />
  );
}
