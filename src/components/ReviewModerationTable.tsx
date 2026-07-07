"use client";

import { useState } from "react";
import type { Review } from "@/lib/types";

type ModerationReview = Review & {
  productTitle: string;
};

type ApiResult<T> = {
  ok: boolean;
  data?: T;
  error?: string;
};

type ReviewModerationTableProps = {
  reviews: ModerationReview[];
};

export function ReviewModerationTable({ reviews: initialReviews }: ReviewModerationTableProps) {
  const [reviews, setReviews] = useState(initialReviews);
  const [message, setMessage] = useState("Approve useful reviews or mark spam before they reach product pages.");

  async function updateStatus(id: string, status: Review["status"]) {
    setMessage("Updating review...");
    const response = await fetch("/api/admin/reviews", {
      method: "PATCH",
      headers: {
        "content-type": "application/json"
      },
      body: JSON.stringify({ id, status })
    });
    const result = (await response.json()) as ApiResult<Review>;

    if (result.ok && result.data) {
      const updatedReview = result.data;
      setReviews((current) =>
        current.map((review) => (review.id === id ? { ...review, status: updatedReview.status } : review))
      );
      setMessage(`Review marked ${updatedReview.status}.`);
    } else {
      setMessage(result.error ?? "Unable to update review.");
    }
  }

  return (
    <section className="panel">
      <div className="panelHeader">
        <div>
          <h2>Review moderation</h2>
          <p className="statusText">{message}</p>
        </div>
      </div>
      <div className="table">
        {reviews.map((review) => (
          <div className="tableRow reviewRow" key={review.id}>
            <span>{review.customerName}</span>
            <span>{review.productTitle}</span>
            <span>{review.rating} stars</span>
            <span>{review.status}</span>
            <span>{review.createdAt ? new Date(review.createdAt).toLocaleDateString() : "No date"}</span>
            <span>{review.body}</span>
            <span className="rowActions">
              <button type="button" onClick={() => updateStatus(review.id, "approved")}>Approve</button>
              <button className="ghostButton" type="button" onClick={() => updateStatus(review.id, "spam")}>Spam</button>
            </span>
          </div>
        ))}
      </div>
    </section>
  );
}
