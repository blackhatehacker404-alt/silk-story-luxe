import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { useBuyButtonConfig, useUpdateBuyButtonConfig, BuyButtonConfig } from "@/hooks/useSiteSettings";
import { toast } from "sonner";
import { Settings, CreditCard, MessageCircle, Save } from "lucide-react";

export default function AdminSettings() {
  const { data: config, isLoading } = useBuyButtonConfig();
  const updateConfig = useUpdateBuyButtonConfig();
  const [localConfig, setLocalConfig] = useState<BuyButtonConfig>({
    online_payment_enabled: true,
    whatsapp_enabled: true,
    whatsapp_number: "+918870226867",
  });

  useEffect(() => {
    if (config) setLocalConfig(config);
  }, [config]);

  const handleSave = () => {
    updateConfig.mutate(localConfig, {
      onSuccess: () => toast.success("Settings saved"),
      onError: () => toast.error("Failed to save settings"),
    });
  };

  if (isLoading) return <div className="p-8 text-muted-foreground">Loading settings...</div>;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-heading text-2xl font-bold flex items-center gap-2">
          <Settings className="h-6 w-6" /> Store Settings
        </h1>
        <p className="text-sm text-muted-foreground mt-1">Control buy button options on product pages</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg font-heading">Buy Button Configuration</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Online Payment */}
          <div className="flex items-center justify-between p-4 border border-border rounded-lg">
            <div className="flex items-center gap-3">
              <CreditCard className="h-5 w-5 text-muted-foreground" />
              <div>
                <Label className="font-medium">Online Payment (Buy Now)</Label>
                <p className="text-xs text-muted-foreground mt-0.5">
                  Enable direct payment through the website
                </p>
              </div>
            </div>
            <Switch
              checked={localConfig.online_payment_enabled}
              onCheckedChange={(checked) =>
                setLocalConfig((prev) => ({ ...prev, online_payment_enabled: checked }))
              }
            />
          </div>

          {/* WhatsApp */}
          <div className="flex items-center justify-between p-4 border border-border rounded-lg">
            <div className="flex items-center gap-3">
              <MessageCircle className="h-5 w-5 text-muted-foreground" />
              <div>
                <Label className="font-medium">WhatsApp Order</Label>
                <p className="text-xs text-muted-foreground mt-0.5">
                  Let customers order via WhatsApp chat
                </p>
              </div>
            </div>
            <Switch
              checked={localConfig.whatsapp_enabled}
              onCheckedChange={(checked) =>
                setLocalConfig((prev) => ({ ...prev, whatsapp_enabled: checked }))
              }
            />
          </div>

          {/* WhatsApp Number */}
          {localConfig.whatsapp_enabled && (
            <div className="pl-12 space-y-2">
              <Label>WhatsApp Number (with country code)</Label>
              <Input
                value={localConfig.whatsapp_number}
                onChange={(e) =>
                  setLocalConfig((prev) => ({ ...prev, whatsapp_number: e.target.value }))
                }
                placeholder="+918870226867"
              />
            </div>
          )}

          <Button onClick={handleSave} disabled={updateConfig.isPending} className="gap-2">
            <Save className="h-4 w-4" />
            {updateConfig.isPending ? "Saving..." : "Save Settings"}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
