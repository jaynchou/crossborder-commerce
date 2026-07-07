import { handleApiError, ok, requireAdmin } from "@/lib/http";
import { inventoryAdjustmentSchema } from "@/lib/schemas";
import { listInventory, updateInventory } from "@/lib/store";

export async function GET(request: Request) {
  const unauthorized = requireAdmin(request);
  if (unauthorized) return unauthorized;

  return ok(listInventory());
}

export async function PATCH(request: Request) {
  const unauthorized = requireAdmin(request);
  if (unauthorized) return unauthorized;

  try {
    const body = inventoryAdjustmentSchema.parse(await request.json());
    return ok(updateInventory(body));
  } catch (error) {
    return handleApiError(error);
  }
}
