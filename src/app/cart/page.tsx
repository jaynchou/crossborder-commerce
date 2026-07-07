import { CartClient } from "@/components/CartClient";
import { getSettings, listProducts, listShippingRates } from "@/lib/store";

export default function CartPage() {
  const products = listProducts();
  const settings = getSettings();
  const shippingRates = listShippingRates();

  return <CartClient products={products} countries={settings.supportedCountries} shippingRates={shippingRates} />;
}
