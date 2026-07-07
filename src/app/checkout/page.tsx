import { CheckoutClient } from "@/components/CheckoutClient";
import { getSettings, listShippingRates } from "@/lib/store";

export default function CheckoutPage() {
  const settings = getSettings();
  const rates = listShippingRates();

  return <CheckoutClient settings={settings} shippingRates={rates} />;
}
