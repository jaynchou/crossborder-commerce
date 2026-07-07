import { StorefrontClient } from "@/components/StorefrontClient";
import {
  calculateCart,
  listCategories,
  listCoupons,
  listProducts,
  listShippingRates
} from "@/lib/store";

export default function StorefrontPage() {
  const products = listProducts();
  const categories = listCategories();
  const coupons = listCoupons();
  const shippingRates = listShippingRates("US");
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
    />
  );
}
