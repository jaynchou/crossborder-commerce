import { ok } from "@/lib/http";
import { shippingRateSchema } from "@/lib/schemas";
import { listShippingRates } from "@/lib/store";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const query = shippingRateSchema.parse({
    country: searchParams.get("country") ?? undefined
  });

  return ok(listShippingRates(query.country));
}
