import { handleApiError, ok, requireAdmin } from "@/lib/http";
import { orderStatusSchema } from "@/lib/schemas";
import { listOrders, updateOrderStatus } from "@/lib/store";

export async function GET(request: Request) {
  const unauthorized = requireAdmin(request);
  if (unauthorized) return unauthorized;

  return ok(listOrders());
}

export async function PATCH(request: Request) {
  const unauthorized = requireAdmin(request);
  if (unauthorized) return unauthorized;

  try {
    const body = orderStatusSchema.parse(await request.json());
    return ok(updateOrderStatus(body));
  } catch (error) {
    return handleApiError(error);
  }
}
