import { revalidatePath } from "next/cache";
import { fail, handleApiError, ok, requireAdmin } from "@/lib/http";
import { categoryToSlug } from "@/lib/slugs";
import { productSchema } from "@/lib/schemas";
import { getProduct, updateProduct } from "@/lib/store";

type AdminProductRouteProps = {
  params: Promise<{ id: string }>;
};

export async function GET(request: Request, { params }: AdminProductRouteProps) {
  const unauthorized = requireAdmin(request);
  if (unauthorized) return unauthorized;

  const { id } = await params;
  const product = getProduct(id);
  if (!product) return fail("Product not found", 404);

  return ok(product);
}

export async function PUT(request: Request, { params }: AdminProductRouteProps) {
  const unauthorized = requireAdmin(request);
  if (unauthorized) return unauthorized;

  const { id } = await params;
  if (!getProduct(id)) return fail("Product not found", 404);

  try {
    const body = productSchema.omit({ id: true, variants: true }).parse(await request.json());
    const previousProduct = getProduct(id);
    const product = updateProduct(id, body);
    revalidatePath("/");
    if (previousProduct) revalidatePath(`/${categoryToSlug(previousProduct.category)}`);
    revalidatePath(`/${categoryToSlug(product.category)}`);
    revalidatePath(`/products/${id}`);
    revalidatePath("/sitemap.xml");
    return ok(product);
  } catch (error) {
    return handleApiError(error);
  }
}
