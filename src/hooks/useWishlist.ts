import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";

export const useWishlist = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [wishlistIds, setWishlistIds] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchWishlist = useCallback(async () => {
    if (!user) return;
    const { data } = await supabase
      .from("wishlists")
      .select("product_id")
      .eq("user_id", user.id);
    if (data) setWishlistIds(data.map((w: any) => w.product_id));
  }, [user]);

  useEffect(() => {
    fetchWishlist();
  }, [fetchWishlist]);

  const toggleWishlist = async (productId: string) => {
    if (!user) {
      toast({ title: "Please sign in", description: "Sign in to save items to your wishlist.", variant: "destructive" });
      return;
    }
    setLoading(true);
    const isInWishlist = wishlistIds.includes(productId);
    if (isInWishlist) {
      await supabase.from("wishlists").delete().eq("user_id", user.id).eq("product_id", productId);
      setWishlistIds((prev) => prev.filter((id) => id !== productId));
      toast({ title: "Removed from wishlist" });
    } else {
      await supabase.from("wishlists").insert({ user_id: user.id, product_id: productId });
      setWishlistIds((prev) => [...prev, productId]);
      toast({ title: "Added to wishlist ❤️" });
    }
    setLoading(false);
  };

  const isInWishlist = (productId: string) => wishlistIds.includes(productId);

  return { wishlistIds, toggleWishlist, isInWishlist, loading };
};
