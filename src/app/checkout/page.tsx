import { CheckoutClient } from "@/components/CheckoutClient";
import { getSettings, listCategories, listCoupons, listProducts, listShippingRates } from "@/lib/store";

export default function CheckoutPage() {
  const settings = getSettings();
  const rates = listShippingRates();

  return (
    <CheckoutClient
      settings={settings}
      categories={listCategories()}
      coupons={listCoupons()}
      products={listProducts()}
      shippingRates={rates}
    />
  );
}
