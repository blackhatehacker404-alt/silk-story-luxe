import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  useBuyButtonConfig,
  useUpdateBuyButtonConfig,
  BuyButtonConfig,
  useShopIdentity,
  useUpdateShopIdentity,
  ShopIdentity,
} from "@/hooks/useSiteSettings";
import { toast } from "sonner";
import { Settings, CreditCard, MessageCircle, Save, Store, MapPin, Mail, Phone } from "lucide-react";

export default function AdminSettings() {
  const { data: config, isLoading: loadingBuy } = useBuyButtonConfig();
  const updateConfig = useUpdateBuyButtonConfig();
  const { data: identity, isLoading: loadingIdentity } = useShopIdentity();
  const updateIdentity = useUpdateShopIdentity();

  const [localConfig, setLocalConfig] = useState<BuyButtonConfig>({
    online_payment_enabled: true,
    whatsapp_enabled: true,
    whatsapp_number: "+918870226867",
  });

  const [localIdentity, setLocalIdentity] = useState<ShopIdentity>({
    shop_name: "Kalai Fashions",
    tagline: "Elampillai",
    email: "info@kalaifashions.com",
    phone: "+91 88702 26867",
    address_line1: "Elampillai",
    city: "Salem",
    state: "Tamil Nadu",
    pincode: "637502",
  });

  useEffect(() => {
    if (config) setLocalConfig(config);
  }, [config]);

  useEffect(() => {
    if (identity) setLocalIdentity(identity);
  }, [identity]);

  const handleSaveBuy = () => {
    updateConfig.mutate(localConfig, {
      onSuccess: () => toast.success("Buy button settings saved"),
      onError: () => toast.error("Failed to save settings"),
    });
  };

  const handleSaveIdentity = () => {
    updateIdentity.mutate(localIdentity, {
      onSuccess: () => toast.success("Shop identity saved"),
      onError: () => toast.error("Failed to save identity"),
    });
  };

  if (loadingBuy || loadingIdentity)
    return <div className="p-8 text-muted-foreground">Loading settings...</div>;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-heading text-2xl font-bold flex items-center gap-2">
          <Settings className="h-6 w-6" /> Store Settings
        </h1>
        <p className="text-sm text-muted-foreground mt-1">
          Manage your shop identity, location, and storefront options
        </p>
      </div>

      {/* Shop Identity */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg font-heading flex items-center gap-2">
            <Store className="h-5 w-5" /> Shop Identity
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Shop Name</Label>
              <Input
                value={localIdentity.shop_name}
                onChange={(e) =>
                  setLocalIdentity((p) => ({ ...p, shop_name: e.target.value }))
                }
                placeholder="Kalai Fashions"
              />
            </div>
            <div className="space-y-2">
              <Label>Tagline / Subtitle</Label>
              <Input
                value={localIdentity.tagline}
                onChange={(e) =>
                  setLocalIdentity((p) => ({ ...p, tagline: e.target.value }))
                }
                placeholder="Elampillai"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label className="flex items-center gap-1.5">
                <Mail className="h-3.5 w-3.5" /> Email
              </Label>
              <Input
                value={localIdentity.email}
                onChange={(e) =>
                  setLocalIdentity((p) => ({ ...p, email: e.target.value }))
                }
                placeholder="info@kalaifashions.com"
              />
            </div>
            <div className="space-y-2">
              <Label className="flex items-center gap-1.5">
                <Phone className="h-3.5 w-3.5" /> Phone
              </Label>
              <Input
                value={localIdentity.phone}
                onChange={(e) =>
                  setLocalIdentity((p) => ({ ...p, phone: e.target.value }))
                }
                placeholder="+91 88702 26867"
              />
            </div>
          </div>

          <div className="pt-2">
            <Label className="flex items-center gap-1.5 mb-3">
              <MapPin className="h-3.5 w-3.5" /> From / Return Address
            </Label>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label className="text-xs text-muted-foreground">Address Line</Label>
                <Input
                  value={localIdentity.address_line1}
                  onChange={(e) =>
                    setLocalIdentity((p) => ({ ...p, address_line1: e.target.value }))
                  }
                  placeholder="Street / Area"
                />
              </div>
              <div className="space-y-2">
                <Label className="text-xs text-muted-foreground">City</Label>
                <Input
                  value={localIdentity.city}
                  onChange={(e) =>
                    setLocalIdentity((p) => ({ ...p, city: e.target.value }))
                  }
                  placeholder="Salem"
                />
              </div>
              <div className="space-y-2">
                <Label className="text-xs text-muted-foreground">State</Label>
                <Input
                  value={localIdentity.state}
                  onChange={(e) =>
                    setLocalIdentity((p) => ({ ...p, state: e.target.value }))
                  }
                  placeholder="Tamil Nadu"
                />
              </div>
              <div className="space-y-2">
                <Label className="text-xs text-muted-foreground">Pincode</Label>
                <Input
                  value={localIdentity.pincode}
                  onChange={(e) =>
                    setLocalIdentity((p) => ({ ...p, pincode: e.target.value }))
                  }
                  placeholder="637502"
                />
              </div>
            </div>
          </div>

          <Button
            onClick={handleSaveIdentity}
            disabled={updateIdentity.isPending}
            className="gap-2 mt-2"
          >
            <Save className="h-4 w-4" />
            {updateIdentity.isPending ? "Saving..." : "Save Identity"}
          </Button>
        </CardContent>
      </Card>

      {/* Buy Button Config */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg font-heading">Buy Button Configuration</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
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

          <Button onClick={handleSaveBuy} disabled={updateConfig.isPending} className="gap-2">
            <Save className="h-4 w-4" />
            {updateConfig.isPending ? "Saving..." : "Save Settings"}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
