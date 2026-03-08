import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export interface BuyButtonConfig {
  online_payment_enabled: boolean;
  whatsapp_enabled: boolean;
  whatsapp_number: string;
}

export interface ShopIdentity {
  shop_name: string;
  tagline: string;
  email: string;
  phone: string;
  address_line1: string;
  city: string;
  state: string;
  pincode: string;
}

const defaultConfig: BuyButtonConfig = {
  online_payment_enabled: true,
  whatsapp_enabled: true,
  whatsapp_number: "+918870226867",
};

const defaultShopIdentity: ShopIdentity = {
  shop_name: "Kalai Fashions",
  tagline: "Elampillai",
  email: "info@kalaifashions.com",
  phone: "+91 88702 26867",
  address_line1: "Elampillai",
  city: "Salem",
  state: "Tamil Nadu",
  pincode: "637502",
};

export function useBuyButtonConfig() {
  return useQuery({
    queryKey: ["site-settings", "buy_button_config"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("site_settings")
        .select("value")
        .eq("key", "buy_button_config")
        .single();
      if (error || !data) return defaultConfig;
      return data.value as unknown as BuyButtonConfig;
    },
    staleTime: 60000,
  });
}

export function useUpdateBuyButtonConfig() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (config: BuyButtonConfig) => {
      const { error } = await supabase
        .from("site_settings")
        .update({ value: config as any, updated_at: new Date().toISOString() })
        .eq("key", "buy_button_config");
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["site-settings", "buy_button_config"] });
    },
  });
}

export function useShopIdentity() {
  return useQuery({
    queryKey: ["site-settings", "shop_identity"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("site_settings")
        .select("value")
        .eq("key", "shop_identity")
        .single();
      if (error || !data) return defaultShopIdentity;
      return data.value as unknown as ShopIdentity;
    },
    staleTime: 60000,
  });
}

export function useUpdateShopIdentity() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (identity: ShopIdentity) => {
      const { error } = await supabase
        .from("site_settings")
        .update({ value: identity as any, updated_at: new Date().toISOString() })
        .eq("key", "shop_identity");
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["site-settings", "shop_identity"] });
    },
  });
}
