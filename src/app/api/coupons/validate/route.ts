import { couponValidationSchema } from "@/lib/schemas";
import { fail, handleApiError, ok } from "@/lib/http";
import { validateCoupon } from "@/lib/store";

export async function POST(request: Request) {
  try {
    const body = couponValidationSchema.parse(await request.json());
    const coupon = validateCoupon(body.code, body.subtotal);
    if (!coupon) return fail("Coupon is invalid or does not meet requirements", 404);
    return ok(coupon);
  } catch (error) {
    return handleApiError(error);
  }
}
