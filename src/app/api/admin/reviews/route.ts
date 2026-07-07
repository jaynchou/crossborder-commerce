import { handleApiError, ok, requireAdmin } from "@/lib/http";
import { reviewStatusSchema } from "@/lib/schemas";
import { listReviews, updateReviewStatus } from "@/lib/store";

export async function GET(request: Request) {
  const unauthorized = requireAdmin(request);
  if (unauthorized) return unauthorized;

  return ok(listReviews());
}

export async function PATCH(request: Request) {
  const unauthorized = requireAdmin(request);
  if (unauthorized) return unauthorized;

  try {
    const body = reviewStatusSchema.parse(await request.json());
    return ok(updateReviewStatus(body.id, body.status));
  } catch (error) {
    return handleApiError(error);
  }
}
