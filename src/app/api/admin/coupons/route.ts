import { handleApiError, ok, requireAdmin } from "@/lib/http";
import { couponSchema } from "@/lib/schemas";
import { createCoupon, listCoupons } from "@/lib/store";

export async function GET(request: Request) {
  const unauthorized = requireAdmin(request);
  if (unauthorized) return unauthorized;

  return ok(listCoupons());
}

export async function POST(request: Request) {
  const unauthorized = requireAdmin(request);
  if (unauthorized) return unauthorized;

  try {
    const body = couponSchema.parse(await request.json());
    return ok(createCoupon(body), { status: 201 });
  } catch (error) {
    return handleApiError(error);
  }
}
