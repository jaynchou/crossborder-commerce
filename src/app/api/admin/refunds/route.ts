import { handleApiError, ok, requireAdmin } from "@/lib/http";
import { refundStatusSchema } from "@/lib/schemas";
import { listRefunds, updateRefundStatus } from "@/lib/store";

export async function GET(request: Request) {
  const unauthorized = requireAdmin(request);
  if (unauthorized) return unauthorized;

  return ok(listRefunds());
}

export async function PATCH(request: Request) {
  const unauthorized = requireAdmin(request);
  if (unauthorized) return unauthorized;

  try {
    const body = refundStatusSchema.parse(await request.json());
    return ok(updateRefundStatus(body.id, body.status));
  } catch (error) {
    return handleApiError(error);
  }
}
