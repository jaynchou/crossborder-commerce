import { handleApiError, ok, requireAdmin } from "@/lib/http";
import { adminShippingRateSchema } from "@/lib/schemas";
import { createShippingRate, listShippingRates } from "@/lib/store";

export async function GET(request: Request) {
  const unauthorized = requireAdmin(request);
  if (unauthorized) return unauthorized;

  return ok(listShippingRates());
}

export async function POST(request: Request) {
  const unauthorized = requireAdmin(request);
  if (unauthorized) return unauthorized;

  try {
    const body = adminShippingRateSchema.parse(await request.json());
    return ok(createShippingRate(body), { status: 201 });
  } catch (error) {
    return handleApiError(error);
  }
}
