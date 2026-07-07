import { fail, handleApiError, ok } from "@/lib/http";
import { reviewSchema } from "@/lib/schemas";
import { createReview, getProduct, listProductReviews } from "@/lib/store";

type ReviewRouteProps = {
  params: Promise<{ id: string }>;
};

export async function GET(_request: Request, { params }: ReviewRouteProps) {
  const { id } = await params;
  if (!getProduct(id)) return fail("Product not found", 404);

  return ok(listProductReviews(id));
}

export async function POST(request: Request, { params }: ReviewRouteProps) {
  const { id } = await params;
  if (!getProduct(id)) return fail("Product not found", 404);

  try {
    const body = reviewSchema.parse({ ...(await request.json()), productId: id });
    return ok(createReview(body), { status: 201 });
  } catch (error) {
    return handleApiError(error);
  }
}
