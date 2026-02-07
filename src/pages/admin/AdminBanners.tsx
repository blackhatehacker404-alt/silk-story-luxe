import { useState } from "react";
import { Plus, Trash2, Eye, EyeOff, GripVertical } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";

interface Banner {
  id: string;
  title: string;
  subtitle: string;
  imageUrl: string;
  type: "hero" | "festival";
  enabled: boolean;
}

const initialBanners: Banner[] = [
  {
    id: "b1",
    title: "Bridal Collection 2024",
    subtitle: "Timeless elegance for your special day",
    imageUrl: "/src/assets/hero-banner-1.jpg",
    type: "hero",
    enabled: true,
  },
  {
    id: "b2",
    title: "Festival Special",
    subtitle: "Celebrate in style with our finest silks",
    imageUrl: "/src/assets/hero-banner-2.jpg",
    type: "hero",
    enabled: true,
  },
  {
    id: "b3",
    title: "Pongal Collection",
    subtitle: "Exquisite sarees for Pongal celebrations",
    imageUrl: "",
    type: "festival",
    enabled: false,
  },
];

export default function AdminBanners() {
  const [banners, setBanners] = useState<Banner[]>(initialBanners);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [newBanner, setNewBanner] = useState({
    title: "",
    subtitle: "",
    type: "hero" as "hero" | "festival",
  });
  const { toast } = useToast();

  const toggleBanner = (id: string) => {
    setBanners((prev) =>
      prev.map((b) => (b.id === id ? { ...b, enabled: !b.enabled } : b))
    );
  };

  const deleteBanner = (id: string) => {
    setBanners((prev) => prev.filter((b) => b.id !== id));
    toast({ title: "Banner removed" });
  };

  const addBanner = () => {
    if (!newBanner.title.trim()) return;
    const banner: Banner = {
      id: `b-${Date.now()}`,
      title: newBanner.title,
      subtitle: newBanner.subtitle,
      imageUrl: "",
      type: newBanner.type,
      enabled: true,
    };
    setBanners((prev) => [...prev, banner]);
    setNewBanner({ title: "", subtitle: "", type: "hero" });
    setIsDialogOpen(false);
    toast({ title: "Banner added" });
  };

  const heroBanners = banners.filter((b) => b.type === "hero");
  const festivalBanners = banners.filter((b) => b.type === "festival");

  const BannerCard = ({ banner }: { banner: Banner }) => (
    <div className="flex items-center gap-4 p-4 border border-border rounded-lg">
      <GripVertical className="h-4 w-4 text-muted-foreground cursor-grab" />
      <div className="h-16 w-24 rounded bg-secondary flex items-center justify-center text-xs text-muted-foreground overflow-hidden">
        {banner.imageUrl ? (
          <img
            src={banner.imageUrl}
            alt={banner.title}
            className="w-full h-full object-cover"
          />
        ) : (
          "No image"
        )}
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium truncate">{banner.title}</p>
        <p className="text-xs text-muted-foreground truncate">
          {banner.subtitle}
        </p>
      </div>
      <Badge
        variant={banner.enabled ? "default" : "secondary"}
        className="text-[10px]"
      >
        {banner.enabled ? "Active" : "Disabled"}
      </Badge>
      <div className="flex items-center gap-1">
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8"
          onClick={() => toggleBanner(banner.id)}
        >
          {banner.enabled ? (
            <Eye className="h-3.5 w-3.5" />
          ) : (
            <EyeOff className="h-3.5 w-3.5" />
          )}
        </Button>
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8 text-destructive"
          onClick={() => deleteBanner(banner.id)}
        >
          <Trash2 className="h-3.5 w-3.5" />
        </Button>
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-heading text-2xl font-bold">Banners</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Manage homepage and festival banners
          </p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button className="gap-2">
              <Plus className="h-4 w-4" />
              Add Banner
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle className="font-heading">Add Banner</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 pt-2">
              <div className="space-y-2">
                <Label>Title</Label>
                <Input
                  value={newBanner.title}
                  onChange={(e) =>
                    setNewBanner((prev) => ({ ...prev, title: e.target.value }))
                  }
                  placeholder="Summer Collection 2024"
                />
              </div>
              <div className="space-y-2">
                <Label>Subtitle</Label>
                <Input
                  value={newBanner.subtitle}
                  onChange={(e) =>
                    setNewBanner((prev) => ({
                      ...prev,
                      subtitle: e.target.value,
                    }))
                  }
                  placeholder="Discover the finest silks"
                />
              </div>
              <div className="space-y-2">
                <Label>Type</Label>
                <div className="flex gap-2">
                  <Button
                    variant={newBanner.type === "hero" ? "default" : "outline"}
                    size="sm"
                    onClick={() =>
                      setNewBanner((prev) => ({ ...prev, type: "hero" }))
                    }
                  >
                    Hero Banner
                  </Button>
                  <Button
                    variant={newBanner.type === "festival" ? "default" : "outline"}
                    size="sm"
                    onClick={() =>
                      setNewBanner((prev) => ({ ...prev, type: "festival" }))
                    }
                  >
                    Festival Banner
                  </Button>
                </div>
              </div>
              <Button onClick={addBanner} className="w-full">
                Add Banner
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Hero Banners */}
      <Card className="border-border">
        <CardHeader className="pb-3">
          <CardTitle className="text-base font-heading">
            Hero Banners ({heroBanners.length})
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {heroBanners.map((banner) => (
            <BannerCard key={banner.id} banner={banner} />
          ))}
          {heroBanners.length === 0 && (
            <p className="text-sm text-muted-foreground text-center py-4">
              No hero banners
            </p>
          )}
        </CardContent>
      </Card>

      {/* Festival Banners */}
      <Card className="border-border">
        <CardHeader className="pb-3">
          <CardTitle className="text-base font-heading">
            Festival Banners ({festivalBanners.length})
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {festivalBanners.map((banner) => (
            <BannerCard key={banner.id} banner={banner} />
          ))}
          {festivalBanners.length === 0 && (
            <p className="text-sm text-muted-foreground text-center py-4">
              No festival banners
            </p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
