import { revalidatePath } from "next/cache";
import { handleApiError, ok, requireAdmin } from "@/lib/http";
import { categorySchema } from "@/lib/schemas";
import { createCategory, listCategoryStats } from "@/lib/store";

export async function GET(request: Request) {
  const unauthorized = requireAdmin(request);
  if (unauthorized) return unauthorized;

  return ok(listCategoryStats());
}

export async function POST(request: Request) {
  const unauthorized = requireAdmin(request);
  if (unauthorized) return unauthorized;

  try {
    const body = categorySchema.parse(await request.json());
    const category = createCategory(body);
    revalidatePath("/");
    revalidatePath(`/${category.slug}`);
    revalidatePath("/sitemap.xml");
    return ok(category, { status: 201 });
  } catch (error) {
    return handleApiError(error);
  }
}
