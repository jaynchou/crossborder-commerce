import { handleApiError, ok, requireAdmin } from "@/lib/http";
import { paymentMethodStatusSchema } from "@/lib/schemas";
import { listPaymentMethods, updatePaymentMethodStatus } from "@/lib/store";

export async function GET(request: Request) {
  const unauthorized = requireAdmin(request);
  if (unauthorized) return unauthorized;

  return ok(listPaymentMethods());
}

export async function PATCH(request: Request) {
  const unauthorized = requireAdmin(request);
  if (unauthorized) return unauthorized;

  try {
    const body = paymentMethodStatusSchema.parse(await request.json());
    return ok(updatePaymentMethodStatus(body.id, body.enabled));
  } catch (error) {
    return handleApiError(error);
  }
}
