import { AdminLayout } from "@/components/AdminLayout";
import { listReviews } from "@/lib/store";

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
              <span>{review.productId}</span>
              <span>{review.rating} stars</span>
              <span>{review.status}</span>
              <span>{review.body}</span>
            </div>
          ))}
        </div>
      </section>
    </AdminLayout>
  );
}
