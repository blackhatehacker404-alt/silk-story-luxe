import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export interface OrderRow {
  id: string;
  user_id: string;
  order_number: string;
  items: any;
  total_amount: number;
  status: string;
  payment_status: string;
  payment_method: string | null;
  shipping_address: any;
  created_at: string;
  updated_at: string;
}

export function useAdminOrders() {
  return useQuery({
    queryKey: ["admin-orders"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("orders")
        .select("*")
        .order("created_at", { ascending: false });
      if (error) throw error;
      return (data || []) as OrderRow[];
    },
  });
}

export function useUpdateOrderStatus() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, status }: { id: string; status: string }) => {
      const { error } = await supabase
        .from("orders")
        .update({ status })
        .eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-orders"] });
    },
  });
}

export function useCreateManualOrder() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (order: {
      customer_name: string;
      customer_phone: string;
      items: { name: string; quantity: number; price: number }[];
      total_amount: number;
      shipping_address: any;
      payment_status: string;
      payment_method: string;
    }) => {
      // Use the admin's own user_id for manual orders
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Not authenticated");

      const orderNumber = `KF-${Date.now().toString(36).toUpperCase()}`;
      const { error } = await supabase.from("orders").insert({
        user_id: user.id,
        order_number: orderNumber,
        items: order.items as any,
        total_amount: order.total_amount,
        shipping_address: {
          ...order.shipping_address,
          customer_name: order.customer_name,
          customer_phone: order.customer_phone,
        } as any,
        payment_status: order.payment_status,
        payment_method: order.payment_method,
        status: "new",
      });
      if (error) throw error;
      return orderNumber;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-orders"] });
    },
  });
}
