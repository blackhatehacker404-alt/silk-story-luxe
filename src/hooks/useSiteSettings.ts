import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export interface BuyButtonConfig {
  online_payment_enabled: boolean;
  whatsapp_enabled: boolean;
  whatsapp_number: string;
}

const defaultConfig: BuyButtonConfig = {
  online_payment_enabled: true,
  whatsapp_enabled: true,
  whatsapp_number: "+918870226867",
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
