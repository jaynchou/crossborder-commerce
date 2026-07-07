import { handleApiError, ok, requireAdmin } from "@/lib/http";
import { attributeSchema } from "@/lib/schemas";
import { createProductAttribute, listProductAttributes } from "@/lib/store";

export async function GET(request: Request) {
  const unauthorized = requireAdmin(request);
  if (unauthorized) return unauthorized;

  return ok(listProductAttributes());
}

export async function POST(request: Request) {
  const unauthorized = requireAdmin(request);
  if (unauthorized) return unauthorized;

  try {
    const body = attributeSchema.parse(await request.json());
    return ok(createProductAttribute(body), { status: 201 });
  } catch (error) {
    return handleApiError(error);
  }
}
