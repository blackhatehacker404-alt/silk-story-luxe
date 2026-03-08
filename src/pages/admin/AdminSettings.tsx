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
  useThemeColors,
  useUpdateThemeColors,
  ThemeColors,
  useAboutStats,
  useUpdateAboutStats,
  AboutStat,
} from "@/hooks/useSiteSettings";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Settings, CreditCard, MessageCircle, Save, Store, MapPin, Mail, Phone, Palette, Upload, X, Loader2, ImageIcon, BarChart3, Plus, Trash2 } from "lucide-react";

const PRESET_PALETTES = [
  { label: "Classic Black", primary: "#141414", accent: "#141414", background: "#ffffff" },
  { label: "Deep Maroon", primary: "#6b1d2a", accent: "#8b2d3a", background: "#fffaf5" },
  { label: "Royal Navy", primary: "#1a2744", accent: "#2a3f6e", background: "#f8f9fc" },
  { label: "Forest Green", primary: "#1a3c2a", accent: "#2d5a40", background: "#f5faf7" },
  { label: "Warm Bronze", primary: "#5c3d1e", accent: "#8b6b3d", background: "#fdfaf5" },
  { label: "Plum Purple", primary: "#3d1f4e", accent: "#5a2d7a", background: "#faf5fc" },
];

function LogoUploader({ onUploaded }: { onUploaded: (url: string) => void }) {
  const [uploading, setUploading] = useState(false);

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    const ext = file.name.split(".").pop();
    const path = `logo/${Date.now()}.${ext}`;
    const { error } = await supabase.storage.from("brand-assets").upload(path, file, { upsert: true });
    if (error) {
      toast.error("Upload failed");
      setUploading(false);
      return;
    }
    const { data } = supabase.storage.from("brand-assets").getPublicUrl(path);
    onUploaded(data.publicUrl);
    setUploading(false);
    e.target.value = "";
  };

  return (
    <label className="h-16 w-32 rounded border-2 border-dashed border-border flex flex-col items-center justify-center cursor-pointer hover:border-primary transition-colors">
      {uploading ? (
        <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
      ) : (
        <>
          <Upload className="h-4 w-4 text-muted-foreground" />
          <span className="text-[10px] text-muted-foreground mt-1">Upload Logo</span>
        </>
      )}
      <input type="file" accept="image/*" onChange={handleUpload} className="hidden" disabled={uploading} />
    </label>
  );
}

export default function AdminSettings() {
  const { data: config, isLoading: loadingBuy } = useBuyButtonConfig();
  const updateConfig = useUpdateBuyButtonConfig();
  const { data: identity, isLoading: loadingIdentity } = useShopIdentity();
  const updateIdentity = useUpdateShopIdentity();
  const { data: themeColors, isLoading: loadingTheme } = useThemeColors();
  const updateTheme = useUpdateThemeColors();
  const { data: aboutStats, isLoading: loadingStats } = useAboutStats();
  const updateStats = useUpdateAboutStats();

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

  const [localTheme, setLocalTheme] = useState<ThemeColors>({
    primary: "#141414",
    accent: "#141414",
    background: "#ffffff",
  });

  const [localStats, setLocalStats] = useState<AboutStat[]>([
    { number: "500+", label: "Sarees Crafted" },
    { number: "₹999", label: "Starting Price" },
    { number: "50+", label: "Artisan Partners" },
  ]);

  useEffect(() => {
    if (config) setLocalConfig(config);
  }, [config]);

  useEffect(() => {
    if (identity) setLocalIdentity(identity);
  }, [identity]);

  useEffect(() => {
    if (themeColors) setLocalTheme(themeColors);
  }, [themeColors]);

  useEffect(() => {
    if (aboutStats) setLocalStats(aboutStats);
  }, [aboutStats]);

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

  const handleSaveTheme = () => {
    updateTheme.mutate(localTheme, {
      onSuccess: () => toast.success("Theme colors saved — changes will apply across the site"),
      onError: () => toast.error("Failed to save theme"),
    });
  };

  const handleSaveStats = () => {
    updateStats.mutate(localStats, {
      onSuccess: () => toast.success("About page stats saved"),
      onError: () => toast.error("Failed to save stats"),
    });
  };

  if (loadingBuy || loadingIdentity || loadingTheme || loadingStats)
    return <div className="p-8 text-muted-foreground">Loading settings...</div>;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-heading text-2xl font-bold flex items-center gap-2">
          <Settings className="h-6 w-6" /> Store Settings
        </h1>
        <p className="text-sm text-muted-foreground mt-1">
          Manage your shop identity, theme, and storefront options
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
          {/* Logo Upload */}
          <div className="space-y-2">
            <Label className="flex items-center gap-1.5"><ImageIcon className="h-3.5 w-3.5" /> Brand Logo</Label>
            <div className="flex items-center gap-4">
              {localIdentity.logo_url ? (
                <div className="relative h-16 w-32 rounded border border-border overflow-hidden group bg-muted flex items-center justify-center">
                  <img src={localIdentity.logo_url} alt="Logo" className="max-h-full max-w-full object-contain" />
                  <button
                    type="button"
                    onClick={() => setLocalIdentity((p) => ({ ...p, logo_url: "" }))}
                    className="absolute top-0.5 right-0.5 bg-destructive text-destructive-foreground rounded-full p-0.5 opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </div>
              ) : (
                <LogoUploader onUploaded={(url) => setLocalIdentity((p) => ({ ...p, logo_url: url }))} />
              )}
            </div>
            <p className="text-xs text-muted-foreground">Recommended: PNG with transparent background, max 200×80px</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Shop Name</Label>
              <Input
                value={localIdentity.shop_name}
                onChange={(e) => setLocalIdentity((p) => ({ ...p, shop_name: e.target.value }))}
                placeholder="Kalai Fashions"
              />
            </div>
            <div className="space-y-2">
              <Label>Tagline / Subtitle</Label>
              <Input
                value={localIdentity.tagline}
                onChange={(e) => setLocalIdentity((p) => ({ ...p, tagline: e.target.value }))}
                placeholder="Elampillai"
              />
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label className="flex items-center gap-1.5"><Mail className="h-3.5 w-3.5" /> Email</Label>
              <Input
                value={localIdentity.email}
                onChange={(e) => setLocalIdentity((p) => ({ ...p, email: e.target.value }))}
                placeholder="info@kalaifashions.com"
              />
            </div>
            <div className="space-y-2">
              <Label className="flex items-center gap-1.5"><Phone className="h-3.5 w-3.5" /> Phone</Label>
              <Input
                value={localIdentity.phone}
                onChange={(e) => setLocalIdentity((p) => ({ ...p, phone: e.target.value }))}
                placeholder="+91 88702 26867"
              />
            </div>
          </div>
          {/* Social Media Links */}
          <div className="pt-2">
            <Label className="mb-3 block text-sm font-medium">Social Media Links</Label>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label className="text-xs text-muted-foreground">Instagram URL</Label>
                <Input value={localIdentity.instagram_url ?? ""} onChange={(e) => setLocalIdentity((p) => ({ ...p, instagram_url: e.target.value }))} placeholder="https://instagram.com/yourshop" />
              </div>
              <div className="space-y-2">
                <Label className="text-xs text-muted-foreground">Facebook URL</Label>
                <Input value={localIdentity.facebook_url ?? ""} onChange={(e) => setLocalIdentity((p) => ({ ...p, facebook_url: e.target.value }))} placeholder="https://facebook.com/yourshop" />
              </div>
              <div className="space-y-2">
                <Label className="text-xs text-muted-foreground">YouTube URL</Label>
                <Input value={localIdentity.youtube_url ?? ""} onChange={(e) => setLocalIdentity((p) => ({ ...p, youtube_url: e.target.value }))} placeholder="https://youtube.com/@yourshop" />
              </div>
            </div>
          </div>

          <div className="pt-2">
            <Label className="flex items-center gap-1.5 mb-3"><MapPin className="h-3.5 w-3.5" /> From / Return Address</Label>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label className="text-xs text-muted-foreground">Address Line</Label>
                <Input value={localIdentity.address_line1} onChange={(e) => setLocalIdentity((p) => ({ ...p, address_line1: e.target.value }))} placeholder="Street / Area" />
              </div>
              <div className="space-y-2">
                <Label className="text-xs text-muted-foreground">City</Label>
                <Input value={localIdentity.city} onChange={(e) => setLocalIdentity((p) => ({ ...p, city: e.target.value }))} placeholder="Salem" />
              </div>
              <div className="space-y-2">
                <Label className="text-xs text-muted-foreground">State</Label>
                <Input value={localIdentity.state} onChange={(e) => setLocalIdentity((p) => ({ ...p, state: e.target.value }))} placeholder="Tamil Nadu" />
              </div>
              <div className="space-y-2">
                <Label className="text-xs text-muted-foreground">Pincode</Label>
                <Input value={localIdentity.pincode} onChange={(e) => setLocalIdentity((p) => ({ ...p, pincode: e.target.value }))} placeholder="637502" />
              </div>
            </div>
          </div>
          <Button onClick={handleSaveIdentity} disabled={updateIdentity.isPending} className="gap-2 mt-2">
            <Save className="h-4 w-4" />
            {updateIdentity.isPending ? "Saving..." : "Save Identity"}
          </Button>
        </CardContent>
      </Card>

      {/* About Page Stats */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg font-heading flex items-center gap-2">
            <BarChart3 className="h-5 w-5" /> About Page Stats
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-xs text-muted-foreground">These stats appear on the About page and homepage Brand Story section.</p>
          {localStats.map((stat, i) => (
            <div key={i} className="flex items-end gap-3">
              <div className="space-y-1 flex-1">
                <Label className="text-xs text-muted-foreground">Number/Value</Label>
                <Input
                  value={stat.number}
                  onChange={(e) => {
                    const updated = [...localStats];
                    updated[i] = { ...updated[i], number: e.target.value };
                    setLocalStats(updated);
                  }}
                  placeholder="500+"
                />
              </div>
              <div className="space-y-1 flex-1">
                <Label className="text-xs text-muted-foreground">Label</Label>
                <Input
                  value={stat.label}
                  onChange={(e) => {
                    const updated = [...localStats];
                    updated[i] = { ...updated[i], label: e.target.value };
                    setLocalStats(updated);
                  }}
                  placeholder="Sarees Crafted"
                />
              </div>
              {localStats.length > 1 && (
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setLocalStats(localStats.filter((_, idx) => idx !== i))}
                  className="text-destructive hover:text-destructive"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              )}
            </div>
          ))}
          {localStats.length < 6 && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => setLocalStats([...localStats, { number: "", label: "" }])}
              className="gap-1"
            >
              <Plus className="h-3.5 w-3.5" /> Add Stat
            </Button>
          )}
          <div>
            <Button onClick={handleSaveStats} disabled={updateStats.isPending} className="gap-2">
              <Save className="h-4 w-4" />
              {updateStats.isPending ? "Saving..." : "Save Stats"}
            </Button>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg font-heading flex items-center gap-2">
            <Palette className="h-5 w-5" /> Theme Colors
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Preset palettes */}
          <div>
            <Label className="mb-3 block">Quick Presets</Label>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {PRESET_PALETTES.map((p) => (
                <button
                  key={p.label}
                  onClick={() => setLocalTheme({ primary: p.primary, accent: p.accent, background: p.background })}
                  className={`flex items-center gap-3 p-3 border rounded-lg text-left transition-all hover:shadow-md ${
                    localTheme.primary === p.primary && localTheme.background === p.background
                      ? "border-foreground ring-2 ring-foreground/20"
                      : "border-border"
                  }`}
                >
                  <div className="flex gap-1">
                    <div className="w-5 h-5 rounded-full border border-border" style={{ background: p.primary }} />
                    <div className="w-5 h-5 rounded-full border border-border" style={{ background: p.accent }} />
                    <div className="w-5 h-5 rounded-full border border-border" style={{ background: p.background }} />
                  </div>
                  <span className="text-xs font-medium">{p.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Custom pickers */}
          <div>
            <Label className="mb-3 block">Custom Colors</Label>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label className="text-xs text-muted-foreground">Primary</Label>
                <div className="flex items-center gap-3">
                  <input
                    type="color"
                    value={localTheme.primary}
                    onChange={(e) => setLocalTheme((p) => ({ ...p, primary: e.target.value }))}
                    className="w-10 h-10 rounded-md border border-border cursor-pointer"
                  />
                  <Input
                    value={localTheme.primary}
                    onChange={(e) => setLocalTheme((p) => ({ ...p, primary: e.target.value }))}
                    className="font-mono text-xs"
                    placeholder="#141414"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label className="text-xs text-muted-foreground">Accent</Label>
                <div className="flex items-center gap-3">
                  <input
                    type="color"
                    value={localTheme.accent}
                    onChange={(e) => setLocalTheme((p) => ({ ...p, accent: e.target.value }))}
                    className="w-10 h-10 rounded-md border border-border cursor-pointer"
                  />
                  <Input
                    value={localTheme.accent}
                    onChange={(e) => setLocalTheme((p) => ({ ...p, accent: e.target.value }))}
                    className="font-mono text-xs"
                    placeholder="#141414"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label className="text-xs text-muted-foreground">Background</Label>
                <div className="flex items-center gap-3">
                  <input
                    type="color"
                    value={localTheme.background}
                    onChange={(e) => setLocalTheme((p) => ({ ...p, background: e.target.value }))}
                    className="w-10 h-10 rounded-md border border-border cursor-pointer"
                  />
                  <Input
                    value={localTheme.background}
                    onChange={(e) => setLocalTheme((p) => ({ ...p, background: e.target.value }))}
                    className="font-mono text-xs"
                    placeholder="#ffffff"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Preview */}
          <div>
            <Label className="mb-3 block text-xs text-muted-foreground">Preview</Label>
            <div className="rounded-lg border border-border p-6 flex items-center gap-4" style={{ background: localTheme.background }}>
              <div className="rounded-md px-5 py-2.5 text-sm font-medium" style={{ background: localTheme.primary, color: localTheme.background }}>
                Buy Now
              </div>
              <div className="rounded-md px-5 py-2.5 text-sm font-medium border" style={{ background: localTheme.accent, color: localTheme.background }}>
                Add to Cart
              </div>
              <span className="text-sm font-medium" style={{ color: localTheme.primary }}>
                Sample Text
              </span>
            </div>
          </div>

          <Button onClick={handleSaveTheme} disabled={updateTheme.isPending} className="gap-2">
            <Save className="h-4 w-4" />
            {updateTheme.isPending ? "Saving..." : "Save Theme"}
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
                <p className="text-xs text-muted-foreground mt-0.5">Enable direct payment through the website</p>
              </div>
            </div>
            <Switch
              checked={localConfig.online_payment_enabled}
              onCheckedChange={(checked) => setLocalConfig((prev) => ({ ...prev, online_payment_enabled: checked }))}
            />
          </div>
          <div className="flex items-center justify-between p-4 border border-border rounded-lg">
            <div className="flex items-center gap-3">
              <MessageCircle className="h-5 w-5 text-muted-foreground" />
              <div>
                <Label className="font-medium">WhatsApp Order</Label>
                <p className="text-xs text-muted-foreground mt-0.5">Let customers order via WhatsApp chat</p>
              </div>
            </div>
            <Switch
              checked={localConfig.whatsapp_enabled}
              onCheckedChange={(checked) => setLocalConfig((prev) => ({ ...prev, whatsapp_enabled: checked }))}
            />
          </div>
          {localConfig.whatsapp_enabled && (
            <div className="pl-12 space-y-2">
              <Label>WhatsApp Number (with country code)</Label>
              <Input
                value={localConfig.whatsapp_number}
                onChange={(e) => setLocalConfig((prev) => ({ ...prev, whatsapp_number: e.target.value }))}
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
