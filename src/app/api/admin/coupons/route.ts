import { handleApiError, ok, requireAdmin } from "@/lib/http";
import { couponSchema, couponStatusSchema } from "@/lib/schemas";
import { createCoupon, listCoupons, updateCouponStatus } from "@/lib/store";

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

export async function PATCH(request: Request) {
  const unauthorized = requireAdmin(request);
  if (unauthorized) return unauthorized;

  try {
    const body = couponStatusSchema.parse(await request.json());
    return ok(updateCouponStatus(body.code, body.active));
  } catch (error) {
    return handleApiError(error);
  }
}
