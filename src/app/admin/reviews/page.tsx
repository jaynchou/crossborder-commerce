import { AdminLayout } from "@/components/AdminLayout";
import { getProduct, listReviews } from "@/lib/store";

export default function ReviewsPage() {
  const reviews = listReviews();

  return (
    <AdminLayout eyebrow="Trust" title="Reviews">
      <section className="panel">
        <h2>Review moderation</h2>
        <div className="table">
          {reviews.map((review) => (
            <div className="tableRow reviewRow" key={review.id}>
              <span>{review.customerName}</span>
              <span>{getProduct(review.productId)?.title ?? review.productId}</span>
              <span>{review.rating} stars</span>
              <span>{review.status}</span>
              <span>{review.createdAt ? new Date(review.createdAt).toLocaleDateString() : "No date"}</span>
              <span>{review.body}</span>
            </div>
          ))}
        </div>
      </section>
    </AdminLayout>
  );
}
