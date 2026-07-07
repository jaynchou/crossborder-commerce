import { handleApiError, ok, requireAdmin } from "@/lib/http";
import { productVariantSchema } from "@/lib/schemas";
import { createProductVariant, listProductVariants } from "@/lib/store";

export async function GET(request: Request) {
  const unauthorized = requireAdmin(request);
  if (unauthorized) return unauthorized;

  return ok(listProductVariants());
}

export async function POST(request: Request) {
  const unauthorized = requireAdmin(request);
  if (unauthorized) return unauthorized;

  try {
    const body = productVariantSchema.parse(await request.json());
    return ok(createProductVariant(body), { status: 201 });
  } catch (error) {
    return handleApiError(error);
  }
}
