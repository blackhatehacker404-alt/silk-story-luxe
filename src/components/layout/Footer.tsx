import { Link } from "react-router-dom";
import { useShopIdentity } from "@/hooks/useSiteSettings";
import { Instagram, Facebook, Youtube } from "lucide-react";

const Footer = () => {
  const { data: shop } = useShopIdentity();

  return (
    <footer className="bg-foreground text-background">
      <div className="container mx-auto px-4 lg:px-8 py-10 lg:py-14">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Brand */}
          <div>
            <h3 className="text-xl font-heading mb-1">{shop?.shop_name ?? "Kalai Fashions"}</h3>
            <p className="text-[10px] tracking-[0.3em] uppercase mb-3 opacity-60 font-body">{shop?.tagline ?? "Elampillai"}</p>
            <p className="text-xs leading-relaxed opacity-60 font-body">
              Handcrafted silk sarees from {shop?.tagline ?? "Elampillai"},
              bringing you timeless elegance at honest prices.
            </p>
            {(shop?.instagram_url || shop?.facebook_url || shop?.youtube_url) && (
              <div className="flex items-center gap-3 mt-3">
                {shop?.instagram_url && (
                  <a href={shop.instagram_url} target="_blank" rel="noopener noreferrer" className="opacity-60 hover:opacity-100 transition-opacity" aria-label="Instagram">
                    <Instagram size={16} />
                  </a>
                )}
                {shop?.facebook_url && (
                  <a href={shop.facebook_url} target="_blank" rel="noopener noreferrer" className="opacity-60 hover:opacity-100 transition-opacity" aria-label="Facebook">
                    <Facebook size={16} />
                  </a>
                )}
                {shop?.youtube_url && (
                  <a href={shop.youtube_url} target="_blank" rel="noopener noreferrer" className="opacity-60 hover:opacity-100 transition-opacity" aria-label="YouTube">
                    <Youtube size={16} />
                  </a>
                )}
              </div>
            )}
          </div>

          {/* Quick Links + Customer Care combined */}
          <div className="grid grid-cols-2 gap-6">
            <div>
              <h4 className="text-xs tracking-[0.2em] uppercase mb-4 opacity-80 font-body">Quick Links</h4>
              <div className="flex flex-col gap-2">
                {["Shop All", "New Arrivals", "Best Sellers", "Bridal"].map((link) => (
                  <Link key={link} to="/products" className="text-xs opacity-60 hover:opacity-100 transition-opacity font-body">
                    {link}
                  </Link>
                ))}
              </div>
            </div>
            <div>
              <h4 className="text-xs tracking-[0.2em] uppercase mb-4 opacity-80 font-body">Help</h4>
              <div className="flex flex-col gap-2">
                {["Shipping", "Returns", "Care Guide", "FAQ"].map((link) => (
                  <span key={link} className="text-xs opacity-60 hover:opacity-100 transition-opacity cursor-pointer font-body">
                    {link}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-xs tracking-[0.2em] uppercase mb-4 opacity-80 font-body">Contact</h4>
            <div className="flex flex-col gap-2 text-xs opacity-60 font-body">
              <p>{shop?.address_line1 ?? "Elampillai"}, {shop?.city ?? "Salem"}</p>
              <p>{shop?.state ?? "Tamil Nadu"} — {shop?.pincode ?? "637502"}</p>
              <p>{shop?.phone ?? "+91 98765 43210"}</p>
              <p>{shop?.email ?? "info@kalaifashions.com"}</p>
            </div>
          </div>
        </div>

        <div className="mt-8 pt-6 border-t border-background/20 text-center">
          <p className="text-[10px] tracking-[0.15em] opacity-40 font-body">
            © {new Date().getFullYear()} {shop?.shop_name ?? "Kalai Fashions"}. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
