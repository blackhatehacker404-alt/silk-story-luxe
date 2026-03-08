import { useState } from "react";
import { Star } from "lucide-react";
import { useReviews } from "@/hooks/useReviews";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { motion } from "framer-motion";

const StarRating = ({ rating, onRate, interactive = false }: { rating: number; onRate?: (r: number) => void; interactive?: boolean }) => (
  <div className="flex gap-0.5">
    {[1, 2, 3, 4, 5].map((star) => (
      <button
        key={star}
        type="button"
        disabled={!interactive}
        onClick={() => onRate?.(star)}
        className={interactive ? "cursor-pointer hover:scale-110 transition-transform" : "cursor-default"}
      >
        <Star
          size={interactive ? 22 : 14}
          className={star <= rating ? "fill-accent text-accent" : "text-muted-foreground/30"}
        />
      </button>
    ))}
  </div>
);

const ReviewSection = ({ productId }: { productId: string }) => {
  const { reviews, loading, addReview, averageRating, userReview } = useReviews(productId);
  const { user } = useAuth();
  const [showForm, setShowForm] = useState(false);
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");
  const [name, setName] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async () => {
    if (!name.trim()) return;
    setSubmitting(true);
    const success = await addReview(rating, comment, name.trim());
    if (success) {
      setShowForm(false);
      setComment("");
      setRating(5);
    }
    setSubmitting(false);
  };

  return (
    <div className="mt-12 border-t border-border pt-10">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-lg font-heading font-semibold">Customer Reviews</h3>
          {reviews.length > 0 && (
            <div className="flex items-center gap-2 mt-1">
              <StarRating rating={Math.round(averageRating)} />
              <span className="text-sm text-muted-foreground font-body">
                {averageRating.toFixed(1)} ({reviews.length} {reviews.length === 1 ? "review" : "reviews"})
              </span>
            </div>
          )}
        </div>
        {user && !userReview && (
          <Button variant="outline" size="sm" onClick={() => setShowForm(!showForm)} className="font-body">
            Write a Review
          </Button>
        )}
      </div>

      {showForm && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          className="bg-card border border-border rounded-lg p-5 mb-6 space-y-4"
        >
          <div className="space-y-1">
            <label className="text-xs uppercase tracking-wider text-muted-foreground font-body">Your Rating</label>
            <StarRating rating={rating} onRate={setRating} interactive />
          </div>
          <Input placeholder="Your name" value={name} onChange={(e) => setName(e.target.value)} />
          <Textarea placeholder="Share your experience (optional)" value={comment} onChange={(e) => setComment(e.target.value)} rows={3} />
          <div className="flex gap-2">
            <Button size="sm" onClick={handleSubmit} disabled={submitting || !name.trim()} className="bg-primary text-primary-foreground font-body">
              {submitting ? "Submitting..." : "Submit Review"}
            </Button>
            <Button size="sm" variant="outline" onClick={() => setShowForm(false)}>Cancel</Button>
          </div>
        </motion.div>
      )}

      {loading ? (
        <p className="text-muted-foreground font-body text-sm">Loading reviews...</p>
      ) : reviews.length === 0 ? (
        <p className="text-muted-foreground font-body text-sm text-center py-8">No reviews yet. Be the first to review!</p>
      ) : (
        <div className="space-y-4">
          {reviews.map((review) => (
            <div key={review.id} className="border border-border rounded-lg p-4">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <span className="font-body text-sm font-semibold">{review.reviewer_name}</span>
                  <StarRating rating={review.rating} />
                </div>
                <span className="text-xs text-muted-foreground font-body">
                  {new Date(review.created_at).toLocaleDateString("en-IN")}
                </span>
              </div>
              {review.comment && <p className="text-sm text-muted-foreground font-body">{review.comment}</p>}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ReviewSection;
