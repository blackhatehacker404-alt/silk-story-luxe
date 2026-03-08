import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";

export interface Review {
  id: string;
  user_id: string;
  product_id: string;
  rating: number;
  comment: string | null;
  reviewer_name: string;
  created_at: string;
}

export const useReviews = (productId: string) => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchReviews = useCallback(async () => {
    const { data } = await supabase
      .from("reviews")
      .select("*")
      .eq("product_id", productId)
      .order("created_at", { ascending: false });
    if (data) setReviews(data as Review[]);
    setLoading(false);
  }, [productId]);

  useEffect(() => {
    fetchReviews();
  }, [fetchReviews]);

  const addReview = async (rating: number, comment: string, reviewerName: string) => {
    if (!user) {
      toast({ title: "Please sign in", description: "Sign in to leave a review.", variant: "destructive" });
      return false;
    }
    const { error } = await supabase.from("reviews").insert({
      user_id: user.id,
      product_id: productId,
      rating,
      comment: comment || null,
      reviewer_name: reviewerName,
    });
    if (error) {
      if (error.code === "23505") {
        toast({ title: "Already reviewed", description: "You've already reviewed this product.", variant: "destructive" });
      } else {
        toast({ title: "Error", description: error.message, variant: "destructive" });
      }
      return false;
    }
    toast({ title: "Review submitted! ⭐" });
    fetchReviews();
    return true;
  };

  const averageRating = reviews.length > 0
    ? reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length
    : 0;

  const userReview = user ? reviews.find((r) => r.user_id === user.id) : null;

  return { reviews, loading, addReview, averageRating, userReview };
};
