import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export interface CouponRow {
  id: string;
  code: string;
  discount_type: string;
  discount_value: number;
  min_order_amount: number | null;
  max_uses: number | null;
  used_count: number;
  is_active: boolean;
  expires_at: string | null;
  created_at: string;
  updated_at: string;
}

export function useAdminCoupons() {
  return useQuery({
    queryKey: ["admin-coupons"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("coupons")
        .select("*")
        .order("created_at", { ascending: false });
      if (error) throw error;
      return (data || []) as CouponRow[];
    },
  });
}

export function useCreateCoupon() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (coupon: {
      code: string;
      discount_type: string;
      discount_value: number;
      min_order_amount?: number;
      max_uses?: number | null;
      expires_at?: string | null;
    }) => {
      const { error } = await supabase.from("coupons").insert({
        code: coupon.code.toUpperCase(),
        discount_type: coupon.discount_type,
        discount_value: coupon.discount_value,
        min_order_amount: coupon.min_order_amount || 0,
        max_uses: coupon.max_uses || null,
        expires_at: coupon.expires_at || null,
      });
      if (error) throw error;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["admin-coupons"] }),
  });
}

export function useToggleCoupon() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, is_active }: { id: string; is_active: boolean }) => {
      const { error } = await supabase.from("coupons").update({ is_active }).eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["admin-coupons"] }),
  });
}

export function useDeleteCoupon() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("coupons").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["admin-coupons"] }),
  });
}

export function useValidateCoupon() {
  return useMutation({
    mutationFn: async ({ code, orderTotal }: { code: string; orderTotal: number }) => {
      const { data, error } = await supabase
        .from("coupons")
        .select("*")
        .eq("code", code.toUpperCase())
        .eq("is_active", true)
        .single();
      if (error || !data) throw new Error("Invalid coupon code");

      const coupon = data as CouponRow;

      if (coupon.expires_at && new Date(coupon.expires_at) < new Date()) {
        throw new Error("This coupon has expired");
      }
      if (coupon.max_uses && coupon.used_count >= coupon.max_uses) {
        throw new Error("This coupon has reached its usage limit");
      }
      if (coupon.min_order_amount && orderTotal < coupon.min_order_amount) {
        throw new Error(`Minimum order amount is ₹${coupon.min_order_amount}`);
      }

      const discount =
        coupon.discount_type === "percentage"
          ? Math.round((orderTotal * coupon.discount_value) / 100)
          : coupon.discount_value;

      return { coupon, discount: Math.min(discount, orderTotal) };
    },
  });
}

export function useIncrementCouponUsage() {
  return useMutation({
    mutationFn: async (id: string) => {
      const { data } = await supabase.from("coupons").select("used_count").eq("id", id).single();
      if (data) {
        await supabase.from("coupons").update({ used_count: (data as any).used_count + 1 }).eq("id", id);
      }
    },
  });
}
