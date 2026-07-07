import { StorefrontClient } from "@/components/StorefrontClient";
import {
  calculateCart,
  getPageContent,
  getSettings,
  listCategories,
  listCoupons,
  listProducts,
  listShippingRates
} from "@/lib/store";

export const revalidate = 3600;

export default function StorefrontPage() {
  const products = listProducts();
  const categories = listCategories();
  const coupons = listCoupons();
  const shippingRates = listShippingRates("US");
  const settings = getSettings();
  const content = getPageContent();
  const quote = calculateCart(
    [
      { productId: "album-cloud-001", quantity: 1 },
      { productId: "album-tea-002", quantity: 2 }
    ],
    { country: "US", couponCode: "LAUNCH10", shippingRateId: "standard-global" }
  );

  return (
    <StorefrontClient
      storeName={process.env.NEXT_PUBLIC_STORE_NAME ?? "CrossBorder Commerce"}
      products={products}
      categories={categories}
      coupons={coupons}
      shippingRates={shippingRates}
      initialQuote={quote}
      settings={settings}
      content={content}
    />
  );
}
