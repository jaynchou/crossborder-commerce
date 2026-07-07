import { AdminLayout } from "@/components/AdminLayout";
import { ReviewModerationTable } from "@/components/ReviewModerationTable";
import { getProduct, listReviews } from "@/lib/store";

export default function ReviewsPage() {
  const reviews = listReviews();
  const enrichedReviews = reviews.map((review) => ({
    ...review,
    productTitle: getProduct(review.productId)?.title ?? review.productId
  }));

  return (
    <AdminLayout eyebrow="Trust" title="Reviews">
      <ReviewModerationTable reviews={enrichedReviews} />
    </AdminLayout>
  );
}
