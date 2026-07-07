import { revalidatePath } from "next/cache";
import { handleApiError, ok, requireAdmin } from "@/lib/http";
import { productSchema } from "@/lib/schemas";
import { categoryToSlug } from "@/lib/slugs";
import { createProduct, listAllProducts } from "@/lib/store";

export async function GET(request: Request) {
  const unauthorized = requireAdmin(request);
  if (unauthorized) return unauthorized;

  return ok(listAllProducts());
}

export async function POST(request: Request) {
  const unauthorized = requireAdmin(request);
  if (unauthorized) return unauthorized;

  try {
    const body = productSchema.parse(await request.json());
    const product = createProduct(body);
    revalidatePath("/");
    revalidatePath(`/${categoryToSlug(product.category)}`);
    revalidatePath(`/products/${product.id}`);
    revalidatePath("/sitemap.xml");
    return ok(product, { status: 201 });
  } catch (error) {
    return handleApiError(error);
  }
}
