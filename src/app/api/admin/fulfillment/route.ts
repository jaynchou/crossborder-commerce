import { handleApiError, ok, requireAdmin } from "@/lib/http";
import { fulfillmentSchema } from "@/lib/schemas";
import { fulfillOrder } from "@/lib/store";

export async function POST(request: Request) {
  const unauthorized = requireAdmin(request);
  if (unauthorized) return unauthorized;

  try {
    const body = fulfillmentSchema.parse(await request.json());
    return ok(fulfillOrder(body.orderId, body.trackingNumber));
  } catch (error) {
    return handleApiError(error);
  }
}
