import { handleApiError, ok, requireAdmin } from "@/lib/http";
import { mediaAssetSchema } from "@/lib/schemas";
import { createMediaAsset, listMediaAssets } from "@/lib/store";

export async function GET(request: Request) {
  const unauthorized = requireAdmin(request);
  if (unauthorized) return unauthorized;

  return ok(listMediaAssets());
}

export async function POST(request: Request) {
  const unauthorized = requireAdmin(request);
  if (unauthorized) return unauthorized;

  try {
    const body = mediaAssetSchema.parse(await request.json());
    return ok(createMediaAsset(body), { status: 201 });
  } catch (error) {
    return handleApiError(error);
  }
}
