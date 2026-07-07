import { revalidatePath } from "next/cache";
import { handleApiError, ok, requireAdmin } from "@/lib/http";
import { pageContentSchema } from "@/lib/schemas";
import { getPageContent, updatePageContent } from "@/lib/store";

export async function GET(request: Request) {
  const unauthorized = requireAdmin(request);
  if (unauthorized) return unauthorized;

  return ok(getPageContent());
}

export async function PUT(request: Request) {
  const unauthorized = requireAdmin(request);
  if (unauthorized) return unauthorized;

  try {
    const body = pageContentSchema.parse(await request.json());
    const content = updatePageContent(body);
    revalidatePath("/");
    revalidatePath("/sitemap.xml");
    return ok(content);
  } catch (error) {
    return handleApiError(error);
  }
}
