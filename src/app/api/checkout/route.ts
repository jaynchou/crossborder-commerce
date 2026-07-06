import { cartSchema } from "@/lib/schemas";
import { handleApiError, ok } from "@/lib/http";
import { calculateCart } from "@/lib/store";

export async function POST(request: Request) {
  try {
    const body = cartSchema.parse(await request.json());
    return ok(calculateCart(body.items, body));
  } catch (error) {
    return handleApiError(error);
  }
}
