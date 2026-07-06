import { fail, ok } from "@/lib/http";
import { getProduct } from "@/lib/store";

export async function GET(_: Request, context: { params: Promise<{ id: string }> }) {
  const { id } = await context.params;
  const product = getProduct(id);

  if (!product) {
    return fail("Product not found", 404);
  }

  return ok(product);
}
