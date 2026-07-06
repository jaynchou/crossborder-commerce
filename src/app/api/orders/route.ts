import { handleApiError, ok } from "@/lib/http";
import { orderSchema } from "@/lib/schemas";
import { createOrder } from "@/lib/store";

export async function POST(request: Request) {
  try {
    const body = orderSchema.parse(await request.json());
    return ok(createOrder(body), { status: 201 });
  } catch (error) {
    return handleApiError(error);
  }
}
