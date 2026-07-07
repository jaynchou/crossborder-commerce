import { revalidatePath } from "next/cache";
import { handleApiError, ok, requireAdmin } from "@/lib/http";
import { settingsSchema } from "@/lib/schemas";
import { getSettings, updateSettings } from "@/lib/store";

export async function GET(request: Request) {
  const unauthorized = requireAdmin(request);
  if (unauthorized) return unauthorized;

  return ok(getSettings());
}

export async function PUT(request: Request) {
  const unauthorized = requireAdmin(request);
  if (unauthorized) return unauthorized;

  try {
    const body = settingsSchema.parse(await request.json());
    const settings = updateSettings(body);
    revalidatePath("/");
    revalidatePath("/sitemap.xml");
    return ok(settings);
  } catch (error) {
    return handleApiError(error);
  }
}
